/**
 * The sovereign's inbox — the fence's third write (README §2, D3), and the only one the city
 * commits. His word travels without his hands: a gesture in the glass becomes ONE line in the
 * target building's `ISSUES.md`, and the building's own Architect rules it at the next sweep,
 * with his name on the ruling.
 *
 * Four laws hold this file down:
 *
 *  1. **Append-only, and that is the whole licence.** Every write this module makes adds bytes
 *     at EOF: the content BEFORE a gesture is always a byte-prefix of the content after. The
 *     glass never rewrites, reorders, resolves or deletes an entry — that is the sweep's pen,
 *     and editing truth is the forever non-goal (README §4).
 *  2. **The glass never pens the ruling.** A countersign gesture records *that Felix countersigned*;
 *     the ✓ is stamped into the D-entry by the Architect who sweeps, with his name on it. So a
 *     card has three states and all three are read off files: pending → recorded → folded.
 *  3. **No credential gate.** A note is a file write, not a socket call — the arming switch
 *     (D9) exists to gate one-click *dispatch*, so the hands going cold must never cost Felix
 *     the ability to say something. Only the apply button, which IS a fire, disables.
 *  4. **Adoption-on-first-need** (DOCTRINE §3): a building with no inbox gets one minted from
 *     the D53 header template, verbatim, and the entry appended under it.
 */

import { appendFileSync, existsSync, readFileSync, statSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { isAbsolute, join, resolve, sep } from 'path';
import type { Decision, Issue } from '../../doctrine';
import { audit, fail, field, json, type Outcome } from './hands';
import { esc, label, pill } from './html';
import { cityRoot, ISSUES_TEMPLATE } from './paths';
import { bust } from './register';
import { compose, type Composed } from './summon';
import type { Rig } from './rig';

/** Everything has a limit (directive 3.1). A gesture is one line; a body is one gesture. */
const LIMITS = { noteBytes: 4 << 10, evidenceBytes: 64 << 10, requestBytes: 128 << 10, siblings: 40 } as const;

/** D63h's `<who>`, and the fence's own words for it (README §2 write #3). */
export const WHO = 'Felix (via Belvedere)';

// ---------- the gesture ----------

export type Gesture =
	| { kind: 'note'; text: string }
	| { kind: 'defer'; row: string }
	| { kind: 'before'; row: string; other: string }
	| { kind: 'countersign'; decision: string }
	/**
	 * **A field report, with its evidence** (B19, D63h's block form). The desk's route into an inbox:
	 * a note is a title and a body, and D63h says an entry needing evidence *becomes* a
	 * `---`-separated block opening with the entry line. So the title is the `<what>` — the
	 * encapsulation law arriving in the corpus — and the body rides below it as list continuation.
	 * An empty body is a bare bullet and is exactly a `note`; the two kinds stay apart because they
	 * answer different questions (one line said in passing vs. a written thing sent somewhere).
	 */
	| { kind: 'report'; title: string; body: string };

/** D63h's `<what>` — the gesture in the sovereign's own shorthand, one line, ruled by a human. */
export const gestureText = (g: Gesture): string =>
	g.kind === 'note' ? g.text
	: g.kind === 'defer' ? `defer ${g.row}`
	: g.kind === 'before' ? `${g.row} before ${g.other}`
	: g.kind === 'report' ? g.title
	: `countersign ${g.decision}: ✓`;

/** The evidence half of an entry, or `''`. Only a `report` has one. */
export const gestureBody = (g: Gesture): string => (g.kind === 'report' ? g.body : '');

/** The city writes LOCAL dates; `toISOString()` is UTC and would file tonight's note tomorrow. */
export function today(now = new Date()): string {
	const pad = (n: number) => String(n).padStart(2, '0');
	return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

/** D63h in one line: `- <YYYY-MM-DD> · <who> · <what>`. */
export const entryLine = (g: Gesture, date = today()) => `- ${date} · ${WHO} · ${gestureText(g)}`;

/** An entry is ONE bullet: a newline or a control byte inside it would break the grammar. */
const oneLine = (s: string) => s.replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s{2,}/g, " ").trim();

// ---------- the parse boundary ----------

const ROW = /^[A-Za-z0-9][A-Za-z0-9._-]{0,31}$/;      // B6, P1, T12a, 11, O2 — the city's whole range
const DECISION = /^D\d{1,5}$/;

/** A gesture and the building it lands in — the trusted shape below this line. */
export type Filing = { path: string; gesture: Gesture };

/**
 * The write fence, and the reason the wire carries a path rather than a slug: a building minting
 * its FIRST inbox is not on the register yet (nothing there is an artifact), so resolving through
 * the register would refuse exactly the case adoption-on-first-need exists for. The path is
 * resolved before it is measured — `code/../secret` is outside the city however it is spelled.
 */
function buildingDir(raw: string): { path: string } | { error: string } {
	if (!isAbsolute(raw)) return { error: 'building must be an absolute path' };
	const path = resolve(raw);
	if (!path.startsWith(cityRoot() + sep)) return { error: `building is outside the city (${cityRoot()}): ${path}` };
	try { if (!statSync(path).isDirectory()) return { error: `building is not a directory: ${path}` }; }
	catch { return { error: `building does not exist: ${path}` } }
	return { path };
}

export function parseFiling(raw: unknown): Outcome<Filing> {
	if (typeof raw !== 'object' || raw === null) return fail('body must be a JSON object');
	const r = raw as Record<string, unknown>;

	const where = buildingDir(field(r, 'building'));
	if ('error' in where) return fail(where.error);
	const path = where.path;
	const kind = field(r, 'kind');

	if (kind === 'note') {
		const text = oneLine(field(r, 'text'));
		if (text === '') return fail('the note is empty — a blank line is not a gesture');
		if (Buffer.byteLength(text) > LIMITS.noteBytes) return fail(`the note exceeds ${LIMITS.noteBytes} bytes`);
		return { ok: true, result: { path, gesture: { kind, text } } };
	}
	if (kind === 'defer' || kind === 'before') {
		const row = field(r, 'row'), other = field(r, 'other');
		if (!ROW.test(row)) return fail(`row must be a board row id — got "${row}"`);
		if (kind === 'defer') return { ok: true, result: { path, gesture: { kind, row } } };
		if (!ROW.test(other)) return fail(`other must be a board row id — got "${other}"`);
		if (row === other) return fail(`"${row} before ${other}" says nothing — a row cannot precede itself`);
		return { ok: true, result: { path, gesture: { kind, row, other } } };
	}
	if (kind === 'report') {
		const title = oneLine(field(r, 'title'));
		const body = field(r, 'body').replace(/\r\n?/g, '\n').replace(/[ \t]+$/gm, '').replace(/\n+$/, '');
		if (title === '') return fail('the report has no title — D63h\'s entry line cannot be empty');
		if (Buffer.byteLength(title) > LIMITS.noteBytes) return fail(`the report's title exceeds ${LIMITS.noteBytes} bytes`);
		if (Buffer.byteLength(body) > LIMITS.evidenceBytes) return fail(`the report's evidence exceeds ${LIMITS.evidenceBytes} bytes`);
		return { ok: true, result: { path, gesture: { kind, title, body } } };
	}
	if (kind === 'countersign') {
		const decision = field(r, 'decision');
		return DECISION.test(decision)
			? { ok: true, result: { path, gesture: { kind, decision } } }
			: fail(`decision must be a D-id — got "${decision}"`);
	}
	return fail(`kind must be note, report, defer, before or countersign — got "${kind}"`);
}

// ---------- the write ----------

export const inboxFile = (buildingPath: string) => join(buildingPath, 'ISSUES.md');

/**
 * The bytes ONE gesture adds, and the only shaping this module does.
 *
 * A bare bullet needs no block of its own (D63h), but an entry appended straight onto a tail
 * block that already carries an entry's *evidence* reads as part of that evidence — so a tail
 * block with anything in it earns the new entry a `---` of its own, which is exactly how the
 * city's own multi-entry inboxes look. A tail block that is empty (the header template ends with
 * `---`, and a swept inbox drains to it) takes the bullet directly.
 */
export function addition(existing: string, line: string, body = ''): string {
	const tail = existing.split(/^---[ \t]*$/m).at(-1) ?? '';
	const pad = existing === '' || existing.endsWith('\n\n') ? '' : existing.endsWith('\n') ? '\n' : '\n\n';
	return `${pad}${tail.trim() === '' ? '' : '---\n\n'}${line}\n${evidence(body)}`;
}

/**
 * A report's evidence, as markdown list continuation under its own entry line (D63h's block form).
 *
 * Two spaces, and blank lines left bare. The indent is not decoration: `blocks()` in the one parser
 * splits an inbox on `^---\s*$`, so an indented `---` inside a body **cannot** cut the block in half
 * and strand the evidence in a block with no entry line (which is the one thing `parseIssues` lints).
 * Felix's own notes are markdown and rules in them are ordinary; the indent is what makes routing one
 * safe rather than something he has to remember not to write.
 */
export const evidence = (body: string): string =>
	body === '' ? '' : `\n${body.split('\n').map(l => (l === '' ? '' : `  ${l}`)).join('\n')}\n`;

/**
 * The exact bytes ONE gesture appends. **The preview and the write are this one function** — the
 * desk shows Felix what will land before he signs off (spec §3, the countersign law), and a preview
 * composed by a second copy of this reasoning is a preview that can lie.
 */
export const entryBytes = (existing: string, g: Gesture, date = today()): string =>
	addition(existing, entryLine(g, date), gestureBody(g));

/**
 * The bytes an append composes *against*: the inbox as it stands, or the D53 header a mint is about
 * to lay down. Read-only, and shared with the preview (B19) — a preview that guessed the header for
 * a building whose inbox does not exist yet would show the wrong first bytes on exactly the gesture
 * adoption-on-first-need exists for.
 */
export function inboxExisting(buildingPath: string): Outcome<{ path: string; existing: string; minting: boolean }> {
	const path = inboxFile(buildingPath);
	if (existsSync(path)) {
		try { return { ok: true, result: { path, existing: readFileSync(path, 'utf8'), minting: false } }; }
		catch (e) { return fail(`cannot read ${path}: ${(e as Error).message}`); }
	}
	try { return { ok: true, result: { path, existing: readFileSync(ISSUES_TEMPLATE, 'utf8'), minting: true } }; }
	catch (e) { return fail(`no inbox here, and the D53 header template is unreadable (${ISSUES_TEMPLATE}): ${(e as Error).message}`); }
}

export type Filed = { path: string; line: string; minted: boolean; bytes: number };

/**
 * One gesture, one append. The mint is the only other write, and it happens exactly once per
 * building, ever: `wx` refuses a file that appeared between the check and the write rather than
 * clobbering it.
 */
export function fileGesture(f: Filing, date = today()): Outcome<Filed> {
	const path = inboxFile(f.path);
	const line = entryLine(f.gesture, date);

	const stands = inboxExisting(f.path);
	if (!stands.ok) return stands;
	const { existing, minting } = stands.result;
	if (minting) {
		try { writeFileSync(path, existing, { flag: 'wx' }); }
		catch (e) { return fail(`cannot mint ${path}: ${(e as Error).message}`); }
	}
	const minted = minting;

	const add = entryBytes(existing, f.gesture, date);
	try { appendFileSync(path, add); }
	catch (e) { return fail(`cannot append to ${path}: ${(e as Error).message}`); }
	return { ok: true, result: { path, line, minted, bytes: Buffer.byteLength(add) } };
}

/**
 * Do it, then say you did it — the hands' own law (`hands.ts` §audit), and the audit carries the
 * entry verbatim because the entry is already public in git. A **mint** is the one gesture that
 * moves the register: an `ISSUES.md` is an anchor (doctrine's register law), so the directory it
 * lands in may not have been a building a moment ago. A plain append changes no file list and
 * busts nothing — a nine-second walk for a line of prose is a bill nobody asked for.
 */
export function filed(f: Filing): Outcome<Filed> {
	const out = fileGesture(f);
	audit('inbox', { building: f.path, kind: f.gesture.kind, entry: gestureText(f.gesture) }, out);
	if (out.ok && out.result.minted) bust();
	return out;
}

// ---------- the countersign's three states ----------

export type Countersigned = 'pending' | 'recorded' | 'folded';

/** Does this inbox already carry the countersign for `id`? Matched as text, never as a regex. */
export const recordedIn = (issues: Issue[], id: string) =>
	issues.some(i => {
		const head = 'countersign ';
		if (!i.text.startsWith(head)) return false;
		const rest = i.text.slice(head.length).trimStart();
		return rest === id || rest.startsWith(`${id}:`) || rest.startsWith(`${id} `);
	});

/**
 * pending → recorded → folded, all three read off files (B6's amendment). **Folded is the sweep's
 * ✓, not the glass's**: the entry is his word, the D-entry is the Architect's pen, and the two
 * are separate files on purpose.
 */
export const countersignState = (d: Decision, issues: Issue[]): Countersigned =>
	d.blessed ? 'folded' : recordedIn(issues, d.id) ? 'recorded' : 'pending';

// ---------- the apply button's summons ----------

const tilde = (p: string) => p.startsWith(homedir() + sep) ? '~' + p.slice(homedir().length) : p;

/** B6 §2's template, verbatim from the blessed order. `<building>` is the only substitution. */
export const sweepSummons = (buildingPath: string) => {
	const building = tilde(buildingPath);
	return `You are an Architect at fable-high.
Wear ~/code/agents/canon/mantles/architect.md,
then read ${building}/README.md (or its master doc) and ${building}/ISSUES.md,
sweep the inbox: rule each entry, true the board, attribute Felix's entries
to Felix, commit in his git style.`;
};

/** The scoped sitting, composed exactly as `POST /hands/fire` parses it (B4 F1). */
export const sweepFire = (rig: Rig, buildingPath: string, account: string): Composed =>
	compose(rig, {
		summons: sweepSummons(buildingPath), mantle: 'Architect', tier: 'fable-high',
		cwd: buildingPath, account,
	});

// ---------- render ----------

/** What a gesture button carries: the building it targets, and the gesture itself. */
const payload = (buildingPath: string, g: Record<string, unknown>) =>
	esc(JSON.stringify({ building: buildingPath, ...g }));

const out = () => `<div class="acts"><span class="out" data-out></span></div>`;

/**
 * A free-text note. **Encapsulation-first** (design law, README §3): the control leads with its
 * name and `[expand]` opens the box — a scriptless `<details>`, so the disclosure is the
 * browser's and survives everything.
 */
export const noteBox = (buildingPath: string, name = 'note to this inbox') =>
	`<details class="gesture"><summary>${esc(name)}</summary>
		<p class="prose note">One append to <code>${esc(tilde(inboxFile(buildingPath)))}</code>, signed <b>${esc(WHO)}</b>.
		The glass never edits what is already there; this building's Architect rules it at the next sweep.</p>
		<textarea class="prose" data-note rows="3" spellcheck="true"
			placeholder="his word, one line — it lands as written"></textarea>
		<div class="acts"><button class="ges" data-gesture="${payload(buildingPath, { kind: 'note' })}">file it</button>
		<span class="out" data-out></span></div></details>`;

/**
 * Defer and reorder, on a rendered board row. `before <id>` is offered against every other row on
 * the SAME board — the gesture is prose for the Architect, so the row ids are all it needs to
 * carry. Bounded: a board longer than the cap offers the cap, and says so.
 */
export function rowGestures(buildingPath: string, id: string, siblings: string[]): string {
	const rest = siblings.filter(s => s !== id);
	const shown = rest.slice(0, LIMITS.siblings);
	const before = shown.map(s =>
		`<button class="ges" data-gesture="${payload(buildingPath, { kind: 'before', row: id, other: s })}">before ${esc(s)}</button>`).join('');
	const withheld = rest.length > shown.length
		? `<p class="prose note">${rest.length - shown.length} further rows are not offered here.</p>` : '';
	return `<details class="gesture"><summary>defer / reorder</summary>
		<div class="btns"><button class="ges" data-gesture="${payload(buildingPath, { kind: 'defer', row: id })}">defer ${esc(id)}</button>${before}</div>
		${withheld}${out()}</details>`;
}

const COUNTERSIGN: Record<Countersigned, { text: string; tone: Parameters<typeof pill>[1]; note: string }> = {
	pending: { text: 'pending countersign', tone: 'yellow', note: '' },
	recorded: { text: 'recorded — awaiting fold', tone: 'blue',
		note: 'His word is in the inbox; the ✓ reaches the decision when this building\'s Architect sweeps.' },
	folded: { text: 'folded — ✓ in the decision', tone: 'green',
		note: 'The decision already carries its ✓. Nothing is owed here — the queue still lists it, so the card says which reading won.' },
};

/** The card's own headline. It is the STATE, never the queue's word for it — see `countersignAct`. */
export const countersignPill = (state: Countersigned) =>
	pill(COUNTERSIGN[state].text, COUNTERSIGN[state].tone);

/**
 * The countersign gesture, and the two states that offer no button. **Recorded is not signed**:
 * the entry is in the inbox and the ✓ reaches the D-entry when the Architect sweeps, so the card
 * says so rather than letting a click look like a ratification.
 *
 * **Folded outranks pending, and that is D10 doing its job.** `parseDecisions` marks an entry
 * pending whenever the phrase appears anywhere in it — including in the entry that *defines* the
 * ritual (canon D21, which is `✓ Felix` and has sat on the rail as a pending countersign since B3).
 * Two readings, one of them a false positive, so the card renders safe: no button, both readings
 * named. The parse stays the parser's (D65); the ask rides this row's findings.
 */
export function countersignAct(buildingPath: string, d: Decision, state: Countersigned): string {
	if (state === 'pending') return `<div class="gesture flat">
		<p class="prose note">One line into <code>${esc(tilde(inboxFile(buildingPath)))}</code> — the glass records the countersign, it never pens the D-entry (D3).</p>
		<div class="acts"><button class="ges" data-gesture="${payload(buildingPath, { kind: 'countersign', decision: d.id })}">countersign ${esc(d.id)}</button>
		<span class="out" data-out></span></div></div>`;
	return `<div class="gesture flat"><p class="prose note">${esc(COUNTERSIGN[state].note)}</p></div>`;
}

/**
 * The apply button: the scoped Architect sitting, one per account (a toggled group, never a
 * dropdown — design law §3). One composed body, one name-stamp: only one of these will ever be
 * clicked, and minting three stamps to render three labels would spend two of them on nothing.
 */
export function applyAct(rig: Rig, buildingPath: string, accounts: string[], armed: boolean, entries: number): string {
	const first = accounts[0];
	if (!first) return `<p class="prose note bad">No accounts in <code>accounts.tsv</code> — nothing to fire the sweep as.</p>`;

	const composed = sweepFire(rig, buildingPath, first);
	if ('blocked' in composed) return `<p class="prose note bad">${esc(composed.blocked)}</p>`;

	const cold = armed ? '' : ' disabled';
	const buttons = accounts.map(a =>
		`<button class="ges apply" data-apply="${esc(JSON.stringify({ ...composed.body, account: a }))}"${cold}>sweep as ${esc(a)}</button>`).join('');
	return `<div class="gesture flat">
		<p class="prose note">${entries} entr${entries === 1 ? 'y' : 'ies'} waiting. The sitting reads this building's master doc and its inbox, rules each entry, and commits — Felix's word applied with the Architect's name on the ruling.</p>
		<div class="btns">${buttons}</div>
		<div class="acts">${label('as')}<span class="out" data-out>${esc(`${composed.body.stamp} · ${composed.body.model}-${composed.body.effort}`)}</span></div>
		<details class="more"><summary>the summons</summary><pre class="summons">${esc(composed.body.summons)}</pre></details></div>`;
}

/**
 * The one script the gesture UI needs: one delegated listener, no framework, no client state.
 * A countersign reloads because the card's whole point is the transition it just caused — the
 * page re-reads the file and the three states derive themselves. Everything else reports the
 * line it filed, verbatim, so Felix can see exactly what his inbox now says.
 */
export const INBOX_SCRIPT = `<script>
document.addEventListener('click', async ev => {
	const btn = ev.target.closest('button[data-gesture], button[data-apply]');
	if (!btn) return;
	const box = btn.closest('.gesture'), out = box.querySelector('[data-out]');
	btn.disabled = true;
	try {
		if (btn.dataset.apply) {
			out.textContent = 'firing…';
			const r = await fetch('/hands/fire', { method: 'POST', headers: { 'content-type': 'application/json' }, body: btn.dataset.apply });
			const body = await r.json();
			out.textContent = body.ok ? 'fired ' + body.result.workspace + ' · sha ' + body.result.sha : r.status + ' ' + body.error;
			if (!body.ok) btn.disabled = false;
			return;
		}
		const gesture = JSON.parse(btn.dataset.gesture);
		const note = box.querySelector('[data-note]');
		if (note) gesture.text = note.value;
		out.textContent = 'filing…';
		const r = await fetch('/inbox', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(gesture) });
		const body = await r.json();
		if (!body.ok) { out.textContent = r.status + ' ' + body.error; btn.disabled = false; return; }
		out.textContent = 'filed · ' + body.result.line;
		if (note) note.value = '';
		if (gesture.kind === 'countersign') location.reload();
	} catch (e) { out.textContent = String(e); btn.disabled = false; }
});
</script>`;

// ---------- the route ----------

/**
 * `POST /inbox`. **No credential gate** (§3 above): the hands going cold must never cost Felix
 * the ability to say something. A refusal is 409 — the request was legal, the world said no.
 */
export async function inboxRoute(req: Request): Promise<Response> {
	if (req.method !== 'POST') return json({ ok: false, error: 'the inbox is POST-only' }, 405);

	const raw = await req.text();
	if (Buffer.byteLength(raw) > LIMITS.requestBytes) return json({ ok: false, error: `body exceeds ${LIMITS.requestBytes} bytes` }, 413);
	let body: unknown;
	try { body = JSON.parse(raw || 'null'); }
	catch (e) { return json({ ok: false, error: `body is not JSON: ${(e as Error).message}` }, 400); }

	const parsed = parseFiling(body);
	if (!parsed.ok) return json(parsed, 400);
	const out = filed(parsed.result);
	return json(out, out.ok ? 200 : 409);
}
