// Bar 7, and the survive law (grammar §6). Every scripted death is re-parsed:
// the transcript on disk holds whole lines up to the cut, always — and when the
// parent is the one that dies, the subject finishes anyway.
import { test, expect } from "bun:test";
import { mkdirSync, rmSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { validateStream, validateTranscript } from "./validate.ts";
import { HERE, VENUE_ROOT, loadScenario, runScenario } from "./goldens.ts";
import { transcriptPath } from "./transcript.ts";

const DEATHS = ["die-137", "die-exit-1", "hang"];

for (const name of DEATHS) {
	test(`${name} — the transcript has zero torn lines after the cut`, async () => {
		const s = loadScenario(name);
		const run = await runScenario(s);
		expect(run.exit).toBe(s.golden.expectExit);
		expect(run.transcript).not.toBe("");
		const tx = validateTranscript(run.transcript, {
			path: transcriptPath(run.configDir, run.cwd, run.sessionId),
			configDir: run.configDir, cwd: run.cwd, sessionId: run.sessionId,
		});
		expect(tx.violations).toEqual([]);
		expect(validateStream(run.stream).violations).toEqual([]);
	}, 20_000);
}

test("dead is `no result at EOF`, never a subtype", async () => {
	for (const name of ["die-137", "hang"]) {
		const run = await runScenario(loadScenario(name));
		expect(run.stream).not.toContain('"type":"result"');
	}
	// die-exit-1 is the other shape: a result DOES arrive, and only is_error
	// separates it from a success.
	const err = await runScenario(loadScenario("die-exit-1"));
	const last = err.stream.split("\n").filter(Boolean).map((l) => JSON.parse(l) as Record<string, unknown>)
		.filter((e) => e.type === "result").at(-1)!;
	expect(last.subtype).toBe("error_during_execution");
	expect(last.is_error).toBe(true);
}, 20_000);

test("the parent dies, the subject finishes, the transcript is whole", async () => {
	const root = `${VENUE_ROOT}/orphan-drill`;
	const configDir = `${root}/config`, cwd = `${root}/venue`;
	const sessionId = "0f00d000-0000-4000-8000-00000000beef";
	rmSync(root, { recursive: true, force: true });
	mkdirSync(cwd, { recursive: true });

	// A real parent process, not a shell: `sh -c "exec …"` makes the shell
	// BECOME the subject, and killing "the parent" kills the subject (C4's
	// instrument note).
	const parent = `${root}/parent.ts`;
	writeFileSync(parent, [
		`const proc = Bun.spawn(["bun", ${JSON.stringify(`${HERE}/cli.ts`)}, ...Bun.argv.slice(2)],`,
		`\t{ cwd: process.env.FAKE_CWD!, env: process.env, stdout: "pipe", stderr: "pipe" });`,
		`await proc.exited;`,
		``,
	].join("\n"));

	const proc = Bun.spawn(["bun", parent, "-p", "Run the two steps.", "--session-id", sessionId,
		"--model", "sonnet", "--permission-mode", "acceptEdits", "--output-format", "stream-json", "--verbose"], {
		cwd: root,
		env: {
			HOME: "/Users/felix", USER: "felix", SHELL: "/bin/zsh",
			PATH: "/Users/felix/.local/bin:/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin",
			LANG: "en_US.UTF-8", TMPDIR: "/private/tmp/",
			CLAUDE_CONFIG_DIR: configDir, FAKE_CWD: cwd,
			FAKE_CLAUDE_SCENARIO: `${HERE}/scenarios/orphan-finish.json`, FAKE_CLAUDE_SEED: "1",
		},
		stdout: "ignore", stderr: "ignore",
	});

	const path = transcriptPath(configDir, cwd, sessionId);
	await until(() => existsSync(path) && readFileSync(path, "utf8").includes("STEP1"), 5_000);
	proc.kill("SIGKILL");
	await proc.exited;

	await until(() => existsSync(path) && readFileSync(path, "utf8").includes("STEP1 and STEP2 complete."), 5_000);
	const text = readFileSync(path, "utf8");
	expect(text).toContain("STEP1 and STEP2 complete.");
	expect(validateTranscript(text, { path, configDir, cwd, sessionId }).violations).toEqual([]);
}, 30_000);

async function until(cond: () => boolean, ms: number) {
	const deadline = Date.now() + ms;
	while (Date.now() < deadline) {
		if (cond()) return;
		await new Promise((r) => setTimeout(r, 25));
	}
	throw new Error(`condition never held within ${ms} ms`);
}
