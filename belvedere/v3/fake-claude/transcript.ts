// The transcript on disk — the truth the engine re-derives state from when the
// stream it was reading has died with its reader (grammar §6). Rows go down one
// appendFileSync at a time, so a cut at any moment leaves whole lines and never
// a torn one (F7's shape, by construction).

import { appendFileSync, mkdirSync, readFileSync, existsSync } from "node:fs";
import { dirname } from "node:path";

/** Grammar §2: every non-alphanumeric in the cwd becomes a dash. */
export const slugFor = (cwd: string): string => cwd.replace(/[^a-zA-Z0-9]/g, "-");

export const transcriptPath = (configDir: string, cwd: string, sessionId: string): string =>
	`${configDir}/projects/${slugFor(cwd)}/${sessionId}.jsonl`;

export type Transcript = { append(row: object): void; path: string };

export function transcript(path: string): Transcript {
	mkdirSync(dirname(path), { recursive: true });
	return {
		path,
		append(row) { appendFileSync(path, JSON.stringify(row) + "\n"); },
	};
}

/**
 * How many turns this session has already taken — the act index a resume picks
 * up at. A turn's user row carries its text as a string; tool results carry an
 * array, so counting strings counts turns.
 */
export function priorTurns(path: string): number {
	if (!existsSync(path)) return 0;
	let n = 0;
	for (const line of readFileSync(path, "utf8").split("\n")) {
		if (!line) continue;
		let row: { type?: string; message?: { content?: unknown } };
		try { row = JSON.parse(line); } catch { continue; }
		if (row.type === "user" && typeof row.message?.content === "string") n++;
	}
	return n;
}
