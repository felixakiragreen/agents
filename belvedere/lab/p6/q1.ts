/**
 * P6 Q1 — live-pane delivery. Drives five payloads at a live, idle Claude TUI through the
 * segmented transport, then two CONTROLS the transport is KNOWN to corrupt.
 *
 *   bun belvedere/lab/p6/q1.ts               # fires its own probe
 *   bun belvedere/lab/p6/q1.ts workspace:50  # reuses a live one
 *
 * Proof per arm: sha256(sent bytes) === sha256(the transcript's next user-turn bytes),
 * and the turn count moved by exactly one.
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { fire, waitForSession, waitForEvent, waitForTurns, userTurns, deliverSegmented, pasteBracketed, pasteNaked, submit, screen, sha, sleep } from './lib';

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

/** Deliver, submit, and hand back exactly the user turns the delivery added. */
async function send(text: string) {
	const before = userTurns(tp).length;
	const t0 = Date.now() / 1000;
	await deliverSegmented(fired.workspace, text);
	await sleep(800);
	const box = await screen(fired.workspace);
	await submit(fired.workspace);
	const turns = await waitForTurns(tp, before + 1);
	await waitForEvent(sid, 'Stop', t0);
	return { added: turns.slice(before), box, ms: Math.round((Date.now() / 1000 - t0) * 1000) };
}

for (const [label, file] of [
	['Q1-A blank lines', 'a-blanks.txt'],
	['Q1-C metachars, unexpanded $(echo pwned), literal \\n \\t \\r, unicode', 'c-meta.txt'],
	['Q1-D indentation and trailing spaces', 'd-indent.txt'],
	['Q1-F a fenced code block, 304 B', 'f-code.txt'],
] as [string, string][]) {
	const text = payload(file);
	const { added, ms } = await send(text);
	const exact = added.length === 1 && sha(added[0]!.text) === sha(text);
	ok(label, exact, `sent ${sha(text)} (${Buffer.byteLength(text)} B) · got ${sha(added[0]?.text ?? '')} (${Buffer.byteLength(added[0]?.text ?? '')} B) · ${added.length} turn · ${ms} ms`);
	if (!exact) console.log(`  SENT>>>${JSON.stringify(text)}\n  GOT >>>${JSON.stringify(added.map(t => t.text))}`);
}

// ---------- the ONE named limit: a literal TAB never reaches a live TUI ----------
{
	const text = payload('b-tabs.txt');
	const { added } = await send(text);
	const got = added[0]?.text ?? '';
	ok('Q1-B literal TAB is SWALLOWED BY THE TUI (named limit, not a transport bug)',
		added.length === 1 && got !== text && !got.includes('\t') && text.includes('\t'),
		`sent ${Buffer.byteLength(text)} B with ${(text.match(/\t/g) || []).length} tabs · got ${Buffer.byteLength(got)} B with ${(got.match(/\t/g) || []).length} · the wire carried every 0x09 (wire.ts b-tabs)`);
	console.log(`  GOT >>>${JSON.stringify(got)}`);
}

// ---------- CONTROL 1: the bracketed wrapper — markers land as TEXT, LF lands as CR ----------
{
	const text = payload('a-blanks.txt');
	const before = userTurns(tp).length;
	const t0 = Date.now() / 1000;
	await pasteBracketed(fired.workspace, text);
	await sleep(1500);
	await submit(fired.workspace);
	const turns = await waitForTurns(tp, before + 1);
	const added = turns.slice(before);
	const all = added.map(t => t.text).join('');
	ok('Q1-CTRL-1 bracketed wrapper corrupts (the probe can SEE corruption)',
		!added.some(t => sha(t.text) === sha(text)) && all.includes('[200~'),
		`${added.length} turn(s), none the message · markers as text: ${all.includes('[200~') || all.includes('[201~')} · CR for LF: ${all.includes('\r')}`);
	console.log(`  CTRL-1 received: ${JSON.stringify(added.map(t => t.text))}`);
	await waitForEvent(sid, 'Stop', t0);
}

// ---------- CONTROL 2: the naked paste — P2 T4's mechanism, reproduced on demand ----------
{
	const text = payload('a-blanks.txt');
	const before = userTurns(tp).length;
	await pasteNaked(fired.workspace, text);
	await sleep(15_000);
	const added = userTurns(tp).slice(before);
	const box = await screen(fired.workspace);
	ok('Q1-CTRL-2 naked paste auto-submits and strands the rest (T4 reproduced)',
		!added.some(t => sha(t.text) === sha(text)),
		`one message became ${added.length} submitted turn(s), none of them the message, with the remainder left in the input box`);
	console.log(`  CTRL-2 received: ${JSON.stringify(added.map(t => t.text))}`);
	console.log(`  box after:\n${box.split('\n').filter(l => l.trim()).slice(-6).map(l => '    | ' + l).join('\n')}`);
	await submit(fired.workspace);   // flush the stranded remainder so the probe is clean
}

console.log(`\n---- Q1 summary ----\n${results.join('\n')}`);
console.log(`\nworkspace ${fired.workspace} · session ${sid} · transcript ${tp}`);
