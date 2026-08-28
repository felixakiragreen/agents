/**
 * P6 — one arm, one fixture, against a live probe. The workhorse for isolating a
 * corruption class.
 *
 *   bun belvedere/lab/p6/arm.ts <workspace-ref> <fixture> [segmented|bracketed|naked]
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { waitForSession, waitForTurns, userTurns, deliverSegmented, pasteBracketed, pasteNaked, submit, screen, sha, sleep } from './lib';

const HERE = import.meta.dir;
const ws = process.argv[2]!;
const fixture = process.argv[3]!;
const mode = process.argv[4] ?? 'segmented';
const text = readFileSync(join(HERE, 'fixtures', fixture), 'utf8');

const beat = await waitForSession(ws);
const tp = beat.tp!;
const before = userTurns(tp).length;

if (mode === 'segmented') await deliverSegmented(ws, text);
else if (mode === 'bracketed') await pasteBracketed(ws, text);
else await pasteNaked(ws, text);

await sleep(1500);
console.log(`box:\n${(await screen(ws)).split('\n').filter(l => l.trim()).slice(-10).map(l => '  | ' + l).join('\n')}`);
if (mode !== 'naked') await submit(ws);

const turns = await waitForTurns(tp, before + 1);
const added = turns.slice(before);
console.log(`\nfixture ${fixture} · mode ${mode} · ${added.length} user turn(s) added`);
console.log(`sent  ${Buffer.byteLength(text)} B ${sha(text)}\n      ${JSON.stringify(text)}`);
for (const t of added) console.log(`got   ${Buffer.byteLength(t.text)} B ${sha(t.text)}\n      ${JSON.stringify(t.text)}`);
console.log(added.length === 1 && sha(added[0]!.text) === sha(text) ? 'BYTE-EXACT' : 'CORRUPTED');
