// The scenario language: one JSON file scripts one subject, turn by turn.
// Acts are indexed by turn (0 = ignite, n = the nth resume or stdin message);
// each act is a sequence of steps the fake performs in order. Parsed once here
// into trusted shapes — everything downstream may assume it is well-formed.

import { refuse, type Refusal } from "./refusal.ts";

export type ReportState = "done" | "needs_input" | "blocked";

export type Step =
	/** Opens a turn. Required first step of every act; legal again mid-act (F1). */
	| { do: "init"; permissionMode?: string; model?: string }
	| { do: "text"; text: string; thinking?: string }
	| { do: "tool"; name: string; input: Record<string, unknown>; result: string; isError?: boolean }
	/** A refused tool call: permission_denied in-stream + a row in denials[]. */
	| { do: "deny"; name: string; input: Record<string, unknown>; message: string }
	/** The only step that costs real wall time — a window to be killed in. */
	| { do: "delay"; ms: number }
	/** The --json-schema answer; needs-⬡(question) made structural (F5). */
	| { do: "report"; state: ReportState; cause: string; answer?: string }
	/** An extra result mid-act. The act's closing result is always implicit. */
	| { do: "result"; override?: Record<string, unknown> }
	| { do: "die"; exit?: number; signal?: "SIGKILL" | "SIGTERM" }
	/** Stop emitting, stay alive: no result at EOF, and no EOF either. */
	| { do: "hang" };

export type Act = {
	steps: Step[];
	/** Fields merged into this act's closing result. */
	result?: Record<string, unknown>;
};

/** How `goldens.ts` spawns this scenario to record its golden stream. */
export type Golden = {
	mode: "argv" | "stdin";
	/** stdin mode: write turn n+1 only after result n. Unpaced turns coalesce. */
	paced: boolean;
	flags: string[];
	turns: string[];
	seed: number;
	/** The exit code the golden run must produce; null when the harness kills it. */
	expectExit: number | null;
};

export type Scenario = {
	name: string;
	note: string;
	/** Off by default: real claude always emits these, and they drown a golden. */
	noise: { thinkingTokens: boolean; rateLimit: boolean };
	acts: Act[];
	golden: Golden;
};

export function parseScenario(text: string, source: string): Scenario | Refusal {
	let raw: unknown;
	try { raw = JSON.parse(text); } catch (e) { return refuse(`${source}: not JSON — ${e}`); }
	if (typeof raw !== "object" || raw === null) return refuse(`${source}: not an object`);
	const s = raw as Record<string, unknown>;

	if (typeof s.name !== "string") return refuse(`${source}: name must be a string`);
	if (typeof s.note !== "string") return refuse(`${source}: note must be a string`);
	if (!Array.isArray(s.acts) || s.acts.length === 0)
		return refuse(`${source}: acts must be a non-empty array`);

	const acts: Act[] = [];
	for (const [i, a] of s.acts.entries()) {
		const act = parseAct(a, `${source} act ${i}`);
		if ("refusal" in act) return act;
		acts.push(act);
	}

	const golden = parseGolden(s.golden, source);
	if ("refusal" in golden) return golden;

	const noise = (s.noise ?? {}) as Record<string, unknown>;
	return {
		name: s.name, note: s.note, acts, golden,
		noise: { thinkingTokens: noise.thinkingTokens === true, rateLimit: noise.rateLimit === true },
	};
}

function parseAct(raw: unknown, where: string): Act | Refusal {
	if (typeof raw !== "object" || raw === null) return refuse(`${where}: not an object`);
	const a = raw as Record<string, unknown>;
	if (!Array.isArray(a.steps) || a.steps.length === 0)
		return refuse(`${where}: steps must be a non-empty array`);

	const steps: Step[] = [];
	for (const [i, s] of a.steps.entries()) {
		const step = parseStep(s, `${where} step ${i}`);
		if ("refusal" in step) return step;
		steps.push(step);
	}
	if (steps[0]!.do !== "init")
		return refuse(`${where}: every act opens with an init step — a turn without one emits no init`);
	if (a.result !== undefined && (typeof a.result !== "object" || a.result === null))
		return refuse(`${where}: result must be an object of overrides`);
	return { steps, ...(a.result === undefined ? {} : { result: a.result as Record<string, unknown> }) };
}

function parseStep(raw: unknown, where: string): Step | Refusal {
	if (typeof raw !== "object" || raw === null) return refuse(`${where}: not an object`);
	const s = raw as Record<string, unknown>;
	const str = (k: string) => typeof s[k] === "string";
	const obj = (k: string) => typeof s[k] === "object" && s[k] !== null;
	switch (s.do) {
		case "init":
			if (s.permissionMode !== undefined && !str("permissionMode")) return refuse(`${where}: permissionMode must be a string`);
			if (s.model !== undefined && !str("model")) return refuse(`${where}: model must be a string`);
			return { do: "init", ...(str("permissionMode") ? { permissionMode: s.permissionMode as string } : {}),
				...(str("model") ? { model: s.model as string } : {}) };
		case "text":
			if (!str("text")) return refuse(`${where}: text must be a string`);
			return { do: "text", text: s.text as string, ...(str("thinking") ? { thinking: s.thinking as string } : {}) };
		case "tool":
			if (!str("name") || !obj("input") || !str("result")) return refuse(`${where}: tool needs name, input, result`);
			return { do: "tool", name: s.name as string, input: s.input as Record<string, unknown>,
				result: s.result as string, isError: s.isError === true };
		case "deny":
			if (!str("name") || !obj("input") || !str("message")) return refuse(`${where}: deny needs name, input, message`);
			return { do: "deny", name: s.name as string, input: s.input as Record<string, unknown>, message: s.message as string };
		case "delay":
			if (typeof s.ms !== "number" || s.ms < 0) return refuse(`${where}: delay needs a non-negative ms`);
			return { do: "delay", ms: s.ms };
		case "report":
			if (s.state !== "done" && s.state !== "needs_input" && s.state !== "blocked")
				return refuse(`${where}: report state must be done | needs_input | blocked`);
			if (!str("cause")) return refuse(`${where}: report needs a cause`);
			return { do: "report", state: s.state, cause: s.cause as string, ...(str("answer") ? { answer: s.answer as string } : {}) };
		case "result":
			if (s.override !== undefined && !obj("override")) return refuse(`${where}: override must be an object`);
			return { do: "result", ...(obj("override") ? { override: s.override as Record<string, unknown> } : {}) };
		case "die":
			if (s.exit === undefined && s.signal === undefined) return refuse(`${where}: die needs exit or signal`);
			if (s.exit !== undefined && typeof s.exit !== "number") return refuse(`${where}: die exit must be a number`);
			if (s.signal !== undefined && s.signal !== "SIGKILL" && s.signal !== "SIGTERM")
				return refuse(`${where}: die signal must be SIGKILL or SIGTERM`);
			return { do: "die", ...(typeof s.exit === "number" ? { exit: s.exit } : {}),
				...(s.signal === undefined ? {} : { signal: s.signal as "SIGKILL" | "SIGTERM" }) };
		case "hang":
			return { do: "hang" };
		default:
			return refuse(`${where}: unknown step ${JSON.stringify(s.do)}`);
	}
}

function parseGolden(raw: unknown, source: string): Golden | Refusal {
	if (typeof raw !== "object" || raw === null) return refuse(`${source}: golden must be an object`);
	const g = raw as Record<string, unknown>;
	if (g.mode !== "argv" && g.mode !== "stdin") return refuse(`${source}: golden.mode must be argv | stdin`);
	if (!Array.isArray(g.turns) || g.turns.length === 0 || g.turns.some((t) => typeof t !== "string"))
		return refuse(`${source}: golden.turns must be a non-empty array of strings`);
	if (!Array.isArray(g.flags) || g.flags.some((f) => typeof f !== "string"))
		return refuse(`${source}: golden.flags must be an array of strings`);
	if (typeof g.seed !== "number") return refuse(`${source}: golden.seed must be a number`);
	if (g.expectExit !== null && typeof g.expectExit !== "number")
		return refuse(`${source}: golden.expectExit must be a number or null`);
	return {
		mode: g.mode, paced: g.paced !== false, flags: g.flags as string[],
		turns: g.turns as string[], seed: g.seed, expectExit: g.expectExit as number | null,
	};
}
