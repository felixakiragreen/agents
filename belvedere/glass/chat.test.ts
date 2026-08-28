// The Chat's testable half (B16): the compose-time refusal law, the transcript window and its byte
// offsets, the turn grammar, the drafts, and the verification read's three failure verdicts.
//
// What is NOT here is a cmux socket or a live session. `deliver()` is P6's measured transport and
// `sendMessage()` drives Felix's real desktop — proving either in `bun test` would mean a suite that
// types into whatever pane he is looking at (B8 F1's lesson, and P6's own disclosed accident). Those
// ride `lab/b16/probe.ts` against a real fired probe session, which is where the DoD's byte-exact
// shas come from. **Everything that can be a pure function is one, and lives here.**

import { expect, test, describe, afterAll, beforeAll } from 'bun:test';
import { mkdtempSync, rmSync, writeFileSync, appendFileSync, statSync, existsSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { MESSAGE_LIMITS, refusals } from './deck-model';
import {
	blocksOf, boxOf, draftFile, parseMessage, readDraft, sendable, turnsAfter, turnsOf, verify,
	windowOf, writeDraft, type Located,
} from './chat';

const tmp = mkdtempSync(join(tmpdir(), 'b16-'));
afterAll(() => rmSync(tmp, { recursive: true, force: true }));

// ---------- the corpus: a transcript shaped exactly like the harness's own ----------

const user = (text: string, ts = '2026-08-28T01:00:00.000Z') =>
	JSON.stringify({ type: 'user', isSidechain: false, timestamp: ts, message: { role: 'user', content: text } });

const toolResult = () =>
	JSON.stringify({ type: 'user', isSidechain: false, timestamp: '2026-08-28T01:00:01.000Z', message: { role: 'user', content: [{ type: 'tool_result', tool_use_id: 'toolu_1' }] } });

const say = (text: string, ts = '2026-08-28T01:00:02.000Z') =>
	JSON.stringify({ type: 'assistant', isSidechain: false, timestamp: ts, message: { model: 'claude-sonnet-4-5', content: [{ type: 'text', text }] } });

const uses = (name: string, input: Record<string, unknown>) =>
	JSON.stringify({ type: 'assistant', isSidechain: false, timestamp: '2026-08-28T01:00:03.000Z', message: { model: 'claude-sonnet-4-5', content: [{ type: 'tool_use', name, input }] } });

const file = (name: string, lines: string[]): string => {
	const path = join(tmp, name);
	writeFileSync(path, lines.join('\n') + '\n');
	return path;
};

// ---------- the compose-time refusals (P6's law, the one both sides import) ----------

describe('refused at compose, never at send — P6 §T', () => {
	test('a literal TAB is refused by name: the TUI swallows every one (T6)', () => {
		const bad = refusals('col1\tcol2');
		expect(bad.map(b => b.code)).toContain('tab');
		// Felix's own directives are tabs at width 3, so this fires on real content — which is exactly
		// why it is a refusal and not a silent expansion (P6 F3: rewriting his bytes is not the fix).
		expect(bad.find(b => b.code === 'tab')!.text).toContain('P6 T6');
	});

	test('a first line beginning "/" is refused: it creates ZERO user turns (T8)', () => {
		expect(refusals('/status and then some words').map(b => b.code)).toContain('command');
		// `!` and `#` are the same family by construction and were never separately measured. Refusing
		// more is safe; a `!` that ran as a shell command in his session is not a nice measurement.
		expect(refusals('!rm -rf /').map(b => b.code)).toContain('command');
		expect(refusals('#remember this').map(b => b.code)).toContain('command');
		// A slash anywhere BUT the head of the first line is just a slash.
		expect(refusals('see ~/code/agents\n/status').map(b => b.code)).not.toContain('command');
	});

	test('a legal multi-line message with blank lines and indents is refused for nothing', () => {
		expect(refusals('one\n\n    indented two\ntrailing three   ')).toEqual([]);
	});

	test('everything has a limit: bytes and lines, because the transport is a clock (F4)', () => {
		expect(refusals('x'.repeat(MESSAGE_LIMITS.bytes + 1)).map(b => b.code)).toContain('bytes');
		expect(refusals('x\n'.repeat(MESSAGE_LIMITS.lines)).map(b => b.code)).toContain('lines');
		expect(refusals('   ').map(b => b.code)).toContain('empty');
	});

	test('the parse boundary refuses what sanitizing would REWRITE, rather than rewriting it', () => {
		const sid = '11111111-2222-4333-8444-555555555555';
		// A CR would arrive as a second line; a control byte would be stripped. Either way the bytes
		// the glass claims to send would not be the bytes it sent, and the sha would be a lie.
		const cr = parseMessage({ sid, text: 'one\r\ntwo' });
		expect(cr.ok).toBe(false);
		expect(cr.ok === false && cr.error).toContain('control');
		expect(parseMessage({ sid, text: 'one\ntwo' }).ok).toBe(true);
		expect(parseMessage({ sid: 'not-a-uuid', text: 'hi' }).ok).toBe(false);
		const tabbed = parseMessage({ sid, text: 'a\tb' });
		expect(tabbed.ok === false && tabbed.error).toContain('tab');
	});
});

// ---------- the window: bytes in, whole lines and an offset out ----------

describe('the transcript window pages backwards on its own byte offset', () => {
	const path = file('window.jsonl', [user('one'), user('two'), user('three')]);
	const size = statSync(path).size;

	test('the tail is the tail, and it says it started at zero when it holds everything', () => {
		const w = windowOf(path, null, 1 << 20)!;
		expect(w.from).toBe(0);
		expect(w.to).toBe(size);
		expect(turnsOf(w, tmp).map(t => t.blocks.length)).toEqual([1, 1, 1]);
	});

	test('a partial edge line is dropped, never guessed at — and `from` is a BYTE offset', () => {
		// Ask for fewer bytes than the last two records: the window opens mid-record and the partial
		// head line is dropped whole.
		const w = windowOf(path, null, 40)!;
		expect(w.from).toBeGreaterThan(0);
		// The offset must land exactly on a record boundary, which is what makes `before=` sound.
		const back = windowOf(path, w.from, 1 << 20)!;
		expect(back.to).toBe(w.from);
		expect(back.from).toBe(0);
		// Together the two windows are the whole file and no turn is in both.
		const keys = [...turnsOf(back, tmp), ...turnsOf(w, tmp)].map(t => t.key);
		expect(new Set(keys).size).toBe(keys.length);
	});

	test('a multi-byte corpus does not shift the offset — the newline is found in the BUFFER', () => {
		// `—`, `⚡` and `⬡` are three bytes each: a UTF-16 index into a byte offset is a bug that only
		// shows up on the interesting lines, so the split is done on the buffer.
		const p = file('utf8.jsonl', [user('— ⚡ ⬡ one'), user('— ⚡ ⬡ two')]);
		const w = windowOf(p, null, 30)!;
		const back = windowOf(p, w.from, 1 << 20)!;
		expect(back.to).toBe(w.from);
		expect(turnsOf(back, tmp).length + turnsOf(w, tmp).length).toBeGreaterThanOrEqual(1);
	});
});

// ---------- the turn grammar ----------

describe('turns: what a transcript says, and what it only did', () => {
	test('a tool result is not a turn — the tool_use line above it already said what ran', () => {
		const p = file('tools.jsonl', [user('go'), uses('Read', { file_path: '/x/y.ts' }), toolResult(), say('done')]);
		const turns = turnsOf(windowOf(p, null, 1 << 20)!, tmp);
		expect(turns.map(t => t.role)).toEqual(['user', 'assistant']);
		const acts = turns[1]!.blocks.filter(b => b.kind === 'act');
		expect(acts).toEqual([{ kind: 'act', tool: 'Read', head: '/x/y.ts' }]);
	});

	test('consecutive assistant records are ONE turn, in order, prose and activity interleaved', () => {
		const p = file('run.jsonl', [
			user('go'), say('first'), uses('Bash', { command: 'ls -la\nsecond line' }), say('second'),
		]);
		const turns = turnsOf(windowOf(p, null, 1 << 20)!, tmp);
		expect(turns.length).toBe(2);
		expect(turns[1]!.blocks.map(b => b.kind)).toEqual(['prose', 'act', 'prose']);
		// One tool call, one line: the head is the first line of the command and no more.
		expect(turns[1]!.blocks[1]).toEqual({ kind: 'act', tool: 'Bash', head: 'ls -la' });
	});

	test('a sidechain is a subagent’s own conversation and is not this session’s', () => {
		const side = JSON.stringify({ type: 'user', isSidechain: true, message: { role: 'user', content: 'inside the subagent' } });
		const p = file('side.jsonl', [user('go'), side, say('done')]);
		const turns = turnsOf(windowOf(p, null, 1 << 20)!, tmp);
		expect(turns.length).toBe(2);
		expect(JSON.stringify(turns)).not.toContain('inside the subagent');
	});

	test('a fenced block is kept verbatim and carries NO decoder spans (B20 §1, one grammar on)', () => {
		const blocks = blocksOf('read canon row 17\n```\nYou are a Builder at opus-high.\ncanon row 17\n```\nand D2', tmp);
		expect(blocks.map(b => b.kind)).toEqual(['prose', 'fence', 'prose']);
		const fence = blocks[1] as { kind: 'fence'; lang: string; text: string };
		expect(fence.text).toBe('You are a Builder at opus-high.\ncanon row 17');
		// The prose around it is spans (which the client hands to the decoder); the fence is a string.
		expect((blocks[0] as { spans: unknown[] }).spans.length).toBeGreaterThan(0);
		expect('spans' in fence).toBe(false);
	});

	test('activity is capped per turn and the fold is COUNTED, never silently dropped', () => {
		const many = Array.from({ length: 50 }, (_, n) => uses('Read', { file_path: `/x/${n}.ts` }));
		const p = file('many.jsonl', [user('go'), ...many]);
		const t = turnsOf(windowOf(p, null, 1 << 20)!, tmp)[1]!;
		expect(t.blocks.filter(b => b.kind === 'act').length).toBe(40);
		expect(t.folded).toBe(10);
	});
});

// ---------- the verification read: the three verdicts that are failures ----------

describe('nothing is reported delivered without the read (P6 §T)', () => {
	test('one new turn whose sha matches is delivered; anything else is not', async () => {
		const p = file('verify.jsonl', [user('the summons')]);
		const from = statSync(p).size;
		appendFileSync(p, user('the message\n\nwith a blank line') + '\n');
		const ok = await verify(p, from, 'the message\n\nwith a blank line', Date.now() + 2000);
		expect(ok.ok).toBe(true);

		const p2 = file('verify2.jsonl', [user('the summons')]);
		const from2 = statSync(p2).size;
		appendFileSync(p2, user('not what was sent') + '\n');
		const wrong = await verify(p2, from2, 'the message', Date.now() + 2000);
		expect(wrong.ok).toBe(false);
		expect(wrong.ok === false && wrong.error).toContain('corrupted');
	});

	test('TWO new turns is the split P6 exists to catch, and it is never retried', async () => {
		const p = file('split.jsonl', [user('the summons')]);
		const from = statSync(p).size;
		appendFileSync(p, user('first half') + '\n' + user('second half') + '\n');
		const out = await verify(p, from, 'first half\nsecond half', Date.now() + 2000);
		expect(out.ok).toBe(false);
		expect(out.ok === false && out.error).toContain('2 user turns arrived where one was sent');
	});

	test('no new turn inside the budget is UNVERIFIED — never "sent"', async () => {
		const p = file('silent.jsonl', [user('the summons')]);
		const out = await verify(p, statSync(p).size, 'anything', Date.now() + 900);
		expect(out.ok).toBe(false);
		expect(out.ok === false && out.error).toContain('unverified');
	});

	test('the appended region is what is read — earlier turns are not new turns', () => {
		const p = file('after.jsonl', [user('one'), user('two')]);
		expect(turnsAfter(p, statSync(p).size)).toEqual([]);
		const from = statSync(p).size;
		appendFileSync(p, toolResult() + '\n' + user('three') + '\n');
		// A tool result is a `user` record and is NOT a turn: counting it would report a delivery that
		// never happened, which is the one failure this whole read exists to prevent.
		expect(turnsAfter(p, from)).toEqual(['three']);
	});
});

// ---------- the input box, read before a single byte is delivered (P6 Q4-F5) ----------

describe('the box precheck', () => {
	test('an empty box reads empty, framed or not — the caret is not always at column zero', () => {
		expect(boxOf('some chrome\n╭─────╮\n│ ❯   │\n╰─────╯')).toBe('');
		expect(boxOf('❯ ')).toBe('');
		expect(boxOf('a screen with no prompt at all')).toBe('');
	});

	test('a half-typed draft reads as itself — that is what refuses the send (P6 Q4-F5)', () => {
		expect(boxOf('header\n❯ HALF A DRAFT FELIX WAS TYPING\nfooter')).toBe('HALF A DRAFT FELIX WAS TYPING');
		expect(boxOf('╭───╮\n│ ❯ half a draft │\n╰───╯')).toBe('half a draft');
		// ASCII `|` is content, not a border: reading `a | b` as an empty box is how the transport
		// ends up appending to something he was writing.
		expect(boxOf('❯ a | b')).toBe('a | b');
	});
});

// ---------- D10 as structure: what may arm, decided server-side ----------

describe('sendable — ambiguity never arms (D10)', () => {
	const base: Located = {
		sid: '11111111-2222-4333-8444-555555555555', name: 'probe', stamp: 'probe', account: 'personal',
		building: 'agents', cwd: tmp, model: 'sonnet', state: 'idle', waiting: null,
		ws: 'B01C9D0F-C040-40C0-8043-9DE256384376', transcript: join(tmp, 'window.jsonl'), configDir: '/x',
	};

	test('cold hands arm nothing, and say which credential is missing', () => {
		const s = sendable(base, false, 'no credential at ~/.config/belvedere/env');
		expect(s.can).toBe(false);
		expect(s.why).toContain('no credential');
	});

	test('a live session in a cmux workspace sends live; one in no workspace does not', () => {
		expect(sendable(base, true, 'armed')).toMatchObject({ can: true, mode: 'live' });
		expect(sendable({ ...base, ws: null }, true, 'armed').can).toBe(false);
	});

	test('a dead session resumes — but only into a directory that still exists', () => {
		expect(sendable({ ...base, state: 'dead' }, true, 'armed')).toMatchObject({ can: true, mode: 'resume' });
		expect(sendable({ ...base, state: 'dead', cwd: join(tmp, 'gone') }, true, 'armed').can).toBe(false);
		expect(sendable({ ...base, state: 'dead', account: null }, true, 'armed').can).toBe(false);
	});

	test('no transcript, no send: a delivery that cannot be verified is not a delivery', () => {
		const s = sendable({ ...base, transcript: null }, true, 'armed');
		expect(s.can).toBe(false);
		expect(s.why).toContain('verified');
	});
});

// ---------- the drafts: `desk/drafts/`, one file per target ----------

describe('drafts persist under desk/drafts (D17, D18 class 3)', () => {
	const sid = '11111111-2222-4333-8444-555555555555';
	beforeAll(() => { process.env['DESK_DIR'] = join(tmp, 'desk'); });
	afterAll(() => { delete process.env['DESK_DIR']; });

	test('a draft written is a draft read back, and an emptied one leaves no file behind', () => {
		expect(readDraft(sid)).toBe('');
		expect(writeDraft(sid, 'half a thought\n\nand the rest').ok).toBe(true);
		expect(readDraft(sid)).toBe('half a thought\n\nand the rest');
		expect(existsSync(draftFile(sid))).toBe(true);
		expect(writeDraft(sid, '').ok).toBe(true);
		expect(existsSync(draftFile(sid))).toBe(false);
		expect(readDraft(sid)).toBe('');
	});

	test('the sid IS the filename, so it is a session id or it is refused', () => {
		expect(writeDraft('../../escape', 'x').ok).toBe(false);
		expect(writeDraft(sid, 'x'.repeat((64 << 10) + 1)).ok).toBe(false);
	});
});
