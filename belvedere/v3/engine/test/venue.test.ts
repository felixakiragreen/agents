// The trust read, at home (C10 F6). It was written inside a dig's scratch, the
// console became its second caller, and C14 moved it into `venue.ts` — so this
// is where it is measured: the two places an account keeps its `.claude.json`,
// the ancestor rule C8 F2 found, and the engine pausing ‹venue› **before** it
// spawns anything.
//
// Every config dir here is written by the test. The one live read is the last
// test, and it is a read C8 F2 already made: the accounts trust this repo.
import { test, expect } from "bun:test";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
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

// ---------- the flip (B12 E1's class), pinned where the read lives ----------
//
// Claude Code writes a `projects` entry for **any** cwd it visits, and an entry
// it wrote without ever showing the dialog carries `hasTrustDialogAccepted:
// false`. That `false` is *no opinion recorded here*, never a refusal: an
// ancestor's blanket trust still skips the dialog. A read that short-circuits on
// it refuses a venue that demonstrably works — measured at B7 F1, where a
// session ignited into `~/code/b7-founding-probe` (a `false` entry under a
// `true` `~/code`) reached its first user turn and beat the census ten times.
//
// **Only `true` decides.** `false` falls through to later evidence. The mutant
// below is the read as the flip would write it, and it is what the regression
// catches: it must call the live fixture cold while `trusts` calls it warm.

/** The flipped read: any entry short-circuits, `false` included. Kept here so the
 *  regression has a red to be green against. */
const flipped = (configDir: string, cwd: string): boolean => {
	const path = configJson(configDir);
	const projects = (JSON.parse(readFileSync(path, "utf8")) as
		{ projects?: Record<string, { hasTrustDialogAccepted?: unknown }> }).projects ?? {};
	const entries = Object.entries(projects)
		.filter(([dir]) => cwd === dir || cwd.startsWith(`${dir}/`))
		.sort(([a], [b]) => b.length - a.length);           // nearest entry first
	return entries[0]?.[1].hasTrustDialogAccepted === true;
};

test("an auto-created `false` never vetoes an ancestor's trust — only `true` decides (B12 E1)", () => {
	const configDir = account("flip", "inside", []);
	writeFileSync(`${configDir}/.claude.json`, JSON.stringify({
		projects: {
			"/city": { hasTrustDialogAccepted: true },
			"/city/visited": { hasTrustDialogAccepted: false },
			"/elsewhere/visited": { hasTrustDialogAccepted: false },
		},
	}));
	// The read under test: the `false` is a note, the `true` above it is the answer.
	expect(trusts(configDir, "/city/visited")).toBe(true);
	expect(trusts(configDir, "/city/visited/deeper")).toBe(true);
	// And an actually-untrusted venue still refuses, loudly: a `false` with nothing
	// true above it is cold, and so is a venue with no entry at all.
	expect(trusts(configDir, "/elsewhere/visited")).toBe(false);
	expect(trusts(configDir, "/elsewhere")).toBe(false);
	const cold = precheckReal({ workDir: "/elsewhere/visited", configDir }, REAL);
	expect(cold.trusted).toBe(false);
	expect(cold.trusted === false && cold.reason).toContain("has never accepted the workspace-trust dialog");

	// RED-BEFORE: the flipped read calls the same venue cold. Same file, same cwd,
	// opposite answer — this is the defect the class is named for.
	expect(flipped(configDir, "/city/visited")).toBe(false);
	expect(flipped(configDir, "/elsewhere/visited")).toBe(false);   // agrees where it must
});

test("the live regression fixture: `~/code/b7-founding-probe` reads `false` and is warm", () => {
	// B22's named fixture, read from the live personal account. The directory
	// itself is gone; the entry that makes it a fixture is not, and `trusts` is
	// path arithmetic over the record — so the class is measurable either way.
	const probe = "/Users/felix/code/b7-founding-probe";
	const raw = JSON.parse(readFileSync(configJson(ACCOUNTS.personal), "utf8")) as
		{ projects?: Record<string, { hasTrustDialogAccepted?: unknown }> };
	const entry = raw.projects?.[probe];
	if (entry === undefined) return;                                // Felix clears these by his hand after B22 lands
	expect(entry.hasTrustDialogAccepted).toBe(false);
	expect(trusts(ACCOUNTS.personal, "/Users/felix/code")).toBe(true);
	expect(trusts(ACCOUNTS.personal, probe)).toBe(true);
	expect(flipped(ACCOUNTS.personal, probe)).toBe(false);          // the flip's own answer, for the record
});

test("trust is read from the account dir's own `.claude.json`, never the legacy file (README §5)", () => {
	// Both shapes exist on this machine, and for the default account they are one
	// character apart: `~/.claude/.claude.json` is the account's, `~/.claude.json`
	// is the legacy file a human reaching for `$HOME` gets wrong answers from
	// (canon charge 20 F6). `configJson` prefers the inside file wherever it
	// exists, and only falls beside it for an account that keeps none.
	const both = account("both", "inside", ["/inside-says-yes"]);
	writeFileSync(`${both}.json`, JSON.stringify({ projects: { "/beside-says-yes": { hasTrustDialogAccepted: true } } }));
	expect(configJson(both)).toBe(`${both}/.claude.json`);
	expect(trustedDirs(both)).toEqual(["/inside-says-yes"]);
	expect(trusts(both, "/beside-says-yes")).toBe(false);           // the legacy file is not consulted

	// Live: the personal account's operative file, named.
	expect(configJson(ACCOUNTS.personal)).toBe(`${ACCOUNTS.personal}/.claude.json`);
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
