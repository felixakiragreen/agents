/**
 * The hands — the fence's write powers, and nothing else (README §2, D3).
 *
 *   POST /hands/ignite    spawn a session, the summons already landed as its first user turn
 *   POST /hands/worktree  a branch checkout under `.claude/worktrees/` (DOCTRINE §10)
 *   POST /hands/focus     jump Felix's eyes to a live session's panel
 *   POST /hands/halt      touch the HALT flag
 *   POST /hands/rename    cmux display state: what a live session's workspace is called (D18 #2)
 *   POST /hands/recolor   cmux display state: what colour it wears (D18 #2)
 *
 * Three laws hold this file down:
 *
 *  1. **Parse at the boundary.** Every request arrives as `unknown` and leaves this module's
 *     top half as a trusted `Ignite`/`Worktree`/`Focus`/`Halt`, or as an error string. Below the
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

import { appendFileSync, closeSync, existsSync, mkdirSync, openSync, readFileSync, readSync, statSync, writeFileSync } from 'fs';
import { createHash } from 'crypto';
import { dirname, isAbsolute, join } from 'path';
import { readCensus, isLive, type Session } from './census';
import { readRig } from './rig';
import { sanitizeSummons } from './sanitize';
import { auditLog, haltFlag, handsEnv, LIVE_CENSUS, summonsDir } from './paths';
import { bust } from './register';

/** Everything has a limit (directive 3.1). A hand that hangs is a glass that hangs. */
const LIMITS = { summonsBytes: 64 << 10, requestBytes: 128 << 10, commandMs: 20_000, shellMs: 8_000, requester: 64, title: 64 } as const;

/**
 * The write boundary's own vocabulary — `Outcome`, `fail`, `field` and `json`. The fence has a
 * fifth write that is not a hand (README §2 #3: the sovereign's inbox, `inbox.ts`); it parses at
 * the same boundary and answers in the same shapes, so it shares these rather than growing a
 * second copy of them. Everything below this block is the four hands and nothing else.
 */
export type Outcome<T> = { ok: true; result: T } | { ok: false; error: string };

export const fail = (error: string): Outcome<never> => ({ ok: false, error });

/** A string field, or the empty string: an absent field and a wrong-typed one refuse identically. */
export function field(raw: Record<string, unknown>, key: string): string {
	const value = raw[key];
	return typeof value === 'string' ? value : '';
}

export const json = (body: unknown, status: number) =>
	new Response(JSON.stringify(body, null, 2) + '\n', { status, headers: { 'content-type': 'application/json; charset=utf-8' } });

// ---------- the credential ----------

/**
 * `~/.config/belvedere/env`, a `KEY=VALUE` file mode 0600. Read on every call, never cached:
 * Felix rotating the password in cmux Settings must disarm the hands on the next click, not on
 * the next restart. Absent, unreadable, or loose-permissioned ⇒ the hands are disabled and say
 * why — the read pages never notice (glass-shatters).
 */
export function readCredential(): Outcome<string> {
	let mode: number;
	try { mode = statSync(handsEnv()).mode; }
	catch { return fail(`no credential at ${handsEnv()}`); }
	if (mode & 0o077) return fail(`${handsEnv()} is mode ${(mode & 0o777).toString(8)} — must be 600`);

	let text: string;
	try { text = readFileSync(handsEnv(), 'utf8'); }
	catch (e) { return fail(`cannot read ${handsEnv()}: ${(e as Error).message}`); }

	for (const line of text.split('\n')) {
		const m = line.match(/^\s*CMUX_SOCKET_PASSWORD\s*=\s*(.*?)\s*$/);
		if (!m) continue;
		const value = m[1]!.replace(/^(['"])(.*)\1$/, '$2');
		if (value !== '') return { ok: true, result: value };
	}
	return fail(`${handsEnv()} carries no CMUX_SOCKET_PASSWORD`);
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
const BUILDING = /^[A-Za-z0-9][A-Za-z0-9._-]*(?:\/[A-Za-z0-9._-]+){0,4}$/;   // the register's path

/**
 * An ignition, or a resume — one hand, because both are "spawn a session" and the fence has one
 * line for that (D3). What separates them is `resume`, and one rule follows from it:
 *
 * **On a resume, a field Belvedere does not know is omitted from argv, never guessed.** A dead
 * transcript carries its own uuid and (sometimes) its own name-stamp; it does not carry the tier
 * it ran at, and it certainly does not carry a next instruction. So on a resume `stamp`, `model`,
 * `effort` and `summons` may all be empty, and each empty one drops its flag — claude comes back
 * on the session's own settings. On a fresh ignition every one of them is still required.
 *
 * The summons is the sharp end: `/shelf` exists so Felix can **stand in** a session, and a resume
 * that injected a first user turn would wake a three-week-dead agent and set it working with no
 * instruction. That is the self-inflicted DoS this row was cut to prevent, not a convenience.
 */
export type Ignite = {
	account: string; stamp: string; cwd: string; model: string; effort: string;
	color: string; summons: string; resume: string | null;
	/** The building the work is FOR — the register's path, `agents/belvedere`. Empty is legal and
	 *  means "no home": the ignition mints its own workspace, which is what every hand did before
	 *  B22. See §placement. */
	building: string;
};
export type Worktree = { repo: string; branch: string };
export type Focus = { sid: string };
export type Halt = { requester: string };

/**
 * The two write-through hands (D18 class 2, D16): cmux is truth for a session's live name and
 * colour, so the deck's rename and recolor are socket writes to **cmux display state** and nothing
 * else — no setting changes, no file writes, no effect on the session itself.
 *
 * Both target by `sid`, the census's own join key, and nothing else. The target is resolved through
 * the live census to the workspace that session is running in: a hand that took a workspace ref
 * from the browser would let a stale page rename whatever now holds that number, which is the
 * ambiguity D10 forbids.
 *
 * **And the resolved target is a UUID, which is load-bearing** (P6 F2): a `workspace:N` ref that
 * does not resolve is not an error to cmux — it delivers to the *focused* workspace instead, so a
 * stale ref renames whatever Felix is looking at. `CMUX_WORKSPACE_ID` is a uuid, a uuid that no
 * longer exists answers `not_found`, and every socket target this row writes — these two hands and
 * the jump's panel, workspace and window — is one.
 */
export type Rename = { sid: string; title: string };
export type Recolor = { sid: string; color: string };

/** An existing directory, absolute — the only kind of place a session or a repo can live. */
function directory(path: string, what: string): string | null {
	if (!isAbsolute(path)) return `${what} must be an absolute path`;
	try { if (!statSync(path).isDirectory()) return `${what} is not a directory: ${path}`; }
	catch { return `${what} does not exist: ${path}`; }
	return null;
}

/** Required on a fresh ignition; on a resume, empty is legal and means "leave it as the session had it". */
const known = (value: string, re: RegExp, what: string, optional: boolean): string | null =>
	optional && value === '' ? null : re.test(value) ? null : `${what} must match ${re} — got "${value}"`;

export function parseIgnite(raw: unknown): Outcome<Ignite> {
	if (typeof raw !== 'object' || raw === null) return fail('body must be a JSON object');
	const r = raw as Record<string, unknown>;
	const ignite: Ignite = {
		account: field(r, 'account'), stamp: field(r, 'stamp'), cwd: field(r, 'cwd'),
		model: field(r, 'model'), effort: field(r, 'effort'), color: field(r, 'color'),
		summons: field(r, 'summons'), resume: field(r, 'resume') || null,
		building: field(r, 'building'),
	};
	if (ignite.resume !== null && !UUID.test(ignite.resume)) return fail(`resume must be a session id — got "${ignite.resume}"`);
	if (ignite.building !== '' && !BUILDING.test(ignite.building))
		return fail(`building must be a register path like "agents/belvedere" — got "${ignite.building}"`);
	const resuming = ignite.resume !== null;
	// The colour is never optional: it is a property of the workspace this call is about to make,
	// not of the session it is reviving, so there is nothing to leave alone.
	const bad = known(ignite.stamp, STAMP, 'stamp', resuming)
		?? known(ignite.model, MODEL, 'model', resuming)
		?? known(ignite.effort, EFFORT, 'effort', resuming)
		?? (COLOR.test(ignite.color) ? null : `color must be a cmux colour name or #rrggbb — got "${ignite.color}"`)
		?? (!resuming && ignite.summons === '' ? 'summons is empty — the ignition IS the summons' : null)
		?? (Buffer.byteLength(ignite.summons) > LIMITS.summonsBytes ? `summons exceeds ${LIMITS.summonsBytes} bytes` : null)
		?? directory(ignite.cwd, 'cwd');
	return bad ? fail(bad) : { ok: true, result: ignite };
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

/**
 * A workspace title Felix will read in a sidebar: one line, bounded, and non-empty after the
 * collapse. A name made only of whitespace is a workspace he cannot find, so it is refused rather
 * than written — cmux would accept it.
 */
export function parseRename(raw: unknown): Outcome<Rename> {
	if (typeof raw !== 'object' || raw === null) return fail('body must be a JSON object');
	const r = raw as Record<string, unknown>;
	const sid = field(r, 'sid');
	if (!UUID.test(sid)) return fail(`sid must be a session id — got "${sid}"`);
	const title = field(r, 'title').replace(/\s+/g, ' ').trim();
	if (title === '') return fail('title is empty — a workspace with no name is one you cannot find');
	if (title.length > LIMITS.title) return fail(`title exceeds ${LIMITS.title} characters`);
	return { ok: true, result: { sid, title } };
}

/**
 * A colour cmux takes: one of its sixteen names, or a `#rrggbb`. The glass's own swatches are
 * felikai hexes (`colors.ts`), so a value this refuses can only have been hand-written — and a
 * value cmux refuses comes back as cmux's own words, on the card, in the audit.
 */
export function parseRecolor(raw: unknown): Outcome<Recolor> {
	if (typeof raw !== 'object' || raw === null) return fail('body must be a JSON object');
	const r = raw as Record<string, unknown>;
	const sid = field(r, 'sid');
	if (!UUID.test(sid)) return fail(`sid must be a session id — got "${sid}"`);
	const color = field(r, 'color');
	return COLOR.test(color) ? { ok: true, result: { sid, color } }
		: fail(`color must be a cmux colour name or #rrggbb — got "${color}"`);
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

async function run(cmd: string[], env: Record<string, string>, ms: number): Promise<Outcome<string>> {
	const p = Bun.spawn(cmd, {
		env: { ...process.env, ...env },
		stdout: 'pipe', stderr: 'pipe',
		timeout: ms,
	});
	const [out, err] = await Promise.all([new Response(p.stdout).text(), new Response(p.stderr).text()]);
	const code = await p.exited;
	const text = (out + err).trim();
	return code === 0 ? { ok: true, result: text } : fail(`${cmd[0]} ${cmd[1]} exited ${code}: ${text || '(no output)'}`);
}

/**
 * The socket, and the city's only door to it — `identity.ts` reads through this rather than forking
 * a second spawn (B18's order: extend, don't fork). The password rides as child env: the documented
 * fallback for `--password`, and unlike argv it never appears in anyone's `ps` output (P2 §A3).
 *
 * The timeout is the caller's because the callers are not alike: a hand may take the full twenty
 * seconds, and a read on the deck's poll path may not.
 */
export const cmux = (password: string, ms: number, ...args: string[]) =>
	run(['cmux', ...args], { CMUX_QUIET: '1', CMUX_SOCKET_PASSWORD: password }, ms);

const git = (repo: string, ...args: string[]) => run(['git', '-C', repo, ...args], {}, LIMITS.commandMs);

/** `OK workspace:3` → `workspace:3` */
const parseRef = (out: string): string | null => out.match(/\b((?:workspace|surface):\d+)\b/)?.[1] ?? null;

// ---------- the four hands ----------

/**
 * `summonsPath`/`sha` are null on a resume: there was no first user turn to write or to prove.
 *
 * `workspace` is a **uuid**, always (P6 F2 — see §the UUID law), and `surface` is the uuid of the
 * pane the session actually runs in. `minted` says whether this hand made the workspace: it is what
 * `retire()` reads back out of the audit, and the difference between a workspace Belvedere may
 * close and one that is Felix's.
 */
export type Ignited = {
	workspace: string; minted: boolean; home: string | null; surface: string | null;
	summonsPath: string | null; sha: string | null; bytes: number;
};

/**
 * The launch, as one shell line. The summons travels by file and is read back by `"$(cat …)"`,
 * so nothing multi-line is ever typed at a shell prompt (P2 S3) and nothing is ever pasted into
 * a live TUI (T4). Every interpolation is single-quoted even where the parse already proved it
 * inert: a quoting rule with an exception is a quoting rule nobody can check by eye.
 *
 * An empty field drops its flag — the resume law (§Ignite). `summonsPath` is null exactly when
 * there is no first user turn, and the line then ends at the last flag: `claude --resume <uuid>`,
 * which is the shape cmux's own restore binding re-execs (P4 §R).
 */
export function launchCommand(req: Ignite, configDir: string, summonsPath: string | null): string {
	const flags: string[] = [];
	if (req.model) flags.push('--model', req.model);
	if (req.effort) flags.push('--effort', req.effort);
	if (req.stamp) flags.push('-n', req.stamp);
	if (req.resume) flags.push('--resume', req.resume);
	return `cd ${q(req.cwd)} && CLAUDE_CONFIG_DIR=${q(configDir)} claude ${flags.map(q).join(' ')}`
		+ (summonsPath ? ` "$(cat ${q(summonsPath)})"` : '');
}

/**
 * The cmux workspace's label. A fresh ignition is its name-stamp; a resume of a session that never
 * had one is named after the transcript it is reviving, because a workspace called `""` is a
 * workspace Felix cannot find and Belvedere will not invent him a lineage he did not ignite.
 */
export const workspaceName = (req: Ignite): string =>
	req.stamp || (req.resume ? `resume-${req.resume.slice(0, 8)}` : 'belvedere');

/**
 * One ignition = one cmux workspace + one claude session + the summons already landed.
 *
 * Deltas from `lab/p2/spawn.ts`: the account table is the rig's `accounts.tsv` (one table in
 * the city, not a second copy in code), the launch `cd`s into the cwd as well as passing
 * `--cwd` (the workspace label and the process's actual directory are two different things),
 * and every command is bounded. The shape itself is P2's, unchanged and proven ×3 accounts.
 */
export const ignite = async (req: Ignite, password: string): Promise<Outcome<Ignited>> =>
	busting(audited('ignite', igniteArgs(req), await attemptIgnite(req, password)));

async function attemptIgnite(req: Ignite, password: string): Promise<Outcome<Ignited>> {
	const configDir = [...readRig().accounts].find(([, label]) => label === req.account)?.[0];
	if (!configDir) return fail(`unknown account "${req.account}" — the rig's accounts.tsv names the three`);

	// No summons, no file: a resume that writes an empty summons file would leave the audit
	// claiming a first user turn that never happened.
	const text = req.summons === '' ? '' : sanitizeSummons(req.summons);
	let summonsPath: string | null = null;
	if (text !== '') {
		summonsPath = join(summonsDir(), `${workspaceName(req)}.summons.txt`);
		mkdirSync(summonsDir(), { recursive: true });
		writeFileSync(summonsPath, text, { mode: 0o600 });
	}

	const command = launchCommand(req, configDir, summonsPath);
	const placed = await place(req, password, command);
	if (!placed.ok) return placed;

	return { ok: true, result: {
		...placed.result, summonsPath,
		sha: summonsPath === null ? null : createHash('sha256').update(text).digest('hex').slice(0, 16),
		bytes: Buffer.byteLength(text),
	} };
}

// ---------- §placement: where a fire lands (B22 candidate 6, B25's surviving half) ----------

/**
 * **The UUID law** (P6 F2, ruled city-wide at G2). A `workspace:N` ref that does not resolve is not
 * an error to cmux — it delivers to the *focused* workspace instead, so a stale ref drives whatever
 * Felix happens to be looking at. Every socket call past a create therefore addresses by uuid.
 *
 * The one documented exception is structural and is named at its site: **`cmux workspace create`
 * and `new-surface` print refs and only refs** — `--id-format both` is accepted and ignored on
 * both (measured at this row). So a ref is read out of the create's own output and converted to a
 * uuid inside the same breath, by the read immediately after it; nothing downstream ever sees it.
 *
 * **The home** (D55's neighbour, B25 §1). An ignition for a building lands in the workspace Felix
 * keeps for that building — found by **name**, addressed by **uuid**, minted only when none
 * exists. The name is the building's last segment, matched exactly: `agents/belvedere` looks for a
 * workspace called `belvedere` and nothing else. Two matches never guess between his workspaces —
 * the ignition mints fresh and the audit carries the ambiguity (D10's spirit); zero matches mint
 * one **named for the building**, never `workspace:N`.
 *
 * A landing into a workspace Belvedere did not make touches nothing but the surface it adds: no
 * rename, and **no recolor** — the colour is a property of the whole workspace, and repainting
 * Felix's is not a hand this fence has.
 */
type Placed = { workspace: string; minted: boolean; home: string | null; surface: string | null };

/** The workspace name a building keeps: its last segment. `agents/belvedere` → `belvedere`. */
export const homeName = (building: string): string | null =>
	building === '' ? null : building.split('/').filter(Boolean).at(-1) ?? null;

/** `cmux workspace list --json` in, the uuids of every workspace wearing exactly this name out. */
export function workspacesNamed(raw: unknown, name: string): string[] {
	const list = (raw as { workspaces?: unknown } | null)?.workspaces;
	if (!Array.isArray(list)) return [];
	const out: string[] = [];
	for (const item of list) {
		if (typeof item !== 'object' || item === null) continue;
		const w = item as Record<string, unknown>;
		const title = typeof w['title'] === 'string' && w['title'] !== '' ? w['title'] : w['custom_title'];
		if (title === name && typeof w['id'] === 'string') out.push(w['id']);
	}
	return out;
}

/** `* surface:74 226CF97B-…  b22-scratch` → the uuid beside a ref. `list-pane-surfaces --id-format both`. */
export function uuidOfRef(listing: string, ref: string): string | null {
	for (const line of listing.split('\n')) {
		const m = line.match(/\b(\w+:\d+)\s+([0-9A-Fa-f-]{36})\b/);
		if (m && m[1] === ref) return m[2]!;
	}
	return null;
}

async function place(req: Ignite, password: string, command: string): Promise<Outcome<Placed>> {
	const home = homeName(req.building);
	if (home === null) return mint(req, password, command, null, null);

	const listed = await cmux(password, LIMITS.commandMs, 'workspace', 'list', '--json');
	if (!listed.ok) return listed;
	let found: string[];
	try { found = workspacesNamed(JSON.parse(listed.result), home); }
	catch (e) { return fail(`cmux workspace list answered no JSON: ${(e as Error).message}`); }

	if (found.length === 1) return land(req, password, command, found[0]!, home);
	// Ambiguity never blocks and never guesses between his workspaces (D10's spirit): mint fresh,
	// and say in the audit which uuids collided so the next hand can see what it stepped around.
	const note = found.length === 0 ? null : `${found.length} workspaces are named "${home}" (${found.join(', ')}) — minted fresh rather than guess`;
	return mint(req, password, command, home, note);
}

/** A workspace of Belvedere's own, named for the building where there is one. */
async function mint(req: Ignite, password: string, command: string, home: string | null, ambiguity: string | null): Promise<Outcome<Placed>> {
	const name = home ?? workspaceName(req);
	const created = await cmux(password, LIMITS.commandMs, 'workspace', 'create',
		'--name', name, '--cwd', req.cwd, '--focus', 'false', '--command', command);
	if (!created.ok) return created;
	const ref = parseRef(created.result);
	// A workspace with no readable ref cannot be closed — there is nothing to name. Say so with
	// the raw output, because the thing is running and only Felix can find it now.
	if (!ref) return fail(`workspace created but no ref in its output — find it by hand and close it: ${created.result}`);

	// The ref → uuid conversion, inside the breath that made the ref (§the UUID law). Everything
	// after this line — the colour, the unwind, the audit, `retire()` — carries the uuid.
	const listed = await cmux(password, LIMITS.commandMs, 'workspace', 'list', '--json');
	if (!listed.ok) return unwind(password, ref, `the workspace was created as ${ref} but cmux would not list it back: ${listed.error}`);
	let workspace: string | null = null;
	try { workspace = uuidOfList(JSON.parse(listed.result), ref); }
	catch (e) { return unwind(password, ref, `cmux workspace list answered no JSON: ${(e as Error).message}`); }
	if (!workspace) return unwind(password, ref, `${ref} is not in cmux's own workspace list — it cannot be addressed by uuid`);

	// Colour is a cmux property, not a `/color` turn — so the session's first user turn stays
	// the summons, and the 359-ignition paste gap stays closed (P2's find). Only ever on a mint:
	// a workspace of Felix's keeps the colour he gave it.
	const colored = await cmux(password, LIMITS.commandMs, 'workspace-action',
		'--workspace', workspace, '--action', 'set-color', '--color', req.color);
	if (!colored.ok) return unwind(password, workspace, `set-color failed: ${colored.error}`);

	if (ambiguity) audit('ignite.ambiguous', { building: req.building, home, workspace }, fail(ambiguity));
	return { ok: true, result: { workspace, minted: true, home, surface: null } };
}

/** `cmux workspace list --json` in, the uuid of one ref out — the breath's own conversion. */
export function uuidOfList(raw: unknown, ref: string): string | null {
	const list = (raw as { workspaces?: unknown } | null)?.workspaces;
	if (!Array.isArray(list)) return null;
	for (const item of list) {
		const w = item as Record<string, unknown>;
		if (w?.['ref'] === ref && typeof w['id'] === 'string') return w['id'];
	}
	return null;
}

/**
 * Landing into a workspace that is already Felix's: one new terminal surface, named for the
 * name-stamp, and the launch line typed into it.
 *
 * `new-surface` takes no `--command` (measured — the flag does not exist on it or on `new-pane`),
 * so the launch travels as text into a **fresh shell**, which is legal exactly where pasting into a
 * live Claude TUI is not (P2 T4): the surface has never run anything, `launchCommand` is one line,
 * and every interpolation in it is single-quoted. The shell needs a moment to exist before it can
 * be typed at, so the surface is read until it answers something rather than typed at blind.
 */
async function land(req: Ignite, password: string, command: string, workspace: string, home: string): Promise<Outcome<Placed>> {
	const made = await cmux(password, LIMITS.commandMs, 'new-surface', '--type', 'terminal', '--workspace', workspace, '--focus', 'false');
	if (!made.ok) return made;
	const ref = made.result.match(/\bsurface:\d+\b/)?.[0] ?? null;
	if (!ref) return fail(`surface created in ${workspace} but no ref in its output — find it by hand: ${made.result}`);

	const listed = await cmux(password, LIMITS.commandMs, 'list-pane-surfaces', '--workspace', workspace, '--id-format', 'both');
	if (!listed.ok) return shed(password, ref, workspace, `the surface was created as ${ref} but cmux would not list it back: ${listed.error}`);
	const surface = uuidOfRef(listed.result, ref);
	if (!surface) return shed(password, ref, workspace, `${ref} is not in ${workspace}'s own surface list — it cannot be addressed by uuid`);

	// The workspace wears the building's name, so the tab wears the stamp: without it the session
	// is a pane called "Terminal" in a workspace holding several, which is one Felix cannot find.
	//
	// **Every surface-addressed call names its workspace** — B18 F1's law, re-measured here: a
	// surface handle is resolved *inside one workspace*, and with `--workspace` omitted cmux looks
	// in the caller's, then the selected one. This probe's first run failed exactly there
	// (`rename-tab … → not_found: Workspace not found`, against a uuid that plainly existed), and
	// the same omission on `send` would have typed a launch line into whatever Felix was looking at.
	const named = await cmux(password, LIMITS.commandMs, 'rename-tab', '--workspace', workspace, '--surface', surface, workspaceName(req));
	if (!named.ok) return shed(password, surface, workspace, `rename-tab failed: ${named.error}`);

	const ready = await shellReady(password, workspace, surface);
	if (!ready.ok) return shed(password, surface, workspace, ready.error);

	const typed = await cmux(password, LIMITS.commandMs, 'send', '--workspace', workspace, '--surface', surface, command);
	if (!typed.ok) return shed(password, surface, workspace, `send failed: ${typed.error}`);
	const entered = await cmux(password, LIMITS.commandMs, 'send-key', '--workspace', workspace, '--surface', surface, 'Enter');
	// Past the Enter there is a live session in Felix's workspace: closing the surface would kill it,
	// so a failed receipt is reported with the surface named, never unwound.
	if (!entered.ok) return fail(`the launch line is typed into ${surface} but Enter was refused (${entered.error}) — press it by hand`);

	return { ok: true, result: { workspace, minted: false, home, surface } };
}

/** A shell that has printed anything at all is a shell that can be typed at. Bounded, and it says so. */
async function shellReady(password: string, workspace: string, surface: string): Promise<Outcome<string>> {
	for (let waited = 0; waited < LIMITS.shellMs; waited += 200) {
		const seen = await cmux(password, 5_000, 'read-screen', '--workspace', workspace, '--surface', surface, '--lines', '4');
		if (seen.ok && seen.result.trim() !== '') return seen;
		await Bun.sleep(200);
	}
	return fail(`the new surface printed nothing in ${LIMITS.shellMs} ms — its shell never came up, so the launch line was never typed`);
}

/**
 * A landing that dies after its surface exists closes **the surface**, never the workspace: the
 * workspace is Felix's and holds his other panes. `unwind`'s sibling, and the distinction is the
 * whole reason placement is worth writing carefully.
 */
async function shed(password: string, surface: string, workspace: string, why: string): Promise<Outcome<never>> {
	const closed = await cmux(password, LIMITS.commandMs, 'close-surface', '--surface', surface, '--workspace', workspace);
	audit('ignite.shed', { surface, workspace, why }, closed);
	return fail(closed.ok
		? `${why} — ${surface} closed, ${workspace} untouched`
		: `${why} — AND the surface would not close: ${closed.error}. ${surface} is still open in ${workspace}; close it by hand.`);
}

// ---------- §retirement (D55) ----------

/**
 * Close a workspace **Belvedere minted** that **nothing has been added to**. Both halves are
 * measured rather than assumed: the audit says who made it, and cmux says what is in it now.
 *
 * A mint arrives holding exactly one surface — the session it was made for. A workspace holding
 * more than that is one Felix moved a panel into, and a workspace Felix touched is his, forever
 * (B25 §3). This is the D55 cleanup a probe owes its own desktop, not a hand on the wire: no route
 * reaches it, and the write surface is exactly the one `unwind` already had.
 */
export async function retire(workspace: string, password: string): Promise<Outcome<{ workspace: string; surfaces: number }>> {
	if (!mintedByBelvedere(workspace))
		return audited('retire', { workspace }, fail(`${workspace} is not in the audit as a workspace Belvedere minted — it is Felix's`));

	const listed = await cmux(password, LIMITS.commandMs, 'list-pane-surfaces', '--workspace', workspace, '--id-format', 'both');
	if (!listed.ok) return audited('retire', { workspace }, listed);
	const surfaces = listed.result.split('\n').filter(l => /\bsurface:\d+\s+[0-9A-Fa-f-]{36}/.test(l)).length;
	if (surfaces > 1)
		return audited('retire', { workspace, surfaces }, fail(`${workspace} holds ${surfaces} surfaces — something was added to it, so it is Felix's now and stays standing`));

	const closed = await cmux(password, LIMITS.commandMs, 'workspace', 'close', workspace);
	return audited('retire', { workspace, surfaces }, closed.ok ? { ok: true, result: { workspace, surfaces } } : closed);
}

/** Does the audit record this uuid as one of Belvedere's own mints? */
export function mintedByBelvedere(workspace: string): boolean {
	return readAudit().some(line =>
		line.action === 'ignite' && line.ok === true
		&& (line.result as { workspace?: unknown; minted?: unknown } | null)?.workspace === workspace
		&& (line.result as { minted?: unknown }).minted === true);
}

/** The audit, parsed, bounded to the tail the readers need. A malformed line is skipped, never fatal. */
type AuditLine = { ts?: string; action?: string; args?: Record<string, unknown>; ok?: boolean; result?: unknown };

export function readAudit(tailBytes = 4 << 20): AuditLine[] {
	let text: string;
	try {
		const size = statSync(auditLog()).size;
		const fd = openSync(auditLog(), 'r');
		try {
			const from = Math.max(0, size - tailBytes);
			const buf = Buffer.alloc(size - from);
			readSync(fd, buf, 0, buf.length, from);
			text = buf.toString('utf8');
		} finally { closeSync(fd); }
	} catch { return []; }
	const out: AuditLine[] = [];
	for (const line of text.split('\n')) {
		if (line === '') continue;
		try { out.push(JSON.parse(line) as AuditLine); } catch { /* a partial first line, or a torn write */ }
	}
	return out;
}

/**
 * **The ignited-for join** (B25 §2). The census keys a session by cwd alone (`buildingOf`, B5 F1),
 * so `architect-belvedere-04` working at the repo root houses under `agents` while the stamp, the
 * summons and the audit all say `agents/belvedere`. The ignition knew the building; the audit kept
 * it; the name-stamp is what joins them, because it is the one field the audit and the census both
 * carry (the census reads it out of the transcript's `agent-name` record — B2 F1).
 *
 * Stamp → building, last ignition wins. A stamp Belvedere never ignited is absent, and an absent
 * stamp falls back to the cwd — hand-started sessions house exactly as they always did.
 */
let joined: { at: number; size: number; homes: Map<string, string> } | null = null;

export function ignitedFor(): Map<string, string> {
	// The deck polls every 3 s and the audit is append-only, so the read is keyed on the file's own
	// size and mtime: a log that has not grown cannot have named a new home (B8 F3's law — nothing
	// on the poll path re-does work it can prove is unchanged).
	let stamp: { at: number; size: number };
	try { const s = statSync(auditLog()); stamp = { at: s.mtimeMs, size: s.size }; }
	catch { return new Map(); }
	if (joined && joined.at === stamp.at && joined.size === stamp.size) return joined.homes;

	const homes = new Map<string, string>();
	for (const line of readAudit()) {
		if (line.action !== 'ignite' || line.ok !== true) continue;
		const stamp = line.args?.['stamp'];
		const building = line.args?.['building'];
		if (typeof stamp === 'string' && stamp !== '' && typeof building === 'string' && building !== '')
			homes.set(stamp, building);
	}
	joined = { ...stamp, homes };
	return homes;
}

/**
 * An ignition is create-then-configure, so a failure after the create leaves a live workspace running
 * a session nobody asked for — B3 F1 measured exactly that: a colour cmux refuses cost a whole
 * ignition and orphaned the workspace behind it. So an ignition that dies after its create closes what it
 * made, and the audit carries the unwind under its own action. **If the close fails too, the
 * error names the live workspace** — an orphan Felix knows about is a chore; one he does not is
 * a session burning quota in a window he never opens.
 */
async function unwind(password: string, workspace: string, why: string): Promise<Outcome<never>> {
	const closed = await cmux(password, LIMITS.commandMs, 'workspace', 'close', workspace);
	audit('ignite.unwind', { workspace, why }, closed);
	return fail(closed.ok
		? `${why} — ${workspace} closed, nothing left running`
		: `${why} — AND the unwind failed: ${closed.error}. ${workspace} is still live; close it by hand.`);
}

/**
 * DOCTRINE §10's worktree, by its convention: `<repo>/.claude/worktrees/<branch>`, a fresh
 * branch every time. An existing branch is a refusal, not a checkout — a hand that silently
 * adopts someone else's branch is how two sessions end up writing one history.
 */
export const worktree = async (req: Worktree): Promise<Outcome<{ path: string; branch: string }>> =>
	busting(audited('worktree', { ...req }, await attemptWorktree(req)));

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

/** The census's word on one live session, or the reason there is nothing to act on. */
function liveSession(sid: string): Outcome<Session> {
	const census = readCensus();
	if (!census.present) return fail('census not deployed — the deck cannot see any session');
	const session = census.sessions.find(s => s.sid === sid);
	if (!session) return fail(`no session ${sid} in the census`);
	if (!isLive(session)) return fail(`session ${sid} is ${session.state} — nothing to act on`);
	return { ok: true, result: session };
}

/** The workspace a live session runs in, by the census's own `CMUX_WORKSPACE_ID`. */
function liveWorkspace(sid: string): Outcome<{ session: Session; ws: string }> {
	const found = liveSession(sid);
	if (!found.ok) return found;
	const ws = found.result.last.ws;
	return ws
		? { ok: true, result: { session: found.result, ws } }
		: fail(`session ${sid} is not in a cmux workspace (no CMUX_WORKSPACE_ID) — hooks are venue-blind`);
}

// ---------- the jump ----------

/** Where a surface actually sits *now* — the tree's word, not a hook's memory of it. */
export type Placement = { workspace: string; window: string };

/**
 * `cmux tree --all --json --id-format both`, read for one surface. Pure, so the shape is pinned by
 * tests rather than by a live desktop.
 */
export function findSurface(raw: unknown, surface: string): Placement | null {
	const windows = (raw as { windows?: unknown } | null)?.windows;
	if (!Array.isArray(windows)) return null;
	for (const w of windows) {
		const window = (w as Record<string, unknown>)['id'];
		const workspaces = (w as Record<string, unknown>)['workspaces'];
		if (typeof window !== 'string' || !Array.isArray(workspaces)) continue;
		for (const ws of workspaces) {
			const workspace = (ws as Record<string, unknown>)['id'];
			const panes = (ws as Record<string, unknown>)['panes'];
			if (typeof workspace !== 'string' || !Array.isArray(panes)) continue;
			for (const p of panes) {
				const surfaces = (p as Record<string, unknown>)['surfaces'];
				if (!Array.isArray(surfaces)) continue;
				for (const s of surfaces)
					if ((s as Record<string, unknown>)['id'] === surface) return { workspace, window };
			}
		}
	}
	return null;
}

/**
 * The jump, and the field report's *"JUMP TO PANEL … does nothing"* closed at the cause. Three
 * things were wrong with asking cmux to focus a panel and calling it a jump — all measured at this
 * row against a live socket (`lab/b18/jump.ts`):
 *
 *  1. **`--panel` is resolved inside ONE workspace.** With `--workspace` omitted — which is what the
 *     hand did whenever the census carried no `ws` — a surface in any other workspace answers
 *     `not_found: Surface not found`, by ref and by uuid alike.
 *  2. **The census's `ws` is a hook's memory.** The surface's *current* workspace is the tree's to
 *     say, so the tree is read first and a surface it does not carry is a refusal, not a jump into
 *     a workspace that may no longer hold it (D10: an ambiguous target never sends).
 *  3. **Nothing on the socket brings cmux forward.** `focus-panel` selects the workspace inside cmux
 *     and returns `OK`; `focus-window`, whose own help says *"Focus (bring to front) the specified
 *     window"*, means the window inside the app. Measured with the deck in a browser: frontmost was
 *     `Arc` before, after `focus-panel`, and after `focus-window` — an `ok` receipt over a screen
 *     that never moved, which is exactly what Felix reported. The application half is the OS's, so
 *     the last step is `open -a <the bundle cmux itself names>`; measured `Arc` → `cmux`.
 */
export const focus = async (req: Focus, password: string): Promise<Outcome<Placement & { surface: string }>> =>
	audited('focus', { ...req }, await attemptFocus(req, password));

async function attemptFocus(req: Focus, password: string): Promise<Outcome<Placement & { surface: string }>> {
	const found = liveSession(req.sid);
	if (!found.ok) return found;
	const sf = found.result.last.sf;
	if (!sf) return fail(`session ${req.sid} is not in a cmux pane (no CMUX_SURFACE_ID) — nothing to focus`);

	const tree = await cmux(password, LIMITS.commandMs, 'tree', '--all', '--json', '--id-format', 'both');
	if (!tree.ok) return tree;
	let placed: Placement | null;
	try { placed = findSurface(JSON.parse(tree.result), sf); }
	catch (e) { return fail(`cmux tree answered no JSON: ${(e as Error).message}`); }
	if (!placed) return fail(`surface ${sf} is not on the desktop any more — the pane it heartbeated from is gone`);

	const jumped = await cmux(password, LIMITS.commandMs, 'focus-panel', '--panel', sf, '--workspace', placed.workspace);
	if (!jumped.ok) return jumped;

	// The panel is selected; the app may still be behind a browser. A jump Felix cannot see is the
	// bug, so a window that will not come forward is reported, never swallowed.
	const front = await cmux(password, LIMITS.commandMs, 'focus-window', '--window', placed.window);
	if (!front.ok) return fail(`${sf} is selected but cmux's window did not come forward: ${front.error}`);

	const shown = await activate(password);
	if (!shown.ok) return fail(`${sf} is selected but cmux is still behind whatever you are looking at: ${shown.error}`);

	return { ok: true, result: { surface: sf, ...placed } };
}

/**
 * Bring the application itself forward — the half of the jump the socket does not have. cmux names
 * its own bundle (`identify --json` → `app_bundle_path`), so the glass never carries a hard-coded
 * path to somebody's Applications folder; `open -a` is a system binary and a spawn, the same posture
 * `gauges.ts` already takes with `ps`, and it activates a running app rather than launching one.
 */
async function activate(password: string): Promise<Outcome<string>> {
	const who = await cmux(password, LIMITS.commandMs, 'identify', '--json');
	if (!who.ok) return who;
	let bundle: unknown;
	try { bundle = (JSON.parse(who.result) as Record<string, unknown>)['app_bundle_path']; }
	catch (e) { return fail(`cmux identify answered no JSON: ${(e as Error).message}`); }
	if (typeof bundle !== 'string' || !isAbsolute(bundle)) return fail(`cmux names no app bundle to bring forward`);
	const opened = await run(['open', '-a', bundle], {}, LIMITS.commandMs);
	return opened.ok ? { ok: true, result: bundle } : opened;
}

// ---------- write-through: cmux is truth, so the deck writes to cmux (D16, D18 class 2) ----------

/** Rename the workspace a live session runs in. Display state only — the session is untouched. */
export const rename = async (req: Rename, password: string): Promise<Outcome<{ workspace: string; title: string }>> =>
	audited('rename', { ...req }, await attemptRename(req, password));

async function attemptRename(req: Rename, password: string): Promise<Outcome<{ workspace: string; title: string }>> {
	const target = liveWorkspace(req.sid);
	if (!target.ok) return target;
	const done = await cmux(password, LIMITS.commandMs,
		'workspace-action', '--workspace', target.result.ws, '--action', 'rename', '--title', req.title);
	return done.ok ? { ok: true, result: { workspace: target.result.ws, title: req.title } } : done;
}

/** Recolor the same workspace. A colour cmux refuses comes back in cmux's own words (B3 F1). */
export const recolor = async (req: Recolor, password: string): Promise<Outcome<{ workspace: string; color: string }>> =>
	audited('recolor', { ...req }, await attemptRecolor(req, password));

async function attemptRecolor(req: Recolor, password: string): Promise<Outcome<{ workspace: string; color: string }>> {
	const target = liveWorkspace(req.sid);
	if (!target.ok) return target;
	const done = await cmux(password, LIMITS.commandMs,
		'workspace-action', '--workspace', target.result.ws, '--action', 'set-color', '--color', req.color);
	// `OK action=set_color … color=#0E6B8C` — cmux's resolved value, not the word that was asked for.
	return done.ok
		? { ok: true, result: { workspace: target.result.ws, color: done.result.match(/color=(#[0-9A-Fa-f]{6})/)?.[1] ?? req.color } }
		: done;
}

/**
 * The flag. Dormant by design — its consumers arrive with the Steward chapter — but the file is
 * the contract, so the button can exist now and mean something later. Last writer wins: a HALT
 * is a state, not a queue.
 */
export const halt = (req: Halt): Outcome<{ path: string; at: string }> =>
	audited('halt', { ...req }, attemptHalt(req));

/**
 * The flag, read — **the engine is its first consumer** (B11 §5, keel §5). It lives beside `halt()`
 * because one module owning a file both ways is why the two can never disagree about its shape:
 * `<iso> <requester>\n`, last writer wins, and an unparseable flag still HALTS (a flag that exists
 * is a stop; refusing to read it is not an excuse to keep firing).
 */
export type Halted = { at: string; by: string; text: string };

export function readHalt(): Halted | null {
	let text: string;
	try { text = readFileSync(haltFlag(), 'utf8'); }
	catch { return null; }
	const line = text.split('\n')[0] ?? '';
	const cut = line.indexOf(' ');
	return cut < 0
		? { at: line, by: '', text: line }
		: { at: line.slice(0, cut), by: line.slice(cut + 1), text: line };
}

function attemptHalt(req: Halt): Outcome<{ path: string; at: string }> {
	const at = new Date().toISOString();
	try {
		interlock(haltFlag());                        // B8 F1: the real HALT was armed by a suite, once
		mkdirSync(dirname(haltFlag()), { recursive: true });
		writeFileSync(haltFlag(), `${at} ${req.requester}\n`);
	} catch (e) { return fail(`cannot write ${haltFlag()}: ${(e as Error).message}`); }
	return { ok: true, result: { path: haltFlag(), at } };
}

// ---------- §audit ----------

/**
 * One line per action, in the census's own gitignored neighbourhood. `args` is what was asked
 * for MINUS the summons text — the record keeps its length and its sha so an ignition can still be
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
	interlock(auditLog());
	mkdirSync(dirname(auditLog()), { recursive: true });
	appendFileSync(auditLog(), line + '\n');
}

/**
 * **The live-neighbourhood interlock** (B22 candidate 4). Every census anchor hangs off
 * `$CENSUS_DIR`, whose default is Felix's real telemetry — so a test file that forgets the knob
 * writes into the city's own audit, silently. The city has paid twice: B8 F1 (`hands.test.ts`
 * armed the real HALT and left 16 lines in `hands.jsonl`) and this row (`desk.test.ts` filed
 * scratch-building notes through `filed()`, which audits — 240 → 242 at G2, two more during the
 * C19 batch). `nextStamp` counts that log (B3 F4), so each stray line spends a real name-stamp
 * ordinal forever after.
 *
 * The guard is at the write rather than in a checklist, because the failure is *silence*: a suite
 * cannot assert "the live audit is byte-identical after this run" from inside itself — `bun test`
 * sets and restores the knob per file, so no `afterAll` speaks for the whole run. Under
 * `bun test` (`NODE_ENV=test`), a write aimed at the live neighbourhood throws and says which knob
 * to set. Outside a test run nothing changes: the hands write where they always did.
 */
export function interlock(path: string): void {
	if (process.env.NODE_ENV !== 'test') return;
	// The whole neighbourhood, not the census directory: `haltFlag()` is `dirname(censusDir())/HALT`,
	// so a guard keyed on the census dir alone lets B8 F1's own door straight through. Measured —
	// this row's first cut of the interlock armed the real HALT from its own test.
	const live = dirname(LIVE_CENSUS);
	if (path !== live && !path.startsWith(`${live}/`)) return;
	throw new Error(`a test run tried to write ${path} — set process.env.CENSUS_DIR to a scratch path first (B8 F1, B22 candidate 4)`);
}

/**
 * Do it, then say you did it. Every hand returns through here, refusals included — the audit is
 * a property of the write, not of the HTTP layer, so no caller can route around it.
 */
function audited<T>(action: string, args: Record<string, unknown>, outcome: Outcome<T>): Outcome<T> {
	audit(action, args, outcome);
	return outcome;
}

/**
 * A hand that can mint a directory tells the register so (B8 §1) — a worktree IS a candidate
 * building, and the walk that would find it costs nine seconds nobody may pay on a request
 * thread. Marking is free and the next page picks it up. A refusal changed nothing, so it marks
 * nothing.
 */
function busting<T>(outcome: Outcome<T>): Outcome<T> {
	if (outcome.ok) bust();
	return outcome;
}

/** The audit's view of an ignition: everything but the words. */
export const igniteArgs = (f: Ignite) => ({
	account: f.account, stamp: f.stamp, cwd: f.cwd, model: f.model, effort: f.effort,
	color: f.color, resume: f.resume, building: f.building, summonsBytes: Buffer.byteLength(f.summons),
});

// ---------- the route ----------

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
		case 'ignite': {
			const parsed = parseIgnite(body);
			return parsed.ok ? answer(await ignite(parsed.result, cred.result)) : json(parsed, 400);
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
		case 'rename': {
			const parsed = parseRename(body);
			return parsed.ok ? answer(await rename(parsed.result, cred.result)) : json(parsed, 400);
		}
		case 'recolor': {
			const parsed = parseRecolor(body);
			return parsed.ok ? answer(await recolor(parsed.result, cred.result)) : json(parsed, 400);
		}
		default:
			return json({ ok: false, error: `no such hand: ${action} — ignite, worktree, focus, halt, rename, recolor` }, 404);
	}
}
