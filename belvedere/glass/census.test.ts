// The liveness state machine, table-driven. This is the one piece of the spine that can be
// wrong silently — every other bug renders visibly on the page.
//
// The law under test (P1 F5): the census says what a session WAS DOING; `kill -0 pid` says
// whether it still EXISTS. Never render a state without both.

import { expect, test } from 'bun:test';
import { sessionState, isAlive, identify, toBeat, BG_CAP, STALE_SECONDS, type Beat, type SessionState } from './census';
import { mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const NOW = 1_800_000_000;
const beat = (ev: string, over: Partial<Beat> = {}): Beat =>
	({ t: NOW, ev, sid: 's', acct: null, pid: 4242, ws: null, sf: null, cwd: null, tp: null, tool: null, why: null,
		aid: null, at: null, bg: [], ...over });

type Case = [name: string, last: Beat, alive: boolean | null, want: SessionState];

const CASES: Case[] = [
	// --- the event table, pid alive ---
	['SessionStart is idle, not working — it has no prompt yet', beat('SessionStart', { why: 'startup' }), true, 'idle'],
	['UserPromptSubmit → working', beat('UserPromptSubmit'), true, 'working'],
	['PreToolUse → working', beat('PreToolUse', { tool: 'Bash' }), true, 'working'],
	['PostToolUse → working', beat('PostToolUse', { tool: 'Bash' }), true, 'working'],
	['SubagentStart → working', beat('SubagentStart'), true, 'working'],
	['SubagentStop → working (the parent is still going)', beat('SubagentStop'), true, 'working'],
	['PreCompact → working', beat('PreCompact'), true, 'working'],
	['Stop is the idle sensor', beat('Stop'), true, 'idle'],
	['Notification/permission_prompt → needs-input', beat('Notification', { why: 'permission_prompt' }), true, 'needs-input'],
	['Notification/idle_prompt is a 60 s nag, not a new state', beat('Notification', { why: 'idle_prompt' }), true, 'idle'],
	['SessionEnd → gone', beat('SessionEnd', { why: 'prompt_input_exit' }), true, 'gone'],
	['an event the map does not name renders unknown, never a guess', beat('SomeFutureHook'), true, 'unknown'],

	// --- F5 trap 1: the hard kill. The census's last line stays `Stop` forever. ---
	['pid dead + last line Stop → gone, not idle', beat('Stop'), false, 'gone'],
	['pid dead mid-tool → gone, not working', beat('PreToolUse', { tool: 'Bash' }), false, 'gone'],
	['pid dead + permission prompt → gone', beat('Notification', { why: 'permission_prompt' }), false, 'gone'],
	['SessionEnd outranks a live pid (the id was rotated or reused)', beat('SessionEnd'), true, 'gone'],

	// --- F5 trap 2: no pid on the record. Cannot ask ⇒ cannot claim. ---
	['no pid + working events → unknown, never working', beat('PreToolUse', { pid: null }), null, 'unknown'],
	['no pid + Stop → unknown, not idle', beat('Stop', { pid: null }), null, 'unknown'],
	['no pid + SessionEnd is still gone — the record said so itself', beat('SessionEnd', { pid: null }), null, 'gone'],

	// --- stale census: only `working` decays ---
	['working just inside the stale window stays working', beat('PreToolUse', { t: NOW - STALE_SECONDS + 60 }), true, 'working'],
	['working past the stale window → unknown, never working', beat('PreToolUse', { t: NOW - STALE_SECONDS - 1 }), true, 'unknown'],
	['a week-old UserPromptSubmit → unknown', beat('UserPromptSubmit', { t: NOW - 604800 }), true, 'unknown'],
	['idle does not decay — a live pid that said Stop last year really is idle', beat('Stop', { t: NOW - 604800 }), true, 'idle'],
	['needs-input does not decay — Felix takes as long as Felix takes', beat('Notification', { why: 'permission_prompt', t: NOW - 604800 }), true, 'needs-input'],
	['a stale record whose pid is dead is gone, not unknown', beat('PreToolUse', { t: NOW - 604800 }), false, 'gone'],
];

for (const [name, last, alive, want] of CASES)
	test(name, () => expect(sessionState(last, alive, NOW)).toBe(want));

test('isAlive: our own pid is alive, pid 1 is alive (EPERM counts), a null pid is unaskable', () => {
	expect(isAlive(process.pid)).toBe(true);
	expect(isAlive(1)).toBe(true);
	expect(isAlive(null)).toBe(null);
});

test('isAlive: a pid that cannot exist is dead', () => {
	// 2^22 is above every default `kern.maxproc`; nothing is ever assigned it here.
	expect(isAlive(4194303)).toBe(false);
});

// --- the wire contract with B1's `beat.sh`, locked to the batch-2 bulletin's three shapes ---

/** B1's own `Stop` line, verbatim from a live hooked session (b1-census-deploy.md §DoD-1). */
const WIRE = {
	t: 1787801171.752986, ev: 'Stop', sid: 'fa284eec-60f3-4581-8e74-e5aa5f652975',
	acct: '/Users/felix/.claude', ws: '', sf: '', pid: '89626',
	cwd: '…/scratchpad/venue-hooks', tp: '/Users/felix/.claude/projects/…/fa284eec-….jsonl',
	pmt: 'fb6a1fd5-67d7-4cd7-8012-b4960bd874fd', mode: 'default', aid: null, at: null,
	tool: null, why: null,
	bg: [{ id: 'a10431f998c45d31f', type: 'subagent', status: 'running', agent_type: 'general-purpose' }],
};

test('wire: `pid` is a string on the wire and a number in the glass (bulletin §2)', () => {
	expect(toBeat(WIRE)!.pid).toBe(89626);
});

test('wire: jq --arg empty strings become nulls, never "" (bulletin §1)', () => {
	const b = toBeat({ ...WIRE, acct: '', cwd: '', tp: '', tool: '', why: '' })!;
	expect([b.acct, b.cwd, b.tp, b.tool, b.why]).toEqual([null, null, null, null, null]);
});

test('wire: a record with no sid, no ev or no timestamp is unreadable, not half-trusted', () => {
	expect(toBeat({ ...WIRE, sid: '' })).toBe(null);
	expect(toBeat({ ...WIRE, ev: undefined })).toBe(null);
	expect(toBeat({ ...WIRE, t: '1787812345' })).toBe(null);
	expect(toBeat('not an object')).toBe(null);
});

test('wire: a pid that is absent, empty or junk is unaskable, never pid 0', () => {
	for (const pid of [undefined, null, '', 'x', '0', '-1'])
		expect(toBeat({ ...WIRE, pid })!.pid).toBe(null);
});

test('wire: the full record renders a state, and no dropped field is load-bearing', () => {
	// `pmt` and `mode` are still deliberately unread; `aid`, `at` and `bg` are B5's, below.
	expect(sessionState(toBeat(WIRE)!, true, WIRE.t + 10)).toBe('idle');
});

// --- B5's three fields: the agent join and the capped roster ---

test('wire: the roster arrives typed, and a `""` agent_type reads as absent', () => {
	// Measured on the live census: `SubagentStop` carries an `agent_id` with an EMPTY
	// `agent_type`, while `PreToolUse` inside a running subagent carries both.
	const b = toBeat({ ...WIRE, aid: 'a034cd32d4c166d84', at: '' })!;
	expect([b.aid, b.at]).toEqual(['a034cd32d4c166d84', null]);
	expect(b.bg).toEqual([{ id: 'a10431f998c45d31f', type: 'subagent', status: 'running', agentType: 'general-purpose' }]);
});

test('wire: a roster entry with no id names nothing and is dropped; the rest still counts', () => {
	const b = toBeat({ ...WIRE, bg: [{ type: 'shell' }, { id: 'x', type: 'shell' }] })!;
	expect(b.bg).toEqual([{ id: 'x', type: 'shell', status: 'unknown', agentType: null }]);
});

test('wire: `bg` absent or junk is an empty roster, never a crash and never a guess', () => {
	for (const bg of [undefined, null, 'many', 7, {}]) expect(toBeat({ ...WIRE, bg })!.bg).toEqual([]);
});

test('wire: the roster is capped at BG_CAP — a full one is a sample, and says so (bulletin §3)', () => {
	const many = Array.from({ length: 40 }, (_, n) => ({ id: `a${n}`, type: 'subagent', status: 'running' }));
	expect(toBeat({ ...WIRE, bg: many })!.bg.length).toBe(BG_CAP);
});

test('wire: the venue join is present or honestly absent, never an empty pane (B4)', () => {
	// Hooks are venue-blind (P1 F1): a Ghostty session stamps `""` for both, and `/hands/focus`
	// must read that as "no panel to jump to" rather than as a panel named "".
	const outside = toBeat(WIRE)!;
	expect([outside.ws, outside.sf]).toEqual([null, null]);
	const inside = toBeat({ ...WIRE, ws: 'workspace-uuid', sf: 'surface-uuid' })!;
	expect([inside.ws, inside.sf]).toEqual(['workspace-uuid', 'surface-uuid']);
});

// --- the identity join: who a transcript is, from a bounded head window (B2 F1, B5's shelf) ---

const transcript = (lines: unknown[]): string => {
	const dir = mkdtempSync(join(tmpdir(), 'b5-identity-'));
	const path = join(dir, 'd285127e-0000-4000-8000-00000000abcd.jsonl');
	writeFileSync(path, lines.map(l => JSON.stringify(l)).join('\n') + '\n');
	return path;
};

test('identity: the name-stamp and the cwd come off the transcript, never off the slug', () => {
	const path = transcript([
		{ type: 'custom-title', customTitle: 'p4ctl-hup' },
		{ type: 'agent-name', agentName: 'digger-agents-04' },
		{ type: 'user', cwd: '/Users/felix/code/universal_robots_sdk', message: { role: 'user', content: 'hi' } },
	]);
	expect(identify(path)).toEqual({ stamp: 'digger-agents-04', cwd: '/Users/felix/code/universal_robots_sdk', model: null });
	rmSync(path, { force: true });
});

test('identity: a transcript with a title but no agent-name is UNSTAMPED, not titled', () => {
	// Real shape, measured across the live corpus: **307 of 723 transcripts carry no
	// `agent-name` at all**, and 9 of those carry a `custom-title` instead. A title is what a
	// human typed; a stamp is what `claude -n` wrote, and only the second one is a lineage.
	const path = transcript([
		{ type: 'agent-color', agentColor: 'green' },
		{ type: 'custom-title', customTitle: 'grand-architect' },
		{ type: 'user', cwd: '/Users/felix/code/agents', message: { role: 'user', content: 'hi' } },
	]);
	expect(identify(path)).toEqual({ stamp: null, cwd: '/Users/felix/code/agents', model: null });
	rmSync(path, { force: true });
});

test('identity: a renamed session reads its LAST stamp, and a head with no turn has no cwd', () => {
	const path = transcript([
		{ type: 'agent-name', agentName: 'builder-agents-01' },
		{ type: 'agent-name', agentName: 'builder-agents-02' },
	]);
	expect(identify(path)).toEqual({ stamp: 'builder-agents-02', cwd: null, model: null });
	rmSync(path, { force: true });
});

test('identity: an unreadable transcript is unknown on both counts, never a throw', () => {
	expect(identify('/no/such/transcript.jsonl')).toEqual({ stamp: null, cwd: null, model: null });
});
