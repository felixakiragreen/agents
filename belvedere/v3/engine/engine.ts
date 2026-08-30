// The engine — a state machine over a declared flow whose entire memory is the
// run log on disk. Between turns it holds nothing: `state()` is a fold of the
// log, every transition is appended before it is acted on, and a restart at any
// instant re-derives and continues (cornerstone §4.9, invariant 7).
//
// The only thing kept in memory is a handle on the subjects currently in
// flight — an OS resource, not state. Lose it (crash, restart) and `adopt()`
// gets the outcome back from the pid, the stream file, and the transcript.
//
// The library is the product; `cli.ts` is a hand-hold over it.

import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { DEFAULT_TIMEOUT_MS, parseFlow, stepById, subjectName, type Fired, type Flow, type Posture, type Step } from "./flow.ts";
import { openLog, type Log, type Ruling, type Sensed } from "./log.ts";
import { postureLegal } from "./posture.ts";
import { fold, ready, running, terminal, unresolved, type RunState, type StepState } from "./replay.ts";
import { senseFile, verdict, type Cause, type Reading, type Verdict } from "./sense.ts";
import { readTranscript, transcriptPath, transcriptRows, verdictFromTranscript } from "./transcript.ts";
import { ignite as spawnSubject, streamPath, type Venue } from "./spawn.ts";
import { precheckVenue as defaultPrecheck, type VenuePrecheck } from "./venue.ts";
import { crashPoint } from "./crash.ts";
import { mutant } from "./mutant.ts";
import { isRefusal, refuse, type Refusal } from "./refusal.ts";

/** What the caller blesses: the steps covered, and the ceiling they run under. */
export type Scope = { steps?: string[]; budget?: number };

export type Options = {
	/** Everything one run owns: the log, the subjects' venue, their transcripts. */
	runDir: string;
	/** C4 F8's slot. The layer-0 stub says yes; C8 supplies the real read. */
	precheck?: VenuePrecheck;
};

/** Everything one run owns sits under its run dir. Exported because the oracle
 *  addresses the same transcripts from outside (barrage/oracle.ts) — two places
 *  spelling the layout is one place too many. */
export const venueFor = (runDir: string): Venue =>
	({ workDir: `${runDir}/work`, configDir: `${runDir}/config` });

/** How often an adopted subject's pid is looked at while it finishes. */
const ADOPT_POLL_MS = 25;
/** The account a fake subject belongs to. Real accounts arrive with C8. */
const FAKE_ACCOUNT = "fake";

export type Run = {
	flow: Flow;
	log: Log;
	venue: Venue;
	state(): RunState;
	bless(scope?: Scope): true | Refusal;
	tick(): Promise<RunState>;
	run(): Promise<RunState>;
	rule(stepId: string, ruling: Ruling): Promise<true | Refusal>;
	halt(reason: string): Promise<void>;
};

/**
 * Open a run: the flow file, the log beside it, the venue under it. A log that
 * already holds a blessing must hold *this* flow — statuses on disk match what
 * happened, or the engine stops rather than continue someone else's run
 * (invariant 8).
 */
export function load(flowPath: string, options: Options): Run | Refusal {
	if (!existsSync(flowPath)) return refuse(`flow ${flowPath} does not exist`);
	const flow = parseFlow(readFileSync(flowPath, "utf8"), flowPath);
	if (isRefusal(flow)) return flow;

	const venue = venueFor(options.runDir);
	mkdirSync(venue.workDir, { recursive: true });
	mkdirSync(venue.configDir, { recursive: true });
	const log = openLog(`${options.runDir}/run.jsonl`);

	const priorFlow = fold(log.entries()).flow;
	if (priorFlow !== null && JSON.stringify(priorFlow) !== JSON.stringify(flow))
		return refuse(`${log.path} was blessed on a different flow — amend and re-bless, never edit under a live log`);

	return make(flow, log, venue, options);
}

function make(flow: Flow, log: Log, venue: Venue, options: Options): Run {
	const precheck = options.precheck ?? defaultPrecheck;
	/** step id -> the turn in flight. A handle, never state. */
	const inFlight = new Map<string, Promise<void>>();

	const state = (): RunState => fold(log.entries());
	const pause = (step: string, causes: Cause[], detail: string) =>
		{ log.append({ kind: "paused", step, causes: mutant("mute-pause") ? [] : causes, detail }); };

	/**
	 * One turn's evidence becomes one transition. A gate is the exception that
	 * names the kind: it never lands itself — its report is the verdict a ruling
	 * is made on, so a gate pauses whatever the report says and nothing
	 * downstream moves until it is ruled (invariant 3).
	 */
	/**
	 * The verdict for a turn already recorded. Split from the recording on
	 * purpose: the reading rides the `turn-ended` event, so an engine that dies
	 * between the two appends resolves the turn from its own log on restart
	 * rather than re-reading a stream that no longer exists.
	 *
	 * A gate is the exception that names the kind: it never lands itself — its
	 * report is the verdict a ruling is made on, so a gate pauses whatever the
	 * report says and nothing downstream moves until it is ruled (invariant 3).
	 */
	const resolve = (stepId: string, sensed: Sensed) => {
		const v: Verdict = sensed.source === "stream" ? verdict(sensed.reading) : verdictFromTranscript(sensed.reading);
		const isGate = stepById(flow, stepId)?.kind === "gate";
		if (v.land && (!isGate || mutant("gate-lands-itself"))) { log.append({ kind: "landed", step: stepId, report: v.report }); return; }
		if (v.land) { pause(stepId, ["gate"], `report: ${v.report.cause}`); return; }
		if (mutant("land-denied") && v.causes.includes("needs-⬡ permission")) { log.append({ kind: "landed", step: stepId, report: null }); return; }
		pause(stepId, isGate ? [...v.causes, "gate"] : v.causes, v.detail);
	};

	const settle = (stepId: string, sessionId: string | null, sensed: Sensed) => {
		log.append({ kind: "turn-ended", step: stepId, sessionId, sensed });
		crashPoint(`before-pause:${stepId}`);
		resolve(stepId, sensed);
	};

	/** Ignite one step, or say loudly why it did not. */
	function fire(step: Fired, sessionId: string, resume: string | null): void {
		const trust = precheck(FAKE_ACCOUNT, venue.workDir);
		if (!trust.trusted) { pause(step.id, ["venue"], `venue trust refused: ${trust.reason}`); return; }

		// The turn cursor, read before the subject exists: everything already in
		// the transcript belongs to somebody else's turn — an earlier one of this
		// step's, or a hand turn a summoned terminal added (D20). Recorded, never
		// computed, and read here because in a moment it stops being true.
		const cursor = transcriptRows(transcriptPath(venue.configDir, venue.workDir, sessionId));

		// The turns already spent name this one's stream file, and the log
		// carries them — so a restart addresses the same file without being told.
		const spawned = spawnSubject({
			step, venue, sessionId, resume: resume !== null,
			prompt: resume ?? `${flow.id}/${step.id}`,
			stream: streamPath(options.runDir, step.id, state().spent[step.id] ?? 0),
		});
		if (isRefusal(spawned)) { pause(step.id, ["dead"], spawned.refusal); return; }

		log.append(resume === null
			? { kind: "ignited", step: step.id, sessionId, pid: spawned.pid, venue: venue.workDir, cursor,
				model: step.model, effort: step.effort, posture: step.posture, subject: subjectName(step.subject) }
			: { kind: "resumed", step: step.id, sessionId, pid: spawned.pid, cursor, turn: resume });
		crashPoint(`after-ignite:${step.id}`);

		// The map entry is dropped by `.finally`, never from inside the work: an
		// async body runs to its first `await` **synchronously**, so a turn that
		// is already over would delete its own entry before `set` ever put one
		// there — and a resolved promise left in the map makes `tick`'s race
		// return instantly, forever (C7 F4).
		inFlight.set(step.id, spawned.settled
			.then((reading: Reading) => {
				crashPoint(`before-settle:${step.id}`);
				settle(step.id, reading.sessionId ?? sessionId, { source: "stream", reading });
			})
			.finally(() => { inFlight.delete(step.id); }));
	}

	/**
	 * A step the log says is running that this process never spawned: the engine
	 * before us died holding it. The stream file did not die with that engine
	 * (C6 F2, ruled), so watch the pid, then read the disk.
	 *
	 * The wait re-arms the step's **full** `timeout_ms` — conservative, and
	 * bounded by the same law that bounds a live turn (law 6). A subject that
	 * outlives it is SIGTERMed and read as the timeout it is.
	 */
	function adopt(stepId: string, at: Extract<StepState, { at: "running" }>, turn: number): void {
		inFlight.set(stepId, waitThenRead().finally(() => { inFlight.delete(stepId); }));

		async function waitThenRead(): Promise<void> {
			const step = stepById(flow, stepId);
			const timeoutMs = step !== undefined && step.kind !== "card" ? step.timeoutMs : DEFAULT_TIMEOUT_MS;
			const asked = step !== undefined && step.kind !== "card" ? step.posture : "auto";
			const deadline = Date.now() + timeoutMs;
			while (alive(at.pid) && Date.now() < deadline) await Bun.sleep(ADOPT_POLL_MS);

			const timedOut = alive(at.pid);
			if (timedOut) { try { process.kill(at.pid, "SIGTERM"); } catch { /* it went on its own */ } }
			settle(stepId, at.sessionId, fromDisk(stepId, at, turn, asked, timedOut));
		}
	}

	/**
	 * What the disk says one turn was — stream file first (C6 F2, ruled). The
	 * file is complete iff it carries a `result` row (parse rule 1); only a torn
	 * stream falls back to the transcript's poorer worked / denied / dead.
	 *
	 * The one exception is a turn **this** engine timed out: it has first-hand
	 * knowledge law 6 names, and a stream torn by its own SIGTERM is read as the
	 * timeout it is rather than laundered through the transcript.
	 *
	 * The transcript is read past the cursor the log recorded at spawn, so it
	 * answers for the turn that was fired and not for whichever turn last wrote
	 * to the file (C7 F3). An empty slice is a turn that never reached disk.
	 */
	function fromDisk(stepId: string, at: Extract<StepState, { at: "running" }>, turn: number, asked: Posture, timedOut: boolean): Sensed {
		const reading = senseFile(streamPath(options.runDir, stepId, turn), asked);
		reading.timedOut = timedOut;
		if (!reading.dead || timedOut) return { source: "stream", reading };
		const path = transcriptPath(venue.configDir, venue.workDir, at.sessionId);
		return { source: "transcript", reading: readTranscript(path, at.cursor) };
	}

	async function tick(): Promise<RunState> {
		let now = state();
		if (now.halted !== null) return now;

		// A turn read but never ruled into a transition: the engine before us
		// died in that window. Its reading is in the log; resolve it from there.
		for (const id of unresolved(now)) {
			const at = now.steps[id];
			if (at?.at === "ended") { resolve(id, at.sensed); now = state(); }
		}

		for (const id of running(now))
			if (!inFlight.has(id)) {
				const at = now.steps[id];
				if (at?.at === "running") adopt(id, at, (now.spent[id] ?? 1) - 1);
			}

		// A card never ignites: when its edges land it pauses, and stays paused
		// until `rule()` supplies the answer (D10, D11).
		for (const step of flow.steps)
			if (step.kind === "card" && ready(now, step)) {
				crashPoint(`before-card:${step.id}`);
				pause(step.id, ["card"], step.ask);
				now = state();
			}

		for (const step of flow.steps) {
			if (step.kind === "card" || !ready(now, step)) continue;
			if (now.turns >= now.budget && !mutant("past-ceiling")) {
				log.append({ kind: "ceiling", budget: now.budget, turns: now.turns });
				return state();
			}
			crashPoint(`before-ignite:${step.id}`);
			fire(step, crypto.randomUUID(), null);
			if (mutant("double-ignite")) fire(step, crypto.randomUUID(), null);
			now = state();
		}

		if (inFlight.size > 0) await Promise.race([...inFlight.values()]);
		return state();
	}

	return {
		flow, log, venue, state, tick,

		bless(scope = {}) {
			const now = state();
			const ids = scope.steps ?? flow.steps.map((s) => s.id);
			for (const id of ids)
				if (stepById(flow, id) === undefined) return refuse(`blessing names an unknown step ${JSON.stringify(id)}`);

			// Posture legality is a bless-time gate: a pair the substrate cannot
			// grant is refused before anything ignites, never downgraded silently.
			for (const id of ids) {
				const step = stepById(flow, id) as Step;
				if (step.kind === "card") continue;
				const legal = postureLegal(step.model, step.posture);
				if (isRefusal(legal)) return refuse(`step ${id}: ${legal.refusal}`);
			}

			const budget = scope.budget ?? flow.budget;
			if (budget < now.turns)
				return refuse(`budget ${budget} is below the ${now.turns} turns already spent — a ceiling never moves down`);

			if (now.flow === null) log.append({ kind: "blessed", flow, scope: ids, budget });
			else log.append({ kind: "re-blessed", scope: ids, budget });
			return true;
		},

		async run() {
			let now = state();
			while (!terminal(now)) now = await tick();
			return now;
		},

		async rule(stepId, ruling) {
			const now = state();
			const at = now.steps[stepId];
			if (at === undefined) return refuse(`no such step ${JSON.stringify(stepId)}`);
			if (at.at !== "paused") return refuse(`step ${stepId} is ${at.at}, and only a paused step takes a ruling`);
			const step = stepById(flow, stepId);
			if (step === undefined) return refuse(`no such step ${JSON.stringify(stepId)}`);

			if (ruling.do === "resume") {
				if (step.kind === "card") return refuse(`step ${stepId} is a card: it has no session to resume`);
				if (at.sessionId === null) return refuse(`step ${stepId} has no session id — it never ignited`);
				if (now.turns >= now.budget) return refuse(`a resume is a turn, and the ceiling of ${now.budget} is spent`);
				log.append({ kind: "ruled", step: stepId, ruling });
				fire(step, at.sessionId, ruling.turn);
				await inFlight.get(stepId);
				return true;
			}

			const act = () => ruling.do === "land"
				? log.append({ kind: "landed", step: stepId, report: null })
				: log.append({ kind: "killed", step: stepId, reason: ruling.note });
			if (mutant("act-before-append")) { act(); log.append({ kind: "ruled", step: stepId, ruling }); return true; }
			log.append({ kind: "ruled", step: stepId, ruling });
			act();
			return true;
		},

		async halt(reason) {
			const cut = state();
			log.append({ kind: "halted", reason });
			for (const id of running(cut)) {
				const at = cut.steps[id];
				if (at?.at === "running") { try { process.kill(at.pid, "SIGTERM"); } catch { /* already gone */ } }
			}
			await Promise.allSettled([...inFlight.values()]);
			// Clean terminals (invariant 6): whatever the dying turns reported,
			// a step the halt cut is killed by the halt, and the log says so.
			for (const id of running(cut)) {
				const at = state().steps[id];
				if (at?.at !== "landed" && at?.at !== "killed") log.append({ kind: "killed", step: id, reason });
			}
		},
	};
}

const alive = (pid: number): boolean => {
	try { process.kill(pid, 0); return true; } catch { return false; }
};
