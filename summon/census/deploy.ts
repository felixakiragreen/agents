#!/usr/bin/env bun
// Install the census heartbeat into every account's settings.json — the ×3 ritual.
//
// FELIX-RUN, not agent-run (D14): writing a live config file trips the agent
// permission guard by design, and the surfaced prompt IS the rule.
//
//    bun summon/census/deploy.ts --check    read-only; the drift alarm
//    bun summon/census/deploy.ts            back up once, merge, verify
//
// Nothing is written until all three accounts plan clean: a foreign hooks block
// anywhere refuses the whole run, so the city never ends up half-sensored.
// Test seam: CENSUS_CONFIG_DIRS="dir dir" overrides accounts.tsv (sync/common.sh).

import { copyFileSync, existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, join } from "node:path";

const HERE = import.meta.dir;
const REPO = join(HERE, "..", "..");
const BACKUP_SUFFIX = ".pre-census";

// P1 F6's record, in order. The probe asserts the hook still emits exactly this.
const F6_KEYS = "t ev sid acct ws sf pid cwd tp pmt mode aid at tool why bg".split(" ");

type Account = { dir: string; label: string };

type State =
	| { kind: "installed" }                        // already exactly our hooks
	| { kind: "ready"; settingsExist: boolean }    // no hooks — safe to merge
	| { kind: "upgrade"; note: string }            // our hooks, an older event set — re-merge
	| { kind: "foreign"; note: string }            // hooks we did not write — refuse
	| { kind: "blocked"; why: string };            // can't proceed, and won't guess

// hooks.json is a template: `@CENSUS@` becomes this directory (lab/p1's `@LAB@`
// precedent). The absolute path is derived, never duplicated — so the fragment
// can never name a beat.sh that isn't the one sitting beside this script.
const fragment = JSON.parse(
	readFileSync(join(HERE, "hooks.json"), "utf8").replaceAll("@CENSUS@", JSON.stringify(HERE).slice(1, -1)),
) as { hooks: Record<string, unknown> };

function accounts(): Account[] {
	const override = process.env.CENSUS_CONFIG_DIRS;
	if (override) return override.split(/\s+/).filter(Boolean).map(dir => ({ dir, label: basename(dir) }));
	return readFileSync(join(REPO, "summon", "accounts.tsv"), "utf8")
		.split("\n")
		.filter(line => line && !line.startsWith("#"))
		.map(line => {
			const [, dir, label] = line.split("\t");
			return { dir: dir.replace(/^~/, process.env.HOME!), label };
		});
}

// Preflight: run the hook for real rather than stat it. This is the one loud place
// — beat.sh is deliberately silent, so a missing jq or a broken record can only be
// caught here. Returns an error string, or null when the record is F6-shaped.
function probeBeat(command: string): string | null {
	if (!existsSync(command)) return `hook missing: ${command}`;
	const dir = mkdtempSync(join(tmpdir(), "census-probe-"));
	const payload = JSON.stringify({
		session_id: "probe", transcript_path: "/probe", cwd: "/probe",
		hook_event_name: "SessionStart", source: "startup",
	});
	const run = Bun.spawnSync([command], { stdin: Buffer.from(payload), env: { ...process.env, CENSUS_DIR: dir } });
	if (run.exitCode !== 0) return `hook exited ${run.exitCode} (it must always exit 0)`;
	const out = join(dir, "census.jsonl");
	// An empty file is the jq-is-missing signature: the append redirect creates it,
	// then the exec fails silently by design. Presence alone proves nothing.
	const line = existsSync(out) ? readFileSync(out, "utf8").trim() : "";
	if (!line) return "hook wrote no record — is /usr/bin/jq present?";
	let keys: string[];
	try {
		keys = Object.keys(JSON.parse(line));
	} catch (e) {
		return `hook wrote a non-JSON record (${e}): ${line.slice(0, 120)}`;
	}
	if (keys.join(" ") !== F6_KEYS.join(" ")) return `record is not F6-shaped: ${keys.join(" ")}`;
	return null;
}

// Every `command` string anywhere in a hooks block — so a refusal can name what it
// found, which is how a stale worktree path in an old install gets diagnosed.
function commandsIn(node: unknown, found = new Set<string>()): Set<string> {
	if (Array.isArray(node)) for (const child of node) commandsIn(child, found);
	else if (node && typeof node === "object")
		for (const [key, value] of Object.entries(node))
			if (key === "command" && typeof value === "string") found.add(value);
			else commandsIn(value, found);
	return found;
}

function inspect(a: Account): State {
	if (!existsSync(a.dir)) return { kind: "blocked", why: "config dir missing" };
	const path = join(a.dir, "settings.json");
	if (!existsSync(path)) return { kind: "ready", settingsExist: false };
	let settings: Record<string, unknown>;
	try {
		settings = JSON.parse(readFileSync(path, "utf8"));
	} catch (e) {
		return { kind: "blocked", why: `settings.json is not valid JSON: ${e}` };
	}
	const hooks = settings.hooks;
	if (hooks && Bun.deepEquals(hooks, fragment.hooks)) return { kind: "installed" };
	// Anything that is not null and not an empty object is somebody's configuration —
	// including our own hooks left pointing at a stale path. Never guess, never overwrite.
	const isEmpty = hooks == null || (typeof hooks === "object" && Object.keys(hooks).length === 0);
	if (!isEmpty) {
		const events = typeof hooks === "object" ? Object.keys(hooks).join(" ") : JSON.stringify(hooks);
		const commands = [...commandsIn(hooks)];
		// **Ours, at an older event set.** A hooks block whose every command is exactly THIS
		// `beat.sh` was written by this script and by nothing else, so amending the fragment — one
		// more event, a corrected timeout — is an upgrade rather than an overwrite. Without this,
		// adding an event to `hooks.json` refuses on every account that already carries the census
		// and the only way through is hand-editing three live config files, which is precisely what
		// D14's guard exists to prevent (B22 candidate 5).
		if (commands.length > 0 && commands.every(c => c === hook))
			return { kind: "upgrade", note: `ours, ${Object.keys(hooks as object).length} events → ${Object.keys(fragment.hooks).length}` };
		return { kind: "foreign", note: `existing hooks: ${events}${commands.length ? ` → ${commands.join(", ")}` : ""}` };
	}
	if (existsSync(path + BACKUP_SUFFIX))
		return { kind: "blocked", why: `${BACKUP_SUFFIX} exists but hooks are gone — backing up twice would destroy the first original; move it aside yourself` };
	return { kind: "ready", settingsExist: true };
}

// Returns what happened to the original, for the report — nothing is invented.
function merge(a: Account, upgrade: boolean): string {
	const path = join(a.dir, "settings.json");
	const had = existsSync(path);
	// **An upgrade never backs up.** `.pre-census` holds the file as it was BEFORE the census
	// existed; copying an already-hooked settings.json over it — or writing one under that name
	// where none was ever taken — replaces the only original with a lie about what it was.
	if (had && !upgrade) copyFileSync(path, path + BACKUP_SUFFIX);
	const settings = had ? JSON.parse(readFileSync(path, "utf8")) : {};
	settings.hooks = fragment.hooks;
	writeFileSync(path, JSON.stringify(settings, null, "\t") + "\n");
	return upgrade ? `event set brought forward; settings.json${BACKUP_SUFFIX} untouched`
		: had ? `original → settings.json${BACKUP_SUFFIX}` : "settings.json created (there was none)";
}

const row = (label: string, verdict: string, note: string) =>
	console.log(`   ${label.padEnd(14)} ${verdict.padEnd(9)} ${note}`);

const check = process.argv[2] === "--check";
if (process.argv.length > 3 || (process.argv[2] && !check)) {
	console.error("usage: deploy.ts [--check]");
	process.exit(2);
}

const [{ hooks: [{ command: hook }] }] = fragment.hooks.SessionStart as [{ hooks: [{ command: string }] }];
console.log(`census hook: ${hook}`);

const broken = probeBeat(hook);
if (broken) {
	console.error(`\nREFUSED — the hook itself is broken: ${broken}`);
	process.exit(1);
}
row("hook", "ok", "probed live — emits an F6 record, exit 0");
console.log();

const plan = accounts().map(a => ({ a, state: inspect(a) }));
for (const { a, state } of plan) {
	switch (state.kind) {
		case "installed": row(a.label, "ok", "census hooks in place"); break;
		case "ready":     row(a.label, check ? "DRIFT" : "pending", state.settingsExist ? "no hooks — merge will add them" : "no settings.json — deploy will create it"); break;
		case "upgrade":   row(a.label, check ? "DRIFT" : "pending", `${state.note} — re-merge will bring the event set forward`); break;
		case "foreign":   row(a.label, "REFUSED", state.note); break;
		case "blocked":   row(a.label, "REFUSED", state.why); break;
	}
}

const refused = plan.filter(p => p.state.kind === "foreign" || p.state.kind === "blocked");
if (refused.length) {
	console.error(`\nREFUSED — ${refused.length} account(s) above. Nothing written; resolve by hand, never by overwrite.`);
	process.exit(1);
}

const pending = plan.filter(p => p.state.kind === "ready" || p.state.kind === "upgrade");
if (check) {
	console.log();
	if (pending.length) {
		console.log(`DRIFT — ${pending.length} account(s) not at this event set. Fix with deploy.ts (Felix-run).`);
		process.exit(1);
	}
	console.log(`green — census live on ${plan.length} account(s).`);
	process.exit(0);
}

if (!pending.length) {
	console.log("\nnothing to do — already deployed.");
	process.exit(0);
}
console.log();
for (const { a, state } of pending) {
	const note = merge(a, state.kind === "upgrade");
	const after = inspect(a);
	if (after.kind !== "installed") { console.error(`   ${a.label}: merge did not take (${after.kind}) — STOP`); process.exit(1); }
	row(a.label, "merged", note);
}
console.log("\ndeployed. Only sessions started from now on carry the sensor.");
