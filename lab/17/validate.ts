// lab/017 — the S arm's lint: schema validation over the twin. The C3 comparandum for
// doctrine/'s parser-as-lint. Refusal classes, all loud:
//   json.syntax     — JSON.parse refusal (stray newline in string, missing comma, …)
//   json.dupkey     — duplicate key in one object (raw-text scan; JSON.parse is silently
//                     last-wins — the S arm's one silent class, closed here)
//   field.missing   — a required field absent
//   field.type      — wrong JSON type
//   enum.state / enum.mantle / enum.tier — token outside the grammar ('unrecorded' legal)
//   ref.unresolved  — dependsOn names no row id on the board
//   date.form       — not ISO YYYY-MM-DD

import { readFileSync } from 'fs';
import { join } from 'path';
import { MANTLES, TIERS, STATES } from '../../doctrine/src/grammar';

const DIR = join(import.meta.dir, 'twin');
let fails = 0;
const bad = (cls: string, where: string, what: string) => { fails++; console.log(`${cls}  ${where}  ${what.slice(0, 120)}`); };

const legalTier = (t: unknown) => t === 'unrecorded' || (TIERS as readonly string[]).includes(String(t));
const legalMantle = (m: unknown) => m === 'unrecorded' || (MANTLES as readonly string[]).includes(String(m));
const isDate = (d: unknown) => /^\d{4}-\d{2}-\d{2}$/.test(String(d));
const str = (x: unknown) => typeof x === 'string';

function load(file: string): unknown {
	const raw = readFileSync(join(DIR, file), 'utf8');
	// dupkey: scan object literals textually — JSON.parse would silently last-win
	for (const obj of raw.match(/\{[^{}]*\}/gs) ?? []) {
		const keys = [...obj.matchAll(/"([^"\\]+)"\s*:/g)].map(m => m[1]);
		const dup = keys.find((k, i) => keys.indexOf(k) !== i);
		if (dup) bad('json.dupkey', file, `duplicate key "${dup}"`);
	}
	try { return JSON.parse(raw); }
	catch (e) { bad('json.syntax', file, String(e)); return null; }
}

function need(o: Record<string, unknown>, where: string, spec: Record<string, (x: unknown) => boolean>) {
	for (const [k, ok] of Object.entries(spec)) {
		if (!(k in o)) bad('field.missing', where, k);
		else if (!ok(o[k])) bad('field.type', where, `${k} = ${JSON.stringify(o[k])}`);
	}
}

const boards = load('board.json') as { heading: string; rows: Record<string, unknown>[] }[] | null;
if (boards) for (const b of boards) {
	const ids = new Set(b.rows.map(r => String(r.id)));
	for (const r of b.rows) {
		const w = `board.${r.id}`;
		need(r, w, {
			id: str, work: str, workDoc: x => x === null || str(x),
			dependsOn: Array.isArray, gates: Array.isArray,
			felixGate: x => typeof x === 'boolean', rider: x => x === null || str(x),
			annotation: str,
		});
		if (!r.felixGate) {
			if (!legalMantle(r.mantle)) bad('enum.mantle', w, String(r.mantle));
			if (!legalTier(r.tier)) bad('enum.tier', w, String(r.tier));
		}
		if (r.state !== null && !(STATES as readonly string[]).includes(String(r.state))) bad('enum.state', w, String(r.state));
		for (const d of (r.dependsOn as unknown[]) ?? []) if (!ids.has(String(d))) bad('ref.unresolved', w, String(d));
	}
}

const ledger = load('ledger.json') as Record<string, unknown>[] | null;
if (ledger) for (const [i, e] of ledger.entries()) {
	const w = `ledger[${i}]`;
	need(e, w, { date: isDate, body: str, row: x => x === null || str(x) });
	if (!legalMantle(e.mantle)) bad('enum.mantle', w, String(e.mantle));
	if (!legalTier(e.tier)) bad('enum.tier', w, String(e.tier));
}

const decisions = load('decisions.json') as Record<string, unknown>[] | null;
if (decisions) {
	const seen = new Set<string>();
	for (const d of decisions) {
		const w = `decisions.${d.id}`;
		need(d, w, { id: x => /^D\d+$/.test(String(x)), date: isDate, decider: str, title: str, body: str, countersigned: x => typeof x === 'boolean' });
		if (seen.has(String(d.id))) bad('ref.unresolved', w, 'duplicate decision id');
		seen.add(String(d.id));
	}
}

load('issues.json');
const kickoffs = load('kickoffs.json') as Record<string, unknown>[] | null;
if (kickoffs) for (const [i, k] of kickoffs.entries()) {
	need(k, `kickoffs[${i}]`, { doc: str, text: str });
	if (!legalMantle(k.mantle)) bad('enum.mantle', `kickoffs[${i}]`, String(k.mantle));
	if (!legalTier(k.tier)) bad('enum.tier', `kickoffs[${i}]`, String(k.tier));
}

if (fails) { console.log(`\nVALIDATE: ${fails} failure(s)`); process.exit(1); }
console.log('VALIDATE: OK — twin conforms');
