import { sep } from 'path';

// The doctrine's vocabulary and its text primitives.
// Law: canon/work/DOCTRINE.md §§3, 4, 5, 7, 8, 11 as amended by D63 (the schema fold),
// D64 (the baton grammar) and D71 (the standard: canon/work/STANDARD.md). One parser in the
// city: a mantle, a tier, a state, a verdict, an id or a dead word is named HERE and nowhere
// else — two spellings of one word is how a format drifts.

// `Dispatcher` stays: the parser reads the city's history forever, and the mantle staffed
// real sessions. `Fixer` is D71 §5's minting — a session with no mantle IS a Fixer, so the
// word types every bare-session entry the record left unnamed (025's three, 026 item 7).
export const MANTLES = ['Grand Architect', 'Architect', 'Dispatcher', 'Digger', 'Builder', 'Mentat', 'Fixer'] as const;
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
 * §11's ⬡-baton types — what the baton REQUIRES of the hand it waits on, ruled by Felix at
 * stigmergon's phase-3 pass (2026-09-02): **mental** (a decision to make), **visual** (an
 * interface to look at or drive), **bench** (physical testing — *"a bench baton cannot be paid
 * from the desk"*; a simulator is not enough). The type is the ⬡-action's own leading noun, so
 * this is a word table and not a branch: STANDARD §1's three verdicts (bless · rule · kill) are
 * mental by definition, §6's **visual pass** and **bench** name their own. Every word here is a
 * word the record already writes; the office extends the table from 045's census, and an action
 * this table does not name types `null` and is listed there.
 */
export type BatonType = 'mental' | 'visual' | 'bench';
export const BATON_TYPES: Readonly<Record<string, BatonType>> = {
	rule: 'mental', ruling: 'mental', bless: 'mental', blessing: 'mental', kill: 'mental',
	choose: 'mental', choice: 'mental', read: 'mental', verify: 'mental', decide: 'mental',
	pass: 'visual', 'visual pass': 'visual', smoke: 'visual', look: 'visual',
	watch: 'visual', open: 'visual', drive: 'visual',
	bench: 'bench',
};

/**
 * D80 · D18 — ids are strings. A charge is its number padded to three (`023`); a kind keeps its
 * letter (`G2`, `D79`); a session is its name-stamp (`grand-architect-21`); and every historical
 * spelling (bare numbers, `C‹n›`, per-campaign prefixes) stays an address forever. Nothing
 * renumbers, nothing is reused — a respell is not a renumber. Every id in the city carries a
 * digit, and reading a word as one indicts the parser (P3 §0).
 */
export const isId = (s: string) => /^[A-Za-z0-9][A-Za-z0-9-]*$/.test(s) && /\d/.test(s);

/**
 * §8 — a decision id, as text, named ONCE: a campaign prefix, an optional second letter run,
 * then the number. `D63` · `D63a` · `RP-1` · `A17` · and the standard's own `‹prefix›-D‹n›`
 * (`PD-D9`, `TH-D11`, `LB-D10`, `C-D2`, `VX-D2`) are one shape. D80 killed `‹prefix›-D‹n›` as a
 * spelling anyone writes; the reader keeps it forever, because the city's history is full of it.
 * The reader used to spell this in four places and reject that form in all four — a silent zero
 * over bob's 53 declared decisions (026-F1). One spelling, or it drifts again.
 */
export const DECISION_ID = String.raw`[A-Za-z]{1,8}(?:-[A-Za-z]{1,8})?-?\d+[a-z]?`;

/** §7 — the blessing mark: he looked. `✓ Felix` is the historical spelling: read forever, never emitted. */
export const BLESSED_MARK = /⬡\s*✓|✓\s*Felix/;
/**
 * §7 — the credit mark (D82): the hexagon without the check, so its absence says he has not
 * looked. Authorization on credit, the review owed. The date is part of the token and is never
 * inferred, so the bare token matches too — an undated mark is the statement's failure, and
 * `creditDate` hands back null for it because a mark with no date authorizes nothing.
 */
export const CREDIT_MARK = /⬡\s*go\b[ \t]*(\d{4}-\d{2}-\d{2})?/;
export const creditDate = (s: string) => s.match(CREDIT_MARK)?.[1] ?? null;
/**
 * A mark rides the END of an attribution, behind §8's `·` — `(2026-08-29, Grand Architect ·
 * ⬡✓ 2026-08-29)`, `(2026-09-01, Architect · ⬡ go 2026-09-01)`. The separator is required:
 * without it "proposed, pending ⬡✓" reads as a blessing already given, and the decider loses
 * half its name to the strip.
 */
export const MARK_TAIL = /\s*·\s*(?:⬡\s*✓|✓\s*Felix|⬡\s*go)(?:\s*\d{4}-\d{2}-\d{2})?\s*$/;

/** §8 — a dispatched session marks its entry proposed, in either spelling. */
export const PROPOSED_MARK = /proposed[\s,]*(?:[—–-]\s*)?pending\s+(?:⬡\s*✓|Felix countersign)/i;

/**
 * D78's retention law, unenforced from its blessing to 041: a LANDED or KILLED Status cell is
 * capped in characters (lint-hard — the fix is the law: status + findings pointer, the story in
 * the charge doc), a ledger entry in words (a warning — the ledger's READS are D78-exempt, its
 * writes are not).
 */
export const CELL_CAP = 200;
export const ENTRY_CAP = 150;
/**
 * §8's purge, nudged (048): the register is the queue and the staging ground, never the archive
 * — past this it has become one. A warning, because a purge is a blessed act and no lint's to
 * force; the cure is the kill, and git holds every byte.
 */
export const REGISTER_CAP = 30 << 10;

export type Mantle = typeof MANTLES[number];
export type State = typeof STATES[number];
export type Artifact = 'board' | 'ledger' | 'decisions' | 'issues' | 'kickoff' | 'prose' | 'register';
/**
 * A form defect is a failure — the doc is lying. A `warn` is the vocabulary arm's one softer
 * verdict, and it exists because the standard asks for exactly one (§7's id namespace: one
 * letter serving two kinds in one building — "the vocabulary arm warns"). Warnings never move
 * the exit code.
 */
export type Severity = 'fail' | 'warn';

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
	severity: Severity;
};

export const fail = (artifact: Artifact, code: string, reason: string, excerpt: string, line: number, severity: Severity = 'fail'): Fail =>
	({ artifact, code, reason, excerpt, file: '', line, severity });

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

const blankRun = (s: string) => s.replace(/[^\n]/g, ' ');

/**
 * Fenced blocks and inline ticks, blanked in place — every offset stays the real one. A doc that
 * quotes a token is naming it, not carrying it: this is what tells a mention from a mark.
 */
export function maskCode(md: string): string {
	let fence = false;
	return md.split('\n')
		.map(l => /^\s*```/.test(l) ? (fence = !fence, blankRun(l)) : fence ? blankRun(l) : l)
		.join('\n')
		.replace(/`[^`\n]*`/g, blankRun);
}

/**
 * The law book itself. `canon/` prints the graveyard — STANDARD §9 IS a table of dead words —
 * and §7 spells the credit mark by writing one. A book that may not name a form cannot define
 * it, so every arm that reads forms as data fences this directory (025; 041).
 */
export const isLawBook = (f: string) => f.split(sep).includes('canon');

/** A leading ALLCAPS token, as a whole word — the Status cell's lifecycle slot. */
export function leadingToken(s: string): string {
	const m = s.trim().match(/^[A-Z][A-Z ]*[A-Z]|^[A-Z]+/);
	if (!m) return '';
	// "IN FLIGHT" is two words; anything else stops at the first word.
	const up = m[0];
	return up.startsWith('IN FLIGHT') ? 'IN FLIGHT' : (up.split(' ')[0] ?? '');
}
