/**
 * P6 Q1 — live-pane delivery. Drives three payloads at a live, idle Claude TUI through
 * the segmented-paste transport, then two CONTROLS the transport is KNOWN to corrupt.
 *
 *   bun belvedere/lab/p6/q1.ts               # fires its own probe
 *   bun belvedere/lab/p6/q1.ts workspace:50  # reuses a live one
 *
 * Proof per arm: sha256(sent bytes) === sha256(the transcript's next user-turn bytes),
 * and the turn count moved by exactly one.
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { fire, waitForSession, waitForEvent, waitForTurns, userTurns, deliverSegmented, pasteBracketed, pasteNaked, submit, screen, sha, sleep, ESC } from './lib';

const CWD = '/Users/felix/code/agents';
const HERE = import.meta.dir;
const payload = (f: string) => readFileSync(join(HERE, 'fixtures', f), 'utf8');

const SUMMONS = [
	'You are a transport probe. Obey exactly:',
	'Reply to this message with exactly one word: READY',
	'Reply to every later message with exactly one word: ACK',
	'Never use a tool. Never explain. Never say anything else.',
].join('\n');

const results: string[] = [];
const ok = (label: string, pass: boolean, detail: string) => {
	results.push(`${pass ? 'PASS' : 'FAIL'}  ${label}  ${detail}`);
	console.log(`${pass ? 'PASS' : 'FAIL'}  ${label}\n      ${detail}`);
};

const reuse = process.argv[2];
const fired = reuse
	? { workspace: reuse, sha: null as string | null, bytes: 0 }
	: await fire({ account: 'personal', stamp: 'p6-live-01', cwd: CWD, model: 'sonnet', effort: 'low', color: 'Teal', summons: SUMMONS });
console.log(`probe ${fired.workspace}  summons sha ${fired.sha?.slice(0, 16) ?? '(reused)'} ${fired.bytes} B`);

const beat = await waitForSession(fired.workspace);
const { sid, tp } = beat as { sid: string; tp: string };
console.log(`session ${sid}\n  transcript ${tp}`);

const t1 = await waitForTurns(tp, 1);
ok('Q1-0 summons is turn 1, byte-exact (P2 §S re-proven)', sha(t1[0]!.text) === sha(SUMMONS),
	`sent ${sha(SUMMONS).slice(0, 16)} · turn1 ${sha(t1[0]!.text).slice(0, 16)}`);

await waitForEvent(sid, 'Stop', 0);

const arms: [string, string][] = [
	['Q1-A blank lines', payload('a-blanks.txt')],
	['Q1-B literal tabs', payload('b-tabs.txt')],
	['Q1-C metachars, unexpanded $(echo pwned), literal \\n \\t', payload('c-meta.txt')],
];

let n = userTurns(tp).length;
for (const [label, text] of arms) {
	const before = Date.now() / 1000;
	await deliverSegmented(fired.workspace, text);
	await sleep(800);
	const box = await screen(fired.workspace);
	await submit(fired.workspace);
	const turns = await waitForTurns(tp, n + 1);
	const got = turns[turns.length - 1]!.text;
	const exact = sha(got) === sha(text) && turns.length === n + 1;
	n = turns.length;
	ok(label, exact,
		`sent sha ${sha(text).slice(0, 16)} (${Buffer.byteLength(text)} B) · got sha ${sha(got).slice(0, 16)} (${Buffer.byteLength(got)} B) · +${turns.length - (n - 1) - 1 + 1} turn`);
	if (!exact) console.log(`  SENT>>>${JSON.stringify(text)}\n  GOT >>>${JSON.stringify(got)}`);
	console.log(`  box before Enter:\n${box.split('\n').filter(l => l.trim()).slice(-7).map(l => '    | ' + l).join('\n')}`);
	await waitForEvent(sid, 'Stop', before);
}

// ---------- CONTROL 1: the bracketed wrapper. One turn, but the markers land as TEXT
// and every newline lands as CR (0x0d) — the transport rewrites LF (`wire.ts`).
{
	const text = payload('a-blanks.txt');
	const before = Date.now() / 1000;
	await pasteBracketed(fired.workspace, text);
	await sleep(1500);
	await submit(fired.workspace);
	const turns = await waitForTurns(tp, n + 1);
	const got = turns[turns.length - 1]!.text;
	n = turns.length;
	ok('Q1-CTRL-1 bracketed wrapper corrupts (probe can SEE corruption)',
		sha(got) !== sha(text) && got.includes('[200~') && got.includes('\r'),
		`got ${Buffer.byteLength(got)} B · markers as text: ${got.includes('[200~')} · CR for LF: ${got.includes('\r')} · LF present: ${got.includes('\n')}`);
	console.log(`  CTRL-1 received: ${JSON.stringify(got)}`);
	await waitForEvent(sid, 'Stop', before);
}

// ---------- CONTROL 2: the naked paste — P2 T4's mechanism, reproduced on demand.
{
	const text = payload('a-blanks.txt');
	const before = n;
	await pasteNaked(fired.workspace, text);
	await sleep(12_000);
	const turns = userTurns(tp);
	const added = turns.slice(before);
	ok('Q1-CTRL-2 naked paste splits and auto-submits (T4 reproduced)',
		added.length > 1 && !added.some(t => sha(t.text) === sha(text)),
		`one message became ${added.length} user turns, none of them the message: ${JSON.stringify(added.map(t => t.text))}`);
	console.log(`  screen after:\n${(await screen(fired.workspace)).split('\n').filter(l => l.trim()).slice(-6).map(l => '    | ' + l).join('\n')}`);
}

console.log(`\n---- Q1 summary ----\n${results.join('\n')}`);
console.log(`\nworkspace ${fired.workspace} · session ${sid} · transcript ${tp}`);
