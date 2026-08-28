/**
 * The flow file — **a batch note as data** (flow-keel §3), and the only module in the city that
 * touches its bytes.
 *
 * A flow is a declared DAG of steps: what would be fired, at which tier, into which venue, behind
 * which gate. It is committed truth in `belvedere/flows/<name>.flow.json`; the glass **reads** it
 * and never writes it (B10 §out-of-scope — flow files are mantle work, committed by sittings).
 *
 * **The serialization is deliberately disposable.** D7's AI-native mandate put storage on the
 * Standards Office's desk (canon row 17) and this schema is that experiment's *evidence*, so it is
 * honest, minimal, and behind one boundary: everything downstream sees `Flow`/`Step`, and a ruling
 * from the Office swaps JSON for whatever it rules in this file alone.
 *
 * **Parser-as-lint** (README §1): a flow that will not parse renders its failure and files nothing.
 * Every refusal is a value with a code — never a throw, never a half-parsed flow — because a DAG
 * that draws wrong is a DAG that arms wrong (D10: ambiguity never renders as fireable structure).
 */

import { createHash } from 'crypto';
import { appendFileSync, mkdirSync, readFileSync, readdirSync, statSync } from 'fs';
import { homedir } from 'os';
import { dirname, isAbsolute, join } from 'path';
import { isMantle, isTier, MANTLES, MODELS, TIERS, type Mantle } from '../../doctrine';
import { fileWindow } from './census';
import type { Ring } from './deck-model';
import { cityRoot, flowRun, flowsDir } from './paths';
import { readRig, type Rig } from './rig';

/** Everything has a limit (directive 3.1) — files walked, bytes read, steps declared, run lines kept. */
export const LIMITS = {
	flows: 64,
	bytes: 1 << 20,
	steps: 200,
	words: 6,           // Felix's encapsulation law, enforced at the boundary rather than derived
	doc: 4 << 20,       // a kickoff's source document
	run: 2 << 20,       // the tail of a run log
	timeout: 10_080,    // a step's ceiling in minutes — seven days, not a guess: everything has a limit
} as const;

/** A step with no declared limit still has one (B11 §4). Four hours is a long sitting, not a stall. */
export const DEFAULT_TIMEOUT_MINUTES = 240;

// ---------- the shapes ----------

/** Where a step runs. `master` is the shared checkout; `worktree` is DOCTRINE §10's cut branch. */
export type Venue =
	| { kind: 'master'; cwd: string }
	| { kind: 'worktree'; repo: string; branch: string };

/**
 * What stands between a step and its firing. **An architect gate is itself a fireable step** —
 * its kickoff is the step's own (flow-keel §3), which is how review rides the string instead of
 * stopping it. A `felix` gate is his card: it renders, and nothing on it can fire (D10).
 */
export type Gate =
	| { kind: 'none' }
	| { kind: 'felix'; card: string }
	| { kind: 'architect' };

/**
 * The step's first user turn, resolved at parse time. `doc`/`fence` record where it came from —
 * a path and a **1-based fence ordinal** — so a kickoff is quoted from the order that blessed it
 * rather than copied into the flow file where the two can drift apart.
 */
export type Kickoff = { text: string; doc: string | null; fence: number | null };

export type Step = {
	id: string;
	/** The encapsulation: 1–6 words, **written, not derived** (B9 F1 — the corpus lacks the field). */
	name: string;
	kickoff: Kickoff;
	account: string;
	mantle: Mantle;
	/** `<model>-<effort>`, doctrine's own vocabulary. The model half IS the permission posture (P5 F5). */
	tier: string;
	venue: Venue;
	depends: string[];
	gate: Gate;
	/**
	 * The step's own limit (directive 3.1), in minutes from its fire. Past it, a step that has not
	 * landed is **paused and surfaced** — never advanced past, and never killed: stopping live work
	 * is Felix's or the session's own (B11 §4/§6).
	 */
	timeoutMinutes: number;
	/** Longest path from a root — the rank this step sits on when the DAG is drawn. */
	depth: number;
};

export type Flow = {
	name: string;
	file: string;
	building: string;
	/** D12's arm unit: building + chapter. Growth inside it auto-joins an armed flow (scope-arm). */
	scope: string;
	created: string;
	concurrency: number;
	judgeTier: string;
	/**
	 * **What was armed** (B11 §1). Armed flows are immutable, so the arm records this and the engine
	 * refuses to start anything new once it moves — one click on *re-arm* covers the amendment (D11).
	 *
	 * It is sha256 over the flow file's own bytes **and every resolved kickoff**, in step order. The
	 * spec asks for the file; B10 F2 is why the kickoffs are in it too: a `{doc, fence}` kickoff is a
	 * POSITIONAL reference, so an edit to the *order* re-points it with the flow file untouched, and
	 * an arm that covered only the file would authorize bytes nobody re-read.
	 */
	hash: string;
	steps: Step[];
};

/** Named, so a failure can be asserted rather than string-matched (B10 §3). */
export type FlowCode =
	| 'unreadable' | 'malformed' | 'field'
	| 'duplicate-id' | 'unknown-dep' | 'cycle'
	| 'kickoff' | 'name-too-long'
	| 'unknown-account' | 'unknown-tier' | 'unknown-venue';

export type FlowFail = { name: string; file: string; code: FlowCode; error: string };
export type FlowRead = { ok: true; flow: Flow } | { ok: false; fail: FlowFail };

const FLOW_NAME = /^[a-z0-9][a-z0-9-]{0,63}$/;
const STEP_ID = /^[a-z0-9][a-z0-9._-]{0,63}$/;

// ---------- the fence: a kickoff quoted from the doc that blessed it ----------

/**
 * The Nth fenced block of a markdown document, inner text only, **no trailing newline** — the
 * bytes a summons is (B7's fire path writes exactly this). An unterminated fence at EOF is not a
 * block, so a document that ends mid-fence simply has one fewer.
 */
export function fenceOf(text: string, ordinal: number): string | null {
	const lines = text.split('\n');
	const blocks: string[] = [];
	let open: number | null = null;
	for (const [i, line] of lines.entries()) {
		if (!line.startsWith('```')) continue;
		if (open === null) open = i;
		else { blocks.push(lines.slice(open + 1, i).join('\n')); open = null; }
	}
	return blocks[ordinal - 1] ?? null;
}

/** A kickoff's source document: absolute, `~`-relative, or in the city's own coordinates. */
export const docPath = (doc: string): string =>
	doc.startsWith('~/') ? join(homedir(), doc.slice(2)) : isAbsolute(doc) ? doc : join(cityRoot(), doc);

/**
 * A venue's path, resolved **at the parse boundary** (directive 2.2). A flow file writes `~/code/agents`
 * because that is how the city writes paths; a `Venue` carries the real one, because everything
 * downstream of here — the trust precheck, the worktree hand, the fire's `cwd` — takes a path and not
 * a string that might still need expanding. Rendering puts the `~` back (`html.ts` §tilde).
 */
export const venuePath = (p: string): string =>
	p.startsWith('~/') ? join(homedir(), p.slice(2)) : p;

// ---------- the parse boundary ----------

type Raw = Record<string, unknown>;

const isRaw = (v: unknown): v is Raw => typeof v === 'object' && v !== null && !Array.isArray(v);
const str = (o: Raw, k: string): string | null => typeof o[k] === 'string' ? o[k] : null;

class Refusal extends Error {
	constructor(readonly code: FlowCode, message: string) { super(message); }
}
const refuse = (code: FlowCode, message: string): never => { throw new Refusal(code, message); };

/** `Builder · opus-high` → the two halves, each checked against doctrine's own vocabulary (D65). */
function staffing(raw: string, where: string): { mantle: Mantle; tier: string } {
	const [mantle = '', tier = ''] = raw.split('·').map(s => s.trim());
	if (!isMantle(mantle)) refuse('unknown-tier', `${where}: "${mantle}" is not a mantle (${MANTLES.join(', ')})`);
	if (!isTier(tier)) refuse('unknown-tier', `${where}: "${tier}" is not a tier (${MODELS.join('/')} × low…max)`);
	return { mantle: mantle as Mantle, tier };
}

function venue(raw: unknown, where: string): Venue {
	if (!isRaw(raw)) refuse('unknown-venue', `${where}: venue must be an object`);
	const kind = str(raw as Raw, 'kind');
	if (kind === 'master') {
		const cwd = str(raw as Raw, 'cwd');
		return cwd === null ? refuse('unknown-venue', `${where}: a master venue needs a cwd`) : { kind, cwd: venuePath(cwd) };
	}
	if (kind === 'worktree') {
		const repo = str(raw as Raw, 'repo'), branch = str(raw as Raw, 'branch');
		return repo === null || branch === null
			? refuse('unknown-venue', `${where}: a worktree venue needs a repo and a branch`)
			: { kind, repo: venuePath(repo), branch };
	}
	return refuse('unknown-venue', `${where}: venue kind "${kind ?? '—'}" is neither master nor worktree`);
}

function gate(raw: unknown, where: string): Gate {
	if (raw === undefined || raw === null || raw === 'none') return { kind: 'none' };
	if (!isRaw(raw)) refuse('field', `${where}: gate must be an object or "none"`);
	const kind = str(raw as Raw, 'kind');
	if (kind === 'architect') return { kind };
	if (kind === 'felix') {
		const card = str(raw as Raw, 'card');
		return card === null ? refuse('field', `${where}: a felix gate needs its card text`) : { kind, card };
	}
	return refuse('field', `${where}: gate kind "${kind ?? '—'}" is neither felix nor architect`);
}

/**
 * Inline text, or a fence quoted out of a document. **Resolution failure is parse failure** (§3):
 * a flow whose kickoff cannot be found is a flow that would fire an empty first turn, and there is
 * no honest half-measure between the bytes and nothing.
 */
function kickoff(raw: unknown, where: string, read: (p: string) => string | null): Kickoff {
	if (typeof raw === 'string') return raw.trim() === ''
		? refuse('kickoff', `${where}: an inline kickoff is empty`)
		: { text: raw, doc: null, fence: null };
	if (!isRaw(raw)) refuse('kickoff', `${where}: kickoff must be text or {doc, fence}`);
	const doc = str(raw as Raw, 'doc');
	const fence = (raw as Raw)['fence'];
	if (doc === null || typeof fence !== 'number' || !Number.isInteger(fence) || fence < 1)
		refuse('kickoff', `${where}: {doc, fence} needs a doc path and a 1-based fence ordinal`);
	const path = docPath(doc!);
	const text = read(path);
	if (text === null) refuse('kickoff', `${where}: cannot read ${path}`);
	const block = fenceOf(text!, fence as number);
	if (block === null) refuse('kickoff', `${where}: ${path} has no fence #${fence as number}`);
	return { text: block!, doc: path, fence: fence as number };
}

const readDoc = (p: string): string | null => {
	try { return statSync(p).size > LIMITS.doc ? null : readFileSync(p, 'utf8'); }
	catch { return null; }
};

/**
 * Depth, and the cycle refusal in the same walk (Kahn): a node's depth is the longest path from a
 * root, and anything still holding an unmet dependency when the queue empties is in a cycle.
 */
function ranked(steps: { id: string; depends: string[] }[]): Map<string, number> {
	const depth = new Map<string, number>();
	const left = new Map(steps.map(s => [s.id, new Set(s.depends)]));
	const dependents = new Map<string, string[]>();
	for (const s of steps) for (const d of s.depends) dependents.set(d, [...(dependents.get(d) ?? []), s.id]);

	const queue = steps.filter(s => s.depends.length === 0).map(s => s.id);
	for (const id of queue) depth.set(id, 0);
	for (let i = 0; i < queue.length; i++) {
		const id = queue[i]!;
		for (const next of dependents.get(id) ?? []) {
			depth.set(next, Math.max(depth.get(next) ?? 0, (depth.get(id) ?? 0) + 1));
			const waiting = left.get(next)!;
			waiting.delete(id);
			if (waiting.size === 0) queue.push(next);
		}
	}
	if (depth.size !== steps.length)
		refuse('cycle', `a cycle: ${steps.filter(s => !depth.has(s.id)).map(s => s.id).join(' → ')} never become ready`);
	return depth;
}

function toFlow(name: string, file: string, text: string, raw: unknown, rig: Rig, read: (p: string) => string | null): Flow {
	if (!isRaw(raw)) refuse('malformed', `${file}: the flow file is not a JSON object`);
	const o = raw as Raw;

	const building = str(o, 'building'), scope = str(o, 'scope'), created = str(o, 'created');
	if (building === null || scope === null || created === null)
		refuse('field', `${file}: a flow needs building, scope and created`);
	if (!Array.isArray(o['steps']) || o['steps'].length === 0) refuse('field', `${file}: a flow needs steps`);
	const rawSteps = o['steps'] as unknown[];
	if (rawSteps.length > LIMITS.steps) refuse('field', `${file}: ${rawSteps.length} steps is past the ${LIMITS.steps} limit`);

	const concurrency = typeof o['concurrency'] === 'number' ? o['concurrency'] : 1;
	if (!Number.isInteger(concurrency) || concurrency < 1) refuse('field', `${file}: concurrency must be a positive integer`);
	const judgeTier = str(o, 'judgeTier') ?? 'fable-high';
	if (!isTier(judgeTier)) refuse('unknown-tier', `${file}: judgeTier "${judgeTier}" is not a tier`);

	const accounts = new Set(rig.accounts.values());
	const seen = new Set<string>();
	const parsed = rawSteps.map((rs, i) => {
		if (!isRaw(rs)) refuse('field', `${file}: step ${i + 1} is not an object`);
		const s = rs as Raw;
		const id = str(s, 'id');
		if (id === null || !STEP_ID.test(id)) refuse('field', `${file}: step ${i + 1} has no legal id`);
		const where = `${file} step ${id!}`;
		if (seen.has(id!)) refuse('duplicate-id', `${where}: declared twice`);
		seen.add(id!);

		const stepName = str(s, 'name');
		if (stepName === null || stepName.trim() === '') refuse('field', `${where}: a step needs its name`);
		// The encapsulation law at the boundary: the flow schema writes a name **from birth**, so
		// unlike the corpus it is never derived — and never over six words (B10 §2).
		if (stepName!.trim().split(/\s+/).length > LIMITS.words)
			refuse('name-too-long', `${where}: "${stepName}" is more than ${LIMITS.words} words`);

		const account = str(s, 'account');
		if (account === null || !accounts.has(account))
			refuse('unknown-account', `${where}: "${account ?? '—'}" is not an account (${[...accounts].join(', ')})`);

		const tier = str(s, 'tier');
		if (tier === null) refuse('unknown-tier', `${where}: a step needs its staffing`);
		const { mantle, tier: t } = staffing(tier!, where);

		const depends = s['depends'] === undefined ? [] : s['depends'];
		if (!Array.isArray(depends) || depends.some(d => typeof d !== 'string'))
			refuse('field', `${where}: depends must be a list of step ids`);

		const timeout = s['timeoutMinutes'] === undefined ? DEFAULT_TIMEOUT_MINUTES : s['timeoutMinutes'];
		if (typeof timeout !== 'number' || !Number.isFinite(timeout) || timeout <= 0 || timeout > LIMITS.timeout)
			refuse('field', `${where}: timeoutMinutes must be a number in (0, ${LIMITS.timeout}]`);

		return {
			id: id!, name: stepName!.trim(), kickoff: kickoff(s['kickoff'], where, read),
			account: account!, mantle, tier: t, venue: venue(s['venue'], where),
			depends: depends as string[], gate: gate(s['gate'], where),
			timeoutMinutes: timeout as number, depth: 0,
		};
	});

	for (const s of parsed) for (const d of s.depends)
		if (!seen.has(d)) refuse('unknown-dep', `${file} step ${s.id}: depends on "${d}", which is not a step here`);

	const depth = ranked(parsed);
	const steps = parsed.map(s => ({ ...s, depth: depth.get(s.id) ?? 0 }))
		.sort((a, b) => a.depth - b.depth || a.id.localeCompare(b.id));
	return {
		name, file, building: building!, scope: scope!, created: created!,
		concurrency, judgeTier, steps,
		// The file's own bytes plus every resolved kickoff, in step order (§Flow.hash). NUL separates
		// them because it cannot occur in either: no concatenation ambiguity, no length prefixes.
		hash: createHash('sha256').update([text, ...steps.map(s => s.kickoff.text)].join('\0')).digest('hex'),
	};
}

/** One flow file, parsed — or the named reason it will not parse. Errors are values, always. */
export function readFlow(name: string, rig: Rig = readRig(), read: (p: string) => string | null = readDoc): FlowRead {
	const file = join(flowsDir(), `${name}.flow.json`);
	if (!FLOW_NAME.test(name)) return { ok: false, fail: { name, file, code: 'unreadable', error: `"${name}" is not a flow name` } };

	let text: string;
	try {
		if (statSync(file).size > LIMITS.bytes) return { ok: false, fail: { name, file, code: 'unreadable', error: `${file} is past the ${LIMITS.bytes} B limit` } };
		text = readFileSync(file, 'utf8');
	}
	catch (e) { return { ok: false, fail: { name, file, code: 'unreadable', error: e instanceof Error ? e.message : String(e) } }; }

	let raw: unknown;
	try { raw = JSON.parse(text); }
	catch (e) { return { ok: false, fail: { name, file, code: 'malformed', error: e instanceof Error ? e.message : String(e) } }; }

	try { return { ok: true, flow: toFlow(name, file, text, raw, rig, read) }; }
	catch (e) {
		return e instanceof Refusal
			? { ok: false, fail: { name, file, code: e.code, error: e.message } }
			: { ok: false, fail: { name, file, code: 'malformed', error: e instanceof Error ? e.message : String(e) } };
	}
}

/** Every declared flow, parsed, in name order. A directory that is not there is no flows, not a throw. */
export function readFlows(rig: Rig = readRig()): FlowRead[] {
	let names: string[];
	try {
		names = readdirSync(flowsDir())
			.filter(f => f.endsWith('.flow.json'))
			.map(f => f.slice(0, -'.flow.json'.length))
			.sort()
			.slice(0, LIMITS.flows);
	}
	catch { return []; }
	return names.map(n => readFlow(n, rig));
}

// ---------- run-state: defined here, written by B11, rendered by B10 ----------

/**
 * The engine's working memory (B10 §4). **The board stays the only truth about work** — this is
 * telemetry, it lives in the D6 census neighborhood, it is gitignored, and nothing in this row
 * writes it. One JSONL per flow, one line per thing that happened.
 */
export const RUN_EVENTS = ['armed', 'fired', 'landed', 'paused', 'resumed', 'extended', 'refused'] as const;
export type RunEvent = (typeof RUN_EVENTS)[number];

export type RunLine = {
	ts: number;
	ev: RunEvent;
	step: string | null;
	sid: string | null;
	workspace: string | null;
	why: string | null;
	/** On an `armed` line: **what was armed** (`Flow.hash`). Null everywhere else. */
	hash: string | null;
	/**
	 * On a `fired` line: the name-stamp the engine minted for that session. A fire returns a cmux
	 * workspace ref and no session id — claude mints that itself — so the stamp is the join key until
	 * the census reads it off the transcript, and a second `fired` line then carries the `sid`
	 * (B11 §3; `engine.ts` §the join).
	 */
	stamp: string | null;
};

/** A line as the engine hands it over: the clock is the log's, never the caller's. */
export type NewRunLine = Omit<Partial<RunLine>, 'ev' | 'ts'> & { ev: RunEvent };

export type Run = { file: string; present: boolean; lines: RunLine[]; malformed: number };

/**
 * The map from seven events onto the five rings the DAG draws (`deck-model.ts` owns the rings —
 * both sides render them). `armed` and `extended` are authorizations rather than motion — a step
 * that is armed and not yet fired is still *declared* — and `resumed` is a fire continuing.
 */
const RING_OF: Readonly<Record<RunEvent, Ring>> = {
	armed: 'declared', extended: 'declared',
	fired: 'fired', resumed: 'fired',
	landed: 'landed', paused: 'paused', refused: 'refused',
};

const isRunEvent = (v: unknown): v is RunEvent => RUN_EVENTS.includes(v as RunEvent);

function toRunLine(raw: unknown): RunLine | null {
	if (!isRaw(raw)) return null;
	const ts = raw['ts'], ev = raw['ev'];
	if (typeof ts !== 'number' || !Number.isFinite(ts) || !isRunEvent(ev)) return null;
	return {
		ts, ev, step: str(raw, 'step'), sid: str(raw, 'sid'), workspace: str(raw, 'workspace'),
		why: str(raw, 'why'), hash: str(raw, 'hash'), stamp: str(raw, 'stamp'),
	};
}

/** One flow's run log, read from its bounded tail. Unreadable lines are counted, never guessed at. */
export function readRun(name: string): Run {
	const file = flowRun(name);
	const text = fileWindow(file, LIMITS.run, 'end');
	if (text === null) return { file, present: false, lines: [], malformed: 0 };

	const lines: RunLine[] = [];
	let malformed = 0;
	for (const line of text.split('\n')) {
		if (!line.trim()) continue;
		let parsed: RunLine | null = null;
		try { parsed = toRunLine(JSON.parse(line)); } catch { parsed = null; }
		if (parsed === null) malformed++; else lines.push(parsed);
	}
	lines.sort((a, b) => a.ts - b.ts);
	return { file, present: true, lines, malformed };
}

/** What a run log says about one step — by timestamp, never by file position (the census's F4 law). */
export function stateOf(run: Run, step: string): { ring: Ring; last: RunLine | null } {
	const mine = run.lines.filter(l => l.step === step);
	const last = mine.at(-1) ?? null;
	return { ring: last === null ? 'declared' : RING_OF[last.ev], last };
}

/** Flow-level: an `armed` line naming no step is the flow's own authorization (D11's one click). */
export const armedAt = (run: Run): number | null =>
	run.lines.filter(l => l.step === null && l.ev === 'armed').at(-1)?.ts ?? null;

/** What the last arm covered, or null while nothing has authorized this flow (B11 §1). */
export const armedHash = (run: Run): string | null =>
	run.lines.filter(l => l.step === null && l.ev === 'armed').at(-1)?.hash ?? null;

/** The flow's own last word — the arm, the pause that stopped it, the HALT. Steps have their own. */
export const flowLast = (run: Run): RunLine | null =>
	run.lines.filter(l => l.step === null).at(-1) ?? null;

/**
 * The engine's one write, and the only one in the city that touches these bytes — the read side is
 * `readRun` above, so **one module owns the format both ways**. Append-only, one line per thing that
 * happened, in the D6 telemetry neighborhood (gitignored, B10 F9). The clock is stamped here so no
 * caller can write a line into the past.
 *
 * This is telemetry, not truth: the board stays the only truth about work (B10 §4).
 */
export function appendRun(name: string, lines: readonly NewRunLine[], nowSeconds = Date.now() / 1000): number {
	if (lines.length === 0) return 0;
	const file = flowRun(name);
	const text = lines.map(l => JSON.stringify({
		ts: nowSeconds, ev: l.ev,
		step: l.step ?? null, sid: l.sid ?? null, workspace: l.workspace ?? null,
		why: l.why ?? null, hash: l.hash ?? null, stamp: l.stamp ?? null,
	})).join('\n') + '\n';
	mkdirSync(dirname(file), { recursive: true });
	appendFileSync(file, text);
	return lines.length;
}

// ---------- the permission clause (P5 F5), as a check rather than a field ----------

/**
 * **A step carries no permission field** (P5 F5 i): the accounts already run `auto`,
 * `--permission-mode` cannot raise a haiku session, and everything above `auto` is barred by the
 * posture floor — every legal value of that knob is redundant or forbidden.
 *
 * What replaces it is this: **a step's model IS its permission posture** (F5 ii). `haiku` cannot
 * enter `auto` on any account and the fallback to `default` is *silent*, so a haiku step stalls at
 * its first write with no error anywhere. It is refused **at arm** (B11), named loudly, never
 * substituted — and drawn as blocked here, so the refusal is visible before he reaches for it.
 *
 * The venue precheck is the other half and is deliberately **not** run per poll: `trust.ts` spawns
 * `git` per (step, account), which is B11's cost to pay once at arm rather than this row's to pay
 * every three seconds (F5 iii).
 */
export function blocksOf(step: Step): string[] {
	const model = step.tier.split('-')[0] ?? '';
	return model === 'haiku'
		? [`haiku holds no \`auto\` permission mode on any account and fails to \`default\` silently (P5 F1/F5) — this step would stall at its first write. Refused at arm.`]
		: [];
}
