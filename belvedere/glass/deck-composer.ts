/**
 * The composer, server side — **Action at rest** (keel §3, B17).
 *
 * v0's `/summon` proved the shape: compose, read the plan, then fire. The deck keeps every law of
 * it and changes two things.
 *
 * **1. The resolution is round-tripped, and that is the named mechanism** (B17 §2). Every knob move
 * POSTs the draft here and renders what comes back — because resolving a draft means reading the
 * register, three accounts' trust files, two lineage logs, the live census and `git`, none of which
 * exists in a browser. Bundling "the same logic" client-side would mean a second copy of it fed by a
 * second copy of the disk, and two copies drift. One logic, one disk, one answer, and the bytes the
 * button posts are the bytes the page is showing.
 *
 * **2. The theater follows the BUILDING, not the cwd.** The field report's own case: an Architect
 * sitting about belvedere, run at `~/code/agents`, was stamped `architect-agents-03` where
 * `architect-belvedere-02` was meant — because v0 asked one question ("where does it run?") and
 * used the answer for two ("what is it about?"). Here they are two knobs. The cwd stays the venue;
 * it stops naming the work.
 *
 * **Nothing here writes.** It reads, it composes, and it hands back a body — the fire itself is
 * `POST /hands/fire`'s, behind the credential gate, exactly as it has always been.
 */

import { createHash } from 'crypto';
import { statSync } from 'fs';
import { homedir } from 'os';
import { isAbsolute, resolve } from 'path';
import { MANTLES } from '../../doctrine';
import { readCensus } from './census';
import { cmuxColor } from './colors';
import { applyTemplate, slotsIn, TEMPLATES, worktreeCut, type Draft } from './composer';
import type { ComposeDraft, ComposePlan, ComposeWarning, FireWire, MantleChip } from './deck-model';
import { handsState, parseFire } from './hands';
import { register } from './register';
import { sanitizeSummons } from './sanitize';
import { readRig, type Rig } from './rig';
import {
	colourOf, mantleKey, nextOrdinal, ordinal, stampPrefix, theaterOf, tierParts,
} from './summon';
import { readTrust, trustOf } from './trust';
import { usageNow, usageWire } from './usage';

/** Everything has a limit (directive 3.1): the hands cap the summons at 64 KB; a draft is smaller. */
export const LIMITS = { bodyBytes: 128 << 10, summonsChars: 32 << 10, increment: 999 } as const;

const EMPTY: ComposeDraft = {
	building: '', cwd: '', account: '', mantle: '', model: '', effort: '',
	theater: '', increment: '', branch: '', summons: '', template: '',
};

/** The mantle templates, by key — a sticky one of these follows the mantle chip rather than freezing it. */
const MANTLE_KEYS = new Set(MANTLES.map(m => mantleKey(m) ?? ''));

const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');

/**
 * The POST's JSON into a trusted `ComposeDraft`. The summons is the one field kept verbatim but for
 * its line endings — a browser submits CRLF and the hands normalise to LF at their own boundary
 * (`sanitize.ts`), so normalising here keeps the text the page shows, the JSON the button carries
 * and the bytes the session receives **one single string**.
 */
export function readDraft(raw: unknown): ComposeDraft {
	if (typeof raw !== 'object' || raw === null) return { ...EMPTY };
	const r = raw as Record<string, unknown>;
	const summons = typeof r['summons'] === 'string' ? r['summons'].replace(/\r\n?/g, '\n') : '';
	return {
		building: str(r['building']), cwd: str(r['cwd']), account: str(r['account']),
		mantle: str(r['mantle']), model: str(r['model']), effort: str(r['effort']),
		theater: str(r['theater']), increment: str(r['increment']), branch: str(r['branch']),
		summons: summons.slice(0, LIMITS.summonsChars), template: str(r['template']),
	};
}

/** `~/code/x` is how the city writes a path; the filesystem wants the other spelling. */
const untilde = (p: string) => (p.startsWith('~/') ? homedir() + p.slice(1) : p);

const directory = (raw: string): { path: string } | { blocked: string } => {
	if (!isAbsolute(raw)) return { blocked: `the venue must be an absolute path — got "${raw}"` };
	const path = resolve(raw);
	try { if (!statSync(path).isDirectory()) return { blocked: `not a directory: ${path}` }; }
	catch { return { blocked: `does not exist: ${path}` }; }
	return { path };
};

/** A hand-typed increment, or null. Zero and negatives are not ordinals; so is anything non-numeric. */
export function readIncrement(raw: string): number | null {
	if (!/^[0-9]{1,3}$/.test(raw)) return null;
	const n = Number(raw);
	return n >= 1 && n <= LIMITS.increment ? n : null;
}

/**
 * The knobs a chip can offer, off the rig's own tables: the tier `presets.tsv` opens each mantle at,
 * and felikai's hue for it (B18 F1) — **never a colour word invented here**, so a picker cannot
 * show a colour the socket would refuse.
 */
export const mantleChips = (rig: Rig): MantleChip[] =>
	MANTLES.map(name => {
		const key = mantleKey(name) ?? '';
		return { name, key, preset: rig.tiers.get(key) ?? '', color: cmuxColor(rig.colours.get(key) ?? '') };
	});

/**
 * A template **clicked**: it sets the mantle and the tier it speaks as, and becomes the sticky
 * source of the summons body. Routed back through v0's `Draft` so the canon grammar is applied by
 * the one function that knows it (`composer.ts` §applyTemplate) rather than by a second copy.
 *
 * A summons fence already names its own mantle and its own tier (D45), so a chip that filled only
 * the words would leave the page disagreeing with itself.
 */
export function withTemplate(draft: ComposeDraft, key: string, rig: Rig, target: string | null): ComposeDraft {
	if (key === '') return draft;
	const v0: Draft = {
		where: '', cwd: '', account: draft.account, mantle: draft.mantle, model: draft.model,
		effort: draft.effort, stamp: '', branch: draft.branch, summons: draft.summons,
	};
	const out = applyTemplate(v0, key, rig, target);
	return { ...draft, mantle: out.mantle, model: out.model, effort: out.effort, summons: out.summons, template: key };
}

/**
 * The summons a sticky template speaks, **at the knobs' current values**. A mantle template follows
 * the mantle chip rather than freezing the one that was clicked — the six mantle chips are one
 * template parameterised by mantle, not six templates — and every body is re-rendered at the tier
 * the tier chips now say. A template the list does not carry re-renders nothing and keeps his text.
 */
export function templateBody(key: string, mantle: string, tier: string, target: string | null): string | null {
	const wanted = MANTLE_KEYS.has(key) ? mantleKey(mantle) ?? key : key;
	const t = TEMPLATES.find(x => x.key === wanted);
	return t ? t.body({ tier, target }) : null;
}

/**
 * The whole resolution. Every field the page prints comes from here, and the fire button posts
 * `fire` and nothing else.
 *
 * The order matters and is the order a reader would ask in: which building, so the theater is
 * known; which venue, so trust and the worktree can be asked about; which mantle and tier, so the
 * lineage prefix exists; then the ordinal, the stamp, and finally the body the hands must accept.
 */
export function composePlan(draft: ComposeDraft, clicked = ''): ComposePlan {
	const t0 = performance.now();
	const rig = readRig();
	const reg = register();
	const buildings = reg.entries.map(e => ({ building: e.building, path: e.path }))
		.sort((a, b) => a.building.localeCompare(b.building));

	const building = buildings.find(b => b.building === draft.building) ?? null;
	const d = withTemplate(draft, clicked, rig, building?.path ?? null);

	const accounts = [...rig.accounts.values()];
	const account = accounts.includes(d.account) ? d.account : accounts[0] ?? '';

	// The venue: the field where it is typed, else the building's own path. A building chosen and a
	// venue left blank is the common case and it is not an omission — it is the answer.
	const venue = untilde(d.cwd) || building?.path || '';
	const at = venue === '' ? { blocked: 'no venue — pick a building, or type a path' } : directory(venue);
	const cwd = 'path' in at ? at.path : null;
	const cwdNote = 'blocked' in at ? at.blocked : '';

	const key = mantleKey(d.mantle) ?? '';
	const preset = rig.tiers.get(key) ?? '';
	const presetParts = tierParts(preset);
	const model = d.model || presetParts?.model || '';
	const effort = d.effort || presetParts?.effort || '';
	const tier = model && effort ? `${model}-${effort}` : '';

	// The theater — the work's name, honouring `.summon-theaters` where the building files one
	// (row 14's convention, `summon.ts` §theaterOf). The Grand Architect keeps none: there is one
	// office, so the segment would be redundancy, and the knob says so rather than being hidden.
	const derived = building ? theaterOf(building.path) : '';
	const theater = key === 'grand-architect' ? '' : (d.theater || derived);
	const theaterNote = key === 'grand-architect'
		? 'the Grand Architect keeps no theater — one office, so the segment would be redundancy (the rig\'s own law)'
		: building === null ? 'pick a building and the theater is its name'
		: d.theater && d.theater !== derived ? `overridden by hand — this building's own theater is "${derived}"`
		: `the building's own name, honouring its .summon-theaters where it files one`;

	const prefix = stampPrefix(d.mantle, theater);
	// All three lineage sources: both logs, and every stamp the LIVE census is carrying — a name a
	// running session already wears came from somewhere neither log records, and a counter blind to
	// it hands that name out twice (B7 F4, closed here for the deck's own composer).
	const censusStamps = readCensus().sessions.map(s => s.stamp).filter((s): s is string => s !== null);
	const typed = readIncrement(d.increment);
	const increment = prefix === null ? null : typed ?? nextOrdinal(prefix, new Set(), censusStamps);
	const stamp = prefix !== null && increment !== null ? ordinal(prefix, increment) : '';

	const cut = cwd && d.branch ? worktreeCut(cwd, d.branch) : null;
	const worktree = cut && 'repo' in cut ? { repo: cut.repo, branch: cut.branch, path: cut.path } : null;
	const worktreeNote = cut && 'blocked' in cut ? cut.blocked : '';

	// A worktree the hand has not cut yet is not a repo `git` can resolve, so the question is asked
	// of the repo it will be cut from — which IS the inheritance (`trust.ts` §projectOf, B7 F1).
	const askAbout = worktree?.repo ?? cwd;
	const configDir = [...rig.accounts].find(([, label]) => label === account)?.[0] ?? null;
	const trust = askAbout && configDir
		? (({ file, roots }) => {
			const v = trustOf(askAbout, { file, roots });
			return {
				warm: v.warm, where: askAbout, file,
				root: v.warm ? v.root : null,
				refused: v.warm ? null : v.refused,
				repo: v.project.repo,
			};
		})(readTrust(configDir))
		: null;

	// A sticky template speaks at the CURRENT knobs, so `You are a Builder at opus-high.` becomes
	// `…at opus-low.` when the effort chip moves — §1's "the summons text updating as knobs move".
	// The first keystroke in the box clears the stickiness and the words become his.
	const spoken = d.template ? templateBody(d.template, d.mantle, tier, building?.path ?? null) : null;

	// The bytes, sanitized exactly once and exactly as the hands sanitize them — so the `<pre>` on
	// the page, the JSON the button posts and the file the fire writes are one string with one sha.
	const summons = sanitizeSummons(spoken ?? d.summons);
	const color = colourOf(rig, d.mantle);
	const slots = slotsIn(summons);

	const blocked = cwd === null ? cwdNote
		: tier === '' ? `no tier: mantle ${JSON.stringify(d.mantle)} has no preset and no model/effort chosen`
		: stamp === '' ? `no name-stamp: mantle ${JSON.stringify(d.mantle)} · theater ${JSON.stringify(theater)}`
		: summons.trim() === '' ? 'the instrument carries no summons text'
		: null;

	/**
	 * The body carries the **venue**, never the worktree path: the cut does not exist until the
	 * hand makes it, and a body naming a directory that is not there is a body `parseFire` refuses.
	 * The client cuts first and swaps in the path the hand answers with — B7's proven order.
	 */
	const body: FireWire | null = blocked === null && cwd !== null
		? { account, stamp, cwd, model, effort, color, summons }
		: null;

	// The hands' own boundary decides what arms — one gate, asked early, not a second copy of one
	// (D10's family).
	const checked = body === null ? null : parseFire(body);
	const refusal = checked && !checked.ok ? checked.error : null;

	const hands = handsState();
	return {
		// The draft as resolved: a sticky template's words come back so the box shows what will fire.
		draft: { ...d, summons: spoken ?? d.summons },
		accounts, mantles: mantleChips(rig),
		templates: TEMPLATES.map(t => ({ key: t.key, name: t.name })),
		buildings, building, cwd, cwdNote,
		theater, theaterNote, increment, stamp, tier, preset, color,
		worktree, worktreeNote, trust, slots,
		summons, bytes: Buffer.byteLength(summons),
		sha: createHash('sha256').update(summons).digest('hex').slice(0, 16),
		fire: refusal === null ? body : null,
		blocked: blocked ?? refusal,
		warnings: warningsOf({ trust, slots, worktreeNote, model, building, cwd }),
		// **Read, never fetched, on this path** (B17 §4): the composer answers a knob move, and a knob
		// move must not cost an HTTPS round trip. `GET /deck/usage` is the fetch, on expand.
		usage: usageWire(usageNow(rig)),
		handsArmed: hands.armed,
		handsNote: hands.note,
		ms: performance.now() - t0,
	};
}

/**
 * `POST /deck/compose` — the knob move's round trip. **It writes nothing**: the fence's write list
 * is the hands, the inbox and the desk (README §2), and this is a resolution.
 *
 * Errors are values (directive 3.4): a body that is too big or is not JSON answers a plan-shaped
 * refusal rather than a throw, because the client's job is to render whatever comes back and a
 * blank composer would be the lie this building exists to avoid.
 */
export async function composeRoute(req: Request): Promise<Response> {
	if (req.method !== 'POST') return json({ error: '/deck/compose takes a POST' }, 405);
	const raw = await req.text();
	if (Buffer.byteLength(raw) > LIMITS.bodyBytes) return json({ error: `the draft exceeded ${LIMITS.bodyBytes} bytes` }, 413);
	let parsed: unknown;
	try { parsed = JSON.parse(raw); }
	catch { return json({ error: 'the draft is not JSON' }, 400); }
	// `clicked` is the one-shot gesture — a chip just pressed — and `draft.template` is what the
	// summons is still speaking through. Two fields because they answer two questions: which
	// template sets the mantle right now, and which one keeps the body live afterwards.
	const clicked = str((parsed as Record<string, unknown>)?.['clicked']);
	return json(composePlan(readDraft(parsed), clicked), 200);
}

const json = (body: unknown, status: number) =>
	Response.json(body, { status, headers: { 'cache-control': 'no-store' } });

/**
 * What will fire and deserves a second look. **A warning never disarms** (B7's three states): an
 * untrusted directory and an unfilled slot are both things Felix may mean, and the glass reports
 * rather than refuses. What disarms is `blocked` — the hands' refusal, or nothing to compose.
 */
function warningsOf(o: {
	trust: ComposePlan['trust']; slots: string[]; worktreeNote: string;
	model: string; building: { building: string; path: string } | null; cwd: string | null;
}): ComposeWarning[] {
	const out: ComposeWarning[] = [];
	if (o.trust && !o.trust.warm)
		out.push({ name: 'untrusted venue', text:
			`${o.trust.refused ? `${o.trust.refused} is refused` : o.trust.repo
				? `${o.trust.where} is a repository this account has never trusted, and a repository never borrows an ancestor's trust`
				: `nothing at or above ${o.trust.where} is trusted for this account`}`
			+ ` — the session will open and sit on Claude's folder-trust dialog with no first user turn.`
			+ ` Trust is per account and lives on the project root; the deck reads ${o.trust.file} and never answers that dialog.` });
	if (o.slots.length)
		out.push({ name: 'unfilled slots', text: `the summons still carries ${o.slots.join(' ')} — the session will read them as written.` });
	if (o.worktreeNote)
		out.push({ name: 'no worktree', text: `${o.worktreeNote}. The session will land in the venue itself.` });
	// P5 F1, measured: `--model haiku` cannot enter `auto` permission mode on any account and the
	// fallback to `default` is silent, so the first Write stalls on a prompt nobody is watching.
	if (o.model === 'haiku')
		out.push({ name: 'haiku holds no auto mode', text:
			'a haiku session runs in `default` permission mode on every account — measured, and the fallback is silent (P5 F1) — so its first side-effecting tool call stalls on a prompt. Fine for a read-only errand; ordering a stall for anything that writes.' });
	// The venue naming the work is the exact drift the field report caught, so it is said out loud
	// wherever it is true rather than being silently resolved one way or the other.
	if (o.building && o.cwd && o.cwd !== o.building.path)
		out.push({ name: 'venue ≠ building', text:
			`this ignites in ${o.cwd} and is stamped after ${o.building.building}. That is the point — the building names the work, the cwd is only where it runs — but check it is the pair you meant.` });
	return out;
}
