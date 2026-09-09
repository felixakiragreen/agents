// `doctrine boot ‹root›` — the boot pack (044): what a cold session needs to orient, derived
// from the building's books at every call and never kept. DOCTRINE §11's Start, §2's questions.
//
// **Nothing here is authored.** Every line that is not a count is a byte from a file: a board
// row is the document's own line, the tail is the entry's block, an inbox entry is its first
// line. A paraphrase is a defect — the pack is read cold and acted on, so it must be the books.
//
// The parse already exists (`parse()` yields every field); this is a render of it. The board
// question the pack answers is the LIVE one: 108 rows of which 4 are workable is 60 KB read to
// learn four lines, and only a derived live view scales with the campaign.

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { basename, relative, resolve } from 'path';
import { parse, type Board } from './building';
import { statementLine } from './credit';
import { lint } from './lint';
import type { Baton } from './parse';
import { readRegister } from './register';

/** The states a session can still act on — 031's live set, the board's half of it. */
const LIVE: readonly (string | null)[] = ['OPEN', 'IN FLIGHT', 'BLOCKED'];

/** The shelf's own line: a board doc's deferred list opens with it, or the doc keeps none. */
const DEFERRED_LINE = '**Deferred (tracked, not lost):**';

const tilde = (p: string) => p.replace(process.env.HOME + '/', '~/');

/** The day the pack was drawn — local, because the books are dated in Felix's day, not UTC's. */
function today(): string {
	const d = new Date();
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** The commit the pack was drawn at — the pack is derived, so it is only true of one tree. */
function headSha(root: string): string {
	try { return execSync('git rev-parse --short HEAD', { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim(); }
	catch { return 'no git'; }
}

/**
 * The building register's Name for this root (D79), else the directory's basename.
 * The ROWS answer it — `walkRegister` would parse every building in the city to name one.
 */
function registeredName(root: string): string {
	return readRegister().rows.find(r => resolve(r.root) === root)?.name ?? basename(root);
}

/**
 * The shelf's size: top-level `- ` bullets under the deferred line, to the next heading or EOF.
 * Counted, never parsed — the pack says how much is shelved and the board says what (D78).
 */
function deferredCount(md: string): number | null {
	const lines = md.split('\n');
	const at = lines.findIndex(l => l.startsWith(DEFERRED_LINE));
	if (at < 0) return null;
	let n = 0;
	for (let i = at + 1; i < lines.length && !/^#{1,6} /.test(lines[i]!); i++) if (/^- /.test(lines[i]!)) n++;
	return n;
}

/**
 * §11's baton, every field the parser types off the line (045): who holds it and by what name,
 * the shape of the move, what a ⬡-baton asks of him, and what is fireable. Each marked part
 * prints only where the record marked it — an absent shape is an unmarked baton, not a `single`.
 */
function batonLine(baton: Baton | null): string {
	if (!baton) return 'Baton — unrecorded';
	if (baton.holder === 'none') return `Baton — ${baton.text}`;   // §7's typed close carries its own why
	if (baton.holder === 'prose') return 'Baton — dropped';
	const holder = baton.holder === 'felix' ? '⬡' : baton.holder === 'dispatch' ? 'the dispatch' : 'session';
	const summons = baton.instruments.filter(i => i.kind === 'summons').length;
	const rows = baton.instruments.flatMap(i => i.kind === 'row' ? [i.row] : []);
	const parts = [...summons ? [`${summons} summons`] : [], ...rows.length ? [`ignite ${rows.join(', ')}`] : []];
	const who = baton.named ? `${holder} ${baton.named}` : holder;
	const marks = [who, ...baton.shape ? [baton.shape] : [], ...baton.type ? [baton.type] : []];
	return `Baton — ${marks.join(' · ')} → ${parts.join(', ') || 'no instrument'}`;
}

/** One board: its counts, then its live rows verbatim. A board with none prints the counts alone. */
function boardBlock(b: Board, md: string, label: string): string[] {
	const lines = md.split('\n');
	const count = (s: string) => b.rows.filter(r => r.state === s).length;
	const live = b.rows.filter(r => LIVE.includes(r.state));
	const deferred = deferredCount(md);
	const head = `## Board — ${label}: ${b.rows.length} charges · ${live.length} live · `
		+ `${count('LANDED')} landed · ${count('KILLED')} killed · deferred ${deferred ?? '—'}`;
	if (!live.length) return [head];
	return [head, lines[b.line - 1]!, ...live.map(r => lines[r.line - 1]!)];
}

/** The pack: one building's books, rendered. Text only — the room reads `parse()` directly. */
export function bootPack(rootArg: string): string {
	const root = resolve(rootArg);
	const b = parse(root);                       // the building AT the root, never its sub-buildings
	// `parse()` never refuses — a named root is its own anchor by law — so the refusal is the
	// register's own test for a building that is not one (`register.empty`, D79): no artifact.
	if (!b.board.length && !b.files.ledger && !b.files.decisions && !b.files.issues)
		throw new Error('the walk finds no board, ledger, decision register or inbox here — not a building (D79)');
	const rel = (f: string) => relative(root, f);
	const docs = new Map<string, string>();      // one read per doc — two boards in one doc share it
	const read = (f: string) => { const md = docs.get(f) ?? readFileSync(f, 'utf8'); docs.set(f, md); return md; };

	const out = [`# ${registeredName(root)} — boot · ${tilde(root)} · HEAD ${headSha(root)} · ${today()}`];

	// The heading is named where it carries information: n boards per doc is a corpus fact, and
	// there the file alone cannot say which table a block is.
	const perDoc = new Map<string, number>();
	for (const x of b.board) perDoc.set(x.file, (perDoc.get(x.file) ?? 0) + 1);
	for (const x of b.board)
		out.push('', ...boardBlock(x, read(x.file), perDoc.get(x.file)! > 1 ? `${rel(x.file)} · ${x.heading}` : rel(x.file)));

	out.push('');
	if (!b.files.ledger) out.push('## Ledger — none');
	else {
		out.push(`## Ledger — ${rel(b.files.ledger)}: ${b.ledgerEntries} entries`);
		if (b.ledgerTail) out.push(b.ledgerTail.block.replace(/^\n+|\n+$/g, ''));
		out.push(batonLine(b.baton));
	}

	out.push('');
	if (!b.files.decisions) out.push('## Decisions — none');
	else {
		out.push(`## Decisions — ${rel(b.files.decisions)}: ${b.decisions} entries · queue ${b.decisionQueue.length}`);
		// The queue is what waits on his pen — the id and the title, both bytes from the register.
		for (const d of b.decisionQueue) out.push(`- ${d.id} — ${d.title}`);
	}

	out.push('');
	if (!b.files.issues) out.push('## Inbox — none');
	else {
		const lines = read(b.files.issues).split('\n');
		out.push(`## Inbox — ${rel(b.files.issues)}: ${b.issues.length} entries`);
		for (const i of b.issues) out.push(lines[i.line - 1]!);
	}

	// The two gauges: the statement's one line (D82) over this building's credits, and the lint's
	// totals — the drift alarm for the root and everything under it, sub-buildings included.
	const report = lint([root]);
	const failed = report.fails.filter(f => f.severity === 'fail');
	out.push('', `Statement: ${statementLine(b.credits)}`,
		`Lint: ${failed.length} failure(s) in ${new Set(failed.map(f => f.code)).size} class(es) · ${report.fails.length - failed.length} warning(s)`);
	return out.join('\n');
}
