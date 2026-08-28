/**
 * P6 Q3 — delivery to a DEAD session. Kills a live probe, then resumes it through the
 * glass's own hand with a message in argv: `--resume <id> "<msg>"`. Proves the message is
 * the first NEW user turn, byte-exact, that the prior conversation is still there, and
 * that the silo held.
 *
 *   bun belvedere/lab/p6/q3.ts <workspace-ref-to-kill>
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { fire, waitForSession, waitForTurns, userTurns, cmux, beats, sha, sleep } from './lib';

const HERE = import.meta.dir;
const ws = process.argv[2]!;
const MSG = readFileSync(join(HERE, 'fixtures', 'f-code.txt'), 'utf8');

const beat = await waitForSession(ws);
const { sid, tp, acct } = beat as { sid: string; tp: string; acct: string };
const beforeTurns = userTurns(tp);
console.log(`live probe ${ws} · session ${sid}\n  account ${acct}\n  transcript ${tp} (${beforeTurns.length} user turns)`);

await cmux(['workspace', 'close', '--workspace', ws]);
console.log('workspace closed — the session is dead');
await sleep(4000);
const alive = beats().filter(b => b.sid === sid).pop()!;
try { process.kill(Number(alive.pid), 0); console.log(`  WARNING: pid ${alive.pid} still alive`); }
catch { console.log(`  pid ${alive.pid} is gone (kill -0 refused)`); }

// B5 E2's law: on a resume the glass omits what it does not know. It DOES know the message —
// a resume WITH one is a deliberate send, which is exactly the write class this probe arms.
const fired = await fire({
	account: 'personal', stamp: '', cwd: '/Users/felix/code/agents',
	model: '', effort: '', color: 'Teal', summons: MSG, resume: sid,
});
console.log(`resumed into ${fired.workspace} · summons ${fired.bytes} B sha ${fired.sha?.slice(0, 16)}`);

const after = await waitForSession(fired.workspace, 180_000);
console.log(`resumed session id ${after.sid} · transcript ${after.tp}`);
const turns = await waitForTurns(after.tp!, 1, 180_000);

// The message is the newest STRING user turn in the resumed transcript.
const newest = turns[turns.length - 1]!;
const carried = turns.length > 1 && sha(turns[0]!.text) === sha(beforeTurns[0]!.text);

console.log(`\nQ3-1 the message is the newest user turn, byte-exact: ${sha(newest.text) === sha(MSG) ? 'PASS' : 'FAIL'}`);
console.log(`     sent ${sha(MSG)} (${Buffer.byteLength(MSG)} B)`);
console.log(`     got  ${sha(newest.text)} (${Buffer.byteLength(newest.text)} B)`);
console.log(`Q3-2 the prior conversation came with it: ${carried ? 'PASS' : 'FAIL'} — ${turns.length} user turns, first is ${JSON.stringify(turns[0]!.text.slice(0, 44))}`);
console.log(`Q3-3 the silo held: ${after.acct === acct ? 'PASS' : 'FAIL'} — ${after.acct}`);
console.log(`Q3-4 session id ${sid === after.sid ? 'REUSED' : 'ROTATED'} — ${sid} → ${after.sid}`);
console.log(`Q3-5 transcript ${tp === after.tp ? 'SAME FILE' : 'NEW FILE'}`);
console.log(`\nworkspace ${fired.workspace}`);
