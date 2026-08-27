#!/usr/bin/env bun
// Install the census heartbeat into every account's settings.json — the ×3 ritual.
//
// FELIX-RUN, not agent-run (D14): writing a live config file trips the agent
// permission guard by design, and the surfaced prompt IS the rule.
//
//    bun belvedere/census/deploy.ts --check    read-only; the drift alarm
//    bun belvedere/census/deploy.ts            back up once, merge, verify
//
// Nothing is written until all three accounts plan clean: a foreign hooks block
// anywhere refuses the whole run, so the city never ends up half-sensored.
// Test seam: CENSUS_CONFIG_DIRS="dir dir" overrides accounts.tsv (sync/common.sh).

import { copyFileSync, existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const HERE = import.meta.dir;
const REPO = join(HERE, "..", "..");
const BACKUP_SUFFIX = ".pre-census";

// P1 F6's record, in order. The probe asserts the hook still emits exactly this.
const F6_KEYS = "t ev sid acct ws sf pid cwd tp pmt mode aid at tool why bg".split(" ");

type Account = { dir: string; label: string };

type State =
	| { kind: "installed" }                        // already exactly our hooks
	| { kind: "ready"; settingsExist: boolean }    // no hooks — safe to merge
	| { kind: "foreign"; keys: string }            // somebody else's hooks — refuse
	| { kind: "blocked"; why: string };            // can't proceed, and won't guess

const fragment = JSON.parse(readFileSync(join(HERE, "hooks.json"), "utf8")) as {
	hooks: Record<string, unknown>;
};

function accounts(): Account[] {
	const override = process.env.CENSUS_CONFIG_DIRS;
	if (override) return override.split(/\s+/).filter(Boolean).map(dir => ({ dir, label: "override" }));
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
	if (!existsSync(out)) return `hook wrote no record — is /usr/bin/jq present?`;
	const keys = Object.keys(JSON.parse(readFileSync(out, "utf8").trim()));
	if (keys.join(" ") !== F6_KEYS.join(" ")) return `record is not F6-shaped: ${keys.join(" ")}`;
	return null;
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
	if (hooks && typeof hooks === "object" && Object.keys(hooks).length > 0)
		return { kind: "foreign", keys: Object.keys(hooks).join(" ") };
	if (existsSync(path + BACKUP_SUFFIX))
		return { kind: "blocked", why: `${BACKUP_SUFFIX} exists but hooks are gone — backing up twice would destroy the first original; move it aside yourself` };
	return { kind: "ready", settingsExist: true };
}

function merge(a: Account): void {
	const path = join(a.dir, "settings.json");
	if (existsSync(path)) copyFileSync(path, path + BACKUP_SUFFIX);
	const settings = existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : {};
	settings.hooks = fragment.hooks;
	writeFileSync(path, JSON.stringify(settings, null, "\t") + "\n");
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
		case "foreign":   row(a.label, "REFUSED", `existing hooks: ${state.keys}`); break;
		case "blocked":   row(a.label, "REFUSED", state.why); break;
	}
}

const refused = plan.filter(p => p.state.kind === "foreign" || p.state.kind === "blocked");
if (refused.length) {
	console.error(`\nREFUSED — ${refused.length} account(s) above. Nothing written; resolve by hand, never by overwrite.`);
	process.exit(1);
}

const pending = plan.filter(p => p.state.kind === "ready");
if (check) {
	console.log();
	if (pending.length) {
		console.log(`DRIFT — ${pending.length} account(s) unsensored. Fix with deploy.ts (Felix-run).`);
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
for (const { a } of pending) {
	merge(a);
	const after = inspect(a);
	if (after.kind !== "installed") { console.error(`   ${a.label}: merge did not take (${after.kind}) — STOP`); process.exit(1); }
	row(a.label, "merged", `original → settings.json${BACKUP_SUFFIX}`);
}
console.log("\ndeployed. Only sessions started from now on carry the sensor.");
