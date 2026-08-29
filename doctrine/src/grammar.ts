// The doctrine's vocabulary and its text primitives.
// Law: canon/work/DOCTRINE.md §§3, 4, 5, 7, 8, 11 as amended by D63 (the schema fold),
// D64 (the baton grammar) and D71 (the standard: canon/work/STANDARD.md). One parser in the
// city: a mantle, a tier, a state, a verdict, an id or a dead word is named HERE and nowhere
// else — two spellings of one word is how a format drifts.

export const MANTLES = ['Grand Architect', 'Architect', 'Dispatcher', 'Digger', 'Builder', 'Mentat'] as const;
export const MODELS = ['fable', 'opus', 'sonnet', 'haiku'] as const;
export const EFFORTS = ['low', 'medium', 'high', 'xhigh', 'max'] as const;
export const STATES = ['OPEN', 'IN FLIGHT', 'LANDED', 'KILLED', 'BLOCKED'] as const;

export const TIERS: readonly string[] = MODELS.flatMap(m => EFFORTS.map(e => `${m}-${e}`));

/** D63a/D71 — the literal token that makes a ⬡-gate a typed field, not a regex over prose. */
export const HEX_GATE = '⬡-gate';
/** D63b — a verdict rides the annotation; the lifecycle stays five words. */
export const VERDICTS = ['PASSED', 'MERGED', 'BLESSED'] as const;
/** §4's retired synonyms, each with the state `doctrine migrate` re-emits it as. */
export const RETIRED: Readonly<Record<string, string>> = {
	DONE: 'LANDED', CLOSED: 'LANDED', WIP: 'IN FLIGHT', TODO: 'OPEN', AUTHORED: 'LANDED',
};
/** D63c — an annotation that may never lead the Status cell; D69 laid the second, D71 named it. */
export const PENDING = 'PENDING';
export const DEFERRED = 'DEFERRED';
/** D63 as amended — the typed absence: `unrecorded` asserts ignorance where a record never held. */
export const UNRECORDED = 'unrecorded';

/**
 * The standard's graveyard (STANDARD.md §9). Each of these is a live address in the city's
 * history, so the parser reads it forever; `doctrine migrate` re-emits it as its successor and
 * nothing in the city writes one again. A dead word that still parses is not a legal word:
 * `unstaffed` left the legal set entirely (D71 — charges are always staffed).
 */
export const FELIX_GATE = 'Felix-gate';   // → ⬡-gate
export const PARKED = 'PARKED';           // → DEFERRED
export const UNSTAFFED = 'unstaffed';     // → `—`, and only where the Status carries DEFERRED

/**
 * D71 · D18 — ids are strings. A charge is `C‹n›` from the standard's deploy; historical ids
 * (bare numbers, per-campaign prefixes) stay addresses forever; nothing renumbers, nothing is
 * reused. Every id in the city carries a digit — reading a word as one indicts the parser (P3 §0).
 */
export const isId = (s: string) => /^[A-Za-z0-9][A-Za-z0-9-]*$/.test(s) && /\d/.test(s);

/** §7 — the blessing mark. `✓ Felix` is the historical spelling: read forever, never emitted. */
export const BLESSED_MARK = /⬡\s*✓|✓\s*Felix/;
/**
 * The mark rides the END of an attribution, behind §8's `·` — `(2026-08-29, Grand Architect ·
 * ⬡✓ 2026-08-29)`. The separator is required: without it "proposed, pending ⬡✓" reads as a
 * blessing already given, and the decider loses half its name to the strip.
 */
export const BLESSED_TAIL = /\s*·\s*(?:⬡\s*✓|✓\s*Felix)(?:\s*\d{4}-\d{2}-\d{2})?\s*$/;
/** §8 — a dispatched session marks its entry proposed, in either spelling. */
export const PROPOSED_MARK = /proposed[\s,]*(?:[—–-]\s*)?pending\s+(?:⬡\s*✓|Felix countersign)/i;

export type Mantle = typeof MANTLES[number];
export type State = typeof STATES[number];
export type Artifact = 'board' | 'ledger' | 'decisions' | 'issues' | 'kickoff';

export const isMantle = (s: string): s is Mantle => (MANTLES as readonly string[]).includes(s);
export const isTier = (s: string) => TIERS.includes(s);
export const isState = (s: string): s is State => (STATES as readonly string[]).includes(s);

/** Every failure the linter can report carries where it is and what the doc actually says. */
export type Fail = {
	artifact: Artifact;
	code: string;
	reason: string;
	excerpt: string;
	file: string;
	line: number;
};

export const fail = (artifact: Artifact, code: string, reason: string, excerpt: string, line: number): Fail =>
	({ artifact, code, reason, excerpt, file: '', line });

// ---------- text primitives (harvested verbatim from the P3 probes) ----------

/** Markdown emphasis and code ticks carry no meaning in a doctrine field. */
export const strip = (s: string) => s.replace(/\*\*/g, '').replace(/`/g, '').trim();
export const delink = (s: string) => s.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
export const linkTarget = (s: string) => s.match(/\[[^\]]*\]\(([^)]+)\)/)?.[1] ?? null;

/**
 * Split on separators that sit at nesting depth 0 — a comma inside
 * "(confirmed …, 7ms)" is not a list separator, and mistaking it for one
 * indicts the parser, not the doc (P3 §0: this bug cost 110 false failures).
 */
export function topSplit(s: string, seps: string[]): string[] {
	const out: string[] = [];
	let buf = '', depth = 0, tick = false;
	for (let i = 0; i < s.length; i++) {
		const c = s[i]!;
		if (c === '`') tick = !tick;
		if (!tick) { if ('([{'.includes(c)) depth++; else if (')]}'.includes(c)) depth--; }
		if (!tick && depth <= 0 && seps.includes(c)) { out.push(buf); buf = ''; continue; }
		buf += c;
	}
	out.push(buf);
	return out.map(x => x.trim()).filter(Boolean);
}

/** A trailing parenthetical, balanced — D63d's staffing rider, §7's ledger row slot. */
export function trailingParen(s: string): { head: string; inner: string | null } {
	const t = s.trim();
	if (!t.endsWith(')')) return { head: t, inner: null };
	let depth = 0;
	for (let i = t.length - 1; i >= 0; i--) {
		if (t[i] === ')') depth++;
		else if (t[i] === '(') { depth--; if (!depth) return { head: t.slice(0, i).trim(), inner: t.slice(i + 1, -1).trim() }; }
	}
	return { head: t, inner: null };
}

/** A leading ALLCAPS token, as a whole word — the Status cell's lifecycle slot. */
export function leadingToken(s: string): string {
	const m = s.trim().match(/^[A-Z][A-Z ]*[A-Z]|^[A-Z]+/);
	if (!m) return '';
	// "IN FLIGHT" is two words; anything else stops at the first word.
	const up = m[0];
	return up.startsWith('IN FLIGHT') ? 'IN FLIGHT' : (up.split(' ')[0] ?? '');
}
