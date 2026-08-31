// What B26 added to the poll: the baton bucket, which resolves every ledger tail's instruments —
// and a `row` instrument is a **file read** (that charge's work doc) plus a kickoff parse, on the
// request thread, every three seconds for as long as a deck is open.
//
// B8 F3's law is the one to answer: Bun runs one JavaScript thread, so anything synchronous on the
// request path stalls every request that arrives inside it. This prices the bucket against the
// 500 ms bar, cold and warm, and against the same endpoint before the bucket existed.
//
// Run: bun lab/b26/cost.ts
import { needsYou } from '../../glass/attention.ts';
import { readBaton } from '../../glass/baton.ts';
import { city } from '../../glass/register.ts';

const port = 4498;
const glass = Bun.spawn(['bun', 'server.ts'], {
	cwd: new URL('../../glass', import.meta.url).pathname,
	env: { ...process.env, GLASS_PORT: String(port) }, stdout: 'pipe', stderr: 'pipe',
});
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
for (let i = 0; i < 400; i++) { try { if ((await fetch(`http://127.0.0.1:${port}/`)).ok) break; } catch {} await sleep(100); }

// **Spaced, never bursted** (B3 E1's own warning): a tight burst hides a stall behind the first
// response's own work, and the figure that matters is what a browsing deck sees.
const times: number[] = [];
let payload = '';
for (let i = 0; i < 20; i++) {
	const t = performance.now();
	payload = await (await fetch(`http://127.0.0.1:${port}/deck/state`)).text();
	times.push(performance.now() - t);
	await sleep(150);
}
const s = [...times].sort((a, b) => a - b);
console.log(`GET /deck/state  n=${s.length} min=${s[0]!.toFixed(1)} p50=${s[Math.floor(s.length / 2)]!.toFixed(1)} p95=${s[Math.floor(s.length * 0.95)]!.toFixed(1)} max=${s.at(-1)!.toFixed(1)} ms   (bar 500 ms)`);

const snap = JSON.parse(payload) as { queue: { kind: string; baton: unknown }[] };
const batons = snap.queue.filter(i => i.kind === 'baton');
console.log(`payload          ${payload.length} B · queue ${snap.queue.length} items · ${batons.length} batons · baton wire ${JSON.stringify(batons).length} B`);

// The bucket alone, in-process, against the whole live register.
const buildings = city().buildings;
const withBaton = buildings.filter(b => b.baton && b.ledgerTail);
const bucket = () => { for (const b of withBaton) readBaton(b, b.baton!, b.ledgerTail!.line); };
bucket();
const t0 = performance.now(); for (let i = 0; i < 10; i++) bucket(); const t1 = performance.now();
console.log(`readBaton ×${withBaton.length}     ${((t1 - t0) / 10).toFixed(2)} ms per snapshot (warm page cache)`);

const t2 = performance.now(); const q = needsYou(buildings, []); const t3 = performance.now();
console.log(`needsYou whole   ${(t3 - t2).toFixed(1)} ms · ${q.length} items`);

glass.kill('SIGTERM'); await glass.exited;
