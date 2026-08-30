// The stream, rendered for a human.
//
// One turn's stdout is a jsonl file the subject owns (C6 F2's durable stream),
// and it is the most direct look at what a session did that exists: what it
// said, what it reached for, what was refused, what it reported, what it cost.
// This file turns those rows into lines. It reads; it never judges — the
// verdict at the foot is `sense.ts`'s own, so the console and the engine can
// never disagree about a turn in front of Felix.
//
// One row is rendered with more care than the rest. `rate_limit_event` fires on
// **every** turn carrying `status: "allowed"` — its presence means nothing, and
// reading it as an alarm is the misreading C9 F1 caught in a kill criterion.
// What it does carry is the only in-band quota gauge the substrate gives
// (`unifiedWindows.*.utilization`, 0..1), which is the standing answer to
// "sessions cannot see /usage". So: the utilization always, the word ALARM only
// when the status is something other than allowed.

import { emptyReading, senseLine, verdict, type Reading } from "../engine/sense.ts";

/** One stream row as one line, or null for a row worth nothing to a reader. */
export function renderRow(line: string): string | null {
	let e: Record<string, unknown>;
	try {
		const parsed: unknown = JSON.parse(line);
		if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return `  ??       unparseable: ${clip(line, 100)}`;
		e = parsed as Record<string, unknown>;
	} catch { return `  ??       unparseable: ${clip(line, 100)}`; }

	switch (e.type) {
		case "system": return renderSystem(e);
		case "assistant": return renderMessage(e, "claude");
		case "user": return renderMessage(e, "tool");
		case "rate_limit_event": return renderQuota(e);
		case "result": return renderResult(e);
		default: return null;
	}
}

function renderSystem(e: Record<string, unknown>): string | null {
	if (e.subtype !== "init") return null;
	return `  init     posture ${String(e.permissionMode)} · model ${String(e.model)} · session ${String(e.session_id)}`;
}

function renderMessage(e: Record<string, unknown>, who: string): string | null {
	const message = e.message as Record<string, unknown> | undefined;
	const content = message?.content;
	if (typeof content === "string") return content === "" ? null : `  ${pad(who)} ${clip(content, 300)}`;
	if (!Array.isArray(content)) return null;

	const lines: string[] = [];
	for (const raw of content as Record<string, unknown>[]) {
		if (raw.type === "text" && String(raw.text ?? "") !== "") lines.push(`  ${pad(who)} ${clip(String(raw.text), 300)}`);
		if (raw.type === "thinking") lines.push(`  ${pad("thinking")} ${clip(String(raw.thinking ?? ""), 120)}`);
		if (raw.type === "tool_use") lines.push(`  ${pad("tool")} ${String(raw.name)} ${clip(JSON.stringify(raw.input ?? {}), 160)}`);
		if (raw.type === "tool_result")
			lines.push(`  ${pad(raw.is_error === true ? "REFUSED" : "output")} ${clip(text(raw.content), 160)}`);
	}
	return lines.length === 0 ? null : lines.join("\n");
}

/** The gauge, and the alarm that is NOT its presence (C9 F1). */
function renderQuota(e: Record<string, unknown>): string {
	const info = e.rate_limit_info as Record<string, unknown> | undefined;
	const windows = info?.unifiedWindows as Record<string, { utilization?: unknown }> | undefined;
	const percent = (name: string): string => {
		const u = windows?.[name]?.utilization;
		return typeof u === "number" ? `${(u * 100).toFixed(0)}%` : "?";
	};
	const status = String(info?.status ?? "?");
	return `  quota    five-hour ${percent("five_hour")} · seven-day ${percent("seven_day")}`
		+ (status === "allowed" ? "" : `  ALARM: status ${status}`);
}

function renderResult(e: Record<string, unknown>): string {
	const denials = Array.isArray(e.permission_denials) ? e.permission_denials.length : 0;
	const cost = typeof e.total_cost_usd === "number" ? ` · $${e.total_cost_usd.toFixed(4)}` : "";
	return `  result   ${String(e.subtype)} · is_error ${String(e.is_error)} · denials ${denials}${cost}`;
}

/**
 * A whole stream file, plus the engine's own verdict on it. The verdict is the
 * point of the foot: `read` exists so a human can see why a board row says what
 * it says, and a rendering that computed its own answer would be a second
 * opinion nobody asked for.
 */
export function renderStream(text: string, asked: Reading["asked"]): string {
	const lines: string[] = [];
	const reading = emptyReading(asked);
	for (const line of text.split("\n")) {
		if (line === "") continue;
		senseLine(reading, line);
		const rendered = renderRow(line);
		if (rendered !== null) lines.push(rendered);
	}
	lines.push("", renderVerdict(reading));
	return lines.join("\n");
}

export function renderVerdict(reading: Reading): string {
	const v = verdict(reading);
	if (v.land) return `  verdict  LANDS · report ${v.report.state}: ${v.report.cause}`
		+ (v.report.answer === undefined ? "" : `\n  answer   ${v.report.answer}`);
	return `  verdict  PAUSES ‹${v.causes.join(", ")}›\n  detail   ${v.detail}`;
}

const pad = (word: string): string => word.padEnd(8);
const clip = (s: string, n: number): string =>
	(s.length <= n ? s : `${s.slice(0, n)}…`).split("\n").join(" ⏎ ");

const text = (content: unknown): string => {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return JSON.stringify(content ?? "");
	return (content as Record<string, unknown>[]).map((b) => String(b.text ?? "")).join(" ");
};
