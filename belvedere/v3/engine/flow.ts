// The flow file — the engine's own declared shape (D7), parsed once at the
// boundary into trusted types. A step is one of three kinds and the kinds do
// not share a field list: a card has no subject because a card never ignites,
// and that is spelled in the type rather than checked at every use.

import { refuse, type Refusal } from "./refusal.ts";

/** The postures a step may declare. `manual` / `dontAsk` / `plan` do no work
 *  headless (grammar §4), so they are not legal on an unattended step. */
export const POSTURES = ["auto", "acceptEdits", "bypassPermissions"] as const;
export type Posture = (typeof POSTURES)[number];

/** A scripted stand-in: which scenario, and the seed its id stream runs on. */
export type FakeSubject = { scenario: string; seed: number };

/** The real binary. It declares nothing — the account rides the venue's config
 *  dir and the model/effort/posture ride the step — so the arm is an empty
 *  object rather than a bag of fields nothing reads. */
export type RealSubject = Record<string, never>;

/** What the spawn adapter is handed. The adapter is the only code that cares
 *  which arm it is (the cornerstone's D4 echo). */
export type Subject = { fake: FakeSubject } | { real: RealSubject };

/** What the log records a subject as. `real` carries no scenario, so the arm is
 *  named rather than left to a field that would be empty half the time. */
export const subjectName = (s: Subject): string => ("fake" in s ? `fake:${s.fake.scenario}` : "real");

/** The scenario a fake subject runs, or null for a real one — how everything
 *  above the adapter asks, instead of reaching into the union. */
export const fakeScenario = (s: Subject): string | null => ("fake" in s ? s.fake.scenario : null);

export const DEFAULT_TIMEOUT_MS = 120_000;

/** A step id names that step's stream files on disk (C6 F2's ruled fix), so it
 *  is a file name or it is refused — never a slug, which would collide two ids
 *  into one stream. */
const STEP_ID = /^[A-Za-z0-9][A-Za-z0-9._-]*$/;

export type Fired = {
	/** `task`: work. `gate`: work whose report rules the verdict for what follows. */
	kind: "task" | "gate";
	id: string;
	depends: string[];
	/**
	 * The step's own words — the first user turn of its subject, byte-exact
	 * (P2's law: the summons travels as argv). A fake subject ignores it and
	 * takes its script from the scenario, so until C8 nothing needed one and the
	 * default was all there was: `<flow id>/<step id>`, which is an address, not
	 * an instruction. A real subject can do nothing with an address, so a step
	 * that means to say something says it here.
	 */
	prompt: string;
	subject: Subject;
	model: string;
	effort: string;
	posture: Posture;
	timeoutMs: number;
};

/** Felix's own step: no subject, never ignited, pauses until `rule()` answers. */
export type Card = { kind: "card"; id: string; depends: string[]; ask: string };

export type Step = Fired | Card;

export type Flow = {
	id: string;
	name: string;
	/** The ignition ceiling (D73): subject turns, never exceeded without a re-blessing. */
	budget: number;
	steps: Step[];
};

export function parseFlow(text: string, source: string): Flow | Refusal {
	let raw: unknown;
	try { raw = JSON.parse(text); } catch (e) { return refuse(`${source}: not JSON — ${e}`); }
	if (typeof raw !== "object" || raw === null) return refuse(`${source}: not an object`);
	const f = raw as Record<string, unknown>;

	if (typeof f.id !== "string" || f.id === "") return refuse(`${source}: id must be a non-empty string`);
	if (typeof f.name !== "string") return refuse(`${source}: name must be a string`);
	if (typeof f.budget !== "number" || !Number.isInteger(f.budget) || f.budget < 1)
		return refuse(`${source}: budget must be a positive integer — every flow carries its ceiling (D73)`);
	if (!Array.isArray(f.steps) || f.steps.length === 0)
		return refuse(`${source}: steps must be a non-empty array`);

	const steps: Step[] = [];
	const seen = new Set<string>();
	for (const [i, s] of f.steps.entries()) {
		const step = parseStep(s, `${source} step ${i}`, f.id);
		if ("refusal" in step) return step;
		if (seen.has(step.id)) return refuse(`${source}: two steps share the id ${JSON.stringify(step.id)}`);
		seen.add(step.id);
		steps.push(step);
	}
	for (const step of steps)
		for (const dep of step.depends) {
			if (!seen.has(dep)) return refuse(`${source}: step ${step.id} depends on unknown step ${JSON.stringify(dep)}`);
			if (dep === step.id) return refuse(`${source}: step ${step.id} depends on itself`);
		}
	const cycle = firstCycle(steps);
	if (cycle !== null) return refuse(`${source}: the depends graph has a cycle — ${cycle.join(" -> ")}`);

	return { id: f.id, name: f.name, budget: f.budget, steps };
}

function parseStep(raw: unknown, where: string, flowId: string): Step | Refusal {
	if (typeof raw !== "object" || raw === null) return refuse(`${where}: not an object`);
	const s = raw as Record<string, unknown>;
	if (typeof s.id !== "string" || s.id === "") return refuse(`${where}: id must be a non-empty string`);
	if (!STEP_ID.test(s.id))
		return refuse(`${where}: step id ${JSON.stringify(s.id)} is not a file name, and it names the step's stream files — ${STEP_ID}`);
	if (!Array.isArray(s.depends) || s.depends.some((d) => typeof d !== "string"))
		return refuse(`${where}: depends must be an array of step ids`);
	const depends = s.depends as string[];

	if (s.kind === "card") {
		if (typeof s.ask !== "string" || s.ask === "")
			return refuse(`${where}: a card must say what it asks — a pause with no cause is a silent stall (invariant 5)`);
		if (s.subject !== undefined) return refuse(`${where}: a card has no subject — it never ignites`);
		return { kind: "card", id: s.id, depends, ask: s.ask };
	}
	if (s.kind !== "task" && s.kind !== "gate")
		return refuse(`${where}: kind must be task | gate | card (got ${JSON.stringify(s.kind)})`);

	const subject = parseSubject(s.subject, where);
	if ("refusal" in subject) return subject;
	if (typeof s.model !== "string" || s.model === "") return refuse(`${where}: model must be a non-empty string`);
	if (typeof s.effort !== "string" || s.effort === "") return refuse(`${where}: effort must be a non-empty string`);
	if (!(POSTURES as readonly unknown[]).includes(s.posture))
		return refuse(`${where}: posture must be one of ${POSTURES.join(" | ")} (got ${JSON.stringify(s.posture)})`);
	if (s.timeout_ms !== undefined && (typeof s.timeout_ms !== "number" || s.timeout_ms <= 0))
		return refuse(`${where}: timeout_ms must be a positive number of milliseconds`);
	if (s.prompt !== undefined && (typeof s.prompt !== "string" || s.prompt === ""))
		return refuse(`${where}: prompt must be a non-empty string — a step that declares one means to say something`);

	return {
		kind: s.kind, id: s.id, depends, subject,
		prompt: typeof s.prompt === "string" ? s.prompt : `${flowId}/${s.id}`,
		model: s.model, effort: s.effort, posture: s.posture as Posture,
		timeoutMs: typeof s.timeout_ms === "number" ? s.timeout_ms : DEFAULT_TIMEOUT_MS,
	};
}

/** Exactly one arm, and every field in it named. A subject that is neither, or
 *  both, or carries a field the arm does not declare, is refused rather than
 *  half-understood — the spawn adapter is handed a trusted shape or nothing. */
function parseSubject(raw: unknown, where: string): Subject | Refusal {
	if (typeof raw !== "object" || raw === null) return refuse(`${where}: subject must be an object`);
	const s = raw as Record<string, unknown>;
	const arms = ["fake", "real"].filter((a) => s[a] !== undefined);
	if (arms.length !== 1)
		return refuse(`${where}: a subject is exactly one of {fake: {scenario, seed}} | {real: {}} (got ${arms.length === 0 ? "neither" : arms.join(" and ")})`);

	if (s.real !== undefined) {
		if (typeof s.real !== "object" || s.real === null || Array.isArray(s.real))
			return refuse(`${where}: real must be an object`);
		const keys = Object.keys(s.real);
		if (keys.length > 0)
			return refuse(`${where}: a real subject declares nothing — the account rides the venue and the model rides the step (got ${keys.join(", ")})`);
		return { real: {} };
	}

	if (typeof s.fake !== "object" || s.fake === null || Array.isArray(s.fake))
		return refuse(`${where}: fake must be an object of {scenario, seed}`);
	const k = s.fake as Record<string, unknown>;
	if (typeof k.scenario !== "string" || k.scenario === "") return refuse(`${where}: fake.scenario must be a scenario name`);
	if (typeof k.seed !== "number" || !Number.isInteger(k.seed)) return refuse(`${where}: fake.seed must be an integer`);
	return { fake: { scenario: k.scenario, seed: k.seed } };
}

/** Depth-first, colouring as it goes: the first back edge names the cycle. */
function firstCycle(steps: readonly Step[]): string[] | null {
	const deps = new Map(steps.map((s) => [s.id, s.depends]));
	const state = new Map<string, "open" | "closed">();
	const stack: string[] = [];

	const walk = (id: string): string[] | null => {
		const mark = state.get(id);
		if (mark === "closed") return null;
		if (mark === "open") return [...stack.slice(stack.indexOf(id)), id];
		state.set(id, "open");
		stack.push(id);
		for (const dep of deps.get(id) ?? []) {
			const found = walk(dep);
			if (found !== null) return found;
		}
		stack.pop();
		state.set(id, "closed");
		return null;
	};

	for (const s of steps) {
		const found = walk(s.id);
		if (found !== null) return found;
	}
	return null;
}

export const stepById = (flow: Flow, id: string): Step | undefined => flow.steps.find((s) => s.id === id);
