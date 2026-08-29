// The vocabulary arm's data: the graveyard, the spelling lexicon, the id-prefix table and the
// pinned formulas — the standard's §§7–9 mirrored as something a machine can act on.
//
// STANDARD.md is the single home; this file is the mirror and `test/lexicon.test.ts` is the
// alarm: every list below is asserted against the standard's own text, so editing the law
// turns the suite red until the mirror follows. Nothing here restates law the standard does
// not carry, and nothing in the standard is silently dropped — a row the linter cannot
// enforce says so, in writing, with its reason.
//
// Ancestor: manny's M13 (`campaign-id`, hard error) in cap-mega's `model-scripts/lint-manual.py`,
// born at `manny/plans/29-campaign-id-lint.md` (LANDED 2026-08-09, `b4be16ff` `2a9f1b6a`,
// merged `4d7ff621`). Its two laws are this file's: **narrow the pattern, never whitelist a
// file**, and **a pattern that cannot be written without false positives is dropped, in
// writing, not weakened**.

/**
 * One row of the standard's graveyard (§9). `dead` and `successor` are the table's cells
 * VERBATIM — they are the drift test's key, so they are transcription, not paraphrase.
 * `forms` is the word-bounded catcher, or `null` for a row no pattern can serve; the `dropped`
 * field is then mandatory and is the finding, in place.
 */
export type Dead =
	| { dead: string; successor: string; forms: RegExp }
	| { dead: string; successor: string; forms: null; dropped: string };

/**
 * §9's table, in its own order. Case-insensitive, word-bounded, `g`-flagged — the arm re-uses
 * `lastIndex`, so every regex here must be a fresh literal (no sharing).
 */
export const GRAVEYARD: readonly Dead[] = [
	{
		dead: 'row (unit)', successor: 'charge',
		// Narrowed to a REFERENCE — `row 26`, `the row-01 Digger`, `rows 3–7`. Bare "row" is the
		// city's most collided word (lexicon.json's first entry: a settings-panel row, an outliner
		// row, a Swing table row), and M13 narrowed the same word the same way for the same reason.
		forms: /\brows?[-–— ]\d+\b/gi,
	},
	{ dead: 'ratify', successor: 'bless + the record', forms: /\bratif(?:y|ies|ied|ying|ication|ications)\b/gi },
	{
		dead: 'chain (term)', successor: 'a serial batch', forms: null,
		dropped: 'no pattern separates the Guild\'s dead sense from live engineering prose — toolchain, '
			+ 'promise chaining, a chain of custody, `git chain`. Word-bounding does not help: the '
			+ 'collision is on the bare word. Dropped, not weakened.',
	},
	{
		dead: 'true (verb)', successor: 'reconcile',
		// The inflections are unambiguously the verb; bare "true" is the adjective the whole city
		// writes, so it is out of the pattern rather than whitelisted per file.
		forms: /\btru(?:ed|ing)\b/gi,
	},
	{ dead: 'park / PARKED', successor: 'defer / DEFERRED', forms: /\b(?:un)?park(?:s|ed|ing)?\b/gi },
	{ dead: 'drain', successor: 'clear', forms: /\bdrain(?:s|ed|ing)?\b/gi },
	{ dead: 'harvest', successor: 'canonize', forms: /\bharvest(?:s|ed|ing)?\b/gi },
	{ dead: 'Felix-gate / helm-queue forms', successor: '⬡-gate · ⬡-queue', forms: /\bFelix-gat(?:e|es|ed|ing)\b|\bhelm-queue\b/gi },
	{ dead: 'refire', successor: 'reignite', forms: /\bre-?fir(?:e|es|ed|ing)\b/gi },
	{
		dead: 'brief · order (doc names)', successor: 'the charge doc',
		// `order` alone is "in order to" and "the order of the batch" — out. `work order` is M13's
		// own smuggler word, banned outright there for the same reason.
		forms: /\bbriefs?\b|\bwork orders?\b/gi,
	},
	{ dead: 'cut (all senses)', successor: 'lay (create) · kill (remove)', forms: /\bcuts?\b|\bcutting\b/gi },
	{
		dead: 'fold', successor: 'distill', forms: null,
		dropped: 'the live city folds constantly in senses the standard never killed — "the schema fold" '
			+ '(D63\'s own name, an address), "folds in", a folded diff, a fold in a UI tree. The dead '
			+ 'sense is the review gesture and no surface distinguishes it.',
	},
	{
		dead: 'fire (dispatch)', successor: 'ignite',
		// Narrowed to the bare word, and measured: `fire` scored 8/8 Guild-sense on the city corpus,
		// while `fires` scored 0/5, `firing` 1/8 and `fired` 4/8 — in a city of event handlers a
		// clause fires, a listener fires, a kill criterion fires, and none of them are a dispatch.
		// The inflections are dropped rather than whitelisted per building (M13's law); the noun and
		// the bare verb keep the catch, hyphenates included ("live-fire", "the 359-fire gap").
		forms: /\bfire\b/gi,
	},
	{ dead: 'dispatchable · fire-now · ready-now', successor: 'ignitable (or nothing — batons are ready by definition)', forms: /\bdispatchable\b|\bfire-now\b|\bready-now\b/gi },
	{
		dead: 'wave', successor: 'batch', forms: null,
		dropped: 'a wave is a shape in half the city\'s UI and animation prose (whiteboardy, spacex, '
			+ 'the dashboards) and the Guild sense reads identically. The batch respell is C25\'s '
			+ 'sweep; enforcing it costs more false positives than it catches drift.',
	},
	{
		dead: 'move (baton)', successor: 'action; shapes single / batch / fork', forms: null,
		dropped: 'the commonest verb in English. Only the baton\'s slot carries the dead sense and that '
			+ 'slot is typed by the parser already (`classifyBaton`), so a lexical pattern would be all '
			+ 'noise and no new signal.',
	},
	{ dead: 'sitting', successor: 'session', forms: /\bsittings\b|\bthe sitting\b|\bthis sitting\b|\bone sitting\b/gi },
	{
		dead: 'window (law surfaces)', successor: 'session (lore keeps its windows)', forms: null,
		dropped: 'a window is a real object in every UI building in the city (and lore keeps its windows '
			+ 'by the standard\'s own parenthetical). The dead sense is hexwright\'s "the window that '
			+ 'laid its keel" — history, behind the fence. No live-surface pattern survives the collision.',
	},
	{ dead: 'keel · keel-note', successor: 'cornerstone · cornerstone note', forms: /\bkeels?\b|\bkeel-notes?\b|\bkeeled\b/gi },
	{
		dead: 'CLOSED (campaign altitude)', successor: 'set the keystone',
		// Case-sensitive by construction: the dead word is the ALLCAPS status token, not "closed".
		forms: /\bCLOSED\b/g,
	},
	{ dead: 'DoD · Definition of Done', successor: 'Done when:', forms: /\bDoDs?\b|\bDefinitions? of Done\b/g },
	{ dead: 'countersign (verb)', successor: 'bless (the ✓ Felix mark stays)', forms: /\bcountersign(?:s|ed|ing)?\b/gi },
	{ dead: 'rider (all six senses)', successor: '⬡-named appendix · annotation · condition · small charges', forms: /\briders?\b/gi },
	{ dead: 'helm', successor: 'the Felix-queue (noun ⬡)', forms: /\bhelms?\b|\bhelm-frames?\b|\bhelm frames?\b/gi },
	{
		dead: 'glass (the word)', successor: 'Belvedere / the deck',
		// The Guild sense only: "the glass", "his glass", "the sovereign's glass". A pane of glass and
		// a glass of water keep the word.
		forms: /\b(?:the|his|its|our|sovereign's) glass\b/gi,
	},
	{
		dead: 'strike (decide sense)', successor: 'kill', forms: null,
		dropped: '§7 keeps `~~strike~~` as live notation, so the word names a legal gesture on the very '
			+ 'surfaces this arm walks. The dead sense (striking a decision) is indistinguishable from '
			+ 'naming the notation.',
	},
	{
		dead: 'pass (Guild-minted senses)', successor: 'bless (the gesture) · visual pass survives', forms: null,
		dropped: 'the standard kills some senses and keeps others in one breath — formula 11 is '
			+ '"Passing = finished." and the visual pass survives by name. A word the law both bans and '
			+ 'blesses cannot be linted lexically.',
	},
	{ dead: '--bless (goldens)', successor: '--gild', forms: /--bless\b/g },
	{ dead: 'Dispatcher (mantle)', successor: 'the flow engine — 20 is the new dispatcher (ruled)', forms: /\bDispatchers?\b/g },
	{ dead: 'unstaffed', successor: 'Fixer (staffing) · `—` (dissolved staffing on DEFERRED charges)', forms: /\bunstaffed\b/gi },
	{
		dead: 'the four-slot waggle', successor: 'one plain sentence per thing', forms: null,
		dropped: 'not a word — a document shape. The dead four slots (Problem / Move / Stakes / Dig) '
			+ 'appear as ordinary headings all over the city; catching the anatomy needs a structural '
			+ 'rule the standard has not asked for.',
	},
	{
		dead: 'bare "register"', successor: 'a named register',
		// §8's own rule: "register" never stands bare. A named register always carries its qualifier
		// in front of the word (the decision register, the building register), so the bare article
		// form IS the violation and nothing else is.
		forms: /\b(?:the|a|this|its|our) registers?\b/gi,
	},
];

// ---------- §8, the spelling lexicon ----------

/**
 * §8: "American, with the exception list: grey (greys, greyed)". The exception INVERTS its pair —
 * `grey` is the Guild's spelling, so `gray` is the catch and `grey` is never one.
 */
export const SPELLING_EXCEPTIONS: readonly string[] = ['grey', 'greys', 'greyed'];

/**
 * `[American, British]`, harvested verbatim from the census's own pair list
 * (`lab/21/ortho.ts`, charge 21) — the pairs that are actually mixed in this city, not a
 * dictionary. `ortho-report.md` measured every one of them live.
 */
export const SPELLING_PAIRS: readonly (readonly [string, string])[] = [
	['color', 'colour'], ['center', 'centre'], ['gray', 'grey'], ['behavior', 'behaviour'],
	['favor', 'favour'], ['honor', 'honour'], ['flavor', 'flavour'], ['license', 'licence'],
	['defense', 'defence'], ['offense', 'offence'], ['analyze', 'analyse'], ['catalog', 'catalogue'],
	['dialog', 'dialogue'], ['traveled', 'travelled'], ['modeling', 'modelling'], ['labeled', 'labelled'],
	['canceled', 'cancelled'], ['fulfill', 'fulfil'], ['judgment', 'judgement'], ['artifact', 'artefact'],
	['theater', 'theatre'], ['meter', 'metre'], ['liter', 'litre'], ['practice', 'practise'],
];

/**
 * -ise words that are not -ize words in any dialect. The census's stoplist (`lab/21/ortho.ts`),
 * plus the words this arm's own corpus run proved it was missing — `improvise` (26 uses),
 * `advertise` (8) and `supervise` (7) all sat in `ortho-report.md`'s "top -ise" table, which
 * means the census's -ise count of 193 is ~41 too high. Filed as C26-F2.
 */
export const ISE_STOPLIST: ReadonlySet<string> = new Set([
	'rise', 'arise', 'wise', 'otherwise', 'likewise', 'clockwise', 'promise', 'premise',
	'surprise', 'exercise', 'precise', 'concise', 'paradise', 'expertise', 'franchise', 'disguise',
	'raise', 'praise', 'noise', 'poise', 'advise', 'devise', 'revise', 'comprise', 'compromise', 'anise',
	'improvise', 'advertise', 'supervise', 'televise', 'excise', 'incise', 'demise', 'treatise',
	'enterprise', 'merchandise', 'apprise', 'reprise', 'chastise', 'guise', 'valise', 'malaise',
	'lengthwise', 'crosswise', 'edgewise', 'sidewise', 'anywise',
	'tortoise', 'turquoise', 'porpoise', 'bruise', 'cruise',
]);

// ---------- §7, the id namespace ----------

/** §7's sentence, in its own order: the letters the canon reserves. */
export const CANON_PREFIXES: readonly string[] = ['D', 'F', 'E', 'G', 'GA-', 'FC-'];

/**
 * `C‹n›` — the charge id the standard's deploy writes (§What remains: "Laid 2026-08-29 as
 * C23–C28"). Reserved by use rather than by §7's sentence, so it is declared apart: the drift
 * test binds `CANON_PREFIXES` to the standard and must not be told to expect a letter the
 * standard's §7 does not print.
 */
export const CHARGE_PREFIX = 'C';

// ---------- §8, the pinned twenty-four ----------

/**
 * The pinned formulas, blessed ⬡✓ 2026-08-29 — exact strings, one wording each. The drift test
 * reads §8's numbered list and asserts this array is it, item for item.
 */
export const FORMULAS: readonly string[] = [
	'One concept, one word.',
	'Files carry the truth.',
	'Lay, then ignite.',
	'A documented kill is a win.',
	'Gates are charges.',
	'Measurements carry their conditions.',
	'Probes ship with a control.',
	'Ambiguity, never plurality, is the sin.',
	'A paraphrase is a defect.',
	'The state leads, the annotation follows.',
	'Passing = finished.',
	'One function, one home.',
	'Append, distill, strike.',
	'A baton must read cold.',
	'Stop and escalate.',
	'A claim without evidence is a draft.',
	'The tail alone reboots a cold session.',
	'Targets are read from the repo.',
	'Parallel-safe is not parallel-affordable.',
	'Split when it hurts, not before.',
	'Auto-loaded bytes are taxed.',
	'Creep is a bug.',
	'Think in any terms; communicate in the standard.',
	'Translate the Sovereign\'s vocabulary; challenge his substance.',
];
