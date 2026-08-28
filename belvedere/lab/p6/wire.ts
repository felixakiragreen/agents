/**
 * P6 — what does cmux actually put on the wire? Stands up a raw-mode sink in its own
 * cmux workspace (`sink.py`, DECSET 2004 announced so the emulator sees a bracketed-
 * paste-capable app, exactly the state a Claude TUI is in), pastes one payload at it,
 * and dumps the bytes that arrived.
 *
 *   bun belvedere/lab/p6/wire.ts <fixture> [--wrap] [--no-2004]
 *
 * This is the control instrument for every claim about the transport: a sink that
 * rewrites nothing is the only way to tell a transport's corruption from an app's.
 */

import { readFileSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import { cmux, sleep, ESC } from './lib';

const HERE = import.meta.dir;
const fixture = process.argv[2] ?? 'a-blanks.txt';
const wrap = process.argv.includes('--wrap');
const no2004 = process.argv.includes('--no-2004');

const text = readFileSync(join(HERE, 'fixtures', fixture), 'utf8');
const payload = wrap ? `${ESC}[200~${text}${ESC}[201~` : text;
const OUT = '/tmp/p6-wire.bin';

if (existsSync(OUT)) rmSync(OUT);
const ws = (await cmux(['workspace', 'create', '--name', 'p6-wire', '--cwd', '/tmp',
	'--command', `python3 ${join(HERE, 'sink.py')} ${OUT} 14${no2004 ? ' --no-2004' : ''}`,
	'--focus', 'false'])).split(/\s+/)[1]!;

for (let i = 0; i < 30; i++) {
	await sleep(500);
	if ((await cmux(['read-screen', '--workspace', ws])).includes('SINK READY')) break;
	if (i === 29) throw new Error('sink never announced READY');
}

if (process.argv.includes('--send')) {
	await cmux(['send', '--workspace', ws, '--', payload]);
} else {
	await cmux(['set-buffer', '--name', 'p6wire', '--', payload]);
	await cmux(['paste-buffer', '--name', 'p6wire', '--workspace', ws]);
}
await sleep(15_000);

const got = readFileSync(OUT);
console.log(`fixture ${fixture}  wrap=${wrap}  decset2004=${!no2004}`);
console.log(`sent    ${Buffer.byteLength(payload)} B  ${JSON.stringify(payload)}`);
console.log(`arrived ${got.length} B`);
console.log(got.toString('binary').replace(/\x1b/g, '<ESC>').replace(/\r/g, '<CR>').replace(/\n/g, '<LF>').replace(/\t/g, '<TAB>'));
await cmux(['workspace', 'close', '--workspace', ws]);
