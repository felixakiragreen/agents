// Arm B's driver: one process, one JSON user message per stdin line.
//
// Turn 0 takes the first line alone; every act after it takes everything
// queued. A caller that paces on `result` therefore hands over one line at a
// time and keeps its turn boundaries; a caller that writes all its turns and
// closes gets them merged into a single turn — bytes whole, boundaries
// destroyed (grammar §3's trap, reproduced).

import { refuse, isRefusal, type Refusal } from "./refusal.ts";
import { runAct, type Outcome, type Session, type Sink, type Turn } from "./run.ts";
import type { Transcript } from "./transcript.ts";

export async function driveStdin(s: Session, firstAct: number, sink: Sink, tx: Transcript): Promise<Outcome | Refusal> {
	const feed = lineFeed();
	const first = await feed.next();
	if (isRefusal(first)) return first;
	if (first === null) return refuse("--input-format stream-json got no turns on stdin");

	let act = firstAct;
	let turn: Turn = { text: first, queued: 0 };
	while (true) {
		const outcome = await runAct(s, act, turn, sink, tx);
		if (outcome.kind !== "closed") return outcome;
		const batch = await feed.drain();
		if (isRefusal(batch)) return batch;
		if (batch.length === 0) return { kind: "closed" };
		act++;
		turn = { text: batch.join("\n"), queued: batch.length - 1 };
	}
}

type Feed = {
	next(): Promise<string | null | Refusal>;
	drain(): Promise<string[] | Refusal>;
};

/** A line queue over stdin: `next` waits for one, `drain` takes all pending. */
function lineFeed(): Feed {
	const queue: string[] = [];
	let buf = "";
	let closed = false;
	let bad: Refusal | null = null;
	let wake: (() => void) | null = null;

	const push = (line: string) => {
		if (!line.trim() || bad !== null) return;
		let msg: { message?: { content?: unknown } };
		try { msg = JSON.parse(line) as typeof msg; }
		catch { bad = refuse(`stdin line is not JSON: ${line.slice(0, 80)}`); return; }
		const text = textOf(msg.message?.content);
		if (isRefusal(text)) { bad = text; return; }
		queue.push(text);
	};

	// Named, not an immediately-invoked expression: TS narrows variables captured
	// by an IIFE to their value at the call site, which makes `wake` unreachable.
	async function pump() {
		for await (const chunk of Bun.stdin.stream()) {
			buf += new TextDecoder().decode(chunk);
			let i;
			while ((i = buf.indexOf("\n")) >= 0) { push(buf.slice(0, i)); buf = buf.slice(i + 1); }
			wake?.();
		}
		push(buf);
		closed = true;
		wake?.();
	}
	void pump();

	const settle = async () => {
		while (queue.length === 0 && !closed && bad === null)
			await new Promise<void>((r) => { wake = r; });
		wake = null;
	};
	return {
		async next() { await settle(); return bad ?? queue.shift() ?? null; },
		async drain() { await settle(); return bad ?? queue.splice(0); },
	};
}

function textOf(content: unknown): string | Refusal {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return refuse("stdin message carries no user content");
	return content
		.map((b) => (typeof b === "object" && b !== null && "text" in b ? String((b as { text: unknown }).text) : ""))
		.join("");
}
