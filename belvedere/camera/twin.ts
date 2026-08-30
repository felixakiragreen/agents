// The twin — a disarmed copy of the glass, booted for one probe and killed after it.
//
// Nothing in `glass/` changed to make this possible, and nothing may: the deck already reads
// both knobs this file turns (`glass/paths.ts:37` and `:80`), and the arming law already says
// that an absent credential answers every hand 503 (README §2, `hands.ts:618`). The camera does
// not simulate a disarmed deck — it points the real one at a path that does not exist and then
// **proves** it went cold before a browser ever opens (§the disarm probe).
//
// Two laws hold this file down:
//
//  1. **The twin never outlives the probe.** SIGTERM and *wait for exit*, on every path — the
//     happy one, the throw, the boot that never came up. A leaked twin is a failed bar, and a
//     leaked twin holding a port is the next probe's mystery.
//  2. **A camera that finds itself armed is a stop, not a warning.** If the disarm probe answers
//     anything but 503, the twin is torn down and the boot refuses. There is no flag to proceed.

import { existsSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { seedFixture, type Fixture } from './fixtures/seed';

/** Errors are values (directive 3.4): a refusal is returned, and only the CLI decides to exit. */
export type Outcome<T> = { ok: true; result: T } | { ok: false; error: string };

const fail = (error: string): Outcome<never> => ({ ok: false, error });

/** Everything has a limit (directive 3.1). A boot that hangs is an agent that waits forever. */
const LIMITS = { readyMs: 40_000, pollMs: 100, disarmMs: 5_000, exitMs: 5_000 } as const;

/** The glass, as this module's subprocess and nothing else — the camera imports no deck code. */
const GLASS = join(import.meta.dir, '..', 'glass');

/**
 * The void the credential is pointed at. Under `$TMPDIR` and named for what it is, so a human
 * who finds it in a process list reads the mechanism off the path. It must NOT exist — if it
 * ever does, the boot refuses rather than arming a twin by accident.
 */
export const VOID_ENV = join(tmpdir(), 'belvedere-camera-void', 'there-is-no-credential-here.env');

/**
 * The twin's own drawer. **A disarmed twin is not an inert one**: the fence's two write classes
 * that deliberately stand in FRONT of the arming switch — the desk (D18 class 3) and the
 * sovereign's inbox — are still live on it, because cold hands must never cost Felix the ability
 * to write something down (`server.ts`, the `/inbox` comment). Typing into the Chat's reply box
 * debounce-saves a draft (`chat.client.ts:save`), so without this the camera would leave notes in
 * Felix's real desk. `$DESK_DIR` is `paths.ts`'s own knob; no glass change is involved.
 */
export const SCRATCH_DESK = join(tmpdir(), 'belvedere-camera-desk');

/**
 * The twin's own inbox tree — **C17 F2, closed**. `POST /inbox` stands in FRONT of the arming
 * switch by law (B6 F3), so a probe clicking "file it" wrote into a real building's `ISSUES.md`
 * and the camera could only document the hazard. `$INBOX_DIR` is `paths.ts`'s knob for it
 * (C15 §5): a building keeps its city-relative path under this root, so the gesture lands here and
 * the real city is never opened. Turned on EVERY twin, fixture or not — the real-city twin is the
 * one that needed it, and the fixture twin points it at its own copied city so both worlds contain
 * the write in the tree they already tear down.
 */
export const SCRATCH_INBOX = join(tmpdir(), 'belvedere-camera-inbox');

export type Twin = {
	readonly port: number;
	/** An in-twin URL. Probes never build one by hand, so a probe cannot address another deck. */
	url(path: string): string;
	/** The seeded run directory, or null for a twin reading the real city. Evidence, for the CLI. */
	readonly fixture: string | null;
	/** SIGTERM, then wait. Idempotent: a probe that closes early does not break the CLI's finally. */
	close(): Promise<void>;
};

/** A free high port, learned by binding one and letting go. The twin claims it milliseconds later. */
function ephemeralPort(): number {
	const probe = Bun.serve({ hostname: '127.0.0.1', port: 0, fetch: () => new Response(null, { status: 204 }) });
	const port = probe.port;
	probe.stop(true);
	// Assertions catch impossible states (directive 3.5): a TCP bind that answers no port is not a
	// case to handle, it is a broken runtime.
	if (port === undefined) throw new Error('bun bound 127.0.0.1:0 and reported no port');
	return port;
}

const sleep = (ms: number) => new Promise(done => setTimeout(done, ms));

/**
 * The disarm probe: one POST at a **real** hand with an empty body.
 *
 * `fire` rather than a made-up name because the answer has to come from the gate the deck really
 * uses, and empty-body rather than a payload because the armed reading of this call must also be
 * inert — `handsRoute` reads the credential *before* it parses (`hands.ts:617`), so a twin that
 * somehow held one answers 400 at the parse and spawns nothing. Either way nothing is fired; only
 * 503 lets the camera proceed.
 */
async function disarmed(port: number): Promise<Outcome<string>> {
	let res: Response;
	try {
		res = await fetch(`http://127.0.0.1:${port}/hands/fire`, {
			method: 'POST', body: '{}', signal: AbortSignal.timeout(LIMITS.disarmMs),
		});
	}
	catch (e) { return fail(`the disarm probe could not reach the twin: ${(e as Error).message}`); }

	const body = (await res.text()).trim();
	if (res.status !== 503) return fail(`THE TWIN IS ARMED — POST /hands/fire answered ${res.status}, not 503:\n${body}`);
	if (!body.includes('hands disabled')) return fail(`the twin answered 503 but not the arming law's refusal:\n${body}`);
	return { ok: true, result: body };
}

/**
 * Boot a twin: an ephemeral port, a credential pointed at nothing, and a proof it went cold.
 *
 * **Two worlds, one twin.** By default it reads the real city read-only — the deck's normal render
 * path, no fixtures and no seeded census (C17). With `fixture`, the deck's own anchors are turned
 * instead (`GLASS_CITY`, `CENSUS_DIR`, `USAGE_DIR`, `DESK_DIR`) at a per-run directory seeded at
 * this moment, so a probe can shoot a card state on demand rather than waiting for reality to
 * produce one. **No `glass/` change is involved in either world** — every knob already exists.
 *
 * What the twin cannot do in either world is reach a session: every write the fence names is a
 * hand, and every hand is 503 for as long as this process lives.
 */
export async function bootTwin(opts: { fixture?: boolean } = {}): Promise<Outcome<Twin>> {
	if (existsSync(VOID_ENV)) return fail(`${VOID_ENV} exists — the camera's void is not void; refusing to boot a twin that might be armed`);

	let seeded: Fixture | null = null;
	if (opts.fixture) {
		try { seeded = seedFixture(); }
		catch (e) { return fail(`the fixture could not be seeded: ${(e as Error).message}`); }
	}

	const port = ephemeralPort();
	const child = Bun.spawn(['bun', 'server.ts'], {
		cwd: GLASS,
		env: {
			...process.env,
			BELVEDERE_ENV: VOID_ENV, GLASS_PORT: String(port),
			DESK_DIR: seeded ? seeded.desk : SCRATCH_DESK,
			INBOX_DIR: seeded ? seeded.city : SCRATCH_INBOX,
			// A fixture run's every anchor lands inside the run directory — the city included, so
			// the inbox's un-gated append is contained twice over and dies with the teardown.
			...(seeded ? { GLASS_CITY: seeded.city, CENSUS_DIR: seeded.census, USAGE_DIR: seeded.usage } : {}),
		},
		stdout: 'pipe', stderr: 'pipe',
	});

	// One teardown, reached from every exit below — including the ones that refuse.
	let closed = false;
	const close = async (): Promise<void> => {
		if (closed) return;
		closed = true;
		child.kill('SIGTERM');
		const gone = await Promise.race([child.exited, sleep(LIMITS.exitMs).then(() => null)]);
		// A twin that ignores SIGTERM still dies here, and we still wait: "killed" is a fact about
		// the process table, not about the signal we sent.
		if (gone === null) { child.kill('SIGKILL'); await child.exited; }
		// The run directory goes last: the twin holds it open until it is gone.
		seeded?.close();
	};
	const said = async () => `${await new Response(child.stdout).text()}${await new Response(child.stderr).text()}`.trim();
	const refuse = async (why: string): Promise<Outcome<never>> => { const out = await said(); await close(); return fail(out ? `${why}\n${out}` : why); };

	const deadline = Date.now() + LIMITS.readyMs;
	for (;;) {
		if (child.exitCode !== null || child.signalCode !== null)
			return refuse(`the glass exited before it was ready (code ${child.exitCode}, signal ${child.signalCode}) — the twin's own output follows`);
		try {
			const res = await fetch(`http://127.0.0.1:${port}/`, { signal: AbortSignal.timeout(1_000) });
			if (res.ok) { await res.text(); break; }
		}
		catch { /* not up yet — the deadline below is what ends this loop, never a swallowed throw */ }
		if (Date.now() > deadline) return refuse(`the twin was not serving on ${port} within ${LIMITS.readyMs} ms`);
		await sleep(LIMITS.pollMs);
	}

	const cold = await disarmed(port);
	if (!cold.ok) { await close(); return fail(cold.error); }

	return { ok: true, result: {
		port, fixture: seeded?.root ?? null,
		url: (path: string) => `http://127.0.0.1:${port}${path.startsWith('/') ? path : `/${path}`}`,
		close,
	} };
}
