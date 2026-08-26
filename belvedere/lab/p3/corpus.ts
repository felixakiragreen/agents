// P3 corpus — every doctrine-shaped artifact discovered under ~/code (see findings §1).
// Discovery commands are recorded in the findings; this list is their result.
import { homedir } from 'os';
const H = homedir();
const C = `${H}/code`;
const WT = `${C}/universal_robots_sdk/cap-mega/.claude/worktrees`;

export type Entry = { repo: string; boards?: string[]; ledger?: string; decisions?: string; issues?: string; plans?: string[] };

export const CORPUS: Entry[] = [
   { repo: 'agents', boards: [`${C}/agents/MAP.md`], ledger: `${C}/agents/LEDGER.md`, decisions: `${C}/agents/DECISIONS.md`, issues: `${C}/agents/ISSUES.md`, plans: [`${C}/agents/plans`] },
   { repo: 'agents/belvedere', boards: [`${C}/agents/belvedere/README.md`], ledger: `${C}/agents/belvedere/LEDGER.md`, decisions: `${C}/agents/belvedere/README.md`, issues: `${C}/agents/belvedere/ISSUES.md`, plans: [`${C}/agents/belvedere/plans`] },
   { repo: 'hexwright', boards: [`${C}/hexwright/GENESIS.md`], ledger: `${C}/hexwright/LEDGER.md`, decisions: `${C}/hexwright/DECISIONS.md`, plans: [`${C}/hexwright/plans`] },
   { repo: 'whiteboardy', boards: [`${C}/whiteboardy/GENESIS.md`, `${C}/whiteboardy/docs/m1-editor.md`, `${C}/whiteboardy/docs/m2-sync.md`, `${C}/whiteboardy/docs/m3-shells.md`, `${C}/whiteboardy/docs/touch-native.md`, `${C}/whiteboardy/docs/v1-cutover.md`, `${C}/whiteboardy/docs/v1-expansion.md`], ledger: `${C}/whiteboardy/LEDGER.md`, decisions: `${C}/whiteboardy/DECISIONS.md`, plans: [`${C}/whiteboardy/plans`] },
   { repo: 'rooted/repot', boards: [`${C}/rooted/repot/README.md`], plans: [`${C}/rooted/repot/plans`] },
   { repo: 'rooted/archive/arborist', boards: [`${C}/rooted/archive/arborist/README.md`], issues: `${C}/rooted/archive/arborist/ISSUES.md`, plans: [`${C}/rooted/archive/arborist/plans`] },
   { repo: 'bob', issues: `${C}/universal_robots_sdk/bob/ISSUES.md`, boards: [`${C}/universal_robots_sdk/bob/docs/campaigns/lunchbox/README.md`, `${C}/universal_robots_sdk/bob/docs/campaigns/pods/README.md`, `${C}/universal_robots_sdk/bob/docs/campaigns/theseus/README.md`] },
   { repo: 'cap-mega/simmy', boards: [`${C}/universal_robots_sdk/cap-mega/simmy/README.md`], ledger: `${C}/universal_robots_sdk/cap-mega/simmy/LEDGER.md`, decisions: `${C}/universal_robots_sdk/cap-mega/simmy/README.md`, issues: `${C}/universal_robots_sdk/cap-mega/simmy/ISSUES.md`, plans: [`${C}/universal_robots_sdk/cap-mega/simmy/spikes`] },
   { repo: 'cap-mega/snappy', boards: [`${C}/universal_robots_sdk/cap-mega/snappy/README.md`], ledger: `${C}/universal_robots_sdk/cap-mega/snappy/LEDGER.md`, decisions: `${C}/universal_robots_sdk/cap-mega/snappy/README.md`, issues: `${C}/universal_robots_sdk/cap-mega/snappy/ISSUES.md`, plans: [`${C}/universal_robots_sdk/cap-mega/snappy/plans`] },
   { repo: 'cap-mega/snappy/ch2', boards: [`${C}/universal_robots_sdk/cap-mega/snappy/ch2/README.md`], plans: [`${C}/universal_robots_sdk/cap-mega/snappy/ch2/plans`] },
   { repo: 'cap-mega/docs/units', boards: [`${C}/universal_robots_sdk/cap-mega/docs/units/README.md`], plans: [`${C}/universal_robots_sdk/cap-mega/docs/units/plans`] },
   { repo: 'cap-mega/docs/waypoint-stepper', boards: [`${C}/universal_robots_sdk/cap-mega/docs/waypoint-stepper/README.md`] },
   { repo: 'cap-mega/docs (contract boards)', boards: [`${C}/universal_robots_sdk/cap-mega/docs/advanced-naming-system.md`, `${C}/universal_robots_sdk/cap-mega/docs/node-global-parameters.md`, `${C}/universal_robots_sdk/cap-mega/docs/documentation-findings.md`] },
   { repo: 'cap-mega/manny (wt user-manual)', boards: [`${WT}/user-manual/manny/README.md`] },
   { repo: 'cap-mega/cornerizer (wt)', boards: [`${WT}/cornerizer/docs/cornerizer.md`] },
   { repo: 'cap-mega/tig-avc (wt)', boards: [`${WT}/tig-avc/docs/tig-avc.md`] },
   { repo: 'cap-mega/schema-migration (wt motion-migration)', boards: [`${WT}/motion-migration/docs/schema-migration.md`] },
   { repo: 'spacex-dashboard-c2', ledger: `${C}/universal_robots_sdk/cap-mega/felix/spacex-dashboard-c2/LEDGER.md` },
   { repo: 'spacex-dashboard', ledger: `${C}/universal_robots_sdk/cap-mega/felix/spacex-dashboard/LEDGER.md` },
];

// Scanned, no doctrine artifacts found: my_checklist, golos, thg-doc, thg-speakeasy,
// placeholder, cap-mig, cap-plasma, cap-tig, cap-laser, cap-demo-cart, cap-coord-pos,
// cap-oxy-fuel, cap-positioner, felix, KillTeam-BattleData.
