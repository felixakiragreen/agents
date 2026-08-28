/**
 * The Works, server side: **the declared plan, shaped for the drawing** (B10, keel §6).
 *
 * One thing only — turn parsed `Flow`s and their run logs into the wire shape the Works draws. The
 * file parse is `flow.ts`'s and nothing else touches those bytes; the *past* half of the drawing is
 * the building's own board rows, which are already on the wire (`workshop`) and are joined to these
 * nodes by id in the client rather than parsed a second time here.
 *
 * **Nothing here writes and nothing here fires.** A node carries its kickoff as bytes to read; the
 * arm is B11's, and the string `hands/fire` appears nowhere in this file or in what it produces.
 */

import type { Building } from '../../doctrine';
import { cmuxColor } from './colors';
import type { Works, WorksEdge, WorksFail, WorksFlow, WorksNode, WorksUsage } from './deck-model';
import { blocksOf, armedAt, armedHash, flowLast, readFlows, readRun, stateOf, type Flow, type Step } from './flow';
import { BUCKETS, pacing } from './gauges';
import { handsState, readHalt } from './hands';
import { short, tilde } from './html';
import { gatedOf, isJudge, judgesOf } from './judge';
import { buildingPath } from './register';
import { readRig, type Rig } from './rig';
import { usageNow } from './usage';

/**
 * The venue as one phrase — the law of space: a node has room for a line, not a record. It renders
 * **home**-relative rather than city-relative (`tilde`, not `short`): a venue is a place a session
 * runs and may sit outside the city entirely, and `~/code/agents` is how the corpus writes it.
 */
const venueOf = (s: Step): string =>
	s.venue.kind === 'master' ? `master ${tilde(s.venue.cwd)}` : `worktree ${tilde(s.venue.repo)}:${s.venue.branch}`;

const fromOf = (s: Step): string | null =>
	s.kickoff.doc === null ? null : `${short(s.kickoff.doc)} #${s.kickoff.fence}`;

/**
 * The mantle's hue: the rig's table (`presets.tsv`) through felikai's (B18 F1) — **never a colour
 * word invented here**, and null where the rig staffs no such mantle, because a node wearing a
 * guessed colour is a node lying about who is holding it.
 */
const colorOf = (mantle: string, rig: Rig): string | null =>
	cmuxColor(rig.colours.get(mantle.toLowerCase().replace(/\s+/g, '-')) ?? '');

/**
 * **The card the reactive gate leaves behind** (B12 §2). A judge node whose lane the engine has
 * paused is a judge that sat and left something Felix's: the pause's own sentence *is* the card, so
 * the drawing states the engine's reason rather than inventing an idiom for it, and — like every
 * Felix-card on this deck — nothing on it can fire (D10; `awaitingPass` stays false because the
 * judge has already fired, so there is no pass gesture either).
 */
const residue = (s: Step, ring: string, last: ReturnType<typeof stateOf>['last']): string | null =>
	isJudge(s.id) && ring === 'paused' && last?.why !== undefined && last.why !== null ? last.why : null;

function node(s: Step, run: ReturnType<typeof readRun>, rig: Rig): WorksNode {
	const { ring, last } = stateOf(run, s.id);
	const card = residue(s, ring, last);
	return {
		id: s.id, name: s.name, mantle: s.mantle, color: colorOf(s.mantle, rig),
		tier: s.tier, account: s.account,
		venue: venueOf(s), depends: s.depends, depth: s.depth,
		inserted: isJudge(s.id),
		gate: card !== null ? 'felix' : s.gate.kind,
		card: card ?? (s.gate.kind === 'felix' ? s.gate.card : null),
		kickoff: s.kickoff.text, from: fromOf(s),
		run: {
			ring,
			ev: last?.ev ?? null, at: last?.ts ?? null,
			sid: last?.sid ?? null, workspace: last?.workspace ?? null, why: last?.why ?? null,
		},
		blocks: blocksOf(s),
		timeoutMinutes: s.timeoutMinutes,
		// The engine parks his lane on the card and waits; a `resumed` after it is his pass, so the
		// affordance follows the log rather than being remembered anywhere. A step that has already
		// fired is past its card — a later pause there is a timeout, not a gate.
		awaitingPass: s.gate.kind === 'felix' && last?.ev === 'paused'
			&& !run.lines.some(l => l.step === s.id && l.ev === 'fired'),
	};
}

/**
 * One flow, with its run log read once and every node drawn from it — **including the judges the
 * reactive gate inserted** (B12 §2). They are derived from the log by the same function the engine
 * fires from, so the kickoff on the node is the kickoff that was sent, compared rather than argued
 * about; and the edge from a gated step to its judge is drawn even though the judge *depends* on
 * nothing, because insertion is the relation and readiness is not.
 */
export function worksFlow(flow: Flow, rig: Rig, buildingPath: string): WorksFlow {
	const run = readRun(flow.name);
	const judges = judgesOf(flow, run, buildingPath);
	const edges: WorksEdge[] = [
		...flow.steps.flatMap(s => s.depends.map(from => ({ from, to: s.id }))),
		...judges.map(j => ({ from: gatedOf(j.id)!, to: j.id })),
	];
	const last = flowLast(run);
	return {
		name: flow.name, file: short(flow.file), building: flow.building, scope: flow.scope,
		created: flow.created, concurrency: flow.concurrency, judgeTier: flow.judgeTier,
		armedAt: armedAt(run),
		hash: flow.hash, armedHash: armedHash(run),
		nodes: [...flow.steps, ...judges].map(s => node(s, run, rig)),
		edges,
		run: { file: short(run.file), present: run.present, lines: run.lines.length, malformed: run.malformed },
		last: last === null ? null : { ev: last.ev, at: last.ts, why: last.why },
	};
}

/**
 * The bill, per account (B10 §5). **B17 put the live read behind this shape**, as B10 said it
 * would: `usageNow` hands over whatever the deck's own fetcher last got — the composer's expand is
 * what fetches — and falls back to the rig's cache for an account it has not reached, labelled as
 * that. It never fetches *here*: this runs on the three-second poll, and a token read plus an HTTPS
 * round trip on a clock is a price nobody agreed to (`usage.ts` §usageNow).
 *
 * The age still rides every figure, because a quota panel that hides its own staleness is the
 * hidden bill this row exists to show.
 */
export function worksUsage(rig: Rig = readRig(), nowSeconds = Date.now() / 1000): WorksUsage[] {
	return usageNow(rig).map(u => ({
		account: u.account,
		ageSeconds: u.fetchedAt === null ? null : Math.max(0, nowSeconds - u.fetchedAt),
		cells: BUCKETS.map(bucket => {
			const q = u.windows[bucket];
			return { bucket, pct: q?.pct ?? null, delta: q === undefined ? null : pacing(q, nowSeconds) };
		}),
	}));
}

/**
 * Every flow declared for one building, and every flow file that would not parse.
 *
 * A failure is carried rather than dropped: **a flow that will not render is a flow that is lying**
 * (README §1's parser-as-lint), so the page shows the named refusal and files nothing. Failures are
 * building-blind by necessity — a file that will not parse has no `building` field to filter on —
 * so they ride every building's Works and say which file they came from.
 */
export function worksOf(building: string | null, buildings: readonly Building[] = []): Works | null {
	if (building === null) return null;
	const rig = readRig();
	const reads = readFlows(rig);
	// The register's own path for this building — the same one the engine hands the judge as its
	// venue. Handed in from the poll's existing read rather than looked up again (B14 F8's budget).
	const path = buildingPath(building, buildings);
	const flows: WorksFlow[] = [];
	const fails: WorksFail[] = [];
	for (const r of reads) {
		if (!r.ok) fails.push({ ...r.fail, file: short(r.fail.file) });
		else if (r.flow.building === building) flows.push(worksFlow(r.flow, rig, path));
	}
	return { building, flows, fails, usage: worksUsage(rig), halt: readHalt(), hands: handsState() };
}
