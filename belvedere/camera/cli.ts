// The camera's two verbs, argv-driven.
//
//   bun camera/cli.ts shoot <path> [--port <n>] [--out <file>]
//   bun camera/cli.ts run   <probe.ts>
//
//   shoot        boots a disarmed twin, navigates, writes one PNG, tears the twin down
//   shoot --port shoots a **running** deck instead — one GET and a screenshot, no clicks
//   run          drives a probe script against a twin the camera itself booted, always
//
// Exit codes are the contract: 0 the thing happened, 1 it did not, 2 the argv was wrong. An
// agent reads the printed path on 0 and the printed reason on anything else.
//
// The asymmetry between the verbs is deliberate and is the fence in argv form. Shooting a live
// deck is a read, and a read of Felix's own running deck is legal and useful. *Interacting* with
// one is not: a probe clicks Dispatch buttons, and a Dispatch button on the live deck ignites a
// real session. So `run` refuses a foreign port in kind, and names why.

import { isAbsolute, join, resolve } from 'path';
import { openEyes, shotPath, type Probe } from './probe';
import { bootTwin } from './twin';

const USAGE = `camera — an agent's eyes on the deck

  bun camera/cli.ts shoot <path> [--port <n>] [--out <file>]
      boot a disarmed twin, navigate to <path>, write a PNG, print its path
      --port <n>   shoot a RUNNING deck instead (read-only: one GET, no clicks)
      --out <file> where the PNG lands (default: camera/shots/<stamp>-<path>.png)

  bun camera/cli.ts run <probe.ts>
      run a probe script against a twin the camera boots (never a foreign port)

  --fixture   (shoot without --port, and run) boot the twin against the seeded fixture
              city instead of the real one: deterministic card states, per-run temp dirs,
              torn down with the twin. A probe may ask for it itself with
              \`export const fixture = true\`.
`;

// Annotated rather than inferred so TypeScript reads it as never-returning: every `die` below is a
// narrowing, and the code after one is code the CLI has already proved is reachable.
const die: (why: string, code?: 1 | 2) => never = (why, code = 1) => { console.error(why); process.exit(code); };

/** The flags that stand alone. Everything else is `--name value`, and a missing value is an error. */
const BOOLEAN: ReadonlySet<string> = new Set(['fixture']);

/** Flags are `--name value`; anything else is positional. Explicit, and it refuses what it cannot read. */
function argv(args: readonly string[]): { rest: string[]; flags: Record<string, string> } {
	const rest: string[] = [];
	const flags: Record<string, string> = {};
	for (let i = 0; i < args.length; i++) {
		const a = args[i]!;
		if (!a.startsWith('--')) { rest.push(a); continue; }
		const name = a.slice(2);
		if (BOOLEAN.has(name)) { flags[name] = 'yes'; continue; }
		const value = args[++i];
		if (value === undefined) die(`${a} needs a value\n\n${USAGE}`, 2);
		flags[name] = value!;
	}
	return { rest, flags };
}

/**
 * The seeded world is worth one line of evidence: a probe's teardown bar is "the run directory is
 * gone", and an agent cannot check a path it was never told. It goes to stderr, because stdout's
 * contract is the shot's own path and nothing else.
 */
const announce = (twin: { fixture: string | null }) => {
	if (twin.fixture !== null) console.error(`fixture     ${twin.fixture}`);
};

function foreignPort(raw: string): number {
	const n = Number(raw);
	if (!Number.isInteger(n) || n < 1 || n > 65535) die(`--port ${raw} is not a port`, 2);
	return n;
}

// ---------- shoot ----------

async function shoot(path: string, flags: Record<string, string>): Promise<void> {
	const out = flags['out'] === undefined ? shotPath(path.replace(/^\//, '') || 'rail') : resolve(flags['out']);
	const foreign = flags['port'] === undefined ? null : foreignPort(flags['port']);

	// The argv contradiction is answered before anything is dialled: a command that cannot mean one
	// thing must not fail for an unrelated reason (measured — "no deck answering on 4400" is a true
	// sentence and the wrong one).
	if (foreign !== null && flags['fixture'] !== undefined)
		die('--fixture boots a twin against a seeded city; --port shoots a deck that is already running. Pick one.', 2);

	// A foreign deck is checked before the browser opens, so "nothing is running there" reads as one
	// sentence rather than as a navigation stack trace.
	if (foreign !== null) {
		const answered = await fetch(`http://127.0.0.1:${foreign}/`, { signal: AbortSignal.timeout(5_000) })
			.then(r => r.status, (e: Error) => e.message);
		if (typeof answered === 'string') die(`no deck answering on 127.0.0.1:${foreign} — \`shoot --port\` shoots one that is already running (${answered})`);
	}

	const twin = foreign === null ? await bootTwin({ fixture: flags['fixture'] !== undefined }) : null;
	if (twin && !twin.ok) die(twin.error);
	if (twin?.ok) announce(twin.result);
	const base = twin?.ok ? twin.result.url : (p: string) => `http://127.0.0.1:${foreign}${p.startsWith('/') ? p : `/${p}`}`;

	try {
		const eyes = await openEyes(base);
		if (!eyes.ok) die(eyes.error);
		try {
			await eyes.result.probe.goto(path);
			console.log(await eyes.result.probe.shoot(out));
		}
		finally { await eyes.result.close(); }
	}
	// The twin never outlives the shot — including when the browser threw (twin.ts §1).
	finally { if (twin?.ok) await twin.result.close(); }
}

// ---------- run ----------

async function run(script: string, flags: Record<string, string>): Promise<void> {
	if (flags['port'] !== undefined) die(
		`run refuses --port. A probe clicks, types and sends, and the only deck it may do that to is one the camera booted disarmed:\n`
		+ `on the live deck a Dispatch button ignites a real session and a send reaches a real agent (README §2 — the fence).\n`
		+ `To look at a running deck, that is what \`shoot --port\` is for: one GET and a screenshot, no clicks.`, 2);

	// A probe path is read against the caller's cwd, then against `camera/` — so
	// `run probes/chat.probe.ts` means the same thing from `belvedere/` and from `camera/`, which
	// is how every charge doc writes it.
	const tried = isAbsolute(script) ? [script] : [resolve(script), join(import.meta.dir, script)];
	const file = (await Promise.all(tried.map(async f => ((await Bun.file(f).exists()) ? f : null)))).find(f => f !== null);
	if (file === undefined) die(`no probe at ${tried.join(' or ')}`, 2);

	const mod = (await import(file)) as { default?: unknown; fixture?: unknown };
	if (typeof mod.default !== 'function')
		die(`${file} has no default export — a probe is \`export default async (p: Probe) => { … }\``, 2);
	const probeFn = mod.default as (p: Probe) => Promise<void>;

	// A probe declares the world it needs, because the world is part of what it asserts: a probe
	// written against the fixture city is a lie against the real one. `--fixture` still forces it,
	// so a probe can be re-pointed from the command line without editing it.
	const fixture = flags['fixture'] !== undefined || mod.fixture === true;

	const twin = await bootTwin({ fixture });
	if (!twin.ok) die(twin.error);
	announce(twin.result);
	try {
		const eyes = await openEyes(twin.result.url);
		if (!eyes.ok) die(eyes.error);
		try { await probeFn(eyes.result.probe); }
		finally { await eyes.result.close(); }
	}
	finally { await twin.result.close(); }
}

// ---------- go ----------

const { rest, flags } = argv(process.argv.slice(2));
const [verb, subject] = rest;

if (verb === 'shoot') {
	if (subject === undefined) die(`shoot needs a path — e.g. \`shoot /\`\n\n${USAGE}`, 2);
	await shoot(subject, flags);
}
else if (verb === 'run') {
	if (subject === undefined) die(`run needs a probe file\n\n${USAGE}`, 2);
	await run(subject, flags);
}
else die(USAGE, 2);
