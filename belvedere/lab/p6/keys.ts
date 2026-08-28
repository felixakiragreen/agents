/**
 * P6 — what byte does each newline-ish key put on the wire? Same raw sink as `wire.ts`.
 * `paste-buffer` rewrites every LF to CR (measured), so if a message is to arrive with
 * real LFs the newline has to travel as a KEY, not as text.
 *
 *   bun belvedere/lab/p6/keys.ts
 */

import { readFileSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import { cmux, sleep } from './lib';

const HERE = import.meta.dir;
const OUT = '/tmp/p6-keys.bin';
const KEYS = ['enter', 'ctrl+j', 'shift+enter', 'alt+enter', 'ctrl+enter', 'meta+enter', 'ctrl+m'];

if (existsSync(OUT)) rmSync(OUT);
const ws = (await cmux(['workspace', 'create', '--name', 'p6-keys', '--cwd', '/tmp',
	'--command', `python3 ${join(HERE, 'sink.py')} ${OUT} 40`, '--focus', 'false'])).split(/\s+/)[1]!;

for (let i = 0; i < 30; i++) {
	await sleep(500);
	if ((await cmux(['read-screen', '--workspace', ws])).includes('SINK READY')) break;
}

for (const key of KEYS) {
	await cmux(['set-buffer', '--name', 'p6k', '--', `[${key}]`]);
	await cmux(['paste-buffer', '--name', 'p6k', '--workspace', ws]);
	try { await cmux(['send-key', '--workspace', ws, '--', key]); }
	catch (e) { console.log(`  ${key}: REFUSED — ${(e as Error).message}`); }
	await sleep(300);
}
await sleep(12_000);

const got = readFileSync(OUT).toString('binary');
console.log(got.replace(/\x1b/g, '<ESC>').replace(/\r/g, '<CR 0x0d>').replace(/\n/g, '<LF 0x0a>').replace(/\x00/g, '<NUL>'));
await cmux(['workspace', 'close', '--workspace', ws]);
