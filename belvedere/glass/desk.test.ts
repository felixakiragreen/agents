// The desk (B19, D17/D18 class 3) — the store, the confinement, the trailer, and the three plans.
//
// Everything here runs against a **temp desk and a temp city**. `DESK_DIR` and `GLASS_CITY` are
// pointed at `mkdtemp` roots before a single write, because a suite that writes into Felix's real
// drawer is the same class of bug as one that armed the city's real HALT flag (B8 F1). The anchors
// are functions, so setting the env in `beforeAll` is enough (`paths.ts` §the parentheses).

import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';
import { parseIssues } from '../../doctrine';

const ROOT = mkdtempSync(join(tmpdir(), 'b19-desk-'));
const CITY = join(ROOT, 'city');
const DESK = join(CITY, 'agents/desk');
const BUILDING = join(CITY, 'scratch-building');

import {
	DESK_ROUTES, fileNote, listNotes, mintSlug, noteFile, planRoute, readAsk, readNote,
	receiptStamp, saveNote, split, stampNote, titleOf,
} from './desk';
import { entryBytes, evidence, parseFiling, today } from './inbox';
import { draftFile } from './chat';

// Set and restored around this file, never at module scope: `paths.ts` resolves per call, so a
// leaked `GLASS_CITY` would point every later file in the process at a temp tree (B15 F4's family).
const saved = { city: process.env.GLASS_CITY, desk: process.env.DESK_DIR, env: process.env.BELVEDERE_ENV };

beforeAll(() => {
	process.env.GLASS_CITY = CITY;
	process.env.DESK_DIR = DESK;
	// A desk suite must never reach a socket: an armed test process drives Felix's real desktop (B18).
	process.env.BELVEDERE_ENV = join(ROOT, 'no-credential-here');
	mkdirSync(DESK, { recursive: true });
	mkdirSync(BUILDING, { recursive: true });
});
afterAll(() => {
	process.env.GLASS_CITY = saved.city;
	process.env.DESK_DIR = saved.desk;
	process.env.BELVEDERE_ENV = saved.env;
	rmSync(ROOT, { recursive: true, force: true });
});

const wrote = (slug: string) => readFileSync(join(DESK, `${slug}.md`), 'utf8');

// ---------- the confinement (spec §1, DoD 5) ----------

describe('the confinement: no path ever arrives from a URL', () => {
	test('a crafted slug that walks out of the desk is refused, loudly, naming the rule', () => {
		for (const bad of ['../../canon/CLAUDE', '../ISSUES', 'a/b', '.', '..', 'Note', 'note.md', '', '/etc/passwd']) {
			const out = noteFile(bad);
			expect(out.ok).toBe(false);
			expect(out.ok ? '' : out.error).toContain('lower-case letters, digits and dashes');
		}
	});

	test('and a crafted SAVE writes nothing — the refusal is at the boundary, not after it', () => {
		const before = existsSync(join(CITY, 'agents/ISSUES.md'));
		const out = saveNote('../ISSUES', 'pwned');
		expect(out.ok).toBe(false);
		expect(existsSync(join(CITY, 'agents/ISSUES.md'))).toBe(before);
		expect(existsSync(join(DESK, '../ISSUES.md'))).toBe(false);
	});

	test('a legal slug resolves directly under the desk and nowhere else', () => {
		const out = noteFile('2026-08-28-01');
		expect(out.ok && out.result).toBe(join(DESK, '2026-08-28-01.md'));
	});
});

// ---------- the store ----------

describe('the store: flat, first line is the title', () => {
	test('a save mints a dated slug, and the first line names it', () => {
		const out = saveNote('', '# the deck keel\n\nhis words, kept');
		expect(out.ok).toBe(true);
		if (!out.ok) return;
		expect(out.result.slug).toBe(`${today()}-01`);
		expect(out.result.title).toBe('the deck keel');
		expect(wrote(out.result.slug)).toBe('# the deck keel\n\nhis words, kept\n');
	});

	test('a second new note takes the next ordinal — a name is minted once and never moves', () => {
		const out = saveNote('', 'second');
		expect(out.ok && out.result.slug).toBe(`${today()}-02`);
		expect(mintSlug()).toBe(`${today()}-03`);
	});

	test('CRLF is normalised at the boundary and nothing else about his bytes is touched', () => {
		const out = saveNote('crlf-note', 'one\r\ntwo\r\n\r\n\tindented  and trailing  ');
		expect(out.ok).toBe(true);
		expect(wrote('crlf-note')).toBe('one\ntwo\n\n\tindented  and trailing  \n');
	});

	test('the list is newest first and carries the title, never the body', () => {
		const names = listNotes().map(n => n.slug);
		expect(names).toContain('crlf-note');
		expect(names.length).toBeGreaterThanOrEqual(3);
		const dates = listNotes().map(n => n.at);
		expect([...dates].sort((a, b) => b - a)).toEqual(dates);
	});

	test('an emptied note is removed — a desk full of blank notes is a desk nobody opens', () => {
		saveNote('throwaway', 'something');
		expect(existsSync(join(DESK, 'throwaway.md'))).toBe(true);
		expect(saveNote('throwaway', '').ok).toBe(true);
		expect(existsSync(join(DESK, 'throwaway.md'))).toBe(false);
	});

	test('a title with no words is honest rather than blank', () => {
		expect(titleOf('')).toBe('(untitled)');
		expect(titleOf('\n\n   \n#  ')).toBe('(untitled)');
		expect(titleOf('###### six hashes')).toBe('six hashes');
	});

	test('a note the desk does not hold is a refusal, not an empty note', () => {
		const out = readNote('nothing-here-at-all');
		expect(out.ok).toBe(false);
		expect(out.ok ? '' : out.error).toContain('no note');
	});
});

// ---------- the trailer ----------

describe('the trailer: receipts are not body', () => {
	test('a note with no receipts is all body', () => {
		expect(split('a\n\n---\n\nb')).toEqual({ body: 'a\n\n---\n\nb', routed: [] });
	});

	test('a trailing block of routed lines comes off, and the body keeps its own rules', () => {
		const raw = 'title\n\n---\n\nprose under a rule of his own\n\n---\nrouted 2026-08-28 09:12 → /x/ISSUES.md\n';
		const s = split(raw);
		expect(s.body).toBe('title\n\n---\n\nprose under a rule of his own');
		expect(s.routed).toEqual(['routed 2026-08-28 09:12 → /x/ISSUES.md']);
	});

	test('a trailing block that is NOT all receipts stays body — no marker of the glass’s invention', () => {
		const raw = 'title\n\n---\nrouted 2026-08-28 09:12 → /x\nand one more thought\n';
		expect(split(raw).routed).toEqual([]);
		expect(split(raw).body).toContain('and one more thought');
	});

	test('a save preserves the receipts under it, and the editor never sees them', () => {
		saveNote('stamped-note', 'a filed thing\n\nwith evidence');
		expect(stampNote('stamped-note', '/somewhere/ISSUES.md').ok).toBe(true);
		saveNote('stamped-note', 'a filed thing\n\nwith evidence, edited');
		const raw = wrote('stamped-note');
		expect(raw).toContain('with evidence, edited');
		expect(raw).toContain('→ /somewhere/ISSUES.md');
		const back = readNote('stamped-note');
		expect(back.ok && back.result.text.includes('routed')).toBe(false);
		expect(back.ok && back.result.routed).toBe(1);
	});

	test('clearing a note that carries receipts keeps them: the words go, the record of where they went does not', () => {
		expect(saveNote('stamped-note', '').ok).toBe(true);
		expect(existsSync(join(DESK, 'stamped-note.md'))).toBe(true);
		expect(wrote('stamped-note')).toContain('→ /somewhere/ISSUES.md');
	});

	test('the receipt is a shape the desk can read back — the stamp asserts its own grammar', () => {
		expect(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}$/.test(receiptStamp(new Date(2026, 7, 28, 9, 4)))).toBe(true);
		expect(receiptStamp(new Date(2026, 7, 28, 9, 4))).toBe('2026-08-28 09:04');
	});
});

// ---------- D63h's block form (the ISSUES route's composition) ----------

describe('the block form: a title, and its evidence under it', () => {
	test('evidence is markdown list continuation, and an indented rule cannot cut the block', () => {
		expect(evidence('a\n\n---\nb')).toBe('\n  a\n\n  ---\n  b\n');
		expect(evidence('')).toBe('');
	});

	test('a report with no evidence is exactly a bare bullet', () => {
		const g = { kind: 'report' as const, title: 'one line', body: '' };
		expect(entryBytes('# head\n\n---\n', g, '2026-08-28'))
			.toBe('\n- 2026-08-28 · Felix (via Belvedere) · one line\n');
	});

	test('a report with evidence opens its own block and the one parser reads it with ZERO lint', () => {
		const header = readFileSync(join(process.env['HOME']!, 'code/agents/canon/work/templates/issues.md'), 'utf8');
		const g = { kind: 'report' as const, title: 'the field report', body: 'first\n\n---\n\nsecond' };
		const md = header + entryBytes(header, g, '2026-08-28');
		const r = parseIssues(md);
		expect(r.fails).toEqual([]);
		expect(r.issues.length).toBe(1);
		expect(r.issues[0]!.text).toBe('the field report');
		expect(r.issues[0]!.who).toBe('Felix (via Belvedere)');
	});

	test('the parse boundary refuses a titleless report and an oversized one', () => {
		expect(parseFiling({ building: BUILDING, kind: 'report', title: '   ', body: 'x' }).ok).toBe(false);
		const huge = 'x'.repeat((64 << 10) + 1);
		const out = parseFiling({ building: BUILDING, kind: 'report', title: 't', body: huge });
		expect(out.ok ? '' : out.error).toContain('evidence exceeds');
	});
});

// ---------- the three plans ----------

describe('the routes: planned before they fire', () => {
	test('an unknown route names the three that exist', () => {
		const out = readAsk({ slug: 'x', to: 'email' });
		expect(out.ok ? '' : out.error).toContain(DESK_ROUTES.join(', '));
	});

	test('→ composer: the plan IS the note body, and an empty note refuses', () => {
		saveNote('for-composer', 'You are a Builder at opus-high.\n\nDo the thing.');
		const p = planRoute({ slug: 'for-composer', to: 'composer', building: '', sid: '' });
		expect(p.ok && p.result.text).toBe('You are a Builder at opus-high.\n\nDo the thing.');
		expect(p.ok && p.result.refusal).toBe(null);
		saveNote('blank-note', '\n');
		expect(readNote('blank-note').ok).toBe(false);       // an empty save removed it, so the plan 404s
	});

	test('→ session: no target is a refusal, never a guess', () => {
		const p = planRoute({ slug: 'for-composer', to: 'session', building: '', sid: '' });
		expect(p.ok && p.result.refusal).toContain('no session chosen');
	});

	test('→ session: the desk will not overwrite a draft he is halfway through', () => {
		const sid = 'aaaaaaaa-1111-4111-8111-aaaaaaaaaaaa';
		mkdirSync(join(DESK, 'drafts'), { recursive: true });
		writeFileSync(draftFile(sid), 'HALF A REPLY FELIX WAS TYPING');
		const p = planRoute({ slug: 'for-composer', to: 'session', building: '', sid });
		expect(p.ok && p.result.refusal).toContain('already holds a 29 B draft');
		rmSync(draftFile(sid), { force: true });
		const clear = planRoute({ slug: 'for-composer', to: 'session', building: '', sid });
		expect(clear.ok && clear.result.refusal).toBe(null);
		expect(clear.ok && clear.result.where).toContain(sid);
	});

	test('→ ISSUES: the preview quotes the exact bytes, and the mint is quoted too', () => {
		saveNote('a-field-report', 'the copy-paste kill shot\n\nseventeen items, and here is the first');
		const p = planRoute({ slug: 'a-field-report', to: 'issues', building: BUILDING, sid: '' });
		expect(p.ok).toBe(true);
		if (!p.ok) return;
		expect(p.result.refusal).toBe(null);
		expect(p.result.where).toContain('adoption-on-first-need');
		expect(p.result.text).toContain(`- ${today()} · Felix (via Belvedere) · the copy-paste kill shot`);
		expect(p.result.text).toContain('  seventeen items, and here is the first');
		// The preview is a READ: nothing is minted by looking at it.
		expect(existsSync(join(BUILDING, 'ISSUES.md'))).toBe(false);
	});

	test('→ ISSUES fired: the previewed bytes are the appended bytes, and the note gains its receipt', () => {
		const before = planRoute({ slug: 'a-field-report', to: 'issues', building: BUILDING, sid: '' });
		expect(before.ok).toBe(true);
		if (!before.ok) return;
		const out = fileNote({ slug: 'a-field-report', to: 'issues', building: BUILDING, sid: '' }, before.result.sha);
		expect(out.ok).toBe(true);
		if (!out.ok) return;
		const landed = readFileSync(join(BUILDING, 'ISSUES.md'), 'utf8');
		expect(landed.endsWith(before.result.text)).toBe(true);
		expect(out.result.minted).toBe(true);
		expect(parseIssues(landed).fails).toEqual([]);
		expect(out.result.receipt).toContain(`→ ${join(BUILDING, 'ISSUES.md')}`);
		expect(wrote('a-field-report')).toContain(out.result.receipt);
		const back = readNote('a-field-report');
		expect(back.ok && back.result.routed).toBe(1);
	});

	test('a second filing appends, and the bytes before are a byte-prefix of the bytes after', () => {
		const first = readFileSync(join(BUILDING, 'ISSUES.md'), 'utf8');
		saveNote('a-second-report', 'the second thing\n\nwith its own evidence');
		const p = planRoute({ slug: 'a-second-report', to: 'issues', building: BUILDING, sid: '' });
		expect(p.ok).toBe(true);
		if (!p.ok) return;
		expect(p.result.text.startsWith('\n---\n\n')).toBe(true);   // D63h: a block of its own
		expect(fileNote({ slug: 'a-second-report', to: 'issues', building: BUILDING, sid: '' }, p.result.sha).ok).toBe(true);
		const after = readFileSync(join(BUILDING, 'ISSUES.md'), 'utf8');
		expect(after.startsWith(first)).toBe(true);
		expect(parseIssues(after).issues.length).toBe(2);
	});

	test('a sign-off on bytes that moved is refused by name (B11’s arm law, one door along)', () => {
		saveNote('a-third-report', 'the third thing');
		const out = fileNote({ slug: 'a-third-report', to: 'issues', building: BUILDING, sid: '' }, 'deadbeefdeadbeef');
		expect(out.ok).toBe(false);
		expect(out.ok ? '' : out.error).toContain('the inbox moved while you were reading it');
		expect(parseIssues(readFileSync(join(BUILDING, 'ISSUES.md'), 'utf8')).issues.length).toBe(2);
	});

	test('a building outside the city is refused on the plan, never on the write', () => {
		const p = planRoute({ slug: 'a-third-report', to: 'issues', building: '/etc', sid: '' });
		expect(p.ok && p.result.refusal).toContain('outside the city');
		expect(p.ok && p.result.text).toBe('');
	});

	test('only the inbox route is fired here — the other two are the client’s own wires', () => {
		const out = fileNote({ slug: 'a-third-report', to: 'session', building: '', sid: '' }, '');
		expect(out.ok ? '' : out.error).toContain('the client');
	});
});
