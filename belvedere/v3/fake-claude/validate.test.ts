// Bars 2 and 3. The oracle faces reality — every C4 capture must pass — and it
// must be seen to fail: a validator nobody watched go red is theater.
import { test, expect } from "bun:test";
import { readdirSync, readFileSync, existsSync } from "node:fs";
import { validateStream, validateTranscript } from "./validate.ts";
import { HERE } from "./goldens.ts";

const CAPTURES = `${HERE}/../lab/c4/captures`;

const captureDirs = () =>
	readdirSync(CAPTURES).filter((d) => existsSync(`${CAPTURES}/${d}/stdout.jsonl`)).sort();

test("43 of 43 C4 captures are grammar-conformant", () => {
	const dirs = captureDirs();
	expect(dirs.length).toBe(43);
	const red = dirs.filter((d) => !validateStream(readFileSync(`${CAPTURES}/${d}/stdout.jsonl`, "utf8")).ok);
	expect(red).toEqual([]);
});

/** A real capture, then one byte of damage. */
const damaged = (dir: string, wreck: (lines: string[]) => string[]): string => {
	const text = readFileSync(`${CAPTURES}/${dir}/stdout.jsonl`, "utf8");
	const lines = text.split("\n");
	const tail = lines.pop();
	expect(tail).toBe("");
	return wreck(lines).join("\n") + "\n";
};

const rules = (text: string) => new Set(validateStream(text).violations.map((v) => v.rule));

test("negative control 1 — a required field stripped from the result goes red", () => {
	const wrecked = damaged("q1-echo-personal", (lines) => lines.map((l) => {
		const e = JSON.parse(l) as Record<string, unknown>;
		if (e.type === "result") delete e.permission_denials;
		return JSON.stringify(e);
	}));
	expect(rules(wrecked).has("fields")).toBe(true);
});

test("negative control 2 — an unknown subtype goes red", () => {
	const wrecked = damaged("q1-echo-personal", (lines) => lines.map((l) => {
		const e = JSON.parse(l) as Record<string, unknown>;
		if (e.subtype === "init") e.subtype = "initialise";
		return JSON.stringify(e);
	}));
	expect(rules(wrecked).has("subtype")).toBe(true);
});

test("negative control 3 — a torn final line goes red", () => {
	const text = readFileSync(`${CAPTURES}/q1-echo-personal/stdout.jsonl`, "utf8");
	const wrecked = text.slice(0, text.length - 40);
	expect(rules(wrecked).has("json")).toBe(true);
});

test("negative control 4 — a denial the result never carries goes red", () => {
	const wrecked = damaged("q1-write-personal", (lines) => lines.map((l) => {
		const e = JSON.parse(l) as Record<string, unknown>;
		if (e.type === "result") e.permission_denials = [];
		return JSON.stringify(e);
	}));
	expect(validateStream(wrecked).violations.map((v) => v.detail).join(" "))
		.toContain("never reached a result's denials");
});

test("negative control 5 — a second session id in one stream goes red", () => {
	const wrecked = damaged("q1-echo-personal", (lines) => lines.map((l, i) => {
		const e = JSON.parse(l) as Record<string, unknown>;
		if (i === lines.length - 1) e.session_id = "00000000-0000-4000-8000-000000000000";
		return JSON.stringify(e);
	}));
	expect(rules(wrecked).has("session")).toBe(true);
});

test("the transcript oracle rules paths and whole lines", () => {
	const row = JSON.stringify({ type: "user", sessionId: "s", message: { role: "user", content: "hi" } });
	const good = validateTranscript(row + "\n", {
		path: "/tmp/cfg/projects/-tmp-venue/s.jsonl", configDir: "/tmp/cfg", cwd: "/tmp/venue", sessionId: "s",
	});
	expect(good.ok).toBe(true);

	expect(validateTranscript(row, {}).violations[0]?.rule).toBe("whole-lines");
	expect(validateTranscript(row + "\n", {
		path: "/tmp/cfg/elsewhere/s.jsonl", configDir: "/tmp/cfg", cwd: "/tmp/venue", sessionId: "s",
	}).violations[0]?.rule).toBe("path");
	expect(validateTranscript(JSON.stringify({ type: "nonsense" }) + "\n", {}).violations[0]?.rule).toBe("type");
});
