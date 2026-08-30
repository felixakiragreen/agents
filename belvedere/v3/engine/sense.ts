// The stream sensor — grammar §10's parse rules as one fold over the event
// lines a subject emits, and the verdict that turns what was sensed into the
// step's outcome.
//
// The danger this module exists to defuse: headless never stalls on permission,
// it auto-denies and reports success (C4 F6). `exit 0` + `subtype:"success"` +
// `is_error:false` is emitted by turns that did nothing at all. So nothing here
// reads success; it reads denials, the granted posture, and the declared report.

import type { Posture } from "./flow.ts";

export type ReportState = "done" | "needs_input" | "blocked";
export type Report = { state: ReportState; cause: string; answer?: string };

/** The step report, declared on every fired step as `--json-schema`. Without it
 *  needs-⬡(question) is byte-identical to a finished turn (grammar §5). */
export const REPORT_SCHEMA = JSON.stringify({
	type: "object",
	properties: {
		state: { type: "string", enum: ["done", "needs_input", "blocked"] },
		cause: { type: "string" },
		answer: { type: "string" },
	},
	required: ["state", "cause"],
});

export type Denial = { tool: string; toolUseId: string };

/** Everything one turn of one subject was observed to be. */
export type Reading = {
	sessionId: string | null;
	/** What the flow asked for, and what `init` said took effect. */
	asked: Posture;
	granted: string | null;
	results: number;
	denials: Denial[];
	report: Report | null;
	/** The last result's `is_error` — the only field separating it from success. */
	errored: boolean;
	/** No `result` at EOF (parse rule 3). */
	dead: boolean;
	timedOut: boolean;
	exit: number | null;
	signal: string | null;
	text: string;
	unparsed: number;
};

export function emptyReading(asked: Posture): Reading {
	return {
		sessionId: null, asked, granted: null, results: 0, denials: [], report: null,
		errored: false, dead: true, timedOut: false, exit: null, signal: null, text: "", unparsed: 0,
	};
}

/**
 * Fold one stream line into the reading. Called per line as the stream arrives,
 * so a turn that dies mid-flight still leaves everything read up to the cut.
 * The last `result` wins (parse rule 1) — a subagent's completion re-invokes the
 * parent and a second `result` lands (C4 F1), so "the process exited" is never
 * the turn boundary.
 */
export function senseLine(r: Reading, line: string): void {
	if (line.trim() === "") return;
	let e: Record<string, unknown>;
	try {
		const parsed: unknown = JSON.parse(line);
		if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) { r.unparsed++; return; }
		e = parsed as Record<string, unknown>;
	} catch { r.unparsed++; return; }

	if (r.sessionId === null && typeof e.session_id === "string") r.sessionId = e.session_id;

	// Parse rule 4: the first init reports the posture that actually took effect.
	if (e.type === "system" && e.subtype === "init" && r.granted === null && typeof e.permissionMode === "string")
		r.granted = e.permissionMode;

	if (e.type !== "result") return;
	r.results++;
	r.dead = false;
	r.errored = e.is_error === true;
	r.text = typeof e.result === "string" ? e.result : "";
	// Parse rule 2: the truth signal is permission_denials[], never the subtype.
	r.denials = Array.isArray(e.permission_denials)
		? e.permission_denials.flatMap((d) => {
			const row = d as Record<string, unknown> | null;
			const tool = row?.tool_name, id = row?.tool_use_id;
			return typeof tool === "string" && typeof id === "string" ? [{ tool, toolUseId: id }] : [];
		})
		: [];
	r.report = parseReport(e.structured_output) ?? parseReport(r.text);
}

/** The report rides `structured_output`, and `result.result` carries the same
 *  JSON as text (captures/q3-schema-done). Either shape parses; neither is guessed. */
export function parseReport(raw: unknown): Report | null {
	let v: unknown = raw;
	if (typeof v === "string") {
		try { v = JSON.parse(v); } catch { return null; }
	}
	if (typeof v !== "object" || v === null) return null;
	const o = v as Record<string, unknown>;
	if (o.state !== "done" && o.state !== "needs_input" && o.state !== "blocked") return null;
	if (typeof o.cause !== "string") return null;
	return { state: o.state, cause: o.cause, ...(typeof o.answer === "string" ? { answer: o.answer } : {}) };
}

/** Every reason a step may fail to land. A pause names all of them, not one:
 *  a subject that was granted the wrong posture AND was denied a tool is two
 *  findings, and reporting one hides the other. */
export type Cause =
	| "timeout" | "dead" | "needs-⬡ permission" | "posture" | "error"
	| "needs-⬡ question" | "blocked" | "no report" | "card" | "halted";

/** Most-load-bearing first: the primary cause is what a board row shows. The
 *  denial outranks the posture because the silent success is the hazard that
 *  loses work; both are always carried. */
const SEVERITY: readonly Cause[] = [
	"timeout", "dead", "needs-⬡ permission", "posture", "error",
	"blocked", "needs-⬡ question", "no report", "card", "halted",
];

export type Verdict =
	| { land: true; report: Report }
	| { land: false; causes: Cause[]; detail: string };

export function verdict(r: Reading): Verdict {
	const causes: Cause[] = [];
	const detail: string[] = [];

	if (r.timedOut) { causes.push("timeout"); detail.push("the turn passed its timeout and was SIGTERMed"); }
	if (r.dead) { causes.push("dead"); detail.push(`no result at EOF (exit ${r.exit}, signal ${r.signal})`); }
	if (r.denials.length > 0) {
		causes.push("needs-⬡ permission");
		detail.push(`permission denied: ${r.denials.map((d) => d.tool).join(", ")}`);
	}
	if (!r.dead && r.granted !== r.asked) {
		causes.push("posture");
		detail.push(`asked ${r.asked}, init granted ${r.granted ?? "nothing"}`);
	}
	if (r.errored) { causes.push("error"); detail.push(`the result carries is_error: ${r.text.slice(0, 120)}`); }
	if (!r.dead && r.report === null) { causes.push("no report"); detail.push("the result carries no parseable step report"); }
	if (r.report?.state === "needs_input") { causes.push("needs-⬡ question"); detail.push(r.report.cause); }
	if (r.report?.state === "blocked") { causes.push("blocked"); detail.push(r.report.cause); }

	if (causes.length === 0 && r.report !== null && r.report.state === "done")
		return { land: true, report: r.report };
	if (causes.length === 0) causes.push("no report");
	return { land: false, causes: rank(causes), detail: detail.join("; ") };
}

const rank = (causes: readonly Cause[]): Cause[] =>
	[...causes].sort((a, b) => SEVERITY.indexOf(a) - SEVERITY.indexOf(b));
