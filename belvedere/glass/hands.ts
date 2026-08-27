/**
 * The hands — the fence's four write powers, and nothing else (README §2, D3).
 *
 *   POST /hands/fire      spawn a session, the summons already landed as its first user turn
 *   POST /hands/worktree  a branch checkout under `.claude/worktrees/` (DOCTRINE §10)
 *   POST /hands/focus     jump Felix's eyes to a live session's panel
 *   POST /hands/halt      touch the HALT flag
 *
 * Three laws hold this file down:
 *
 *  1. **Parse at the boundary.** Every request arrives as `unknown` and leaves this module's
 *     top half as a trusted `Fire`/`Worktree`/`Focus`/`Halt`, or as an error string. Below the
 *     parse line, nothing re-checks anything.
 *  2. **Errors are values.** No hand throws for a refusal — a taken branch, a dead socket and
 *     an absent credential are all `{ ok: false, error }`. The one deliberate exception is the
 *     audit write (§audit): a write the city cannot account for is a failure of the write.
 *  3. **The credential never leaves this process.** It is read per call, handed to `cmux` as
 *     child env, and never logged, rendered, returned, or committed.
 *
 * Recipe provenance: P2 §S/§T, hardened from `lab/p2/spawn.ts`. Deltas from that lab code are
 * named at their sites — the account table, the cwd, and the timeout.
 */

import { appendFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { createHash } from 'crypto';
import { dirname, isAbsolute, join } from 'path';
import { readCensus, isLive } from './census';
import { readRig } from './rig';
import { sanitizeSummons } from './sanitize';
import { AUDIT, HALT, HANDS_ENV, SUMMONS_DIR } from './paths';

/** Everything has a limit (directive 3.1). A hand that hangs is a glass that hangs. */
const LIMITS = { summonsBytes: 64 << 10, requestBytes: 128 << 10, commandMs: 20_000, requester: 64 } as const;

export type Outcome<T> = { ok: true; result: T } | { ok: false; error: string };

const fail = (error: string): Outcome<never> => ({ ok: false, error });

// ---------- the credential ----------

/**
 * `~/.config/belvedere/env`, a `KEY=VALUE` file mode 0600. Read on every call, never cached:
 * Felix rotating the password in cmux Settings must disarm the hands on the next click, not on
 * the next restart. Absent, unreadable, or loose-permissioned ⇒ the hands are disabled and say
 * why — the read pages never notice (glass-shatters).
 */
export function readCredential(): Outcome<string> {
	let mode: number;
	try { mode = statSync(HANDS_ENV).mode; }
	catch { return fail(`no credential at ${HANDS_ENV}`); }
	if (mode & 0o077) return fail(`${HANDS_ENV} is mode ${(mode & 0o777).toString(8)} — must be 600`);

	let text: string;
	try { text = readFileSync(HANDS_ENV, 'utf8'); }
	catch (e) { return fail(`cannot read ${HANDS_ENV}: ${(e as Error).message}`); }

	for (const line of text.split('\n')) {
		const m = line.match(/^\s*CMUX_SOCKET_PASSWORD\s*=\s*(.*?)\s*$/);
		if (!m) continue;
		const value = m[1]!.replace(/^(['"])(.*)\1$/, '$2');
		if (value !== '') return { ok: true, result: value };
	}
	return fail(`${HANDS_ENV} carries no CMUX_SOCKET_PASSWORD`);
}

/** What the glass says about its own hands. The reason is a path and a diagnosis, never a value. */
export const handsState = (): { armed: boolean; note: string } => {
	const cred = readCredential();
	return cred.ok ? { armed: true, note: 'armed' } : { armed: false, note: cred.error };
};

// ---------- the parse boundary ----------

const STAMP = /^[a-z][a-z0-9-]{0,63}$/;                  // `<mantle>-<theater>-<NN>` (canon rows 13/14)
const COLOR = /^(?:[A-Za-z]{1,20}|#[0-9a-fA-F]{6})$/;    // cmux takes a name or a hex
const MODEL = /^[a-z0-9][a-z0-9.\-\[\]]{0,40}$/;
const EFFORT = /^[a-z]{1,10}$/;
const UUID = /^[0-9a-fA-F-]{8,64}$/;                     // session ids and cmux surface ids alike
const BRANCH = /^[A-Za-z0-9][A-Za-z0-9._\/-]{0,79}$/;    // git-legal enough; `..` is refused below

export type Fire = {
	account: string; stamp: string; cwd: string; model: string; effort: string;
	color: string; summons: string; resume: string | null;
};
export type Worktree = { repo: string; branch: string };
export type Focus = { sid: string };
export type Halt = { requester: string };

function field(raw: Record<string, unknown>, key: string): string {
	const value = raw[key];
	return typeof value === 'string' ? value : '';
}

/** An existing directory, absolute — the only kind of place a session or a repo can live. */
function directory(path: string, what: string): string | null {
	if (!isAbsolute(path)) return `${what} must be an absolute path`;
	try { if (!statSync(path).isDirectory()) return `${what} is not a directory: ${path}`; }
	catch { return `${what} does not exist: ${path}`; }
	return null;
}

export function parseFire(raw: unknown): Outcome<Fire> {
	if (typeof raw !== 'object' || raw === null) return fail('body must be a JSON object');
	const r = raw as Record<string, unknown>;
	const fire: Fire = {
		account: field(r, 'account'), stamp: field(r, 'stamp'), cwd: field(r, 'cwd'),
		model: field(r, 'model'), effort: field(r, 'effort'), color: field(r, 'color'),
		summons: field(r, 'summons'), resume: field(r, 'resume') || null,
	};
	if (!STAMP.test(fire.stamp)) return fail(`stamp must match ${STAMP} — got "${fire.stamp}"`);
	if (!MODEL.test(fire.model)) return fail(`model must match ${MODEL} — got "${fire.model}"`);
	if (!EFFORT.test(fire.effort)) return fail(`effort must match ${EFFORT} — got "${fire.effort}"`);
	if (!COLOR.test(fire.color)) return fail(`color must be a cmux colour name or #rrggbb — got "${fire.color}"`);
	if (fire.resume !== null && !UUID.test(fire.resume)) return fail(`resume must be a session id — got "${fire.resume}"`);
	if (fire.summons === '') return fail('summons is empty — the fire IS the summons');
	if (Buffer.byteLength(fire.summons) > LIMITS.summonsBytes) return fail(`summons exceeds ${LIMITS.summonsBytes} bytes`);
	const bad = directory(fire.cwd, 'cwd');
	return bad ? fail(bad) : { ok: true, result: fire };
}

export function parseWorktree(raw: unknown): Outcome<Worktree> {
	if (typeof raw !== 'object' || raw === null) return fail('body must be a JSON object');
	const r = raw as Record<string, unknown>;
	const wt: Worktree = { repo: field(r, 'repo'), branch: field(r, 'branch') };
	if (!BRANCH.test(wt.branch) || wt.branch.includes('..') || wt.branch.endsWith('/'))
		return fail(`branch is not a legal branch name — got "${wt.branch}"`);
	const bad = directory(wt.repo, 'repo');
	return bad ? fail(bad) : { ok: true, result: wt };
}

export function parseFocus(raw: unknown): Outcome<Focus> {
	if (typeof raw !== 'object' || raw === null) return fail('body must be a JSON object');
	const sid = field(raw as Record<string, unknown>, 'sid');
	return UUID.test(sid) ? { ok: true, result: { sid } } : fail(`sid must be a session id — got "${sid}"`);
}

export function parseHalt(raw: unknown): Outcome<Halt> {
	if (typeof raw !== 'object' || raw === null) return fail('body must be a JSON object');
	// The requester is written to a file Felix reads under pressure: one line, no control bytes.
	const requester = field(raw as Record<string, unknown>, 'requester').replace(/\s+/g, ' ').trim().slice(0, LIMITS.requester);
	return requester ? { ok: true, result: { requester } } : fail('requester is required — a HALT with no name is unanswerable');
}

// ---------- running the world's two commands ----------

/** Single-quote for the shell, closing over embedded quotes. */
const q = (value: string): string => `'${value.replaceAll("'", "'\\''")}'`;

async function run(cmd: string[], env: Record<string, string>): Promise<Outcome<string>> {
	const p = Bun.spawn(cmd, {
		env: { ...process.env, ...env },
		stdout: 'pipe', stderr: 'pipe',
		timeout: LIMITS.commandMs,
	});
	const [out, err] = await Promise.all([new Response(p.stdout).text(), new Response(p.stderr).text()]);
	const code = await p.exited;
	const text = (out + err).trim();
	return code === 0 ? { ok: true, result: text } : fail(`${cmd[0]} ${cmd[1]} exited ${code}: ${text || '(no output)'}`);
}

/** The socket. The password rides as child env — the documented fallback for `--password`,
 *  and unlike argv it never appears in anyone's `ps` output (P2 §A3). */
const cmux = (password: string, ...args: string[]) =>
	run(['cmux', ...args], { CMUX_QUIET: '1', CMUX_SOCKET_PASSWORD: password });

const git = (repo: string, ...args: string[]) => run(['git', '-C', repo, ...args], {});

/** `OK workspace:3` → `workspace:3` */
const parseRef = (out: string): string | null => out.match(/\b((?:workspace|surface):\d+)\b/)?.[1] ?? null;

// ---------- the four hands ----------

export type Fired = { workspace: string; summonsPath: string; sha: string; bytes: number };

/**
 * The launch, as one shell line. The summons travels by file and is read back by `"$(cat …)"`,
 * so nothing multi-line is ever typed at a shell prompt (P2 S3) and nothing is ever pasted into
 * a live TUI (T4). Every interpolation is single-quoted even where the parse already proved it
 * inert: a quoting rule with an exception is a quoting rule nobody can check by eye.
 */
export function launchCommand(req: Fire, configDir: string, summonsPath: string): string {
	const flags = ['--model', req.model, '--effort', req.effort, '-n', req.stamp];
	if (req.resume) flags.push('--resume', req.resume);
	return `cd ${q(req.cwd)} && CLAUDE_CONFIG_DIR=${q(configDir)} claude `
		+ flags.map(q).join(' ') + ` "$(cat ${q(summonsPath)})"`;
}

/**
 * One fire = one cmux workspace + one claude session + the summons already landed.
 *
 * Deltas from `lab/p2/spawn.ts`: the account table is the rig's `accounts.tsv` (one table in
 * the city, not a second copy in code), the launch `cd`s into the cwd as well as passing
 * `--cwd` (the workspace label and the process's actual directory are two different things),
 * and every command is bounded. The shape itself is P2's, unchanged and proven ×3 accounts.
 */
export const fire = async (req: Fire, password: string): Promise<Outcome<Fired>> =>
	audited('fire', fireArgs(req), await attemptFire(req, password));

async function attemptFire(req: Fire, password: string): Promise<Outcome<Fired>> {
	const configDir = [...readRig().accounts].find(([, label]) => label === req.account)?.[0];
	if (!configDir) return fail(`unknown account "${req.account}" — the rig's accounts.tsv names the three`);

	const text = sanitizeSummons(req.summons);
	const summonsPath = join(SUMMONS_DIR, `${req.stamp}.summons.txt`);
	mkdirSync(SUMMONS_DIR, { recursive: true });
	writeFileSync(summonsPath, text, { mode: 0o600 });

	const command = launchCommand(req, configDir, summonsPath);
	const created = await cmux(password, 'workspace', 'create',
		'--name', req.stamp, '--cwd', req.cwd, '--focus', 'false', '--command', command);
	if (!created.ok) return created;
	const workspace = parseRef(created.result);
	if (!workspace) return fail(`no workspace ref in: ${created.result}`);

	// Colour is a cmux property, not a `/color` turn — so the session's first user turn stays
	// the summons, and the 359-fire paste gap stays closed (P2's find).
	const colored = await cmux(password, 'workspace-action',
		'--workspace', workspace, '--action', 'set-color', '--color', req.color);
	if (!colored.ok) return fail(`fired ${workspace}, but set-color failed: ${colored.error}`);

	return { ok: true, result: {
		workspace, summonsPath,
		sha: createHash('sha256').update(text).digest('hex').slice(0, 16),
		bytes: Buffer.byteLength(text),
	} };
}

/**
 * DOCTRINE §10's worktree, by its convention: `<repo>/.claude/worktrees/<branch>`, a fresh
 * branch every time. An existing branch is a refusal, not a checkout — a hand that silently
 * adopts someone else's branch is how two sessions end up writing one history.
 */
export const worktree = async (req: Worktree): Promise<Outcome<{ path: string; branch: string }>> =>
	audited('worktree', { ...req }, await attemptWorktree(req));

async function attemptWorktree(req: Worktree): Promise<Outcome<{ path: string; branch: string }>> {
	const inside = await git(req.repo, 'rev-parse', '--show-toplevel');
	if (!inside.ok) return fail(`not a git repo: ${req.repo}`);

	const exists = await git(req.repo, 'show-ref', '--verify', '--quiet', `refs/heads/${req.branch}`);
	if (exists.ok) return fail(`branch already exists: ${req.branch}`);

	const path = join(inside.result, '.claude/worktrees', req.branch);
	if (existsSync(path)) return fail(`worktree path already exists: ${path}`);

	const added = await git(req.repo, 'worktree', 'add', path, '-b', req.branch);
	return added.ok ? { ok: true, result: { path, branch: req.branch } } : added;
}

/**
 * The jump. A session's panel is its census `sf` (`CMUX_SURFACE_ID`); hooks are venue-blind, so
 * a Ghostty session carries none and cannot be jumped to — which is a fact to report, not a
 * failure to paper over (P1 F1, batch-2 bulletin §1).
 */
export const focus = async (req: Focus, password: string): Promise<Outcome<{ surface: string; workspace: string | null }>> =>
	audited('focus', { ...req }, await attemptFocus(req, password));

async function attemptFocus(req: Focus, password: string): Promise<Outcome<{ surface: string; workspace: string | null }>> {
	const census = readCensus();
	if (!census.present) return fail('census not deployed — the glass cannot see any panel');
	const session = census.sessions.find(s => s.sid === req.sid);
	if (!session) return fail(`no session ${req.sid} in the census`);
	if (!isLive(session)) return fail(`session ${req.sid} is ${session.state} — nothing to jump to`);
	const { sf, ws } = session.last;
	if (!sf) return fail(`session ${req.sid} is not in a cmux pane (no CMUX_SURFACE_ID) — nothing to focus`);

	const args = ['focus-panel', '--panel', sf, ...(ws ? ['--workspace', ws] : [])];
	const jumped = await cmux(password, ...args);
	return jumped.ok ? { ok: true, result: { surface: sf, workspace: ws } } : jumped;
}

/**
 * The flag. Dormant by design — its consumers arrive with the Steward chapter — but the file is
 * the contract, so the button can exist now and mean something later. Last writer wins: a HALT
 * is a state, not a queue.
 */
export const halt = (req: Halt): Outcome<{ path: string; at: string }> =>
	audited('halt', { ...req }, attemptHalt(req));

function attemptHalt(req: Halt): Outcome<{ path: string; at: string }> {
	const at = new Date().toISOString();
	try {
		mkdirSync(dirname(HALT), { recursive: true });
		writeFileSync(HALT, `${at} ${req.requester}\n`);
	} catch (e) { return fail(`cannot write ${HALT}: ${(e as Error).message}`); }
	return { ok: true, result: { path: HALT, at } };
}

// ---------- §audit ----------

/**
 * One line per action, in the census's own gitignored neighbourhood. `args` is what was asked
 * for MINUS the summons text — the record keeps its length and its sha so a fire can still be
 * proven byte-exact without the log becoming a copy of every prompt the city ever sent.
 *
 * This is the one write that may throw: an action the city cannot account for is a failed
 * action, and the server's error page is the honest place for that to land.
 */
export function audit(action: string, args: Record<string, unknown>, outcome: Outcome<unknown>): void {
	const line = JSON.stringify({
		ts: new Date().toISOString(), action, args,
		ok: outcome.ok, result: outcome.ok ? outcome.result : outcome.error,
	});
	mkdirSync(dirname(AUDIT), { recursive: true });
	appendFileSync(AUDIT, line + '\n');
}

/**
 * Do it, then say you did it. Every hand returns through here, refusals included — the audit is
 * a property of the write, not of the HTTP layer, so no caller can route around it.
 */
function audited<T>(action: string, args: Record<string, unknown>, outcome: Outcome<T>): Outcome<T> {
	audit(action, args, outcome);
	return outcome;
}

/** The audit's view of a fire: everything but the words. */
export const fireArgs = (f: Fire) => ({
	account: f.account, stamp: f.stamp, cwd: f.cwd, model: f.model, effort: f.effort,
	color: f.color, resume: f.resume, summonsBytes: Buffer.byteLength(f.summons),
});

// ---------- the route ----------

const json = (body: unknown, status: number) =>
	new Response(JSON.stringify(body, null, 2) + '\n', { status, headers: { 'content-type': 'application/json; charset=utf-8' } });

/** A refusal is 409: the request was legal, the world said no. A malformed body is 400. */
const answer = (outcome: Outcome<unknown>) => outcome.ok ? json(outcome, 200) : json(outcome, 409);

/**
 * `/hands/<action>`. POST only; JSON in, JSON out; the credential gate first, so a disabled
 * glass never even parses a body it could not act on.
 */
export async function handsRoute(req: Request, action: string): Promise<Response> {
	if (req.method !== 'POST') return json({ ok: false, error: 'hands are POST-only' }, 405);

	const cred = readCredential();
	if (!cred.ok) return json({ ok: false, error: `hands disabled — ${cred.error}` }, 503);

	const raw = await req.text();
	if (Buffer.byteLength(raw) > LIMITS.requestBytes) return json({ ok: false, error: `body exceeds ${LIMITS.requestBytes} bytes` }, 413);
	let body: unknown;
	try { body = JSON.parse(raw || 'null'); }
	catch (e) { return json({ ok: false, error: `body is not JSON: ${(e as Error).message}` }, 400); }

	switch (action) {
		case 'fire': {
			const parsed = parseFire(body);
			return parsed.ok ? answer(await fire(parsed.result, cred.result)) : json(parsed, 400);
		}
		case 'worktree': {
			const parsed = parseWorktree(body);
			return parsed.ok ? answer(await worktree(parsed.result)) : json(parsed, 400);
		}
		case 'focus': {
			const parsed = parseFocus(body);
			return parsed.ok ? answer(await focus(parsed.result, cred.result)) : json(parsed, 400);
		}
		case 'halt': {
			const parsed = parseHalt(body);
			return parsed.ok ? answer(halt(parsed.result)) : json(parsed, 400);
		}
		default:
			return json({ ok: false, error: `no such hand: ${action} — fire, worktree, focus, halt` }, 404);
	}
}
