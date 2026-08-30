// Bar 5. Layer 0 is unmetered but not free: the barrage spawns thousands of
// these, so spawn-to-exit is a budget, and it is measured, not hoped for.
import { test, expect } from "bun:test";
import { mkdirSync, rmSync } from "node:fs";
import { loadavg } from "node:os";
import { HERE, VENUE_ROOT } from "./goldens.ts";

const SPAWNS = 50;
const P50_BAR_MS = 100;

test(`echo spawns and exits, p50 under ${P50_BAR_MS} ms over ${SPAWNS} spawns`, async () => {
	const root = `${VENUE_ROOT}/speed`;
	const cwd = `${root}/venue`;
	rmSync(root, { recursive: true, force: true });
	mkdirSync(cwd, { recursive: true });
	const env = {
		HOME: "/Users/felix", USER: "felix", SHELL: "/bin/zsh",
		PATH: "/Users/felix/.local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin",
		LANG: "en_US.UTF-8", TMPDIR: "/private/tmp/",
		CLAUDE_CONFIG_DIR: `${root}/config`,
		FAKE_CLAUDE_SCENARIO: `${HERE}/scenarios/echo.json`, FAKE_CLAUDE_SEED: "1",
	};

	const before = loadavg().map((n) => n.toFixed(2)).join(" ");
	const ms: number[] = [];
	for (let i = 0; i < SPAWNS; i++) {
		const t0 = Date.now();
		const proc = Bun.spawn(["bun", `${HERE}/cli.ts`, "-p", "Reply with exactly: pong",
			"--model", "haiku", "--permission-mode", "acceptEdits", "--output-format", "stream-json", "--verbose"],
			{ cwd, env, stdout: "pipe", stderr: "pipe" });
		await new Response(proc.stdout).text();
		expect(await proc.exited).toBe(0);
		ms.push(Date.now() - t0);
	}
	const after = loadavg().map((n) => n.toFixed(2)).join(" ");

	const sorted = [...ms].sort((a, b) => a - b);
	const at = (q: number) => sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * q))]!;
	console.log(`spawn->exit over ${SPAWNS}: min=${sorted[0]} p50=${at(0.5)} p90=${at(0.9)} max=${sorted.at(-1)} ms`);
	console.log(`load ${before} -> ${after}`);
	expect(at(0.5)).toBeLessThanOrEqual(P50_BAR_MS);
}, 60_000);
