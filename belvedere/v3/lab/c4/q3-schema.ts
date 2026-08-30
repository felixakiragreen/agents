// Q3 addendum — needs-⬡(question) is not sensible from the stream: its result is
// byte-identical to idle. Does --json-schema make the state structural?
import { run, capture, events } from "./lib.ts";
import { rmSync, mkdirSync } from "node:fs";
import { SCRATCH } from "./lib.ts";

const SCHEMA = JSON.stringify({
	type: "object",
	properties: {
		state: { type: "string", enum: ["done", "needs_input", "blocked"] },
		cause: { type: "string" },
		answer: { type: "string" },
	},
	required: ["state", "cause"],
});

for (const [name, prompt] of [
	["done",        "Say hello. You have everything you need. Then report your state."],
	["needs_input", "Write the config file. (I have not told you the filename or the contents.) Report your state; do not use tools."],
] as const) {
	const cwd = `${SCRATCH}/q3-schema-${name}`;
	rmSync(cwd, { recursive: true, force: true }); mkdirSync(cwd, { recursive: true });
	const r = await run({ account: "personal", cwd, timeoutMs: 120_000,
		args: ["-p", prompt, "--model", "haiku", "--effort", "low", "--tools", "",
			"--json-schema", SCHEMA, "--output-format", "stream-json", "--verbose"] });
	const res = events(r.stdout).find((e) => e.type === "result");
	capture({ capture: `q3-schema-${name}`, account: "personal", model: "haiku", effort: "low",
		posture: "default", cwdClass: "scratch-untracked", task: "T-schema" }, r, { cwd, prompt });
	console.log(`${name}: exit=${r.code} result=${JSON.stringify(res?.result)}`);
	if (r.code !== 0) console.log("  stderr: " + r.stderr.trim().slice(0, 300));
}
