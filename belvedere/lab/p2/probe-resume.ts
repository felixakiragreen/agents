/**
 * P2 probe: the resume variant through the same recipe.
 *
 *   bun probe-resume.ts <account> <stamp> <color> <session-uuid>
 *
 * Proves `claude --resume <uuid>` spawns through the identical path — the only
 * delta is two extra argv tokens — and that the resumed session keeps its
 * original transcript while the new summons lands as a further user turn.
 */

import { spawn, type Account } from "./spawn.ts";

const [account, name, color, uuid] = process.argv.slice(2);
if (!account || !name || !color || !uuid) {
	console.error("usage: bun probe-resume.ts <account> <stamp> <color> <uuid>");
	process.exit(2);
}

const result = await spawn({
	account: account as Account,
	name,
	cwd: `${process.env.HOME}/code/agents`,
	model: "haiku",
	effort: "medium",
	color,
	resume: uuid,
	summons: "P2_RESUME_MARKER. Reply with exactly one line: RESUMED=yes. Use no tools.",
	summonsDir: process.env.P2_SUMMONS_DIR ?? "/tmp",
});

console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exit(1);
