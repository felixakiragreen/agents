// The dialect: exactly the claude argv surface the v3 engine uses (C5 spec),
// and nothing else. An unknown flag is a refusal, not a shrug — the engine's
// argv stays dialect-pure or the fake stops proving anything about it.

import { refuse, type Refusal } from "./refusal.ts";

export const PERMISSION_MODES = [
	"acceptEdits", "auto", "bypassPermissions", "manual", "dontAsk", "plan",
] as const;
export type PermissionMode = (typeof PERMISSION_MODES)[number];

/** Short names real claude resolves; anything else passes through verbatim. */
const MODEL_IDS: Record<string, string> = {
	haiku: "claude-haiku-4-5-20251001",
	sonnet: "claude-sonnet-5",
	opus: "claude-opus-5",
	fable: "claude-fable-5",
};

/** Flags that take a value. The set is closed — see the module comment. */
const VALUED = new Set([
	"-p", "--print", "--session-id", "--resume", "--output-format", "--input-format",
	"--permission-mode", "--model", "--json-schema",
]);
const BARE = new Set(["--verbose", "--include-hook-events"]);

export type Argv = {
	/** The first turn's text. Null in stdin mode, where turns arrive on stdin. */
	prompt: string | null;
	sessionId: string | null;
	resume: string | null;
	inputFormat: "argv" | "stream-json";
	includeHookEvents: boolean;
	/** What the engine asked for; what init reports is the scenario's to say. */
	permissionMode: PermissionMode | null;
	model: string;
	jsonSchema: string | null;
};

export function parseArgv(args: readonly string[]): Argv | Refusal {
	let print = false, prompt: string | null = null;
	let sessionId: string | null = null, resume: string | null = null;
	let outputFormat: string | null = null, inputFormat: string | null = null;
	let verbose = false, includeHookEvents = false;
	let permissionMode: string | null = null;
	let model: string | null = null, jsonSchema: string | null = null;

	for (let i = 0; i < args.length; i++) {
		const flag = args[i]!;
		if (!VALUED.has(flag) && !BARE.has(flag))
			return refuse(`unknown flag ${JSON.stringify(flag)} — the fake speaks only the engine's dialect`);
		if (BARE.has(flag)) {
			if (flag === "--verbose") verbose = true; else includeHookEvents = true;
			continue;
		}
		// `-p` alone is stdin mode; `-p <text>` carries the first turn. A prompt
		// may itself start with `-` (the inject payload does), so only a flag the
		// dialect knows ends the option.
		const next = args[i + 1];
		const takes = next !== undefined && !VALUED.has(next) && !BARE.has(next);
		if (flag === "-p" || flag === "--print") {
			print = true;
			if (takes) { prompt = next!; i++; }
			continue;
		}
		if (!takes) return refuse(`${flag} needs a value`);
		i++;
		switch (flag) {
			case "--session-id": sessionId = next!; break;
			case "--resume": resume = next!; break;
			case "--output-format": outputFormat = next!; break;
			case "--input-format": inputFormat = next!; break;
			case "--permission-mode": permissionMode = next!; break;
			case "--model": model = next!; break;
			case "--json-schema": jsonSchema = next!; break;
		}
	}

	if (!print) return refuse("the fake is headless-only: -p is required");
	if (outputFormat !== "stream-json")
		return refuse(`--output-format stream-json is required (got ${outputFormat ?? "nothing"})`);
	if (!verbose) return refuse("--verbose is required with --output-format stream-json");
	if (inputFormat !== null && inputFormat !== "stream-json")
		return refuse(`--input-format stream-json is the only input format (got ${inputFormat})`);
	if (inputFormat === "stream-json" && prompt !== null)
		return refuse("-p takes no text under --input-format stream-json: turns arrive on stdin");
	if (inputFormat === null && prompt === null)
		return refuse("-p needs the first turn's text unless --input-format stream-json");
	if (permissionMode !== null && !(PERMISSION_MODES as readonly string[]).includes(permissionMode))
		return refuse(`unknown --permission-mode ${JSON.stringify(permissionMode)}`);
	if (sessionId !== null && resume !== null)
		return refuse("--session-id and --resume are exclusive");
	if (sessionId !== null && !isUuid(sessionId)) return refuse(`--session-id is not a uuid: ${sessionId}`);
	if (resume !== null && !isUuid(resume)) return refuse(`--resume is not a session uuid: ${resume}`);
	if (jsonSchema !== null) {
		try { JSON.parse(jsonSchema); } catch { return refuse("--json-schema is not JSON"); }
	}

	return {
		prompt, sessionId, resume,
		inputFormat: inputFormat === "stream-json" ? "stream-json" : "argv",
		includeHookEvents,
		permissionMode: permissionMode as PermissionMode | null,
		model: model === null ? MODEL_IDS.haiku! : (MODEL_IDS[model] ?? model),
		jsonSchema,
	};
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
export const isUuid = (s: string): boolean => UUID.test(s);
