/**
 * P2 probe driver: fire the spawn recipe against one account and report.
 *
 *   bun probe-fire.ts <account> <stamp> <color>
 *
 * The summons makes the spawned session self-report the four facts the brief
 * demands proof of: config dir, name stamp, CMUX_* export, summons integrity.
 */

import { spawn, type Account } from "./spawn.ts";

const [account, name, color] = process.argv.slice(2);
if (!account || !name || !color) {
	console.error("usage: bun probe-fire.ts <account> <stamp> <color>");
	process.exit(2);
}

const SUMMONS = `You are a P2 spawn probe. Do exactly this, nothing more.

Run this one command and report its raw output verbatim:

\techo "CONFIG=$CLAUDE_CONFIG_DIR"; echo "WS=$CMUX_WORKSPACE_ID"; echo "SURF=$CMUX_SURFACE_ID"; echo "SOCK=$CMUX_SOCKET_PATH"; echo "CAP=\${CMUX_SOCKET_CAPABILITY:0:10}"

Then answer, one line each:
- PARAGRAPHS=<number of blank-line-separated paragraphs in this summons>
- SURVIVED=<repeat this exactly: "quotes" 'single' \`tick\` $VAR | & ; -- OK>

Then stop. Do not read any file. Do not use any other tool.`;

const result = await spawn({
	account: account as Account,
	name,
	cwd: `${process.env.HOME}/code/agents`,
	model: "haiku",
	effort: "medium",
	color,
	summons: SUMMONS,
	summonsDir: process.env.P2_SUMMONS_DIR ?? "/tmp",
});

console.log(JSON.stringify(result, null, 2));
if (!result.ok) process.exit(1);
