/**
 * P6 Q4 — the failure faces. What each way of getting it wrong looks like FROM THE GLASS,
 * and whether the glass can see it BEFORE it sends rather than after.
 *
 *   bun belvedere/lab/p6/q4.ts <live-probe-workspace-ref>
 *
 * Nothing here presses Enter at a target it should not have chosen: the whole point is that
 * a wrong target must be refused, not recovered from.
 */

import { rmSync, mkdirSync, existsSync } from 'fs';
import { fire, waitForSession, deliverSegmented, cmux, beats, screen, sleep } from './lib';

const live = process.argv[2]!;
const say = (label: string, detail: string) => console.log(`\n### ${label}\n${detail}`);

// ---------- F1: a workspace that no longer exists ----------
{
	const ws = (await cmux(['workspace', 'create', '--name', 'p6-dead', '--cwd', '/tmp', '--focus', 'false'])).split(/\s+/)[1]!;
	await cmux(['workspace', 'close', '--workspace', ws]);
	await sleep(1500);
	const faces: string[] = [];
	for (const args of [['set-buffer', '--name', 'p6d', '--', 'x'], ['paste-buffer', '--name', 'p6d', '--workspace', ws], ['send-key', '--workspace', ws, 'enter'], ['read-screen', '--workspace', ws]])
		await cmux(args).then(o => faces.push(`${args[0]} → OK ${o.split('\n')[0]}`)).catch(e => faces.push(`${args[0]} → ${(e as Error).message}`));
	say('F1 dead workspace (closed under us)', faces.join('\n'));
}

// ---------- F2: a workspace ref that never existed ----------
{
	const faces: string[] = [];
	for (const args of [['paste-buffer', '--name', 'p6d', '--workspace', 'workspace:9999'], ['send-key', '--workspace', 'workspace:9999', 'enter'], ['read-screen', '--workspace', 'workspace:9999']])
		await cmux(args).then(o => faces.push(`${args[0]} → OK ${o.split('\n')[0]}`)).catch(e => faces.push(`${args[0]} → ${(e as Error).message}`));
	say('F2 a workspace ref that never existed', faces.join('\n'));
}

// ---------- F3: the surface is a SHELL, not a Claude TUI ----------
{
	const ws = (await cmux(['workspace', 'create', '--name', 'p6-shell', '--cwd', '/tmp', '--focus', 'false'])).split(/\s+/)[1]!;
	await sleep(4000);
	await deliverSegmented(ws, 'echo p6-would-have-run-as-a-command');
	await sleep(1000);
	const box = await screen(ws);
	const uuid = (await cmux(['workspace', 'list', '--id-format', 'both'])).split('\n')
		.find(l => l.trim().replace(/^\*\s*/, '').startsWith(ws + ' '))!.trim().split(/\s+/)[1]!;
	say('F3 the target is a shell, not a Claude session (Enter NOT pressed)',
		`every byte went into zsh's line editor; one Enter would have EXECUTED it:\n${box.split('\n').filter(l => l.trim()).slice(-3).map(l => '  | ' + l).join('\n')}\n` +
		`census beats ever naming this workspace: ${beats().filter(b => b.ws === uuid).length}`);
	await cmux(['workspace', 'close', '--workspace', ws]);
}

// ---------- F4: the TUI is holding the trust dialog (B7 F1 / P5 F3) ----------
{
	const dir = '/Users/felix/code/p6-cold-repo';
	if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
	mkdirSync(dir);
	await Bun.$`git -C ${dir} init -q`;
	const t0 = Date.now() / 1000;
	const fired = await fire({ account: 'personal', stamp: 'p6-cold-01', cwd: dir, model: 'sonnet', effort: 'low', color: 'Charcoal', summons: 'Reply with exactly: COLD' });
	await sleep(45_000);
	const uuid = (await cmux(['workspace', 'list', '--id-format', 'both'])).split('\n').find(l => l.trim().replace(/^\*\s*/, '').startsWith(fired.workspace + ' '))!.trim().split(/\s+/)[1]!;
	const mine = beats().filter(b => b.ws === uuid && b.t >= t0);
	const before = await screen(fired.workspace);
	await deliverSegmented(fired.workspace, 'a message for a session that is not there yet');
	await sleep(1200);
	const after = await screen(fired.workspace);
	say('F4 the session is holding the trust dialog — Enter would ANSWER IT (never pressed)',
		`census beats for this workspace: ${mine.length} (P5 F3's trust-stall signature: zero beats, no transcript, live pid)\n` +
		`screen BEFORE delivery:\n${before.split('\n').filter(l => l.trim()).slice(-6).map(l => '  | ' + l).join('\n')}\n` +
		`screen AFTER delivery (no Enter):\n${after.split('\n').filter(l => l.trim()).slice(-6).map(l => '  | ' + l).join('\n')}`);
	await cmux(['workspace', 'close', '--workspace', fired.workspace]);
	rmSync(dir, { recursive: true, force: true });
	console.log(`  scratch repo removed: ${existsSync(dir) ? 'STILL THERE' : 'gone'}`);
}

// ---------- F5: the input box is not empty (Felix was half-way through a draft) ----------
{
	await deliverSegmented(live, 'HALF A DRAFT FELIX WAS TYPING');
	await sleep(800);
	const dirty = await screen(live);
	await deliverSegmented(live, 'and the glass appends to it');
	await sleep(800);
	const merged = await screen(live);
	say('F5 the box already held something',
		`the transport appends — it does not replace, and there is no key that clears the box safely:\n` +
		`  before: ${dirty.split('\n').filter(l => l.trim().startsWith('❯')).slice(-1)[0]?.trim()}\n` +
		`  after:  ${merged.split('\n').filter(l => l.trim().startsWith('❯')).slice(-1)[0]?.trim()}`);
}
