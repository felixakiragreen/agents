// The liveness state machine, table-driven. This is the one piece of the spine that can be
// wrong silently — every other bug renders visibly on the page.
//
// The law under test (P1 F5): the census says what a session WAS DOING; `kill -0 pid` says
// whether it still EXISTS. Never render a state without both.

import { expect, test } from 'bun:test';
import { sessionState, isAlive, toBeat, STALE_SECONDS, type Beat, type SessionState } from './census';

const NOW = 1_800_000_000;
const beat = (ev: string, over: Partial<Beat> = {}): Beat =>
	({ t: NOW, ev, sid: 's', acct: null, pid: 4242, ws: null, sf: null, cwd: null, tp: null, tool: null, why: null, ...over });

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
	// `pmt`, `mode`, `aid`, `at` and the capped `bg` roster (bulletin §3) are deliberately not
	// read by the spine — B5's WIP gauges own them.
	expect(sessionState(toBeat(WIRE)!, true, WIRE.t + 10)).toBe('idle');
});

test('wire: the venue join is present or honestly absent, never an empty pane (B4)', () => {
	// Hooks are venue-blind (P1 F1): a Ghostty session stamps `""` for both, and `/hands/focus`
	// must read that as "no panel to jump to" rather than as a panel named "".
	const outside = toBeat(WIRE)!;
	expect([outside.ws, outside.sf]).toEqual([null, null]);
	const inside = toBeat({ ...WIRE, ws: 'workspace-uuid', sf: 'surface-uuid' })!;
	expect([inside.ws, inside.sf]).toEqual(['workspace-uuid', 'surface-uuid']);
});
