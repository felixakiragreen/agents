#!/usr/bin/env bun
// C16's one real spend: **the round trip on real bytes.**
//
//   bun lab/c16/roundtrip.ts [account]
//
// A real engine run pauses ‹needs-⬡ question›; Felix's reply, typed into the rendered Chat in a
// real browser and sent with the rendered button, travels the engine's own resume and lands the
// step. Three things are compared rather than argued: the bytes the page sent, the bytes in the
// transcript on disk, and what the run log says the step became.
//
// This is a **lab** instrument and not a suite test, for P6's and B8 F1's reason: it arms real
// hands and spends real turns, and a `bun test` that did either would be a suite driving Felix's
// desktop. It is the mirror of `lab/b16/send.ts` one road along.
//
// **What it touches, and what it does not.** The deck it boots is the real one, armed with Felix's
// own credential — the send is credential-gated on both roads and a disarmed deck proves nothing
// here. Its census, desk and inbox anchors are pointed at a scratch tree, so the run leaves no beat,
// no draft and no audit line in the live census (C19 F6's lesson). The run itself lives in the real
// telemetry tree, because the point is that the deck reads the city's own engine.
//
// Budget: ≤$2 and ≤15 subject turns, dollars leading (D21). The meter runs at the end and exits
// nonzero on a ceiling — that is a ⬡-fork, not a retry.

import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { load, venueFor } from "../../v3/engine/engine.ts";
import { readLog } from "../../v3/engine/log.ts";
import { fold } from "../../v3/engine/replay.ts";
import { isRefusal } from "../../v3/engine/refusal.ts";
import { transcriptPath } from "../../v3/engine/transcript.ts";
import { ACCOUNTS } from "../../v3/engine/venue.ts";
import { meter } from "../../v3/lab/c8/meter.ts";
import { openEyes } from "../../camera/probe.ts";

// `--fake` is the zero-cost dress rehearsal: the same run, the same armed deck, the same browser and
// the same three comparisons, with the committed `answer-then-land` subject in place of a real one.
// Everything but the rendering bar is proven by it, which is what makes the real pass a single shot.
const fake = process.argv.includes("--fake");
const account = process.argv.slice(2).find(a => !a.startsWith("--")) ?? "personal";
const configDir: string | undefined = ACCOUNTS[account as keyof typeof ACCOUNTS];
if (configDir === undefined) throw new Error(`unknown account ${account} — one of ${Object.keys(ACCOUNTS).join(", ")}`);

const TURN_CEILING = 15;
const COST_CEILING = 2;

// The dress rehearsal runs in its own scratch tree: a rehearsal has no business in the city's
// telemetry, and the fake's synthetic `total_cost_usd` would be counted as money by the meter.
const RUNS = fake
	? mkdtempSync(join(realpathSync(tmpdir()), "c16-rehearsal-"))
	: new URL("../../../summon/log/v3", import.meta.url).pathname;
const HOME = fake ? RUNS : new URL("../../../summon/log/v3/c16", import.meta.url).pathname;
const RUN = fake ? "c16/roundtrip-fake" : "c16/roundtrip";
const runDir = join(RUNS, RUN);
const workDir = join(HOME, "venue", account);
const GLASS = new URL("../../glass", import.meta.url).pathname;
const CAPTURE = new URL("./rich.jsonl", import.meta.url).pathname;

const sha256 = (s: string) => createHash("sha256").update(s, "utf8").digest("hex");
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// ── the step ─────────────────────────────────────────────────────────────────

// One turn, doing two jobs: it must PAUSE on a question (so there is a pause to reply into) and it
// must speak in the shapes the rendering bar needs (so this run's own transcript is the committed
// rich fixture). The fake can do the first and no scenario can do the second — writing one is a
// `v3/**` write this charge's fence forbids — so the real subject does both at once.
const PROMPT = [
	"You are writing one short status note and then stopping. Do exactly this, in one turn:",
	"",
	"1. Write a file called notes.md in your working directory containing the single line: Belvedere round trip.",
	"2. Then answer in markdown, using ALL of these: a `##` heading, a bulleted list of two items,",
	"   a markdown table with the columns `gate | result` and two rows, and a fenced code block",
	"   tagged `ts` containing one line of TypeScript. Mention `canon row 17` and `D22` in your prose.",
	"3. You have NOT been told which release this note is for and you must not invent one.",
	"",
	"When you are finished, set the report state to `needs_input` and put this question in `cause`:",
	"Which release is this note for?",
].join("\n");

const REPLY = fake
	? "The release name is ANSWER-THEN-LAND.\n\nSet your report state to done."
	: [
		"The release is BELVEDERE-C16.",
		"",
		"Set your report state to done and put the release name in `answer`.",
	].join("\n");

// ── the run ──────────────────────────────────────────────────────────────────

if (existsSync(runDir)) {
	let n = 1;
	while (existsSync(`${runDir}-${n}`)) n++;
	renameSync(runDir, `${runDir}-${n}`);
	console.log(`  (a previous pass was rotated aside to ${runDir}-${n} — its spend still counts)`);
}
mkdirSync(runDir, { recursive: true });
mkdirSync(workDir, { recursive: true });
writeFileSync(`${runDir}/flow.json`, JSON.stringify({
	id: "c16roundtrip", name: "a reply from the deck, into a pause the engine is holding", budget: 3,
	steps: [{
		id: "note", kind: "task", depends: [], prompt: PROMPT, timeout_ms: 240_000,
		subject: fake ? { fake: { scenario: "answer-then-land", seed: 3 } } : { real: {} },
		model: "sonnet", effort: "low", posture: "auto",
	}],
}, null, 2) + "\n");

console.log(`# C16's round trip · ${account} · ${new Date().toISOString()}`);
console.log(`  run    ${runDir}\n  venue  ${fake ? "the run's own layer-0 sandbox" : workDir}`);

// The fake never writes into a real account dir — its guard refuses at the door (`fake-claude/guard.ts`)
// — so the dress rehearsal runs at layer 0, in the sandbox the run makes and owns.
const venue = fake ? venueFor(runDir) : { workDir, configDir };
const run = load(`${runDir}/flow.json`, { runDir, venue });
if (isRefusal(run)) throw new Error(run.refusal);
const blessed = run.bless();
if (isRefusal(blessed)) throw new Error(blessed.refusal);
await run.run();

const state = run.state();
const at = state.steps["note"];
if (at?.at !== "paused") throw new Error(`the step is ${at?.at}, not paused — there is nothing to reply into`);
console.log(`\n1. THE PAUSE  ‹${at.causes.join(", ")}› ${at.detail}`);
const sessionId = at.sessionId;
if (sessionId === null) throw new Error("the paused step names no session");
const transcript = transcriptPath(venue.configDir, venue.workDir, sessionId);
console.log(`   session    ${sessionId}\n   transcript ${transcript}`);

// ── the deck, armed ──────────────────────────────────────────────────────────

const scratch = mkdtempSync(join(tmpdir(), "c16-roundtrip-"));
const port = ((): number => {
	const probe = Bun.serve({ hostname: "127.0.0.1", port: 0, fetch: () => new Response(null, { status: 204 }) });
	const got = probe.port;
	probe.stop(true);
	if (got === undefined) throw new Error("bun bound 127.0.0.1:0 and reported no port");
	return got;
})();

const glass = Bun.spawn(["bun", "server.ts"], {
	cwd: GLASS,
	env: {
		...process.env,
		RUNS_DIR: RUNS,
		GLASS_PORT: String(port),
		// The blast radius: the run's own beats, drafts, audit lines and any inbox gesture land in a
		// scratch tree. The credential is Felix's real one — the send is gated on both roads.
		CENSUS_DIR: join(scratch, "census"),
		DESK_DIR: join(scratch, "desk"),
		INBOX_DIR: join(scratch, "inbox"),
	},
	stdout: "pipe", stderr: "pipe",
});

const ready = async (): Promise<void> => {
	const deadline = Date.now() + 40_000;
	for (;;) {
		try { if ((await fetch(`http://127.0.0.1:${port}/`, { signal: AbortSignal.timeout(1_000) })).ok) return; }
		catch { /* not up yet */ }
		if (Date.now() > deadline) throw new Error(`the glass was not serving on ${port} within 40 s`);
		await sleep(100);
	}
};
await ready();

// The arming law, from the other side: this deck must NOT be cold, or the bar proves nothing.
const armed = await fetch(`http://127.0.0.1:${port}/chat/send`, { method: "POST", body: "{}" });
if (armed.status === 503) throw new Error(`the deck is DISARMED (${await armed.text()}) — this bar needs Felix's credential`);
console.log(`\n2. THE DECK   armed on 127.0.0.1:${port} · POST /chat/send answered ${armed.status}, not 503`);

const shots: string[] = [];
try {
	const eyes = await openEyes(path => `http://127.0.0.1:${port}${path.startsWith("/") ? path : `/${path}`}`);
	if (!eyes.ok) throw new Error(eyes.error);
	const p = eyes.result.probe;
	try {
		await p.goto("/deck");
		await p.remember("belvedere.deck.session", sessionId);
		await p.remember("belvedere.deck.focus", "chat");
		await p.remember("belvedere.deck.layout", { context: "minimal", focus: "expanded", action: "typical", drawer: "shut" });
		await p.goto("/deck");

		// What the rendering bar is about: the subject's own markdown, in the shapes it wrote. The fake
		// writes none of it, so the dress rehearsal reads the counts and asserts only the fence law.
		await p.waitFor(fake ? ".ct-turns .ct" : ".ct-turns .ct-md-table");
		const counts = {
			heads: await p.count(".ct-turns .ct-md-h"),
			lists: await p.count(".ct-turns .ct-md-list li"),
			tables: await p.count(".ct-turns .ct-md-table table"),
			fences: await p.count(".ct-turns .ct-fence"),
			acts: await p.count(".ct-turns .ct-act"),
			spans: await p.count(".ct-turns .dw"),
			inFences: await p.count(".ct-turns .ct-fence .dw"),
			marks: await p.count(".ct-map .ct-mark"),
		};
		if (counts.inFences !== 0) throw new Error(`${counts.inFences} decoder spans inside a fence — B20 §1 is broken`);
		shots.push(await p.shoot(fake ? "c16-fake-render" : "c16-rich-render"));

		const box = `textarea[data-chat-draft="${sessionId}"]`;
		await p.waitFor(box);
		await p.type(box, REPLY);
		await p.waitFor("[data-chat-send]");
		shots.push(await p.shoot(fake ? "c16-fake-armed" : "c16-armed-reply"));

		const t0 = Date.now();
		await p.click("[data-chat-send]");
		let receipt = "";
		for (const deadline = Date.now() + 180_000; Date.now() < deadline;) {
			receipt = await p.text(`[data-out-for="chat:${sessionId}"]`);
			if (receipt.includes("delivered") || /^\d{3} /.test(receipt)) break;
			await sleep(500);
		}
		console.log(`\n3. THE SEND   ${receipt}`);
		console.log(`   wall       ${((Date.now() - t0) / 1000).toFixed(1)} s`);
		if (!receipt.includes("delivered")) throw new Error(`the deck did not report a delivery: ${receipt}`);
		shots.push(await p.shoot(fake ? "c16-fake-delivered" : "c16-delivered"));

		// The three comparisons.
		const turns = readFileSync(transcript, "utf8").split("\n").filter(l => l !== "")
			.map(l => JSON.parse(l) as { type: string; message?: { content?: unknown } })
			.filter(r => r.type === "user" && typeof r.message?.content === "string")
			.map(r => r.message!.content as string);
		const landed = turns.find(t => t === REPLY);
		console.log(`\n4. THE BYTES`);
		console.log(`   page-side  ${Buffer.byteLength(REPLY)} B  sha ${sha256(REPLY)}`);
		console.log(`   on disk    ${landed === undefined ? "ABSENT" : `${Buffer.byteLength(landed)} B  sha ${sha256(landed)}`}`);
		if (landed === undefined) throw new Error("the reply is not in the transcript on disk");

		// **Delivered is not landed, and the deck is the engine for the turn it just resumed**
		// (findings F2). The send answers as soon as the words are on disk; the turn goes on inside
		// the glass, and tearing the glass down before it settles leaves the log saying `running`
		// forever. So the instrument waits on the LOG, which is the only thing that says what a step
		// became — and this wait is what a human's deck does by simply staying up.
		const settled = async (): Promise<string> => {
			for (const deadline = Date.now() + 300_000; Date.now() < deadline;) {
				const s = fold(readLog(`${runDir}/run.jsonl`)).steps["note"];
				if (s !== undefined && s.at !== "running" && s.at !== "ended") return s.at;
				await sleep(500);
			}
			return "running";
		};
		const at5 = await settled();
		const after = fold(readLog(`${runDir}/run.jsonl`)).steps["note"];
		console.log(`\n5. THE LOG    ${at5} after ${((Date.now() - t0) / 1000).toFixed(1)} s`);
		if (after?.at === "landed") console.log(`   report     ${after.report?.state} · ${after.report?.cause}\n   answer     ${after.report?.answer}`);
		if (after?.at !== "landed") throw new Error(`the step is ${after?.at}, not landed`);

		console.log(`\n6. THE RENDER ${JSON.stringify(counts)}`);

		if (fake) console.log(`\n7. THE CAPTURE skipped — the fake writes no markdown, and the fixture is a real capture`);
		else {
			copyFileSync(transcript, CAPTURE);
			console.log(`\n7. THE CAPTURE ${CAPTURE} · ${statSync(CAPTURE).size} B — the committed rich fixture`);
		}
	}
	finally { await eyes.result.close(); }
}
finally {
	glass.kill("SIGTERM");
	await glass.exited;
}

for (const s of shots) console.log(s);

const m = meter(HOME);
console.log(`\n  turns ${m.turns}/${TURN_CEILING} · cost $${m.cost.toFixed(4)}/$${COST_CEILING}${fake ? " (the fake's, and both are synthetic)" : ""}`);
if (fake) rmSync(RUNS, { recursive: true, force: true });
if (m.turns > TURN_CEILING || m.cost > COST_CEILING) {
	console.error("  CEILING HIT — stop, file what stands, ⬡-fork to Felix (D21)");
	process.exit(1);
}
