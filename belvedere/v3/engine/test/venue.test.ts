// The trust read, at home (C10 F6). It was written inside a dig's scratch, the
// console became its second caller, and C14 moved it into `venue.ts` — so this
// is where it is measured: the two places an account keeps its `.claude.json`,
// the ancestor rule C8 F2 found, and the engine pausing ‹venue› **before** it
// spawns anything.
//
// Every config dir here is written by the test. The one live read is the last
// test, and it is a read C8 F2 already made: the accounts trust this repo.
import { test, expect } from "bun:test";
import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { load } from "../engine.ts";
import { readLog } from "../log.ts";
import { isRefusal } from "../refusal.ts";
import { ACCOUNTS, accountOf, configJson, precheckReal, precheckVenue, trustedDirs, trusts } from "../venue.ts";
import { SCRATCH } from "./harness.ts";

const FAKE = { fake: { scenario: "schema-done", seed: 1 } } as const;
const REAL = { real: {} } as const;

/** An account dir on scratch, with its trust record written where `where` says.
 *  Both shapes exist on this machine, so both are built here. */
function account(name: string, where: "inside" | "beside", dirs: string[]): string {
	const configDir = `${SCRATCH}/accounts/${name}`;
	rmSync(configDir, { recursive: true, force: true });
	rmSync(`${configDir}.json`, { force: true });
	mkdirSync(configDir, { recursive: true });
	const json = JSON.stringify({ projects: Object.fromEntries(dirs.map((d) => [d, { hasTrustDialogAccepted: true }])) });
	writeFileSync(where === "inside" ? `${configDir}/.claude.json` : `${configDir}.json`, json);
	return configDir;
}

test("the trust record is found inside the config dir, or beside it", () => {
	const inside = account("inside", "inside", ["/a"]);
	const beside = account("beside", "beside", ["/b"]);
	expect(configJson(inside)).toBe(`${inside}/.claude.json`);
	expect(configJson(beside)).toBe(`${beside}.json`);
	expect(trustedDirs(inside)).toEqual(["/a"]);
	expect(trustedDirs(beside)).toEqual(["/b"]);
	// A config dir with no record at all is an account that trusts nothing —
	// answered, never thrown.
	expect(trustedDirs(`${SCRATCH}/accounts/there-is-no-such-account`)).toEqual([]);
});

test("only an accepted dir counts, and trust is inherited by descendants (C8 F2)", () => {
	const configDir = account("mixed", "inside", ["/trusted"]);
	writeFileSync(`${configDir}/.claude.json`, JSON.stringify({
		projects: { "/trusted": { hasTrustDialogAccepted: true }, "/opened": { hasTrustDialogAccepted: false } },
	}));
	expect(trustedDirs(configDir)).toEqual(["/trusted"]);
	expect(trusts(configDir, "/trusted")).toBe(true);
	expect(trusts(configDir, "/trusted/deep/inside")).toBe(true);
	expect(trusts(configDir, "/opened")).toBe(false);
	// A prefix is not an ancestor: `/trusted-elsewhere` starts with the string
	// and is a different directory.
	expect(trusts(configDir, "/trusted-elsewhere")).toBe(false);
});

test("a fake subject is trusted by construction — its sandbox is never read", () => {
	const configDir = account("empty", "inside", []);
	const venue = { workDir: "/nowhere-anyone-accepted", configDir };
	expect(precheckReal(venue, REAL).trusted).toBe(false);
	// Same venue, same untrusting record, fake subject: yes, and no read at all.
	expect(precheckVenue(venue, FAKE)).toEqual({ trusted: true });
	expect(precheckVenue(venue, REAL).trusted).toBe(false);
});

test("a real subject in an untrusted venue pauses ‹venue› before anything spawns", async () => {
	const configDir = account("refuses", "inside", ["/somewhere-else"]);
	const runDir = `${SCRATCH}/venue-refused`;
	const workDir = `${SCRATCH}/venue-refused/work`;
	rmSync(runDir, { recursive: true, force: true });
	mkdirSync(runDir, { recursive: true });
	const flowPath = `${runDir}/flow.json`;
	writeFileSync(flowPath, JSON.stringify({
		id: "venue", name: "a real subject with nowhere to live", budget: 2,
		steps: [{ id: "t", kind: "task", depends: [], prompt: "never sent", subject: REAL,
			model: "sonnet", effort: "low", posture: "auto", timeout_ms: 1_000 }],
	}));

	const run = load(flowPath, { runDir, venue: { workDir, configDir } });
	if (isRefusal(run)) throw new Error(run.refusal);
	if (isRefusal(run.bless())) throw new Error("bless refused");
	const state = await run.run();

	const at = state.steps.t;
	expect(at?.at).toBe("paused");
	if (at?.at === "paused") {
		expect(at.causes).toEqual(["venue"]);
		expect(at.detail).toContain("has never accepted the workspace-trust dialog");
		expect(at.detail).toContain(workDir);
	}
	// The whole point of a precheck: no ignition, no turn, no subject. A real
	// spawn here would cost money for a session nobody could ever summon.
	expect(readLog(run.log.path).filter((e) => e.kind === "ignited")).toEqual([]);
	expect(state.turns).toBe(0);
}, 20_000);

test("the three accounts have names, a stranger has only its path", () => {
	expect(accountOf(ACCOUNTS.personal)).toBe("personal");
	expect(accountOf(ACCOUNTS["thg-fgreen"])).toBe("thg-fgreen");
	expect(accountOf("/private/tmp/not-an-account")).toBe(null);
});

test("measured, not assumed: the personal account trusts this repo (C8 F2)", () => {
	const repo = new URL("../../../..", import.meta.url).pathname.replace(/\/$/, "");
	expect(repo.endsWith("/code/agents")).toBe(true);
	// The fact the console's summon leans on: a pane opened in this tree does not
	// stop on the workspace-trust dialog.
	expect(trusts(ACCOUNTS.personal, repo)).toBe(true);
	expect(precheckReal({ workDir: `${repo}/belvedere`, configDir: ACCOUNTS.personal }, REAL)).toEqual({ trusted: true });
});
