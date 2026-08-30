// The conformance oracle — the one instrument that faces both ways: real C4
// captures must pass it, and so must everything the fake emits. C6's parser
// tests and C7's barrage import it, so the API is deliberately two functions
// and two types, and stays that way.
//
// Every rule below is measured, not assumed: the required-field sets are the
// intersection of the keys C4's 43 captures actually carry.

import { transcriptPath } from "./transcript.ts";

export type Violation = { rule: string; line: number; detail: string };
export type Conformance = { ok: boolean; violations: Violation[] };

const STREAM_TYPES = new Set(["system", "assistant", "user", "rate_limit_event", "result"]);

const REQUIRED: Record<string, readonly string[]> = {
	"system/init": ["agents", "analytics_disabled", "apiKeySource", "capabilities",
		"claude_code_version", "cwd", "fast_mode_disabled_reason", "fast_mode_state",
		"mcp_servers", "memory_paths", "messaging_socket_path", "model", "output_style",
		"permissionMode", "plugins", "product_feedback_disabled", "session_id", "skills",
		"slash_commands", "subtype", "terminal_slash_commands", "tools", "type", "uuid"],
	"system/hook_started": ["hook_event", "hook_id", "hook_name", "session_id", "subtype", "type", "uuid"],
	"system/hook_response": ["exit_code", "hook_event", "hook_id", "hook_name", "outcome",
		"output", "session_id", "stderr", "stdout", "subtype", "type", "uuid"],
	"system/thinking_tokens": ["estimated_tokens", "estimated_tokens_delta", "session_id", "subtype", "type", "uuid"],
	"system/permission_denied": ["message", "session_id", "subtype", "tool_name", "tool_use_id", "type", "uuid"],
	"system/background_tasks_changed": ["session_id", "subtype", "tasks", "type", "uuid"],
	"system/task_started": ["description", "is_backgrounded", "session_id", "subtype", "task_id", "task_type", "tool_use_id", "type", "uuid"],
	"system/task_progress": ["description", "last_tool_name", "session_id", "subagent_type", "subtype", "task_id", "tool_use_id", "type", "usage", "uuid"],
	"system/task_updated": ["patch", "session_id", "subtype", "task_id", "type", "uuid"],
	"system/task_notification": ["output_file", "session_id", "status", "subtype", "summary", "task_id", "tool_use_id", "type", "uuid"],
	"assistant": ["message", "parent_tool_use_id", "request_id", "session_id", "timestamp", "type", "uuid"],
	"user": ["message", "parent_tool_use_id", "session_id", "timestamp", "type", "uuid"],
	"rate_limit_event": ["rate_limit_info", "session_id", "type", "uuid"],
	"result": ["api_error_status", "duration_api_ms", "duration_ms", "fast_mode_disabled_reason",
		"fast_mode_state", "is_error", "modelUsage", "num_turns", "permission_denials",
		"queued_turn_count", "result", "session_id", "stop_reason", "subagent_stats", "subtype",
		"terminal_reason", "time_to_request_ms", "total_cost_usd", "ttft_ms", "ttft_stream_ms",
		"type", "usage", "uuid"],
};

const RESULT_SUBTYPES = new Set(["success", "error_during_execution"]);

type Event = Record<string, unknown>;

export function validateStream(text: string): Conformance {
	const v: Violation[] = [];
	const events: { e: Event; line: number }[] = [];
	const lines = text.split("\n");

	for (const [i, raw] of lines.entries()) {
		const line = i + 1;
		if (raw.trim() === "") {
			if (i !== lines.length - 1) v.push({ rule: "json", line, detail: "blank line inside the stream" });
			continue;
		}
		let e: unknown;
		try { e = JSON.parse(raw); } catch { v.push({ rule: "json", line, detail: "line is not JSON" }); continue; }
		if (typeof e !== "object" || e === null || Array.isArray(e)) {
			v.push({ rule: "json", line, detail: "line is not a JSON object" }); continue;
		}
		events.push({ e: e as Event, line });
	}

	let sessionId: string | null = null;
	let inits = 0, results = 0, seenInit = false;
	const announced = new Set<string>();       // permission_denied tool_use_ids
	const settled = new Set<string>();         // ids a result has carried
	const toolUses = new Set<string>();
	let anyResultAfter = false;

	for (const { e, line } of events) {
		const type = e.type;
		if (typeof type !== "string" || !STREAM_TYPES.has(type)) {
			v.push({ rule: "type", line, detail: `unknown type ${JSON.stringify(type)}` }); continue;
		}
		const subtype = e.subtype;
		const key = type === "system" || type === "result" ? `${type}/${String(subtype)}` : type;
		const required = REQUIRED[type === "result" ? "result" : key];
		if (required === undefined) {
			v.push({ rule: "subtype", line, detail: `unknown ${type} subtype ${JSON.stringify(subtype)}` }); continue;
		}
		if (type === "result" && !RESULT_SUBTYPES.has(String(subtype)))
			v.push({ rule: "subtype", line, detail: `unknown result subtype ${JSON.stringify(subtype)}` });
		for (const k of required)
			if (!(k in e)) v.push({ rule: "fields", line, detail: `${key} is missing ${k}` });

		const sid = e.session_id;
		if (typeof sid === "string") {
			if (sessionId === null) sessionId = sid;
			else if (sessionId !== sid) v.push({ rule: "session", line, detail: `second session id ${sid}` });
		}

		if (type === "system" && subtype === "init") { inits++; seenInit = true; }
		if ((type === "assistant" || type === "user") && !seenInit)
			v.push({ rule: "init-first", line, detail: `${type} before any init` });
		if (type === "system" && subtype === "permission_denied" && typeof e.tool_use_id === "string")
			announced.add(e.tool_use_id);

		if (type === "assistant") for (const b of blocks(e))
			if (b.type === "tool_use" && typeof b.id === "string") toolUses.add(b.id);
		if (type === "user") for (const b of blocks(e))
			if (b.type === "tool_result" && typeof b.tool_use_id === "string" && !toolUses.has(b.tool_use_id))
				v.push({ rule: "tool-result", line, detail: `tool_result for unannounced ${b.tool_use_id}` });

		if (type === "result") {
			results++;
			anyResultAfter = true;
			const denials = e.permission_denials;
			if (!Array.isArray(denials)) v.push({ rule: "denials", line, detail: "permission_denials is not an array" });
			else for (const d of denials) {
				const id = (d as Event | null)?.tool_use_id;
				if (typeof id !== "string") { v.push({ rule: "denials", line, detail: "denial has no tool_use_id" }); continue; }
				settled.add(id);
				if (!announced.has(id)) v.push({ rule: "denials", line, detail: `result claims a denial never announced in-stream: ${id}` });
			}
		}
	}

	if (results > inits)
		v.push({ rule: "turns", line: 0, detail: `${results} results for ${inits} inits — a turn cannot end before it opens` });
	if (anyResultAfter) for (const id of announced)
		if (!settled.has(id)) v.push({ rule: "denials", line: 0, detail: `permission_denied ${id} never reached a result's denials` });

	return { ok: v.length === 0, violations: v };
}

const TRANSCRIPT_TYPES = new Set(["user", "assistant", "attachment", "last-prompt", "mode", "queue-operation", "atis-latch"]);

export type TranscriptExpect = {
	/** Where the file was read from — checked against configDir + cwd + sessionId. */
	path?: string;
	configDir?: string;
	cwd?: string;
	sessionId?: string;
};

export function validateTranscript(text: string, expect: TranscriptExpect = {}): Conformance {
	const v: Violation[] = [];
	const lines = text.split("\n");
	if (text !== "" && lines[lines.length - 1] !== "")
		v.push({ rule: "whole-lines", line: lines.length, detail: "file does not end with a newline — the last line is torn" });

	for (const [i, raw] of lines.entries()) {
		const line = i + 1;
		if (raw === "") continue;
		let row: unknown;
		try { row = JSON.parse(raw); } catch { v.push({ rule: "whole-lines", line, detail: "row is not JSON" }); continue; }
		const r = row as Event;
		if (typeof r.type !== "string" || !TRANSCRIPT_TYPES.has(r.type))
			v.push({ rule: "type", line, detail: `unknown transcript row type ${JSON.stringify(r.type)}` });
		if (expect.sessionId !== undefined && typeof r.sessionId === "string" && r.sessionId !== expect.sessionId)
			v.push({ rule: "session", line, detail: `row carries session ${r.sessionId}` });
	}

	if (expect.path !== undefined && expect.configDir !== undefined && expect.cwd !== undefined && expect.sessionId !== undefined) {
		const want = transcriptPath(expect.configDir, expect.cwd, expect.sessionId);
		if (expect.path !== want) v.push({ rule: "path", line: 0, detail: `transcript at ${expect.path}, grammar §2 says ${want}` });
	}
	return { ok: v.length === 0, violations: v };
}

function blocks(e: Event): Event[] {
	const message = e.message as Event | undefined;
	const content = message?.content;
	return Array.isArray(content) ? (content as Event[]) : [];
}
