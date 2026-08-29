// The Standards Office's reference reader. The Office owns the format, so it owns the
// parser: two readers of one format WILL drift. The glass imports THIS.
//
// Law: canon/work/DOCTRINE.md §§3, 4, 5, 7, 8, 11 as amended by D63 (the schema fold),
// D64 (the baton grammar) and D71 (the standard — canon/work/STANDARD.md).
// Shapes: belvedere/plans/p3-parse-coverage.md §5, normative (D65).

export { parse, parseFiles, discover, slug, LIMITS, lastWalk, type Building, type Board } from './src/building';
export {
	parseBoards, parseLedger, parseDecisions, parseIssues, parseKickoffs, classifyBaton, batonFails,
	type BoardRow, type LedgerEntry, type Decision, type Issue, type Kickoff, type Baton, type Instrument,
} from './src/parse';
export { lint, render, guardRegressions, isLiveWorkDoc, type LintReport, type Totals } from './src/lint';
export {
	MANTLES, MODELS, EFFORTS, TIERS, STATES, VERDICTS, RETIRED, HEX_GATE, PENDING, DEFERRED, UNRECORDED,
	FELIX_GATE, PARKED, UNSTAFFED,
	isMantle, isTier, isState, isId, type Fail, type Mantle, type State, type Artifact, type Severity,
} from './src/grammar';
export { GRAVEYARD, FORMULAS, SPELLING_PAIRS, SPELLING_EXCEPTIONS, ISE_STOPLIST, CANON_PREFIXES, CHARGE_PREFIX, type Dead } from './src/lexicon';
export { mask, vocabularyFails, prefixFails, RESERVED } from './src/vocabulary';
export { migrate, migrateText, RULES, roundTrip, type Migration, type Edit } from './src/migrate';
