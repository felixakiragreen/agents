// lab/017 — arm S render: twin JSON → doctrine-markdown VIEW (read-only; writes happen
// in the JSON, never here). Also the fidelity control's left hand: check-fidelity.ts
// parses these renders and diffs the typed fields against the corpus parse.

import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const DIR = import.meta.dir;
const OUT = join(DIR, 'rendered');
const load = (f: string) => JSON.parse(readFileSync(join(DIR, 'twin', f), 'utf8'));

// A cell carrying an unescaped pipe would silently truncate the row in every GFM
// renderer AND the parser (18-wave esc: three field sightings) — the S arm refuses loud.
function cell(s: string): string {
	if (/(?<!\\)\|/.test(s)) throw new Error(`unescaped | in cell: ${s.slice(0, 80)}`);
	return s;
}

export function renderBoards(boards: ReturnType<typeof load>): string {
	let md = '';
	for (const b of boards) {
		md += `## ${b.heading}\n\n| ID | Work | Depends on | Staffing | Status |\n|---|---|---|---|---|\n`;
		for (const r of b.rows) {
			const work = r.workDoc ? `[${r.work}](${r.workDoc})` : r.work;
			const deps = [...r.dependsOn, ...r.gates.map((g: string) => `Felix-gate: ${g}`)].join(' · ') || '—';
			const staff = (r.felixGate ? 'Felix-gate' : `${r.mantle} · ${r.tier}`) + (r.rider ? ` (${r.rider})` : '');
			const status = r.state ? (r.annotation ? `${r.state} — ${r.annotation}` : r.state) : r.annotation;
			md += `| ${[r.id, work, deps, staff, status].map(cell).join(' | ')} |\n`;
		}
		md += '\n';
	}
	return md;
}

export function renderLedger(entries: ReturnType<typeof load>): string {
	let md = '# LEDGER — rendered view\n';
	for (const e of entries)
		md += `\n---\n\n**${e.date} · ${e.mantle} · ${e.tier}${e.row ? ` (${e.row})` : ''}** — ${e.body}\n`;
	return md;
}

export function renderDecisions(entries: ReturnType<typeof load>): string {
	let md = '# DECISIONS — rendered view\n\n';
	for (const e of entries)
		md += `- **${e.id}** (${e.date}, ${e.decider}${e.countersigned ? ' · ⬡✓' : ''}): **${e.title}.** ${e.body}\n`;
	return md;
}

export function renderKickoffs(ks: ReturnType<typeof load>): string {
	let md = '# Kickoffs — rendered view\n';
	for (const k of ks) md += `\n<!-- ${k.doc} -->\n\n\`\`\`\n${k.text}\n\`\`\`\n`;
	return md;
}

if (import.meta.main) {
	mkdirSync(OUT, { recursive: true });
	writeFileSync(join(OUT, 'board.md'), renderBoards(load('board.json')));
	writeFileSync(join(OUT, 'LEDGER.md'), renderLedger(load('ledger.json')));
	writeFileSync(join(OUT, 'DECISIONS.md'), renderDecisions(load('decisions.json')));
	writeFileSync(join(OUT, 'kickoffs.md'), renderKickoffs(load('kickoffs.json')));
	console.log('rendered:', OUT);
}
