// The building register (D79) — `canon/BUILDINGS.md`, read as an artifact.
//
// Membership is declared, never inferred: this file names every building and host, and
// discovery's universe is its `building` rows. A `host` is listed, never walked. A declared
// root outranks the walk's worktree skip — manny registers its `user-manual` checkout — and
// the FILE-level dedup (building.ts) still drops the mainline twins that checkout carries.
//
// Two readers of one file drift, so this is the only one: `doctrine lint` reports the rows'
// form and their dead roots, `doctrine buildings` walks them, and the qualified id's building
// half resolves against the Names here (DOCTRINE §4).

import { readFileSync, statSync } from 'fs';
import { homedir } from 'os';
import { dirname, isAbsolute, join, resolve } from 'path';
import { discover, type Building } from './building';
import { delink, fail, strip, type Fail } from './grammar';
import { tables } from './parse';

export type Kind = 'building' | 'host';
export type RegisterRow = { name: string; kind: Kind; root: string; line: number };
/** A row plus what the disk says about it: `buildings` is empty for a host, always. */
export type RegisteredBuilding = RegisterRow & { exists: boolean; buildings: Building[] };

/** The city keeps ONE building register (D79), and it ships beside this parser. */
export const REGISTER = resolve(import.meta.dir, '..', '..', 'canon', 'BUILDINGS.md');

const COLUMNS = ['name', 'kind', 'root'];
const KINDS: readonly string[] = ['building', 'host'];

/** A Root is an address: `~`-expanded, or — for a fixture's own register — its file's neighbour. */
const address = (root: string, dir: string) =>
	root === '~' || root.startsWith('~/') ? join(homedir(), root.slice(1))
	: isAbsolute(root) ? root
	: resolve(dir, root);

const isDir = (p: string) => { try { return statSync(p).isDirectory(); } catch { return false; } };

/** The building register's table, parsed. Every defect is a failure naming the offending line. */
export function parseRegister(md: string, dir: string): { rows: RegisterRow[]; fails: Fail[] } {
	const rows: RegisterRow[] = [], fails: Fail[] = [];
	const table = tables(md).find(t =>
		t.header.length === COLUMNS.length && COLUMNS.every((want, k) => strip(t.header[k] ?? '').toLowerCase() === want));
	if (!table) {
		fails.push(fail('register', 'register.table', `no "${COLUMNS.join(' | ')}" table — the building register IS that table (D79)`, '', 1));
		return { rows, fails };
	}

	const seen = new Set<string>();
	for (const { cells, line } of table.rows) {
		const excerpt = '| ' + cells.join(' | ') + ' |';
		const bad = (code: string, reason: string) => { fails.push(fail('register', code, reason, excerpt, line)); };
		if (cells.length !== COLUMNS.length) { bad('register.row', `a row is Name | Kind | Root — this one splits into ${cells.length} cell(s)`); continue; }

		const name = strip(delink(cells[0]!)), kind = strip(cells[1]!).toLowerCase(), root = strip(cells[2]!);
		if (!name) { bad('register.name', 'empty Name — a Name is the address qualified ids resolve against'); continue; }
		if (seen.has(name)) { bad('register.name', 'duplicate Name — `<building>:<id>` demands one root per Name'); continue; }
		if (!KINDS.includes(kind)) { bad('register.kind', `Kind is "building" (walked for books) or "host" (listed, never walked)`); continue; }
		if (!root) { bad('register.root', 'empty Root — a row without an address declares nothing'); continue; }
		seen.add(name);
		rows.push({ name, kind: kind as Kind, root: address(root, dir), line });
	}
	return { rows, fails };
}

/** The building register as the disk answers it: the rows, their form defects, and every dead Root. */
export function readRegister(file: string = REGISTER): { rows: RegisterRow[]; fails: Fail[] } {
	const { rows, fails } = parseRegister(readFileSync(file, 'utf8'), dirname(file));
	for (const r of rows)
		if (!isDir(r.root)) fails.push(fail('register', 'register.root', 'the Root is no directory on disk — the row is an address, and this one is dead', `${r.name}: ${r.root}`, r.line));
	for (const f of fails) f.file = file;
	return { rows, fails };
}

/**
 * Discovery's universe: every `building` row walked by the anchor law, hosts listed only.
 * A registered building the walk finds nothing in is a WARNING — a founding not yet run
 * (DOCTRINE §12) reads exactly like one, and a warning never moves an exit code.
 */
export function walkRegister(file: string = REGISTER): { entries: RegisteredBuilding[]; fails: Fail[] } {
	const { rows, fails } = readRegister(file);
	const entries = rows.map(r => {
		const exists = isDir(r.root);
		const buildings = r.kind === 'building' && exists ? discover([r.root]) : [];
		if (r.kind === 'building' && exists && !buildings.length)
			fails.push(fail('register', 'register.empty', 'a registered building whose walk finds no artifact — a founding not yet run (DOCTRINE §12)', `${r.name}: ${r.root}`, r.line, 'warn'));
		return { ...r, exists, buildings };
	});
	for (const f of fails) f.file = file;
	return { entries, fails };
}

/** The Names a qualified id may bind to: a host keeps no books, so it can hold no charge. */
export const buildingNames = (rows: RegisterRow[]) => new Set(rows.filter(r => r.kind === 'building').map(r => r.name));

/**
 * DOCTRINE §4's third Depends-on form, resolved at lint: `<building>:<id>` binds its building
 * half to a Name in the building register. The far id is the far building's business — a
 * crossing names the door, and an unregistered door is the defect this catches.
 */
export function crossingFails(b: Building, names: Set<string>): Fail[] {
	const out: Fail[] = [];
	for (const board of b.board) for (const row of board.rows) for (const c of row.crossings) {
		if (names.has(c.slice(0, c.indexOf(':')))) continue;
		const f = fail('board', 'board.crossing', 'the building half of a qualified id names no registered building (canon/BUILDINGS.md, D79)', `${row.id}: ${JSON.stringify(c)}`, row.line);
		f.file = board.file;
		out.push(f);
	}
	return out;
}
