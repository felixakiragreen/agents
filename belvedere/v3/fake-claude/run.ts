// The interpreter: an act's steps become the grammar's events, in order, on
// stdout and in the transcript. Everything it emits is a function of
// (scenario, seed, argv, act index) — nothing is read from the clock, the
// network, or the machine.

import type { Argv } from "./argv.ts";
import type { Act, Scenario } from "./scenario.ts";
import { ids } from "./ids.ts";
import { clock, SPAN } from "./clock.ts";
import * as ev from "./events.ts";
import type { Ctx, Denial } from "./events.ts";
import type { Transcript } from "./transcript.ts";

export type Sink = { emit(event: object): void };

export type Session = {
	argv: Argv;
	scenario: Scenario;
	sessionId: string;
	cwd: string;
	seed: number;
};

export type Outcome =
	| { kind: "closed" }
	| { kind: "died"; exit: number | null; signal: "SIGKILL" | "SIGTERM" | null }
	| { kind: "hung" };

export type Turn = { text: string; queued: number; first: boolean };

/** With `--json-schema` declared, real claude delivers the step report as a tool
 *  call and closes the turn on its result — so the transcript's last two
 *  conversation rows are this pair, and the report's bytes are the call's input.
 *  Both names measured off `engine/test/fixtures/real-c8-q1-smoke.jsonl`. */
const REPORT_TOOL = "StructuredOutput";
const REPORT_ACK = "Structured output provided successfully";

export async function runAct(s: Session, actIndex: number, turn: Turn, out: Sink, tx: Transcript): Promise<Outcome> {
	const act: Act | undefined = s.scenario.acts[actIndex];
	if (act === undefined)
		throw new Error(`scenario ${s.scenario.name} scripts ${s.scenario.acts.length} acts; turn ${actIndex} has no script`);

	const c: Ctx = {
		sessionId: s.sessionId, cwd: s.cwd, model: s.argv.model,
		ids: ids(s.seed, actIndex), clock: clock(actIndex),
	};
	const rows = transcriptRows(c, tx);
	rows.userTurn(turn.text);

	const hookPair = (name: string, event: string) => {
		const id = c.ids.uuid();
		out.emit(ev.hookStarted(c, id, name, event));
		c.clock.advance(SPAN.hook);
		out.emit(ev.hookResponse(c, id, name, event));
	};
	const hook = (name: string, event: string) => {
		if (s.argv.includeHookEvents) hookPair(name, event);
	};

	// SessionStart leaks unflagged at every process start (C5 F2, ruled 2026-08-29).
	if (turn.first)
		hookPair(s.argv.resume === null ? "SessionStart:startup" : "SessionStart:resume", "SessionStart");
	hook("UserPromptSubmit", "UserPromptSubmit");

	const denials: Denial[] = [];
	let numTurns = 1;
	let lastText = "";
	let thinkingTotal = 0;
	let rateLimitSent = false;
	let report: Record<string, unknown> | null = null;
	let results = 0;

	const emitResult = (override: Record<string, unknown> | undefined) => {
		c.clock.advance(SPAN.result);
		const base = ev.result(c, {
			text: report === null ? lastText : JSON.stringify(report),
			numTurns, denials: [...denials], queuedTurnCount: turn.queued,
			structuredOutput: report,
		});
		out.emit({ ...base, ...(override ?? {}) });
		results++;
	};

	for (const step of act.steps) {
		switch (step.do) {
			case "init": {
				c.clock.advance(SPAN.init);
				out.emit(ev.init(c, step.permissionMode ?? s.argv.permissionMode ?? "default", step.model ?? s.argv.model));
				break;
			}
			case "text": {
				const messageId = c.ids.message(), requestId = c.ids.request();
				if (step.thinking !== undefined) {
					c.clock.advance(SPAN.thinking);
					const block = { type: "thinking", thinking: step.thinking, signature: "fake-thinking-signature" } as const;
					out.emit(ev.assistant(c, messageId, requestId, [block]));
					rows.assistant(c, messageId, [block]);
				}
				if (s.scenario.noise.thinkingTokens) {
					const delta = 5 + step.text.length;
					thinkingTotal += delta;
					out.emit(ev.thinkingTokens(c, thinkingTotal, delta));
				}
				c.clock.advance(SPAN.text);
				const block = { type: "text", text: step.text } as const;
				out.emit(ev.assistant(c, messageId, requestId, [block]));
				rows.assistant(c, messageId, [block]);
				lastText = step.text;
				if (s.scenario.noise.rateLimit && !rateLimitSent) { out.emit(ev.rateLimit(c)); rateLimitSent = true; }
				break;
			}
			case "tool": {
				const toolUseId = c.ids.toolUse();
				const messageId = c.ids.message(), requestId = c.ids.request();
				c.clock.advance(SPAN.toolUse);
				const block = { type: "tool_use", id: toolUseId, name: step.name, input: step.input } as const;
				out.emit(ev.assistant(c, messageId, requestId, [block]));
				rows.assistant(c, messageId, [block]);
				hook(`PreToolUse:${step.name}`, "PreToolUse");
				c.clock.advance(SPAN.toolResult);
				const row = ev.toolResult(c, toolUseId, step.result, step.isError === true);
				out.emit(row);
				rows.toolResult(c, row.message.content);
				hook(`PostToolUse:${step.name}`, "PostToolUse");
				numTurns++;
				break;
			}
			case "deny": {
				const toolUseId = c.ids.toolUse();
				const messageId = c.ids.message(), requestId = c.ids.request();
				c.clock.advance(SPAN.toolUse);
				const block = { type: "tool_use", id: toolUseId, name: step.name, input: step.input } as const;
				out.emit(ev.assistant(c, messageId, requestId, [block]));
				rows.assistant(c, messageId, [block]);
				hook(`PreToolUse:${step.name}`, "PreToolUse");
				c.clock.advance(SPAN.deny);
				out.emit(ev.permissionDenied(c, step.name, toolUseId, step.message));
				const row = ev.toolResult(c, toolUseId, step.message, true);
				out.emit(row);
				rows.toolResult(c, row.message.content);
				denials.push({ tool_name: step.name, tool_use_id: toolUseId, tool_input: step.input });
				numTurns++;
				break;
			}
			case "delay": {
				c.clock.advance(step.ms);
				await new Promise((r) => setTimeout(r, step.ms));
				break;
			}
			case "report": {
				report = { state: step.state, cause: step.cause, ...(step.answer === undefined ? {} : { answer: step.answer }) };
				// The report on disk, and only when the caller asked for one. The
				// stream carries it in the `result` row either way; the transcript
				// carries it as the tool call the schema turns it into, which is
				// what lets a turn whose stream died still be landed (C8 F3, C13).
				if (s.argv.jsonSchema !== null) {
					const toolUseId = c.ids.toolUse();
					const messageId = c.ids.message();
					c.clock.advance(SPAN.toolUse);
					const block = { type: "tool_use", id: toolUseId, name: REPORT_TOOL, input: report } as const;
					// The same pair on stdout, for a scenario that asks for it: real
					// claude streams it too, and a stream poorer than its own
					// transcript is a fake that teaches the wrong lesson (C13 F2).
					// Guarded, so the ids and the clock move for nobody else.
					if (s.scenario.streamsReport) out.emit(ev.assistant(c, messageId, c.ids.request(), [block]));
					rows.assistant(c, messageId, [block]);
					c.clock.advance(SPAN.toolResult);
					if (s.scenario.streamsReport) out.emit(ev.toolResult(c, toolUseId, REPORT_ACK, false));
					rows.toolResult(c, [{ type: "tool_result", tool_use_id: toolUseId, content: REPORT_ACK }]);
				}
				break;
			}
			case "result": {
				emitResult(step.override);
				break;
			}
			case "die": {
				rows.lastPrompt(turn.text);
				return { kind: "died", exit: step.exit ?? null, signal: step.signal ?? null };
			}
			case "hang": {
				return { kind: "hung" };
			}
		}
	}

	hook("Stop", "Stop");
	emitResult(act.result);
	rows.lastPrompt(turn.text);
	return { kind: "closed" };
}

/**
 * The transcript's own rows. They share the stream's ids and clock but not its
 * shape: the stream is the parent's view, the transcript is the truth on disk.
 * parentUuid chains within an act and opens null — the engine persists the
 * session id and nothing else (grammar §2), so the chain is decoration.
 */
function transcriptRows(c: Ctx, tx: Transcript) {
	let parent: string | null = null;
	const envelope = (uuid: string) => {
		const row = {
			uuid, parentUuid: parent, sessionId: c.sessionId, cwd: c.cwd,
			version: ev.VERSION, gitBranch: "", userType: "external" as const,
			isSidechain: false, timestamp: c.clock.stamp(),
		};
		parent = uuid;
		return row;
	};
	return {
		userTurn(text: string) {
			tx.append({ type: "user", ...envelope(c.ids.uuid()), message: { role: "user", content: text } });
		},
		assistant(ctx: Ctx, messageId: string, content: readonly object[]) {
			tx.append({
				type: "assistant", ...envelope(ctx.ids.uuid()),
				message: { model: ctx.model, id: messageId, type: "message", role: "assistant", content },
			});
		},
		toolResult(ctx: Ctx, content: readonly object[]) {
			tx.append({ type: "user", ...envelope(ctx.ids.uuid()), message: { role: "user", content } });
		},
		lastPrompt(text: string) {
			tx.append({ type: "last-prompt", lastPrompt: text.replace(/\s+/g, " "), leafUuid: parent, sessionId: c.sessionId });
		},
	};
}
