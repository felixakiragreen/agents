// The minimap (C16 §6), on a transcript taller than the viewport.
//
// Run: bun camera/cli.ts run probes/chat-minimap.probe.ts
//
// The strip's whole claim is that it spans the **file**, not the window — so it can only be measured
// against a real, long conversation, and the city has hundreds. The target is the largest transcript
// in the `personal` account, chosen here at module scope; the deck finds it the way it finds any
// dead session, through the account's own projects tree (B5's discovery, B16's read).
//
// **The coordinate is the server's, never the DOM's opinion** (B21's pattern). The probe asks
// `/deck/chat` what the marks are, picks one the tail window provably does not hold, clicks it, and
// asserts the deck marked the turn with *that* key. A scroll position would prove nothing: the
// question is which turn the jump landed on.

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import type { Probe } from '../probe';

const ACCOUNT = '/Users/felix/.claude/projects';
const SID = /^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.jsonl$/;

/**
 * The **busiest** transcript in the account, not the biggest: measured once, the largest file in the
 * city is 23 MB and holds ten spoken turns — one enormous tool result — while a two-megabyte one
 * holds hundreds. Marks are turns, so the target is chosen by record count, over the candidates a
 * long conversation could plausibly be.
 */
const busiest = (): { sid: string; bytes: number; rows: number } => {
	const files: { sid: string; path: string; bytes: number }[] = [];
	for (const slug of readdirSync(ACCOUNT)) {
		let names: string[];
		try { names = readdirSync(join(ACCOUNT, slug)); } catch { continue; }
		for (const name of names) {
			const m = SID.exec(name);
			if (!m) continue;                          // a subagent transcript is not a session (B21 F7)
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
};

type View = {
	turns: { key: number; role: string }[];
	marks: { key: number; role: string }[];
	turnCount: number;
	from: number;
	bytes: number;
	anchor: number | null;
};

export default async function (p: Probe): Promise<void> {
	const target = busiest();

	await p.goto('/deck');
	await p.remember('belvedere.deck.session', target.sid);
	await p.remember('belvedere.deck.focus', 'chat');
	await p.remember('belvedere.deck.layout', { context: 'minimal', focus: 'expanded', action: 'minimal', drawer: 'shut' });
	await p.goto('/deck');
	await p.waitFor('.ct-map .ct-mark');

	// The server's own index, which is what the strip is drawn from.
	const view = JSON.parse((await p.ask(`/deck/chat?sid=${target.sid}`)).body) as View;
	const marks = await p.count('.ct-map .ct-mark');
	const mine = await p.count('.ct-map .ct-mark-user');
	const theirs = await p.count('.ct-map .ct-mark-assistant');
	const lit = await p.count('.ct-map .ct-mark.on');
	if (marks !== view.marks.length) throw new Error(`${view.marks.length} marks on the wire, ${marks} in the strip`);
	if (mine === 0 || theirs === 0) throw new Error(`the strip cannot tell speakers apart: ${mine} yours, ${theirs} theirs`);
	if (view.turnCount <= view.turns.length) throw new Error(`the transcript is not taller than one window (${view.turnCount} turns, ${view.turns.length} loaded)`);
	const shot = await p.shoot('chat-minimap');

	// A mark the tail window provably does not hold: the file's first turn.
	const first = view.marks[0]!;
	const window0 = view.turns[0]!.key;
	if (first.key >= window0) throw new Error(`the first mark (${first.key}) is inside the loaded window (opens at ${window0})`);

	await p.click(`.ct-map [data-chat-mark="${first.key}"]`);
	await p.waitFor('.ct-aim');
	const landed = await p.count(`.ct-aim[data-key="${first.key}"]`);
	if (landed !== 1) throw new Error(`the jump did not land on turn ${first.key} — ${landed} turns carry that key and are marked`);
	const jumped = await p.shoot('chat-minimap-jump');

	console.log(`target      ${target.sid} · ${target.bytes} B · ${target.rows} records`);
	console.log(`the file    ${view.turnCount} turns · ${view.marks.length} marks · window holds ${view.turns.length}, opening at byte ${view.from} of ${view.bytes}`);
	console.log(`the strip   ${marks} marks · ${mine} yours · ${theirs} the agents' · ${lit} lit (the window on screen)`);
	console.log(`the jump    clicked mark key ${first.key}, out of a window that opens at ${window0}; the marked turn is [data-key="${first.key}"] × ${landed}`);
	console.log(shot);
	console.log(jumped);
}
