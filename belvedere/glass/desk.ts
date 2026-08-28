/**
 * The desk — **one drawer, city-wide** (D17, keel §8; B19). The place Felix writes.
 *
 * `~/code/agents/desk/` is the glass's only file-write neighborhood outside the gitignored
 * telemetry (D18 class 3), and the whole of what this module does is put his words in it and hand
 * them on. The 17-item field report that commissioned the deck would have been written here.
 *
 * Four things live in this file and nothing else:
 *
 *  1. **The store.** Flat, until use proves it needs structure: `desk/<slug>.md` per note, no
 *     frontmatter, **the first line is the title**. `desk/drafts/` is B16's and is untouched here.
 *  2. **The confinement.** A slug is `[a-z0-9-]`, so no path ever arrives from a URL — the same law
 *     the font route carries (`server.ts` §FONTS). The regex is the gate; the directory check below
 *     it is the invariant, asserted rather than assumed.
 *  3. **The trailer.** A routed note gains a receipt line, and receipts are not body: they live in a
 *     trailing `---` block that `split()` takes back off, so the editor shows what he wrote and the
 *     file shows where it went.
 *  4. **The routes**, each planned before it fires. **The desk grows no transport of its own** —
 *     an inbox append is B6's wire (`inbox.ts`), a message is B16's draft (`chat.ts`), a summons is
 *     B17's composer — so what is new here is the *plan*: the exact bytes, and the reason it cannot.
 *
 * **Commits are never the glass's** (D18 class 3). Nothing here runs `git`; the files sit on disk
 * and a sitting — or Felix — commits them.
 */

import { createHash } from 'crypto';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { readDraft } from './chat';
import { fail, field, json, type Outcome } from './hands';
import { entryBytes, filed, inboxExisting, parseFiling, today } from './inbox';
import { deskDir } from './paths';

/** Everything has a limit (directive 3.1): one note, the drawer, and the title one line can hold. */
export const LIMITS = { noteBytes: 256 << 10, notes: 500, titleChars: 120, requestBytes: 512 << 10 } as const;

/** A note's whole name. No dots, no slashes, no case — so a slug can never be a path (§2 above). */
const SLUG = /^[0-9a-z][0-9a-z-]{0,63}$/;

/** A receipt line. Local time, because the city writes local dates (`inbox.ts` §today). */
const ROUTED = /^routed \d{4}-\d{2}-\d{2} \d{2}:\d{2} → \S.*$/;

const RULE = /^---[ \t]*$/;

const sha256 = (s: string) => createHash('sha256').update(s, 'utf8').digest('hex');
const bytesOf = (s: string) => Buffer.byteLength(s, 'utf8');

// ---------- the store ----------

/**
 * One note's path, or a refusal naming the rule. **This is the confinement** (spec §1): a crafted
 * `../../canon/CLAUDE` never reaches the filesystem, because it is not a slug — and the directory
 * check afterwards is the invariant that regex protects, written down where it can be read.
 */
export function noteFile(slug: string): Outcome<string> {
	if (!SLUG.test(slug))
		return fail(`a note is named in lower-case letters, digits and dashes (1–64) — got ${JSON.stringify(slug)}`);
	const path = join(deskDir(), `${slug}.md`);
	if (dirname(path) !== deskDir()) return fail(`refused: ${path} is not directly under ${deskDir()}`);
	return { ok: true, result: path };
}

export type Split = { body: string; routed: string[] };

const whole = (raw: string): Split => ({ body: raw.replace(/\n+$/, ''), routed: [] });

/**
 * His words, and the receipts under them. The trailer is the final `---`-separated block **and only
 * when every non-blank line in it is a routed stamp** — so a note that ends in a rule of his own
 * prose keeps all of it, and no marker of the glass's invention appears in a file he writes by hand.
 */
export function split(raw: string): Split {
	const lines = raw.split('\n');
	for (let i = lines.length - 1; i >= 0; i--) {
		if (!RULE.test(lines[i]!)) continue;
		const after = lines.slice(i + 1).filter(l => l.trim() !== '');
		if (after.length === 0 || !after.every(l => ROUTED.test(l))) return whole(raw);
		return { body: lines.slice(0, i).join('\n').replace(/\n+$/, ''), routed: after };
	}
	return whole(raw);
}

/** The file as it stands: body, then the receipts in their own block. */
const joined = (s: Split): string =>
	s.routed.length === 0 ? (s.body === '' ? '' : `${s.body}\n`) : `${s.body}\n\n---\n${s.routed.join('\n')}\n`;

/**
 * **The first line is the title** (spec §1) — a heading marker taken off, because a note headed
 * `# the desk` is titled *the desk*, and the `#` is how he writes a heading, not part of the name.
 */
export function titleOf(body: string): string {
	const first = body.split('\n').find(l => l.trim() !== '') ?? '';
	const t = first.replace(/^#{1,6}\s+/, '').trim();
	return t === '' ? '(untitled)' : t.slice(0, LIMITS.titleChars);
}

export type DeskNote = {
	slug: string;
	title: string;
	bytes: number;
	/** Epoch seconds — the file's own mtime, which is the only clock a flat drawer has. */
	at: number;
	/** How many places this note has been routed to. The lines themselves ride `readNote`. */
	routed: number;
};

export type DeskRead = DeskNote & { text: string; routes: string[] };

const readFile = (path: string): string => readFileSync(path, 'utf8').slice(0, LIMITS.noteBytes);

/** The drawer, newest first. No desk yet is no notes — the directory is minted on the first save. */
export function listNotes(): DeskNote[] {
	let names: string[];
	try { names = readdirSync(deskDir()); }
	catch { return []; }
	const out: DeskNote[] = [];
	for (const name of names) {
		if (!name.endsWith('.md')) continue;
		const slug = name.slice(0, -3);
		if (!SLUG.test(slug)) continue;                 // `drafts/` and anything hand-named stay out of the list
		const path = join(deskDir(), name);
		try {
			const st = statSync(path);
			if (!st.isFile()) continue;
			const s = split(readFile(path));
			out.push({ slug, title: titleOf(s.body), bytes: st.size, at: st.mtimeMs / 1000, routed: s.routed.length });
		}
		catch { continue; }                             // a note the filesystem refuses is not a note today
	}
	return out.sort((a, b) => b.at - a.at).slice(0, LIMITS.notes);
}

export function readNote(slug: string): Outcome<DeskRead> {
	const at = noteFile(slug);
	if (!at.ok) return at;
	let raw: string, st: ReturnType<typeof statSync>;
	try { st = statSync(at.result); raw = readFile(at.result); }
	catch { return fail(`no note "${slug}" — the desk holds no such file`); }
	const s = split(raw);
	return { ok: true, result: {
		slug, title: titleOf(s.body), text: s.body, bytes: st.size,
		at: st.mtimeMs / 1000, routed: s.routed.length, routes: s.routed,
	} };
}

/** `<date>-NN`, the first free one. A note's name is minted once and never moves: the title is free
 * to change and a receipt already written must keep pointing at the same file. */
export function mintSlug(date = today()): string {
	for (let n = 1; n <= 99; n++) {
		const slug = `${date}-${String(n).padStart(2, '0')}`;
		const at = noteFile(slug);
		if (at.ok && !existsSync(at.result)) return slug;
	}
	return `${date}-${Date.now().toString(36).slice(-4)}`;
}

/**
 * One save. A browser's textarea submits CRLF, so the line endings are normalised at this boundary
 * and nothing else about his bytes is touched (`deck-composer.ts` §readDraft's own reasoning).
 *
 * **An emptied note is removed** — B16's law for drafts, and the only removal gesture the spec's
 * minimalism leaves room for — *unless it carries receipts*, because a note that has been filed
 * somewhere is a record of where it went and clearing the words does not unfile it.
 */
export function saveNote(slug: string, text: string): Outcome<DeskNote> {
	const name = slug === '' ? mintSlug() : slug;
	const at = noteFile(name);
	if (!at.ok) return at;
	const body = text.replace(/\r\n?/g, '\n').replace(/\n+$/, '');
	if (bytesOf(body) > LIMITS.noteBytes) return fail(`a note is at most ${LIMITS.noteBytes} bytes`);

	let held: string[] = [];
	try { held = split(readFile(at.result)).routed; }
	catch { /* a new note carries no receipts */ }

	try {
		if (body === '' && held.length === 0) {
			rmSync(at.result, { force: true });
			return { ok: true, result: { slug: name, title: '', bytes: 0, at: Date.now() / 1000, routed: 0 } };
		}
		mkdirSync(deskDir(), { recursive: true });
		writeFileSync(at.result, joined({ body, routed: held }));
	}
	catch (e) { return fail(`cannot write ${at.result}: ${(e as Error).message}`); }
	const st = statSync(at.result);
	return { ok: true, result: { slug: name, title: titleOf(body), bytes: st.size, at: st.mtimeMs / 1000, routed: held.length } };
}

/** Local `YYYY-MM-DD HH:MM` — the receipt's clock, the same one D63 entries are dated by. */
export function receiptStamp(now = new Date()): string {
	const pad = (n: number) => String(n).padStart(2, '0');
	return `${today(now)} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
}

/**
 * The routed-stamp (spec §3): **where it went, when**, on the note itself.
 *
 * Only the inbox route writes one. A note handed to the Chat's draft box or loaded into the composer
 * has been *copied* — repeatably, and undone by clearing the box — while an inbox append is public,
 * irreversible and somebody else's to sweep. A receipt records that, and nothing cheaper.
 */
export function stampNote(slug: string, where: string): Outcome<string> {
	const at = noteFile(slug);
	if (!at.ok) return at;
	const line = `routed ${receiptStamp()} → ${where}`;
	if (!ROUTED.test(line)) return fail(`refusing to write a receipt the desk cannot read back: ${JSON.stringify(line)}`);
	try {
		const s = split(readFile(at.result));
		writeFileSync(at.result, joined({ body: s.body, routed: [...s.routed, line] }));
	}
	catch (e) { return fail(`cannot stamp ${at.result}: ${(e as Error).message}`); }
	return { ok: true, result: line };
}

// ---------- the routes: planned, then fired ----------

export const DESK_ROUTES = ['issues', 'session', 'composer'] as const;
export type DeskRouteName = (typeof DESK_ROUTES)[number];

export type DeskPlan = {
	to: DeskRouteName;
	slug: string;
	/** Where the bytes land, in the city's own coordinates. */
	where: string;
	/** **The exact bytes this route will write.** What he signs off on, before it fires. */
	text: string;
	bytes: number;
	sha: string;
	/** Why it cannot fire, or null. A plan carrying a refusal draws no button at all (D10). */
	refusal: string | null;
};

const plan = (o: Omit<DeskPlan, 'bytes' | 'sha'>): DeskPlan =>
	({ ...o, bytes: bytesOf(o.text), sha: sha256(o.text).slice(0, 16) });

export type RouteAsk = { slug: string; to: DeskRouteName; building: string; sid: string };

export function readAsk(raw: unknown): Outcome<RouteAsk> {
	if (typeof raw !== 'object' || raw === null) return fail('body must be a JSON object');
	const r = raw as Record<string, unknown>;
	const to = field(r, 'to');
	if (!(DESK_ROUTES as readonly string[]).includes(to))
		return fail(`to must be one of ${DESK_ROUTES.join(', ')} — got ${JSON.stringify(to)}`);
	return { ok: true, result: { slug: field(r, 'slug'), to: to as DeskRouteName, building: field(r, 'building'), sid: field(r, 'sid') } };
}

/**
 * What one route would do, exactly. **One function for all three**, so the bytes he reads before
 * signing off and the bytes the route writes are the same string (B16's `refusals()` law, second
 * venue) — and so a refusal is a value on the plan rather than a throw at the door.
 */
export function planRoute(ask: RouteAsk): Outcome<DeskPlan> {
	const note = readNote(ask.slug);
	if (!note.ok) return note;
	const { text, title, slug } = note.result;
	const empty = text.trim() === '';

	if (ask.to === 'composer')
		return { ok: true, result: plan({
			to: 'composer', slug, where: 'the composer — Action, at rest',
			text, refusal: empty ? 'the note is empty — there is nothing to summon with' : null,
		}) };

	if (ask.to === 'session') {
		if (ask.sid === '')
			return { ok: true, result: plan({ to: 'session', slug, where: 'no target', text,
				refusal: 'no session chosen — pick one anywhere on the deck and it becomes the target' }) };
		const standing = readDraft(ask.sid);
		return { ok: true, result: plan({
			to: 'session', slug, where: `the Chat’s draft for ${ask.sid}`, text,
			refusal: empty ? 'the note is empty — there is nothing to say'
				// His half-written reply is his. The desk hands a note to a box; it does not clear one.
				: standing.trim() !== '' ? `that target already holds a ${bytesOf(standing)} B draft — send or clear it in the Chat first; the desk will not overwrite his words`
				: null,
		}) };
	}

	// The inbox. The composition is B6's — its parse boundary decides what a legal filing is, and
	// `entryBytes` composes the append — so this route resolves a target and quotes the result.
	const filing = parseFiling({ building: ask.building, kind: 'report', title, body: bodyBelow(text) });
	if (!filing.ok)
		return { ok: true, result: plan({ to: 'issues', slug, where: ask.building || 'no building', text: '', refusal: filing.error }) };
	const stands = inboxExisting(filing.result.path);
	if (!stands.ok)
		return { ok: true, result: plan({ to: 'issues', slug, where: filing.result.path, text: '', refusal: stands.error }) };
	return { ok: true, result: plan({
		to: 'issues', slug,
		where: `${stands.result.path}${stands.result.minting ? ' — minting it from the D53 header (adoption-on-first-need)' : ''}`,
		text: entryBytes(stands.result.existing, filing.result.gesture),
		refusal: empty ? 'the note is empty — there is nothing to file' : null,
	}) };
}

/** Everything after the title line: the evidence half of D63h's block form. */
const bodyBelow = (text: string): string => {
	const lines = text.split('\n');
	const first = lines.findIndex(l => l.trim() !== '');
	return first < 0 ? '' : lines.slice(first + 1).join('\n').replace(/^\n+/, '').replace(/\n+$/, '');
};

export type DeskFiled = { path: string; line: string; bytes: number; sha: string; minted: boolean; receipt: string };

/**
 * The inbox route, fired. It carries the `sha` the page was showing and refuses if the composition
 * moved — **B11's arm law, one door along**: an inbox that gained an entry while he was reading the
 * preview would compose different bytes (the `---` decision is a function of the tail), and a
 * sign-off on bytes nobody re-read is not a sign-off.
 */
export function fileNote(ask: RouteAsk, sha: string): Outcome<DeskFiled> {
	if (ask.to !== 'issues') return fail(`only the inbox route is fired here — ${ask.to} is the client's own wire`);
	const p = planRoute(ask);
	if (!p.ok) return p;
	if (p.result.refusal !== null) return fail(p.result.refusal);
	if (sha !== '' && sha !== p.result.sha)
		return fail(`the inbox moved while you were reading it — you signed off on ${sha}, the append is now ${p.result.sha}; read it again`);

	const note = readNote(ask.slug);
	if (!note.ok) return note;
	const filing = parseFiling({ building: ask.building, kind: 'report', title: note.result.title, body: bodyBelow(note.result.text) });
	if (!filing.ok) return filing;

	const out = filed(filing.result);                 // B6's wire: ONE append, audited there, append-only
	if (!out.ok) return out;
	const receipt = stampNote(ask.slug, out.result.path);
	return { ok: true, result: {
		path: out.result.path, line: out.result.line, bytes: out.result.bytes,
		sha: p.result.sha, minted: out.result.minted,
		// A receipt that could not be written is said out loud: the entry landed either way, and a
		// silent half-success is the class this building spends its time refusing.
		receipt: receipt.ok ? receipt.result : `filed, but the receipt could not be written: ${receipt.error}`,
	} };
}

// ---------- the wire ----------

/**
 * `/desk/*` — the drawer's five doors. **Off the poll, deliberately**: nothing on the server changes
 * a note, so broadcasting his own writing back at him every three seconds would only fight the pane
 * he is typing in (B14 F4). The desk answers gestures, like `/deck/doc` and `/deck/chat`.
 *
 * **No credential gate** (B6 F3's law, third venue): a desk write is a file write, and cold hands
 * must never cost Felix the ability to write something down.
 */
export async function deskRoute(req: Request, action: string): Promise<Response> {
	if (action === 'notes')
		return json({ ok: true, result: { dir: deskDir(), notes: listNotes() } }, 200);

	if (action === 'note') {
		const slug = new URL(req.url).searchParams.get('slug') ?? '';
		const out = readNote(slug);
		return json(out, out.ok ? 200 : 404);
	}

	if (req.method !== 'POST') return json({ ok: false, error: `/desk/${action} takes a POST` }, 405);
	const raw = await req.text();
	if (bytesOf(raw) > LIMITS.requestBytes) return json({ ok: false, error: `body exceeds ${LIMITS.requestBytes} bytes` }, 413);
	let body: unknown;
	try { body = JSON.parse(raw || 'null'); }
	catch (e) { return json({ ok: false, error: `body is not JSON: ${(e as Error).message}` }, 400); }
	const r = (body ?? {}) as Record<string, unknown>;

	if (action === 'save') {
		const out = saveNote(field(r, 'slug'), field(r, 'text'));
		return json(out, out.ok ? 200 : 409);
	}
	if (action === 'preview') {
		const ask = readAsk(r);
		if (!ask.ok) return json(ask, 400);
		const out = planRoute(ask.result);
		return json(out, out.ok ? 200 : 409);
	}
	if (action === 'file') {
		const ask = readAsk(r);
		if (!ask.ok) return json(ask, 400);
		const out = fileNote(ask.result, field(r, 'sha'));
		return json(out, out.ok ? 200 : 409);
	}
	return json({ ok: false, error: `no such desk action: ${action} — notes, note, save, preview, file` }, 404);
}
