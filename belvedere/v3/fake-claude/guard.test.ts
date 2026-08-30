// Bar 6: the sandbox guard, proven — not asserted. Two of these spawn the real
// binary at a real account dir and watch it die at the door.
import { test, expect } from "bun:test";
import { writeRoot } from "./guard.ts";
import { isRefusal } from "./refusal.ts";
import { HERE } from "./goldens.ts";

const ACCOUNTS = ["/Users/felix/.claude", "/Users/felix/.claude-thg-fgreen", "/Users/felix/.claude-thg-doorbell"];

test("a real account dir is refused, whichever account it is", () => {
	for (const dir of ACCOUNTS) {
		const r = writeRoot({ HOME: "/Users/felix", CLAUDE_CONFIG_DIR: dir });
		expect(isRefusal(r) && r.refusal).toContain("real account dir");
	}
});

test("no config dir, no run", () => {
	expect(isRefusal(writeRoot({ HOME: "/Users/felix" }))).toBe(true);
	expect(isRefusal(writeRoot({ HOME: "/Users/felix", CLAUDE_CONFIG_DIR: "" }))).toBe(true);
	expect(isRefusal(writeRoot({ HOME: "/Users/felix", CLAUDE_CONFIG_DIR: "relative/dir" }))).toBe(true);
});

test("a sandbox dir is accepted", () => {
	expect(writeRoot({ HOME: "/Users/felix", CLAUDE_CONFIG_DIR: "/private/tmp/fake/config" }))
		.toBe("/private/tmp/fake/config");
});

async function spawnFake(configDir: string | null) {
	const env: Record<string, string> = {
		HOME: "/Users/felix", PATH: "/opt/homebrew/bin:/usr/bin:/bin",
		FAKE_CLAUDE_SCENARIO: `${HERE}/scenarios/echo.json`,
	};
	if (configDir !== null) env.CLAUDE_CONFIG_DIR = configDir;
	const proc = Bun.spawn(["bun", `${HERE}/cli.ts`, "-p", "ping", "--output-format", "stream-json", "--verbose"],
		{ cwd: HERE, env, stdout: "pipe", stderr: "pipe" });
	const [out, err] = await Promise.all([new Response(proc.stdout).text(), new Response(proc.stderr).text()]);
	return { exit: await proc.exited, out, err };
}

test("spawned at a real account dir, the fake refuses and emits nothing", async () => {
	const r = await spawnFake("/Users/felix/.claude");
	expect(r.exit).toBe(2);
	expect(r.out).toBe("");
	expect(r.err).toContain("is a real account dir");
});

test("spawned with no config dir, the fake refuses and emits nothing", async () => {
	const r = await spawnFake(null);
	expect(r.exit).toBe(2);
	expect(r.out).toBe("");
	expect(r.err).toContain("CLAUDE_CONFIG_DIR is unset");
});
