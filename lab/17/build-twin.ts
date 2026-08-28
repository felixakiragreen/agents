// lab/17 — arm S twin construction (row 17, C0).
// Reads the live corpus ONCE through doctrine's own parsers (the normative parse, D65)
// and emits the structured-source twin under lab/17/twin/. Never writes outside lab/17.
//
// Hand-corrections applied (each one a known parser gap, cited in the brief):
//   1. `unrecorded` tier/mantle tokens survive as the literal string (D63 as amended at
//      row 16's F2) — the parser nulls them with an "unknown tier" fail (18-wave esc #1),
//      so heads are re-extracted raw here.
//   2. D21's countersign state is a field (`countersigned`), not the regex heuristic that
//      false-pends the entry defining the marker (brief's case file; parse.ts:338).

import { readFileSync, mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { tables, isBoardHeader } from '../../doctrine/src/parse';
import { delink, linkTarget, strip, topSplit, trailingParen, leadingToken, isState } from '../../doctrine/src/grammar';

const REPO = join(import.meta.dir, '..', '..');
const OUT = join(import.meta.dir, 'twin');

type TwinRow = {
	id: string; work: string; workDoc: string | null;
	dependsOn: string[]; gates: string[];
	mantle: string | null; tier: string | null; felixGate: boolean; rider: string | null;
	state: string | null; annotation: string;
};

function twinBoards(file: string) {
	const md = readFileSync(join(REPO, file), 'utf8');
	const boards = tables(md).filter(t => isBoardHeader(t.header));
	return boards.map(b => ({
		heading: b.heading,
		rows: b.rows.map(({ cells }): TwinRow => {
			if (cells.length !== 5) throw new Error(`${file}: row splits into ${cells.length} cells — fix the corpus read, not the twin`);
			const [idC, workC, depC, staffC, statC] = cells as [string, string, string, string, string];
			// staffing — raw tier survives (`unrecorded` is a typed absence, not a parse null)
			const s = trailingParen(strip(delink(staffC)));
			const felixGate = s.head === 'Felix-gate';
			const segs = felixGate ? [] : topSplit(s.head, ['·']);
			// status
			const st = strip(statC);
			const lead = leadingToken(st);
			const state = isState(lead) ? lead : null;
			// depends-on
			const d = strip(delink(depC));
			const dependsOn: string[] = [], gates: string[] = [];
			if (!/^[—–-]?$/.test(d)) for (const seg of topSplit(d, ['·', ',', ';'])) {
				const gate = seg.match(/^Felix-gate\s*:\s*(.+)$/);
				if (gate) gates.push(gate[1]!.trim());
				else dependsOn.push(seg);
			}
			return {
				id: strip(delink(idC)), work: strip(delink(workC)), workDoc: linkTarget(workC),
				dependsOn, gates,
				mantle: felixGate ? null : (segs[0] ?? null), tier: felixGate ? null : (segs[1] ?? null),
				felixGate, rider: s.inner,
				state, annotation: state ? st.slice(state.length).replace(/^[\s—–-]+/, '') : st,
			};
		}),
	}));
}

function twinLedger() {
	const md = readFileSync(join(REPO, 'LEDGER.md'), 'utf8');
	const entries: object[] = [];
	for (const block of md.split(/^---\s*$/m).map(b => b.trim()).filter(Boolean)) {
		if (/^#/.test(block)) continue; // file header
		const m = block.match(/^\*\*([^*]+?)\*\*\s*[—–-]\s*([\s\S]*)$/);
		if (!m) throw new Error(`LEDGER block has no D63f head: ${block.slice(0, 80)}`);
		const segs = topSplit(m[1]!.replace(/\n/g, ' '), ['·']);
		if (segs.length !== 3) throw new Error(`LEDGER head is not date · mantle · tier: ${m[1]}`);
		const { head: tier, inner: row } = trailingParen(segs[2]!);
		entries.push({ date: segs[0]!, mantle: segs[1]!, tier, row, body: m[2]! });
	}
	return entries;
}

function twinDecisions() {
	const md = readFileSync(join(REPO, 'DECISIONS.md'), 'utf8');
	const lines = md.split('\n');
	const entries: object[] = [];
	for (let i = 0; i < lines.length; i++) {
		if (!/^\s*[-*]\s*\*\*D\d/.test(lines[i]!)) continue;
		let text = lines[i]!.trim(), j = i + 1;
		for (; j < lines.length && lines[j]!.trim() && !/^\s*[-*]\s*\*\*D\d/.test(lines[j]!) && !/^#{1,6} /.test(lines[j]!); j++) text += ' ' + lines[j]!.trim();
		i = j - 1;
		const head = text.match(/^\s*[-*]\s*\*\*D(\d+)\*\*\s*\(/);
		if (!head) throw new Error(`decision head unparsed: ${text.slice(0, 80)}`);
		let k = head[0]!.length, depth = 1;
		for (; k < text.length && depth; k++) { if (text[k] === '(') depth++; else if (text[k] === ')') depth--; }
		const paren = text.slice(head[0]!.length, k - 1);
		const rest = text.slice(k).replace(/^\s*:\s*/, '');
		const tm = rest.match(/^\*\*(.+?)\.?\*\*\s*([\s\S]*)$/);
		if (!tm) throw new Error(`D${head[1]}: title is not a bold label`);
		const pm = paren.match(/^(\d{4}-\d{2}-\d{2}),\s*(.+)$/s);
		if (!pm) throw new Error(`D${head[1]}: attribution unparsed`);
		entries.push({
			id: `D${head[1]}`, date: pm[1]!,
			decider: pm[2]!.replace(/\s*·?\s*✓\s*Felix\s*$/, '').trim(),
			countersigned: /✓\s*Felix/.test(paren),
			title: tm[1]!, body: tm[2]!,
		});
	}
	return entries;
}

function twinKickoffs() {
	const parsed = JSON.parse(readFileSync(join(import.meta.dir, 'parse-baseline.json'), 'utf8'));
	return parsed.kickoffs.map((k: { mantle: string; tier: string; text: string; doc: string }) =>
		({ doc: k.doc.replace(REPO + '/', ''), mantle: k.mantle, tier: k.tier, text: k.text }));
}

mkdirSync(OUT, { recursive: true });
const boards = [...twinBoards('MAP.md'), ...twinBoards('plans/18-great-recut.md')];
writeFileSync(join(OUT, 'board.json'), JSON.stringify(boards, null, '\t') + '\n');
writeFileSync(join(OUT, 'ledger.json'), JSON.stringify(twinLedger(), null, '\t') + '\n');
writeFileSync(join(OUT, 'decisions.json'), JSON.stringify(twinDecisions(), null, '\t') + '\n');
writeFileSync(join(OUT, 'issues.json'), JSON.stringify([], null, '\t') + '\n');
writeFileSync(join(OUT, 'kickoffs.json'), JSON.stringify(twinKickoffs(), null, '\t') + '\n');
console.log('twin written:', OUT);
