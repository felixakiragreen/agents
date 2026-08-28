/**
 * P6 Q1 — live-pane delivery. Fires ONE probe session through the glass's own hands,
 * then drives three payloads at its live, idle TUI with the bracketed-paste wrapper,
 * and finally the CONTROL: the same path with no wrapper (P2 T4's mechanism).
 *
 *   bun belvedere/lab/p6/q1.ts
 *
 * Proof per arm: sha256(sent bytes) === sha256(the transcript's next user-turn bytes).
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { fire, waitForSession, waitForEvent, waitForTurns, userTurns, pasteBracketed, pasteNaked, submit, screen, cmux, sha, sleep } from './lib';

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

// `bun q1.ts` fires a fresh probe; `bun q1.ts workspace:50` reuses a live one (the fire is
// proven either way — a reused probe still carries its own summons as turn 1).
const reuse = process.argv[2];
const fired = reuse
	? { workspace: reuse, sha: null as string | null, bytes: 0 }
	: await fire({ account: 'personal', stamp: 'p6-live-01', cwd: CWD, model: 'sonnet', effort: 'low', color: 'Teal', summons: SUMMONS });
console.log(`probe ${fired.workspace}  summons sha ${fired.sha?.slice(0, 16) ?? '(reused)'} ${fired.bytes} B`);

const beat = await waitForSession(fired.workspace);
const { sid, tp } = beat as { sid: string; tp: string };
console.log(`session ${sid}\n  transcript ${tp}`);

// The summons must have landed byte-exact as turn 1 (P2's law, re-proven here as the baseline).
const t1 = await waitForTurns(tp, 1);
ok('Q1-0 summons is turn 1, byte-exact', sha(t1[0]!.text) === sha(SUMMONS),
	`sent ${sha(SUMMONS).slice(0, 16)} · turn1 ${sha(t1[0]!.text).slice(0, 16)}`);

await waitForEvent(sid, 'Stop', 0);
console.log('probe idle (Stop)');

const arms: [string, string][] = [
	['Q1-A blank lines', payload('a-blanks.txt')],
	['Q1-B literal tabs', payload('b-tabs.txt')],
	['Q1-C metachars + literal \\n \\t', payload('c-meta.txt')],
];

let turnsSoFar = 1;
for (const [label, text] of arms) {
	const before = Date.now() / 1000;
	await pasteBracketed(fired.workspace, text);
	await sleep(1200);
	const box = await screen(fired.workspace);
	await submit(fired.workspace);
	const turns = await waitForTurns(tp, turnsSoFar + 1);
	turnsSoFar += 1;
	const got = turns[turns.length - 1]!.text;
	ok(label, sha(got) === sha(text),
		`sent sha ${sha(text).slice(0, 16)} (${Buffer.byteLength(text)} B) · received sha ${sha(got).slice(0, 16)} (${Buffer.byteLength(got)} B) · turns ${turns.length}`);
	if (sha(got) !== sha(text)) console.log(`  SENT>>>${JSON.stringify(text)}\n  GOT >>>${JSON.stringify(got)}`);
	console.log(`  input box after paste, before Enter:\n${box.split('\n').slice(-8).map(l => '    | ' + l).join('\n')}`);
	await waitForEvent(sid, 'Stop', before);
}

// ---------- the CONTROL: no wrapper. This mechanism is KNOWN to corrupt (P2 T4). ----------
{
	const text = payload('a-blanks.txt');
	const before = Date.now() / 1000;
	await pasteNaked(fired.workspace, text);
	await sleep(4000);
	const box = await screen(fired.workspace);
	const turns = userTurns(tp);
	const got = turns.length > turnsSoFar ? turns[turns.length - 1]!.text : '(nothing submitted)';
	ok('Q1-CONTROL naked paste corrupts (probe can SEE corruption)', sha(got) !== sha(text),
		`sent sha ${sha(text).slice(0, 16)} (${Buffer.byteLength(text)} B) · received ${got === '(nothing submitted)' ? got : `sha ${sha(got).slice(0, 16)} (${Buffer.byteLength(got)} B)`}`);
	console.log(`  CONTROL received: ${JSON.stringify(got)}`);
	console.log(`  screen after naked paste:\n${box.split('\n').slice(-12).map(l => '    | ' + l).join('\n')}`);
}

console.log(`\n---- Q1 summary ----\n${results.join('\n')}`);
console.log(`\nworkspace ${fired.workspace} · session ${sid} · transcript ${tp}`);
console.log(`close with: cmux workspace close --workspace ${fired.workspace}`);
