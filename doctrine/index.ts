// The Standards Office's reference reader. The Office owns the format, so it owns the
// parser: two readers of one format WILL drift. The glass imports THIS.
//
// Law: canon/work/DOCTRINE.md §§3, 4, 5, 7, 8, 11 as amended by D63 (the schema fold),
// D64 (the baton grammar) and D71 (the standard — canon/work/STANDARD.md).
// Shapes: belvedere/plans/p3-parse-coverage.md §5, normative (D65).

export { parse, parseFiles, discover, slug, LIMITS, lastWalk, type Building, type Board } from './src/building';
export {
	parseBoards, parseLedger, parseDecisions, parseIssues, parseKickoffs, classifyBaton, batonFails,
	batonSlots, batonTypeWord,
	type BoardRow, type LedgerEntry, type Decision, type Issue, type Kickoff, type Baton, type Instrument,
	type BatonShape, type Recommendation,
} from './src/parse';
export { lint, render, guardRegressions, isLiveWorkDoc, type LintReport, type Totals } from './src/lint';
export { bootPack } from './src/boot';
export { scanCredits, renderStatement, statementLine, byInterest, type Credit, type Surface, type CreditSources } from './src/credit';
export {
	REGISTER, parseRegister, readRegister, walkRegister, buildingNames, crossingFails,
	type Kind, type RegisterRow, type RegisteredBuilding,
} from './src/register';
export {
	MANTLES, MODELS, EFFORTS, TIERS, STATES, VERDICTS, RETIRED, HEX_GATE, PENDING, DEFERRED, UNRECORDED,
	FELIX_GATE, PARKED, UNSTAFFED, CELL_CAP, ENTRY_CAP, BLESSED_MARK, CREDIT_MARK, BATON_TYPES,
	isMantle, isTier, isState, isId, isLawBook, creditDate, maskCode,
	type Fail, type Mantle, type State, type Artifact, type Severity, type BatonType,
} from './src/grammar';
export { GRAVEYARD, FORMULAS, SPELLING_PAIRS, SPELLING_EXCEPTIONS, ISE_STOPLIST, CANON_PREFIXES, type Dead } from './src/lexicon';
export { mask, vocabularyFails, prefixFails } from './src/vocabulary';
export { migrate, migrateText, RULES, roundTrip, type Migration, type Edit } from './src/migrate';
export {
	HOMES, TOMBSTONE, onFence, respellCitations, respellBuilding, citationTargets, renderHomes, diffRun,
	type Home, type CiteRun, type CiteEdit, type Bare,
} from './src/citations';
