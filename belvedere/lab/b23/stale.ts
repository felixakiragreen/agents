// B23 §4: which staleness the deck's own design still allows, measured rather than argued.
//
//   bun lab/b23/stale.ts
//
// `camera/probes/board-fresh.probe.ts` proves the reported case does NOT reproduce: a row committed
// into an existing board file under an open Workshop reaches the pane within one poll, and a hard
// reload is fresh too. So this asks the next question — where the register's own ruling (E1,
// 2026-08-27: the WALK is held for 300 s, the CONTENT is re-read per request) leaves a window, and
// how wide.
//
// It re-execs itself with `$GLASS_CITY` in the SPAWN env, and that is not decoration: the re-walk
// runs on a worker thread, and a Bun worker does not see a `process.env` its parent set at runtime
// (measured — §the worker's env, below). A script that sets the knob and then trips the TTL is
// measuring a walk of the real `~/code`.
//
// Nothing here writes into the city: it builds a throwaway building under `$TMPDIR`.

import { appendFileSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const BOARD = (id: string) => ['# nb', '', '## The board', '',
	'| ID | Work | Depends on | Staffing | Status |', '|---|---|---|---|---|',
	`| ${id} | the first row | — | Builder · opus-high | OPEN — laid 2026-08-31 |`, ''].join('\n');

// ---------- the parent: build the world, then hand it to a child that was BORN knowing it ----------

if (process.env['B23_CITY'] === undefined) {
	const root = mkdtempSync(join(tmpdir(), 'b23-stale-'));
	mkdirSync(join(root, 'nb'), { recursive: true });
	writeFileSync(join(root, 'nb', 'README.md'), BOARD('N1'));

	// The worker's env, proven in two lines before anything is concluded from it.
	const probe = join(root, 'w.ts');
	writeFileSync(probe, `postMessage(process.env['B23_WORKER'] ?? 'ABSENT');\n`);
	process.env['B23_WORKER'] = 'set-at-runtime';
	const seen = await new Promise<string>(done => {
		const w = new Worker(new URL(`file://${probe}`).href);
		w.onmessage = (e: MessageEvent<string>) => { done(e.data); w.terminate(); };
	});
	console.log(`the worker  a value put in process.env at runtime reaches a Bun worker as: ${seen}`);
	console.log(`            (so $GLASS_CITY must be in the SPAWN env, or the re-walk walks ~/code)`);

	const child = Bun.spawn(['bun', import.meta.path], {
		env: { ...process.env, B23_CITY: root, GLASS_CITY: root },
		stdout: 'inherit', stderr: 'inherit',
	});
	const code = await child.exited;
	rmSync(root, { recursive: true, force: true });
	process.exit(code);
}

// ---------- the child: $GLASS_CITY was in its env before its first import ----------

const root = process.env['B23_CITY']!;
const { boot, bust, city, TTL_MS } = await import('../../glass/register.ts');
const { workshopOf } = await import('../../glass/workshop.ts');

const rows = (name: string): number => {
	const w = workshopOf(city().buildings, name, { session: 0, gate: 0, blessing: 0, escalation: 0 });
	return w === null ? -1 : w.boards.reduce((n, b) => n + b.rows.length, 0);
};
const has = (suffix: string) => city().buildings.some(b => b.building.endsWith(suffix));

boot();
const name = city().buildings.find(b => b.building.endsWith('nb'))?.building;
if (name === undefined) throw new Error(`the walk found no building under ${root}`);
console.log(`the ruling  the register's WALK is held ${TTL_MS / 1000} s; its CONTENT is re-read per request (E1, 2026-08-27)`);
console.log(`at boot     ${name} · ${rows(name)} row`);

// 1. CONTENT: a row appended to a board file the walk already knows — the reported case.
appendFileSync(join(root, 'nb', 'README.md'), '| N2 | a row committed while the deck was open | — | Builder · opus-high | OPEN |\n');
console.log(`a new ROW   ${rows(name)} rows, with no re-walk and no wait — content is never held`);

// 2. THE FILE LIST: a whole new board file beside it. This one IS held.
writeFileSync(join(root, 'nb', 'BOARD.md'), BOARD('M1').replace('# nb', '# second board'));
console.log(`a new FILE  ${rows(name)} rows — the walk's file LIST is what is held, so a new board file waits for it`);

// 3. A WHOLE NEW BUILDING. Held the same way.
mkdirSync(join(root, 'nb2'), { recursive: true });
writeFileSync(join(root, 'nb2', 'README.md'), BOARD('P1'));
console.log(`a new BLDG  ${has('nb2') ? 'on the register at once' : 'NOT on the register — the same window'}`);

// 4. And what closes it: the bust every one of Belvedere's own writes already calls (B8 §1).
bust();
city();                                    // the request that trips it is served warm and starts the walk
for (let i = 0; i < 80 && !has('nb2'); i++) await new Promise(r => setTimeout(r, 100));
console.log(`after bust  ${rows(name)} rows · ${has('nb2') ? 'nb2 on the register' : 'nb2 STILL missing'}`);
