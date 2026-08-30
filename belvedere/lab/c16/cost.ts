// What C16 added to the poll: the engine index on `/deck/state`, and the minimap's own index.
import { stepIndex } from '../../glass/steps.ts';
import { indexOf, LIMITS } from '../../glass/chat.ts';
import { city } from '../../glass/register.ts';

const port = 4497;
const glass = Bun.spawn(['bun', 'server.ts'], {
	cwd: new URL('../../glass', import.meta.url).pathname,
	env: { ...process.env, GLASS_PORT: String(port) }, stdout: 'pipe', stderr: 'pipe',
});
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
for (let i = 0; i < 400; i++) { try { if ((await fetch(`http://127.0.0.1:${port}/`)).ok) break; } catch {} await sleep(100); }

const sid = process.argv[2]!;
const times: Record<string, number[]> = { bare: [], b: [], bs: [] };
for (let i = 0; i < 20; i++) {
	for (const [k, q] of [['bare', ''], ['b', '?b=agents'], ['bs', `?b=agents&s=${sid}`]] as const) {
		const t = performance.now();
		await (await fetch(`http://127.0.0.1:${port}/deck/state${q}`)).text();
		times[k]!.push(performance.now() - t);
	}
	await sleep(50);
}
const stat = (a: number[]) => { const s = [...a].sort((x, y) => x - y); return `min=${s[0]!.toFixed(1)} p50=${s[Math.floor(s.length / 2)]!.toFixed(1)} p95=${s[Math.floor(s.length * 0.95)]!.toFixed(1)} max=${s.at(-1)!.toFixed(1)}`; };
for (const [k, a] of Object.entries(times)) console.log(`GET /deck/state ${k.padEnd(5)} n=${a.length} ${stat(a)} ms`);

const bs = await (await fetch(`http://127.0.0.1:${port}/deck/state?b=agents&s=${sid}`)).text();
console.log(`payload        ?b=&s= ${bs.length} B · chat ${JSON.stringify(JSON.parse(bs).chat).length} B`);

// The two new reads, in-process.
const buildings = city().buildings;
const t0 = performance.now(); const idx = stepIndex(buildings); const t1 = performance.now();
console.log(`stepIndex      ${(t1 - t0).toFixed(1)} ms · ${idx.size} sessions across the newest ${12} run logs`);
const target = idx.get(sid);
const path = target?.transcript ?? JSON.parse(bs).chat.target.transcript;
const t2 = performance.now(); const marks = indexOf(path); const t3 = performance.now();
const t4 = performance.now(); indexOf(path); const t5 = performance.now();
console.log(`indexOf        cold ${(t3 - t2).toFixed(1)} ms · warm ${(t5 - t4).toFixed(3)} ms · ${marks.length} marks · cap ${LIMITS.marks}`);
glass.kill('SIGTERM'); await glass.exited;
