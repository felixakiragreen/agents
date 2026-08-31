// **Continuous full-transcript scroll** (B23 §2 — Felix's ruling, README §3's Chat laws).
//
// Run: bun camera/cli.ts run probes/chat-scroll.probe.ts
//
// The punch list, verbatim: *"Scrolling to the top of Chat snaps it back down OR gets it stuck at
// the top"* — and the design ruling that replaced the model rather than patching it: *"The scroll
// view should show the entire chat & the minimap jumps to its location in the scrollview (not go
// back in time)"*.
//
// Two targets, because the bar has two halves and no one file can be both:
//
//  1. **The 4.7 MB fixture** — the busiest real conversation in the `personal` account, chosen by
//     C16's own rule so the two charges measure one file. Read-only: it proves the top is reachable
//     and stays reached, and that a minimap click lands **spatially**.
//  2. **A tall run of this probe's own** — 120 generated turns under `$TMPDIR`, mounted as a run by
//     `lab/c16/fakerun.ts`'s `rich()` (the capture is a parameter). Only a transcript the probe may
//     APPEND to can prove the other two halves: that a poll which really rebuilds the pane leaves
//     his scroll position untouched, and that follow-the-tail still tracks a growing conversation.

import { appendFileSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { rich } from '../../lab/c16/fakerun.ts';
import type { Probe } from '../probe';

const ACCOUNT = '/Users/felix/.claude/projects';
const SID = /^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.jsonl$/;
/** One poll is 3 s; every dwell here clears one with room for the render. */
const POLL = 4_000;
const TALL = 120;
const LAYOUT = { context: 'minimal', focus: 'expanded', action: 'minimal', drawer: 'shut' } as const;

// ---------- target 1: the busiest real transcript (C16's rule, so it is the same file) ----------

function busiest(): { sid: string; bytes: number; rows: number } {
	const files: { sid: string; path: string; bytes: number }[] = [];
	for (const slug of readdirSync(ACCOUNT)) {
		let names: string[];
		try { names = readdirSync(join(ACCOUNT, slug)); } catch { continue; }
		for (const name of names) {
			const m = SID.exec(name);
			if (!m) continue;
			const path = join(ACCOUNT, slug, name);
			const bytes = statSync(path).size;
			if (bytes > 200_000 && bytes < 8 << 20) files.push({ sid: m[1]!, path, bytes });
		}
	}
	let best = { sid: '', bytes: 0, rows: 0 };
	for (const f of files.sort((a, b) => b.bytes - a.bytes).slice(0, 40)) {
		let rows = 0;
		for (const byte of readFileSync(f.path)) if (byte === 0x0a) rows++;
		if (rows > best.rows) best = { sid: f.sid, bytes: f.bytes, rows };
	}
	if (best.sid === '') throw new Error(`no transcript under ${ACCOUNT}`);
	return best;
}

// ---------- target 2: a tall run this probe owns and may append to ----------

const SESSION = 'b23b23b2-0000-4000-8000-000000000023';
const stamp = () => new Date().toISOString();

const userRow = (text: string) => JSON.stringify({
	type: 'user', sessionId: SESSION, timestamp: stamp(), message: { role: 'user', content: text },
});
const agentRow = (text: string) => JSON.stringify({
	type: 'assistant', sessionId: SESSION, timestamp: stamp(),
	message: { role: 'assistant', content: [{ type: 'text', text }] },
});

/** A conversation taller than any viewport, generated rather than captured — it says nothing. */
function tallCapture(root: string): string {
	const path = join(root, 'tall.jsonl');
	const lines: string[] = [];
	for (let i = 0; i < TALL; i++) {
		lines.push(userRow(`turn ${i} — a generated line so this conversation is taller than the pane.`));
		lines.push(agentRow(`answer ${i} — filler with enough words in it to give the turn a real height on screen, twice over, so a hundred and twenty of them make a scroll view worth scrolling.`));
	}
	writeFileSync(path, `${lines.join('\n')}\n`);
	return path;
}

// The twin inherits `process.env` (`camera/twin.ts` §boot, and the CLI imports a probe before it
// boots one — C16's own trick), so a probe brings its own run tree with no camera change.
const root = mkdtempSync(join(realpathSync(tmpdir()), 'belvedere-b23-'));
const tall = rich('b23/tall', root, tallCapture(root));
process.env['RUNS_DIR'] = root;

// ---------- the probe ----------

const BOX = '#chat-turns';

export default async function (p: Probe): Promise<void> {
	try { await scroll(p); }
	finally { rmSync(root, { recursive: true, force: true }); }
}

async function open(p: Probe, sid: string): Promise<void> {
	await p.remember('belvedere.deck.session', sid);
	await p.remember('belvedere.deck.focus', 'chat');
	await p.remember('belvedere.deck.layout', LAYOUT);
	await p.goto('/deck');
	await p.waitFor(`${BOX} .ct`);
}

async function scroll(p: Probe): Promise<void> {
	await p.goto('/deck');

	// ── 1. the whole conversation, in one scroll view ────────────────────────────
	const real = busiest();
	const opened = Date.now();
	await open(p, real.sid);
	const view = JSON.parse((await p.ask(`/deck/chat?sid=${real.sid}`)).body) as { turns: unknown[]; turnCount: number; from: number; bytes: number };
	const drawn = await p.count(`${BOX} .ct`);
	if (view.from !== 0) throw new Error(`the read began at byte ${view.from} of ${view.bytes} — this fixture is meant to fit whole`);
	if (drawn !== view.turnCount) throw new Error(`the file holds ${view.turnCount} turns and the pane drew ${drawn} — the scroll view is not the whole chat`);
	const geometry = await p.scrolled(BOX);
	if (geometry.height <= geometry.client) throw new Error(`the transcript is not taller than the pane (${geometry.height} px in ${geometry.client} px) — this proves nothing`);

	// ── 2. the top: reachable, and it STAYS reached ──────────────────────────────
	await p.scrollTo(BOX, 0);
	const atTop = await p.scrolled(BOX);
	if (atTop.top !== 0) throw new Error(`scrolling to the top left the pane at ${atTop.top} px`);
	if (!await p.inView(`${BOX} .ct:first-of-type`)) throw new Error('the top of the conversation is not on screen after scrolling to it');
	await p.wait(POLL);
	const stillTop = await p.scrolled(BOX);
	if (stillTop.top !== 0) throw new Error(`a poll snapped the pane back down: 0 px → ${stillTop.top} px`);
	if (!await p.inView(`${BOX} .ct:first-of-type`)) throw new Error('a poll took the first turn off screen');
	const top = await p.shoot('chat-scroll-top');

	// ── 3. the minimap, spatially ────────────────────────────────────────────────
	// The LAST mark, deliberately: the pane is at the top, so a mark that lands the end of the
	// conversation on screen can only have moved the scroll view, not reloaded a window.
	// C16's minimap bars, absorbed: the strip spans the FILE and its two speakers are distinguishable.
	// (`chat-minimap.probe.ts` retired here — its jump bar asserted the windowed model, and under
	// continuous scroll the same question is answered spatially, three lines down.)
	const marks = await p.count('.ct-map .ct-mark');
	const mine = await p.count('.ct-map .ct-mark-user');
	const theirs = await p.count('.ct-map .ct-mark-assistant');
	if (marks !== view.turnCount) throw new Error(`${view.turnCount} turns in the file, ${marks} marks in the strip`);
	if (mine === 0 || theirs === 0) throw new Error(`the strip cannot tell speakers apart: ${mine} yours, ${theirs} theirs`);
	if (marks < 2) throw new Error(`the strip holds ${marks} marks — nothing to jump between`);
	const last = JSON.parse((await p.ask(`/deck/chat?sid=${real.sid}`)).body) as { marks: { key: number }[] };
	const key = last.marks.at(-1)!.key;
	await p.click(`.ct-map [data-chat-mark="${key}"]`);
	await p.wait(500);
	if (!await p.inView(`${BOX} [data-key="${key}"]`)) throw new Error(`the minimap click on mark ${key} did not bring that turn into view`);
	const landed = await p.scrolled(BOX);
	if (landed.top === 0) throw new Error('the minimap click moved nothing');
	const aimed = await p.count(`${BOX} .ct-aim[data-key="${key}"]`);
	if (aimed !== 1) throw new Error(`${aimed} turns carry the mark — the jump marked ${aimed === 0 ? 'nothing' : 'more than one turn'}`);
	const jumped = await p.shoot('chat-scroll-jump');

	// ── 4. a poll that really rebuilds the pane keeps his place ──────────────────
	await open(p, tall.sessionId);
	const tallBox = await p.scrolled(BOX);
	const middle = Math.round((tallBox.height - tallBox.client) / 2);
	await p.scrollTo(BOX, middle);
	const before = await p.scrolled(BOX);
	appendFileSync(tall.transcript, `${userRow('a turn that arrived while he was reading the middle')}\n`);
	await p.wait(POLL);
	const after = await p.scrolled(BOX);
	if (after.height <= before.height) throw new Error(`the appended turn never reached the pane (${before.height} px → ${after.height} px)`);
	if (after.top !== before.top) throw new Error(`a repaint moved his reading: ${before.top} px → ${after.top} px`);
	const held = await p.shoot('chat-scroll-held');

	// ── 5. at the bottom, follow-the-tail still follows ──────────────────────────
	await p.scrollTo(BOX, after.height);
	appendFileSync(tall.transcript, `${userRow('the newest turn of all, arriving at the bottom')}\n`);
	await p.wait(POLL);
	const end = await p.scrolled(BOX);
	if (end.height - end.top - end.client > 40) throw new Error(`follow-the-tail lost the end: ${end.height - end.top - end.client} px short`);
	if (!await p.inView(`${BOX} .ct:last-of-type`)) throw new Error('the newest turn is not on screen after it arrived');

	console.log(`the file    ${real.sid} · ${real.bytes} B · ${real.rows} records`);
	console.log(`one view    ${drawn} turns drawn of ${view.turnCount} in the file · from byte ${view.from} · ${geometry.height} px of content in a ${geometry.client} px pane · opened in ${((Date.now() - opened) / 1000).toFixed(1)} s`);
	console.log(`the top     0 px, and still 0 px after ${POLL / 1000} s of polling · the first turn on screen both times`);
	console.log(`the minimap ${marks} marks for ${view.turnCount} turns · ${mine} yours · ${theirs} the agent's · clicked the last (key ${key}) from the top → the pane moved to ${landed.top} px and that turn is in the viewport`);
	console.log(`the middle  ${before.top} px before an appended turn, ${after.top} px after (±0) · content ${before.height} → ${after.height} px`);
	console.log(`the tail    at the bottom, an appended turn tracked: ${end.height - end.top - end.client} px from the end, the newest turn on screen`);
	console.log(top);
	console.log(jumped);
	console.log(held);
}
