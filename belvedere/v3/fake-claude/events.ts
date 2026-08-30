// The grammar's event set as constructors — every required field C4 measured
// (lab/c4/grammar.md §1), nothing invented. Pure: they build objects, they do
// not write them. `run.ts` owns the writing.

import type { Ids } from "./ids.ts";
import type { Clock } from "./clock.ts";

/** Loud in every stream: this is not claude (grammar §1 reports the real one). */
export const VERSION = "2.1.251-fake";

/** The fake has no account config, so it declares a fixed, honest tool set. */
const TOOLS = ["Bash", "Read", "Write", "Edit", "Glob", "Grep", "Task"];

export type Ctx = {
	sessionId: string;
	cwd: string;
	model: string;
	ids: Ids;
	clock: Clock;
};

export function init(c: Ctx, permissionMode: string, model: string) {
	c.clock.advance(0);
	return {
		type: "system", subtype: "init",
		cwd: c.cwd, session_id: c.sessionId, model, permissionMode,
		tools: TOOLS, agents: [], slash_commands: [], terminal_slash_commands: [],
		mcp_servers: [], apiKeySource: "none", claude_code_version: VERSION,
		output_style: "default", skills: [], plugins: [],
		capabilities: ["interrupt_receipt_v1", "interrupt_cancel_queued_v1", "msg_lifecycle_v1"],
		analytics_disabled: false, product_feedback_disabled: false,
		memory_paths: {}, messaging_socket_path: "/tmp/cc-socks/fake.sock",
		fast_mode_state: "off", fast_mode_disabled_reason: "sdk_opt_in_required",
		uuid: c.ids.uuid(),
	};
}

const USAGE = {
	input_tokens: 10, cache_creation_input_tokens: 11018, cache_read_input_tokens: 13615,
	output_tokens: 40, service_tier: "standard", inference_geo: "not_available",
} as const;

export type Block =
	| { type: "thinking"; thinking: string; signature: string }
	| { type: "text"; text: string }
	| { type: "tool_use"; id: string; name: string; input: Record<string, unknown> };

export function assistant(c: Ctx, messageId: string, requestId: string, content: Block[]) {
	return {
		type: "assistant",
		message: {
			model: c.model, id: messageId, type: "message", role: "assistant",
			content, stop_reason: null, stop_sequence: null, stop_details: null,
			usage: USAGE, diagnostics: null, context_management: null,
		},
		parent_tool_use_id: null, session_id: c.sessionId,
		uuid: c.ids.uuid(), timestamp: c.clock.stamp(), request_id: requestId,
	};
}

export function toolResult(c: Ctx, toolUseId: string, content: string, isError: boolean) {
	return {
		type: "user",
		message: { role: "user", content: [{ type: "tool_result", content, is_error: isError, tool_use_id: toolUseId }] },
		parent_tool_use_id: null, session_id: c.sessionId,
		uuid: c.ids.uuid(), timestamp: c.clock.stamp(),
		tool_use_result: isError ? `Error: ${content}` : content,
	};
}

export function permissionDenied(c: Ctx, toolName: string, toolUseId: string, message: string) {
	return {
		type: "system", subtype: "permission_denied",
		tool_name: toolName, tool_use_id: toolUseId, message,
		uuid: c.ids.uuid(), session_id: c.sessionId,
	};
}

export function thinkingTokens(c: Ctx, total: number, delta: number) {
	return {
		type: "system", subtype: "thinking_tokens",
		estimated_tokens: total, estimated_tokens_delta: delta,
		session_id: c.sessionId, uuid: c.ids.uuid(),
	};
}

export function rateLimit(c: Ctx) {
	return {
		type: "rate_limit_event",
		rate_limit_info: {
			status: "allowed", resetsAt: 1788064200, rateLimitType: "five_hour",
			overageStatus: "rejected", overageDisabledReason: "org_level_disabled",
			isUsingOverage: false,
			unifiedWindows: {
				five_hour: { utilization: 0.01, resetsAt: 1788064200 },
				seven_day: { utilization: 0.45, resetsAt: 1788343200 },
			},
		},
		uuid: c.ids.uuid(), session_id: c.sessionId,
	};
}

export function hookStarted(c: Ctx, hookId: string, name: string, event: string) {
	return {
		type: "system", subtype: "hook_started",
		hook_id: hookId, hook_name: name, hook_event: event,
		uuid: c.ids.uuid(), session_id: c.sessionId,
	};
}

export function hookResponse(c: Ctx, hookId: string, name: string, event: string) {
	return {
		type: "system", subtype: "hook_response",
		hook_id: hookId, hook_name: name, hook_event: event,
		output: "", stdout: "", stderr: "", exit_code: 0, outcome: "success",
		uuid: c.ids.uuid(), session_id: c.sessionId,
	};
}

export type Denial = { tool_name: string; tool_use_id: string; tool_input: Record<string, unknown> };

export type ResultShape = {
	text: string;
	numTurns: number;
	denials: Denial[];
	queuedTurnCount: number;
	structuredOutput: Record<string, unknown> | null;
};

export function result(c: Ctx, r: ResultShape) {
	const ms = c.clock.sinceActStart();
	const base: Record<string, unknown> = {
		type: "result", subtype: "success",
		duration_ms: ms, duration_api_ms: Math.max(0, ms - 50), ttft_ms: 1262, ttft_stream_ms: 888,
		time_to_request_ms: 50,
		is_error: false, num_turns: r.numTurns, stop_reason: "end_turn",
		terminal_reason: "completed", api_error_status: null,
		result: r.text, session_id: c.sessionId, uuid: c.ids.uuid(),
		total_cost_usd: 0.0331,
		usage: { ...USAGE, output_tokens_details: { thinking_tokens: 32 } },
		modelUsage: {
			[c.model]: {
				inputTokens: USAGE.input_tokens, outputTokens: USAGE.output_tokens,
				cacheReadInputTokens: USAGE.cache_read_input_tokens,
				cacheCreationInputTokens: USAGE.cache_creation_input_tokens,
				webSearchRequests: 0, costUSD: 0.0331, contextWindow: 200000,
				maxOutputTokens: 32000, canonicalModel: c.model, provider: "firstParty",
				costBasis: "list",
			},
		},
		permission_denials: r.denials,
		queued_turn_count: r.queuedTurnCount,
		subagent_stats: {
			spawned: 0, requested: { background: 0, foreground: 0, unset: 0 },
			started_in_background: 0, max_depth: 0, spawned_by_subagents: 0,
			completed: 0, failed: 0, killed: { parent: 0, user: 0, system: 0 },
			refused: { depth_limit: 0, concurrency_limit: 0, budget: 0 }, by_type: {},
		},
		fast_mode_state: "off", fast_mode_disabled_reason: "sdk_opt_in_required",
	};
	if (r.structuredOutput !== null) base.structured_output = r.structuredOutput;
	return base;
}
