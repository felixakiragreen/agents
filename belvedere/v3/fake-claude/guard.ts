// The sandbox guard. The fake writes transcripts, and a transcript written into
// a real account dir would poison the city's own session store. So the door is
// shut here, loudly, before a single byte is emitted: no config dir, no run;
// a real account dir, no run. Wrong code looks wrong and dies at the door.

import { basename, dirname, isAbsolute, resolve } from "node:path";
import { homedir } from "node:os";
import { refuse, type Refusal } from "./refusal.ts";

/** The fake's write root, or the reason it refuses to have one. */
export function writeRoot(env: Record<string, string | undefined>): string | Refusal {
	const declared = env.CLAUDE_CONFIG_DIR;
	if (declared === undefined || declared === "")
		return refuse("CLAUDE_CONFIG_DIR is unset — the fake has no sandbox to write into");
	if (!isAbsolute(declared))
		return refuse(`CLAUDE_CONFIG_DIR must be absolute (got ${declared})`);

	const root = resolve(declared);
	const home = resolve(env.HOME ?? homedir());
	if (dirname(root) === home && basename(root).startsWith(".claude"))
		return refuse(`CLAUDE_CONFIG_DIR ${root} is a real account dir — the fake never writes into one`);
	return root;
}
