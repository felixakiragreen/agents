/**
 * P6 Q2 — delivery MID-TURN. Sets the probe a long generation, delivers a message while
 * that turn is still streaming, and proves the timing from the census rather than assuming
 * it: the delivery's `UserPromptSubmit` must precede the work turn's `Stop`.
 *
 *   bun belvedere/lab/p6/q2.ts <workspace-ref>
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { fire, waitForSession, waitForTurns, userTurns, deliverSegmented, submit, screen, beats, sha, sleep } from './lib';

const HERE = import.meta.dir;
const MSG = readFileSync(join(HERE, 'fixtures', 'f-code.txt'), 'utf8');
// The probe's WHOLE FIRST TURN is the long generation — a message cannot talk an obedient
// probe into a long turn (measured twice: it answered ACK and stopped in 3 s), so the work
// has to be the summons.
const WORK = 'Write the integers from 1 to 800, one per line, nothing else at all. Use no tools.\nReply to every later message with exactly one word: ACK';

const fired = await fire({ account: 'personal', stamp: 'p6-busy-02', cwd: '/Users/felix/code/agents', model: 'sonnet', effort: 'low', color: 'Amber', summons: WORK });
const ws = fired.workspace;
console.log(`probe ${ws} · summons ${fired.bytes} B`);
const beat = await waitForSession(ws);
const { sid, tp } = beat as { sid: string; tp: string };
const mine = () => beats().filter(b => b.sid === sid);

const before = 0;
let workSubmitted = 0;
for (let i = 0; i < 120 && !workSubmitted; i++) {
	const u = mine().find(b => b.ev === 'UserPromptSubmit');
	if (u) workSubmitted = u.t; else await sleep(500);
}
console.log(`work turn UserPromptSubmit at ${workSubmitted}`);

await sleep(6000);
const stoppedEarly = mine().some(b => b.ev === 'Stop' && b.t > workSubmitted);
console.log(`6 s in — Stop yet: ${stoppedEarly} (must be false for this to be a mid-turn test)`);

const d0 = Date.now();
await deliverSegmented(ws, MSG);
const deliverMs = Date.now() - d0;
const box = await screen(ws);
await submit(ws);
const submitted = Date.now();
console.log(`delivered ${Buffer.byteLength(MSG)} B / ${MSG.split('\n').length} lines in ${deliverMs} ms`);
console.log(`screen at the mid-turn Enter (the work turn is still streaming above the box):\n${box.split('\n').filter(l => l.trim()).slice(-8).map(l => '  | ' + l).join('\n')}`);

await waitForTurns(tp, before + 2, 300_000);
const visibleMs = Date.now() - submitted;
for (let i = 0; i < 300; i++) {
	if (mine().filter(b => b.ev === 'Stop' && b.t > workSubmitted).length >= 2) break;
	await sleep(1000);
}
await sleep(4000);

const seq = mine().filter(b => b.t >= workSubmitted);
const msgSubmit = seq.find(b => b.ev === 'UserPromptSubmit' && b.t > workSubmitted)!;
const firstStop = seq.find(b => b.ev === 'Stop')!;
const added = userTurns(tp).slice(before);
const raw = readFileSync(tp, 'utf8').split('\n').filter(Boolean).map(l => { try { return JSON.parse(l); } catch { return null; } });
const idx = raw.findIndex((r: any) => r?.type === 'user' && r.message?.content === WORK);
const answer = raw.slice(idx + 1).find((r: any) => r?.type === 'assistant')?.message?.content?.find?.((c: any) => c.type === 'text')?.text ?? '';

console.log(`\ncensus sequence: ${seq.map(b => `${b.ev}@${(b.t - workSubmitted).toFixed(1)}s`).join(' → ')}`);
console.log(`\nQ2-0 the delivery really was mid-turn (its UserPromptSubmit precedes the work turn's Stop): ${msgSubmit.t < firstStop.t ? 'PASS' : 'FAIL'} (+${(msgSubmit.t - workSubmitted).toFixed(1)}s vs +${(firstStop.t - workSubmitted).toFixed(1)}s)`);
console.log(`Q2-1 exactly two user turns, the second byte-exact: ${added.length === 2 && sha(added[1]!.text) === sha(MSG) ? 'PASS' : 'FAIL'} — ${added.map(t => `${Buffer.byteLength(t.text)}B/${sha(t.text).slice(0, 12)}`).join(' ')}`);
console.log(`Q2-2 the in-flight answer was NOT interrupted: ${answer.split('\n').length} lines, ends ${JSON.stringify(answer.slice(-24))}`);
console.log(`Q2-3 turn visible in the transcript ${visibleMs} ms after Enter`);
