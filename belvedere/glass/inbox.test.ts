// The sovereign's inbox, tested where it can actually be wrong: the D63 grammar it writes, the
// append-only law, the fence around which directories it will write into, and the countersign's
// three file-derived states.
//
// **The grammar is never asserted against a string this file made up.** Every entry these tests
// write is read back through `doctrine`'s own `parseIssues` — the one parser in the city (D65) —
// and the claim is always "the parser typed it and filed no lint", never "it looks right to me".
//
// Everything touches disk inside one temp city, wired through the env knobs `paths.ts` resolves
// PER CALL (B8 §4). The knobs are set and restored around this file: `GLASS_CITY` is read by
// files that run after this one (`rail`, `register`, `shelf`), so leaving it pointed at a temp
// tree would be this suite's second frozen-anchor bug. Every write is asserted to have landed
// under the temp root — B8 F1's law: pointing a knob at temp is not proof that temp was used.

import { expect, test, describe, beforeAll, afterAll } from 'bun:test';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, rmSync, existsSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { parseIssues, type Decision, type Issue } from '../../doctrine';
import {
	addition, countersignState, entryLine, filed, fileGesture, gestureText, inboxFile,
	inboxRoute, noteBox, parseFiling, recordedIn, sweepFire, sweepSummons, today, WHO,
	type Filing, type Gesture,
} from './inbox';
import { handsState } from './hands';
import { readRig } from './rig';
import { ISSUES_TEMPLATE } from './paths';

const ROOT = mkdtempSync(join(tmpdir(), 'b6-inbox-'));
const CENSUS = join(ROOT, 'census');
const before: Record<string, string | undefined> = {};

beforeAll(() => {
	for (const key of ['GLASS_CITY', 'CENSUS_DIR', 'BELVEDERE_ENV']) before[key] = process.env[key];
	process.env.GLASS_CITY = ROOT;
	process.env.CENSUS_DIR = CENSUS;
	// No credential anywhere near this file: §4's claim is that the inbox does not need one.
	process.env.BELVEDERE_ENV = join(ROOT, 'no-such-credential');
});

afterAll(() => {
	for (const [key, value] of Object.entries(before))
		if (value === undefined) delete process.env[key]; else process.env[key] = value;
	rmSync(ROOT, { recursive: true, force: true });
});

/** A building directory inside the temp city, optionally carrying an inbox already. */
function building(name: string, inbox?: string): string {
	const path = join(ROOT, name);
	mkdirSync(path, { recursive: true });
	if (inbox !== undefined) writeFileSync(inboxFile(path), inbox);
	return path;
}

const read = (path: string) => readFileSync(inboxFile(path), 'utf8');
const note = (path: string, text: string): Filing => ({ path, gesture: { kind: 'note', text } });

/** The parser's own reading of what was just written: entries typed, lint filed. */
const reparse = (path: string) => parseIssues(read(path));

// ---------- D63h, the grammar the glass writes ----------

describe('the entry line', () => {
	const CASES: [name: string, gesture: Gesture, want: string][] = [
		['a note lands verbatim', { kind: 'note', text: 'the rail understates WIP by 6×' }, 'the rail understates WIP by 6×'],
		['defer names the row', { kind: 'defer', row: 'B7' }, 'defer B7'],
		['reorder is the spec\'s own sentence', { kind: 'before', row: '14', other: '13' }, '14 before 13'],
		['countersign carries the ✓', { kind: 'countersign', decision: 'D11' }, 'countersign D11: ✓'],
	];
	for (const [name, gesture, want] of CASES) test(name, () => expect(gestureText(gesture)).toBe(want));

	test('every gesture reads back through the one parser, typed and lint-free', () => {
		for (const [, gesture] of CASES) {
			const md = `# Issues\n\nheader\n\n---\n\n${entryLine(gesture, '2026-08-27')}\n`;
			const r = parseIssues(md);
			expect(r.fails).toEqual([]);
			expect(r.issues).toHaveLength(1);
			expect(r.issues[0]).toMatchObject({ date: '2026-08-27', who: WHO, text: gestureText(gesture) });
		}
	});

	test('the who is the fence\'s own words, and carries no separator of its own', () => {
		expect(WHO).toBe('Felix (via Belvedere)');
		expect(WHO).not.toContain('·');
	});
});

describe('the date is local, never UTC', () => {
	// `toISOString()` shifts by the offset, so one of these two rolls the day in any timezone on
	// earth: a note filed at 23:59 would be dated tomorrow west of Greenwich, at 00:30 yesterday east.
	test('late evening stays today', () => expect(today(new Date(2026, 7, 27, 23, 59))).toBe('2026-08-27'));
	test('early morning stays today', () => expect(today(new Date(2026, 7, 27, 0, 30))).toBe('2026-08-27'));
	test('single digits are padded', () => expect(today(new Date(2026, 0, 5, 12, 0))).toBe('2026-01-05'));
});

// ---------- the parse boundary ----------

describe('the write fence', () => {
	const kind = { kind: 'note', text: 'x' };

	test('a non-object body is refused', () => expect(parseFiling(null).ok).toBe(false));

	test('a relative path is refused', () => {
		const out = parseFiling({ building: 'belvedere', ...kind });
		expect(out.ok ? '' : out.error).toContain('absolute');
	});

	test('a path outside the city is refused, and the city is named', () => {
		const out = parseFiling({ building: tmpdir(), ...kind });
		expect(out.ok ? '' : out.error).toContain('outside the city');
	});

	test('climbing out with .. is refused — the path is resolved before it is measured', () => {
		const out = parseFiling({ building: join(ROOT, '..', '..', 'etc'), ...kind });
		expect(out.ok).toBe(false);
		expect(out.ok ? '' : out.error).toContain('outside the city');
	});

	test('a directory that does not exist is refused', () => {
		const out = parseFiling({ building: join(ROOT, 'nowhere'), ...kind });
		expect(out.ok ? '' : out.error).toContain('does not exist');
	});

	test('a file is not a building', () => {
		const path = join(ROOT, 'a-file.md');
		writeFileSync(path, 'x');
		expect(parseFiling({ building: path, ...kind }).ok ? '' : (parseFiling({ building: path, ...kind }) as { error: string }).error)
			.toContain('not a directory');
	});
});

describe('the gesture boundary', () => {
	const at = building('fence-gestures');

	test('an empty note is refused — a blank line is not a gesture', () => {
		expect(parseFiling({ building: at, kind: 'note', text: '   \n\t ' }).ok).toBe(false);
	});

	test('a note over the limit is refused', () => {
		expect(parseFiling({ building: at, kind: 'note', text: 'x'.repeat(5000) }).ok).toBe(false);
	});

	test('a multi-line note collapses to ONE line — the bullet is the grammar', () => {
		const out = parseFiling({ building: at, kind: 'note', text: 'first\nsecond\r\n\tthird' });
		expect(out.ok && out.result.gesture).toEqual({ kind: 'note', text: 'first second third' });
	});

	test('a row id that is not one is refused', () => {
		expect(parseFiling({ building: at, kind: 'defer', row: 'B7; rm -rf' }).ok).toBe(false);
		expect(parseFiling({ building: at, kind: 'before', row: 'B7', other: '' }).ok).toBe(false);
	});

	test('a row cannot precede itself', () => {
		const out = parseFiling({ building: at, kind: 'before', row: 'B7', other: 'B7' });
		expect(out.ok ? '' : out.error).toContain('cannot precede itself');
	});

	test('a decision that is not a D-id is refused', () => {
		expect(parseFiling({ building: at, kind: 'countersign', decision: 'D' }).ok).toBe(false);
		expect(parseFiling({ building: at, kind: 'countersign', decision: 'eleven' }).ok).toBe(false);
		expect(parseFiling({ building: at, kind: 'countersign', decision: 'D11' }).ok).toBe(true);
	});

	// Five since B19: `report` is the desk's route in, a title plus its evidence (D63h's block form).
	// The list is in the message because a refusal that does not say what IS legal is half a refusal.
	test('an unknown kind names the five that exist', () => {
		const out = parseFiling({ building: at, kind: 'delete', row: 'B7' });
		expect(out.ok ? '' : out.error).toContain('note, report, defer, before or countersign');
	});
});

// ---------- append-only ----------

const HEADER = '# Issues\n\nprotocol prose.\n\n---\n';

describe('append-only is the whole licence', () => {
	test('BEFORE is a byte-prefix of AFTER, across ten rapid gestures', () => {
		const at = building('ten', HEADER);
		let previous = read(at);
		for (let n = 1; n <= 10; n++) {
			const out = fileGesture(note(at, `gesture ${n}`), '2026-08-27');
			expect(out.ok).toBe(true);
			const after = read(at);
			expect(after.startsWith(previous)).toBe(true);
			expect(after.length).toBeGreaterThan(previous.length);
			previous = after;
		}
		const r = reparse(at);
		expect(r.fails).toEqual([]);
		expect(r.issues.map(i => i.text)).toEqual(Array.from({ length: 10 }, (_, n) => `gesture ${n + 1}`));
	});

	test('the header the file opened with is still its opening bytes', () => {
		const at = building('prefix', HEADER);
		fileGesture(note(at, 'one'), '2026-08-27');
		fileGesture(note(at, 'two'), '2026-08-27');
		expect(read(at).startsWith(HEADER)).toBe(true);
	});

	test('an entry appended onto an evidence block gets a --- of its own', () => {
		const at = building('evidence', `${HEADER}\n- 2026-08-26 · a Digger · a finding\n\n    evidence\n`);
		fileGesture(note(at, 'his answer'), '2026-08-27');
		const md = read(at);
		expect(md).toContain('evidence\n\n---\n\n- 2026-08-27');
		expect(reparse(at).fails).toEqual([]);
	});

	test('an empty tail block takes the bullet directly — no --- litter', () => {
		const at = building('empty-tail', HEADER);
		fileGesture(note(at, 'first'), '2026-08-27');
		expect(read(at)).toBe(`${HEADER}\n- 2026-08-27 · ${WHO} · first\n`);
	});
});

describe('the addition, in isolation', () => {
	const line = '- 2026-08-27 · Felix (via Belvedere) · x';
	test('a file ending in --- gets one blank line', () => expect(addition('a\n\n---\n', line)).toBe(`\n${line}\n`));
	test('a file ending in --- and a blank line gets nothing', () => expect(addition('a\n\n---\n\n', line)).toBe(`${line}\n`));
	test('a file with no trailing newline is still only appended to', () =>
		expect(addition('a', line)).toBe(`\n\n---\n\n${line}\n`));
	test('a file with no --- at all opens a block for the entry', () =>
		expect(addition('# Issues\n\nheader\n', line)).toBe(`\n---\n\n${line}\n`));
});

// ---------- adoption-on-first-need ----------

describe('a building with no inbox', () => {
	test('mints one from the D53 header template, verbatim, then appends', () => {
		const at = building('virgin');
		expect(existsSync(inboxFile(at))).toBe(false);

		const out = fileGesture(note(at, 'the first word this building ever heard'), '2026-08-27');
		expect(out.ok && out.result.minted).toBe(true);

		const template = readFileSync(ISSUES_TEMPLATE, 'utf8');
		const md = read(at);
		expect(md.startsWith(template)).toBe(true);          // the header is the template's own bytes
		const r = parseIssues(md);
		expect(r.fails).toEqual([]);
		expect(r.issues).toHaveLength(1);
		expect(r.issues[0]!.text).toBe('the first word this building ever heard');
	});

	test('the second gesture mints nothing — one header per building, ever', () => {
		const at = building('virgin-twice');
		expect(fileGesture(note(at, 'one'), '2026-08-27')).toMatchObject({ ok: true, result: { minted: true } });
		expect(fileGesture(note(at, 'two'), '2026-08-27')).toMatchObject({ ok: true, result: { minted: false } });
		expect(reparse(at).issues).toHaveLength(2);
	});
});

// ---------- the audit, and where the bytes actually went ----------

describe('the audit', () => {
	test('one line per gesture, in the temp log — and the write landed in the temp city', () => {
		const at = building('audited');
		const out = filed(note(at, 'audit me'));
		expect(out.ok && out.result.path).toBe(inboxFile(at));
		expect(inboxFile(at).startsWith(ROOT)).toBe(true);          // B8 F1: prove temp was used

		const log = join(CENSUS, 'hands.jsonl');
		expect(existsSync(log)).toBe(true);
		const last = JSON.parse(readFileSync(log, 'utf8').trim().split('\n').at(-1)!);
		expect(last).toMatchObject({ action: 'inbox', ok: true, args: { building: at, kind: 'note', entry: 'audit me' } });
	});

	test('the audit carries no name-stamp — the lineage counter must not count gestures', () => {
		const log = readFileSync(join(CENSUS, 'hands.jsonl'), 'utf8');
		expect(log).not.toContain('"stamp"');
	});
});

// ---------- §4: the hands go cold, his word does not ----------

describe('no credential gate', () => {
	test('the hands are disabled in this file, on purpose', () => expect(handsState().armed).toBe(false));

	test('POST /inbox files the entry anyway — a note is a file write, not a socket call', async () => {
		const at = building('cold-hands');
		const res = await inboxRoute(new Request('http://127.0.0.1/inbox', {
			method: 'POST', headers: { 'content-type': 'application/json' },
			body: JSON.stringify({ building: at, kind: 'note', text: 'the hands are cold and I still have things to say' }),
		}));
		expect(res.status).toBe(200);
		const body = await res.json() as { ok: boolean; result: { line: string } };
		expect(body.ok).toBe(true);
		expect(body.result.line).toBe(`- ${today()} · ${WHO} · the hands are cold and I still have things to say`);
		expect(reparse(at).fails).toEqual([]);
	});

	test('GET is refused — the inbox is POST-only', async () => {
		const res = await inboxRoute(new Request('http://127.0.0.1/inbox'));
		expect(res.status).toBe(405);
	});

	test('a malformed body is 400 and writes nothing', async () => {
		const at = building('malformed');
		const res = await inboxRoute(new Request('http://127.0.0.1/inbox', { method: 'POST', body: '{oops' }));
		expect(res.status).toBe(400);
		expect(existsSync(inboxFile(at))).toBe(false);
	});

	test('a refused gesture is 400, and the inbox is untouched', async () => {
		const at = building('refused', HEADER);
		const res = await inboxRoute(new Request('http://127.0.0.1/inbox', {
			method: 'POST', body: JSON.stringify({ building: at, kind: 'note', text: '' }),
		}));
		expect(res.status).toBe(400);
		expect(read(at)).toBe(HEADER);
	});
});

// ---------- the countersign's three states ----------

const decision = (over: Partial<Decision> = {}): Decision => ({
	id: 'D11', date: '2026-08-27', decider: 'Architect', title: 'a ruling', body: '',
	ratified: false, pending: true, line: 1, ...over,
});

const issue = (text: string): Issue => ({ date: '2026-08-27', who: WHO, text, line: 1 });

describe('pending → recorded → folded', () => {
	test('pending: nothing in the inbox, no ✓ in the decision', () =>
		expect(countersignState(decision(), [])).toBe('pending'));

	test('recorded: his entry is in the inbox, the decision is still unsigned', () =>
		expect(countersignState(decision(), [issue('countersign D11: ✓')])).toBe('recorded'));

	test('folded: the sweep stamped the ✓ into the decision', () =>
		expect(countersignState(decision({ ratified: true }), [issue('countersign D11: ✓')])).toBe('folded'));

	test('the fold wins over the entry — a swept decision is folded even before the drain', () =>
		expect(countersignState(decision({ ratified: true }), [])).toBe('folded'));

	test('D11 is not D110, and a note merely mentioning a countersign is not one', () => {
		expect(recordedIn([issue('countersign D110: ✓')], 'D11')).toBe(false);
		expect(recordedIn([issue('we should countersign D11 today')], 'D11')).toBe(false);
		expect(recordedIn([issue('countersign D11')], 'D11')).toBe(true);
	});

	test('the state a gesture produces is the state the card then reads', () => {
		const at = building('countersigned');
		const out = filed({ path: at, gesture: { kind: 'countersign', decision: 'D11' } });
		expect(out.ok).toBe(true);
		expect(countersignState(decision(), reparse(at).issues)).toBe('recorded');
	});
});

// ---------- the apply button's summons ----------

describe('the scoped Architect sitting', () => {
	test('the template is B6 §2\'s, with only the building substituted', () => {
		expect(sweepSummons('/somewhere/else/agents/belvedere')).toBe(
			`You are an Architect at fable-high.
Wear ~/code/agents/canon/mantles/architect.md,
then read /somewhere/else/agents/belvedere/README.md (or its master doc) and /somewhere/else/agents/belvedere/ISSUES.md,
sweep the inbox: rule each entry, true the board, attribute Felix's entries
to Felix, commit in his git style.`);
	});

	test('a path under home is written the way the city writes paths', () => {
		expect(sweepSummons(join(process.env.HOME!, 'code/agents/belvedere'))).toContain('~/code/agents/belvedere/ISSUES.md');
	});

	test('it composes as a real fire body — Architect, fable-high, this building', () => {
		const at = building('composed');
		const composed = sweepFire(readRig(), at, 'personal');
		expect('blocked' in composed).toBe(false);
		if ('blocked' in composed) return;
		expect(composed.body).toMatchObject({ account: 'personal', cwd: at, model: 'fable', effort: 'high' });
		expect(composed.body.stamp.startsWith('architect-composed-')).toBe(true);
		expect(composed.body.summons).toBe(sweepSummons(at));
	});
});

// ---------- the rendered gesture, structurally ----------

describe('the note box', () => {
	test('carries the building it targets and nothing that could fire', () => {
		const html = noteBox('/Users/felix/code/agents/belvedere');
		expect(html).toContain('data-gesture=');
		expect(html).toContain('/Users/felix/code/agents/belvedere');
		for (const pattern of [/data-fire/, /data-worktree/, /\/hands\//]) expect(html).not.toMatch(pattern);
	});
});
