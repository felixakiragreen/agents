import { test, expect } from "bun:test";
import { parseArgv } from "./argv.ts";
import { isRefusal } from "./refusal.ts";

const ok = (args: string[]) => {
	const a = parseArgv(args);
	if (isRefusal(a)) throw new Error(`refused: ${a.refusal}`);
	return a;
};
const why = (args: string[]) => {
	const a = parseArgv(args);
	return isRefusal(a) ? a.refusal : null;
};

const BASE = ["--output-format", "stream-json", "--verbose"];

test("the engine's ignite argv parses whole", () => {
	const a = ok(["-p", "do the thing", "--session-id", "b521fd6e-c376-4aef-8053-883e1e70f2b8",
		"--model", "sonnet", "--permission-mode", "acceptEdits", "--include-hook-events", ...BASE]);
	expect(a.prompt).toBe("do the thing");
	expect(a.sessionId).toBe("b521fd6e-c376-4aef-8053-883e1e70f2b8");
	expect(a.model).toBe("claude-sonnet-5");
	expect(a.permissionMode).toBe("acceptEdits");
	expect(a.includeHookEvents).toBe(true);
	expect(a.inputFormat).toBe("argv");
});

test("a prompt may look like a flag — the inject payload does", () => {
	expect(ok(["-p", "--not-a-flag\n/not-a-slash-command", ...BASE]).prompt)
		.toBe("--not-a-flag\n/not-a-slash-command");
});

test("-p alone is stdin mode", () => {
	const a = ok(["-p", "--input-format", "stream-json", ...BASE]);
	expect(a.prompt).toBeNull();
	expect(a.inputFormat).toBe("stream-json");
});

test("an unknown flag refuses loudly", () => {
	expect(why(["-p", "x", "--effort", "low", ...BASE])).toContain("unknown flag");
	expect(why(["-p", "x", "--dangerously-skip-permissions", ...BASE])).toContain("unknown flag");
});

test("the dialect's own preconditions refuse", () => {
	expect(why(["-p", "x", "--output-format", "stream-json"])).toContain("--verbose is required");
	expect(why(["-p", "x", "--verbose"])).toContain("--output-format stream-json is required");
	expect(why(["--output-format", "stream-json", "--verbose"])).toContain("-p is required");
	expect(why(["-p", ...BASE])).toContain("-p needs the first turn's text");
	expect(why(["-p", "x", "--input-format", "stream-json", ...BASE])).toContain("-p takes no text");
	expect(why(["-p", "x", "--permission-mode", "default", ...BASE])).toContain("unknown --permission-mode");
	expect(why(["-p", "x", "--session-id", "not-a-uuid", ...BASE])).toContain("not a uuid");
	expect(why(["-p", "x", "--json-schema", "{oops", ...BASE])).toContain("not JSON");
	expect(why(["-p", "x", "--session-id", "b521fd6e-c376-4aef-8053-883e1e70f2b8",
		"--resume", "b521fd6e-c376-4aef-8053-883e1e70f2b8", ...BASE])).toContain("exclusive");
});

test("--model defaults to haiku and resolves short names", () => {
	expect(ok(["-p", "x", ...BASE]).model).toBe("claude-haiku-4-5-20251001");
	expect(ok(["-p", "x", "--model", "claude-opus-4-1-20250805", ...BASE]).model).toBe("claude-opus-4-1-20250805");
});
