// What continuous full-transcript scroll COSTS (B23 §2's bar: *"measure and print the render/scroll
// cost on that fixture"*).
//
//   bun lab/b23/cost.ts
//
// The fixture is the 4.7 MB conversation C16's minimap probe already chose — the busiest transcript
// in the `personal` account, by record count rather than by size (the biggest file in the city is
// 23 MB and holds ten spoken turns). Three numbers decide whether the model needs virtualizing: the
// server's whole read, the bytes it puts on the wire, and — measured in a real browser by
// `probes/chat-scroll.probe.ts`, not here — the layout.
//
// Nothing here ignites and nothing here writes: it reads transcripts off disk, which is what the
// deck's own poll does.

import { readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';
import { LIMITS, TAIL, WHOLE, chatView, indexOf, readWorld, turnsOf, windowOf } from '../../glass/chat';

const ACCOUNT = '/Users/felix/.claude/projects';
const SID = /^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.jsonl$/;

/** The busiest transcript — C16's own choice rule, so the two measurements are of one file. */
function busiest(): { sid: string; path: string; bytes: number; rows: number } {
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
	let best = { sid: '', path: '', bytes: 0, rows: 0 };
	for (const f of files.sort((a, b) => b.bytes - a.bytes).slice(0, 40)) {
		let rows = 0;
		for (const byte of readFileSync(f.path)) if (byte === 0x0a) rows++;
		if (rows > best.rows) best = { ...f, rows };
	}
	if (best.sid === '') throw new Error(`no transcript under ${ACCOUNT}`);
	return best;
}

const ms = (f: () => unknown, n: number): { p50: number; min: number; max: number } => {
	const all: number[] = [];
	for (let i = 0; i < n; i++) { const t = performance.now(); f(); all.push(performance.now() - t); }
	all.sort((a, b) => a - b);
	return { p50: all[all.length >> 1]!, min: all[0]!, max: all.at(-1)! };
};
const fixed = (x: number) => x.toFixed(1);

const target = busiest();
const world = readWorld();
console.log(`fixture     ${target.sid} · ${target.bytes} B · ${target.rows} records`);

// The read, cold and warm. The index is grown incrementally and memoized (C16's `indexOf`), so the
// first pass over a file pays for the whole scan and every later one pays for the tail.
const cold = performance.now();
const first = chatView(target.sid, WHOLE, false, 'measuring', world);
const coldMs = performance.now() - cold;
const warm = ms(() => chatView(target.sid, WHOLE, false, 'measuring', world), 5);
const tail = ms(() => chatView(target.sid, TAIL, false, 'measuring', world), 5);

const wholeBytes = JSON.stringify(first).length;
const tailBytes = JSON.stringify(chatView(target.sid, TAIL, false, 'measuring', world)).length;

console.log(`the read    whole ${first.turns.length} turns of ${first.turnCount} · from byte ${first.from} of ${first.bytes}`);
console.log(`            cold ${fixed(coldMs)} ms (the index's own first scan) · warm p50 ${fixed(warm.p50)} ms · min ${fixed(warm.min)} max ${fixed(warm.max)}`);
console.log(`the poll    tail ${LIMITS.turns} turns · p50 ${fixed(tail.p50)} ms · min ${fixed(tail.min)} max ${fixed(tail.max)}   (bar 500 ms)`);
console.log(`the wire    whole ${wholeBytes} B (one gesture, once per target) · tail ${tailBytes} B (every 3 s poll)`);

// The parse alone, without the target lookup or the draft read — what a bigger file would scale.
const w = windowOf(target.path, LIMITS.whole)!;
const parse = ms(() => turnsOf(w, '/'), 3);
const index = ms(() => indexOf(target.path), 3);
console.log(`the parse   ${fixed(parse.p50)} ms for ${w.text.length} chars → ${turnsOf(w, '/').length} turns · index (warm) ${index.p50.toFixed(3)} ms`);

// And the honest ceiling: what the biggest turn count in the account would cost.
let worst = { sid: '', turns: 0 };
for (const slug of readdirSync(ACCOUNT)) {
	let names: string[];
	try { names = readdirSync(join(ACCOUNT, slug)); } catch { continue; }
	for (const name of names) {
		const m = SID.exec(name);
		if (!m) continue;
		const path = join(ACCOUNT, slug, name);
		if (statSync(path).size > LIMITS.whole) continue;
		const n = indexOf(path).length;
		if (n > worst.turns) worst = { sid: m[1]!, turns: n };
	}
}
console.log(`the ceiling the account's longest conversation is ${worst.turns} turns (${worst.sid}) · the cap is ${LIMITS.wholeTurns}`);
