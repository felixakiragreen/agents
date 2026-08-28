/**
 * P6 — the message transport. Probe library.
 *
 * Disposable lab code (digger mantle §6): runnable, not polished. Everything here
 * either fires a probe session through the glass's own hands, drives one transport
 * candidate at a live cmux surface, or reads the two sensors that judge it — the
 * census (`census.jsonl`) and the session's own transcript.
 */

import { readFileSync } from 'fs';
import { createHash } from 'crypto';
import { homedir } from 'os';
import { join } from 'path';

export const GLASS = 'http://127.0.0.1:4400';
export const CENSUS = join(homedir(), 'code/agents/summon/log/census/census.jsonl');
export const ESC = '\x1b';

export const sha = (s: string) => createHash('sha256').update(s, 'utf8').digest('hex');
export const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// ---------- the hands ----------

export type FireOpts = {
	account: string; stamp: string; cwd: string; model: string; effort: string;
	color: string; summons: string; resume?: string;
};

export async function fire(o: FireOpts): Promise<{ workspace: string; sha: string | null; bytes: number }> {
	const r = await fetch(`${GLASS}/hands/fire`, {
		method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(o),
	});
	const body = await r.json() as { ok: boolean; result?: any; error?: string };
	if (!body.ok) throw new Error(`fire refused ${r.status}: ${body.error}`);
	return body.result;
}

// ---------- the census sensor ----------

export type Beat = {
	t: number; ev: string; sid: string; acct: string; ws: string; sf: string; pid: string;
	cwd: string | null; tp: string | null; mode: string | null; why: string | null;
};

export const beats = (): Beat[] =>
	readFileSync(CENSUS, 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l) as Beat);

/**
 * `/hands/fire` returns a workspace REF (`workspace:50`); the census stamps the workspace
 * UUID. The join is ref → UUID → `b.ws`, and it is the only sound one: joining a fired
 * session by cwd matches every other session in the same building, this one included.
 */
export async function workspaceUuid(ref: string): Promise<string> {
	const line = (await cmux(['workspace', 'list', '--id-format', 'both']))
		.split('\n').find(l => l.trim().replace(/^\*\s*/, '').startsWith(ref + ' '));
	if (!line) throw new Error(`workspace ${ref} not in the live list`);
	return line.trim().split(/\s+/)[1]!;
}

export async function waitForSession(ref: string, timeoutMs = 120_000): Promise<Beat> {
	const uuid = await workspaceUuid(ref);
	const deadline = Date.now() + timeoutMs;
	while (Date.now() < deadline) {
		const found = beats().filter(b => b.ws === uuid && b.tp);
		if (found.length) return found[found.length - 1]!;
		await sleep(1000);
	}
	throw new Error(`no census beat with ws=${uuid} (${ref}) within ${timeoutMs}ms — trust stall or dead fire`);
}

export async function waitForEvent(sid: string, ev: string, after: number, timeoutMs = 180_000): Promise<Beat> {
	const deadline = Date.now() + timeoutMs;
	while (Date.now() < deadline) {
		const hit = beats().find(b => b.sid === sid && b.ev === ev && b.t > after);
		if (hit) return hit;
		await sleep(1000);
	}
	throw new Error(`no ${ev} for ${sid} within ${timeoutMs}ms`);
}

// ---------- the transcript sensor ----------

/** A real user turn: `.type == "user"`, content a STRING (tool results are arrays), not meta. */
export function userTurns(tp: string): { text: string; ts: string }[] {
	return readFileSync(tp, 'utf8').split('\n').filter(Boolean).map(l => {
		try { return JSON.parse(l); } catch { return null; }
	}).filter((r: any) => r && r.type === 'user' && typeof r.message?.content === 'string' && !r.isMeta)
		.map((r: any) => ({ text: r.message.content as string, ts: r.timestamp as string }));
}

export async function waitForTurns(tp: string, n: number, timeoutMs = 180_000) {
	const deadline = Date.now() + timeoutMs;
	while (Date.now() < deadline) {
		const t = userTurns(tp);
		if (t.length >= n) return t;
		await sleep(1000);
	}
	throw new Error(`transcript ${tp} never reached ${n} user turns`);
}

// ---------- the transports ----------

/** CANDIDATE (a): bracketed paste. The wrapper a terminal emulator adds to a human's paste. */
export async function pasteBracketed(ws: string, text: string, name = 'p6') {
	await cmux(['set-buffer', '--name', name, '--', `${ESC}[200~${text}${ESC}[201~`]);
	await cmux(['paste-buffer', '--name', name, '--workspace', ws]);
}

/** CONTROL: the same path with no wrapper — P2 T4's mechanism, known to split and auto-submit. */
export async function pasteNaked(ws: string, text: string, name = 'p6ctl') {
	await cmux(['set-buffer', '--name', name, '--', text]);
	await cmux(['paste-buffer', '--name', name, '--workspace', ws]);
}

export const submit = (ws: string) => cmux(['send-key', '--workspace', ws, 'enter']);
export const screen = (ws: string) => cmux(['read-screen', '--workspace', ws]);

export async function cmux(args: string[]): Promise<string> {
	const p = Bun.spawn(['cmux', ...args], { stdout: 'pipe', stderr: 'pipe', env: { ...process.env, CMUX_QUIET: '1' } });
	const [out, err] = await Promise.all([new Response(p.stdout).text(), new Response(p.stderr).text()]);
	const code = await p.exited;
	if (code !== 0) throw new Error(`cmux ${args[0]} exit ${code}: ${err.trim() || out.trim()}`);
	return out.trim();
}
