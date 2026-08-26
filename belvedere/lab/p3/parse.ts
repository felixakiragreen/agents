// P3 probe — doctrine-format-strict parsers for the five glass artifacts.
// Disposable: findings are the deliverable, this code is evidence, not product.
// Law: canon/work/DOCTRINE.md §§4 (board), 5 (kickoff), 7 (ledger), 8 (decisions), 3 (ISSUES).

export type Fail = { artifact: string; reason: string; excerpt: string; line: number };

const MANTLES = ['Grand Architect', 'Architect', 'Dispatcher', 'Digger', 'Builder', 'Mentat'];
const TIERS = ['fable', 'opus', 'sonnet', 'haiku'].flatMap(m =>
   ['low', 'medium', 'high', 'xhigh', 'max'].map(e => `${m}-${e}`));
const STATES = ['OPEN', 'IN FLIGHT', 'LANDED', 'KILLED', 'BLOCKED'];

const strip = (s: string) => s.replace(/\*\*/g, '').replace(/`/g, '').trim();

// split on separators that sit at nesting depth 0 — a comma inside "(confirmed …, 7ms)"
// is not a list separator, and mistaking it for one indicts the parser, not the doc.
function topSplit(s: string, seps: string[]): string[] {
   const out: string[] = []; let buf = '', depth = 0, tick = false;
   for (let i = 0; i < s.length; i++) {
      const c = s[i];
      if (c === '`') tick = !tick;
      if (!tick) { if ('([{'.includes(c)) depth++; else if (')]}'.includes(c)) depth--; }
      if (!tick && depth <= 0 && seps.includes(c)) { out.push(buf); buf = ''; continue; }
      buf += c;
   }
   out.push(buf);
   return out.map(x => x.trim()).filter(Boolean);
}
const delink = (s: string) => s.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1');
const linkTarget = (s: string) => s.match(/\[[^\]]*\]\(([^)]+)\)/)?.[1] ?? null;

// ---------- §4 the board ----------

export type BoardRow = {
   id: string; work: string; workDoc: string | null;
   dependsOn: string[]; gates: string[];
   mantle: string | null; tier: string | null;
   state: string | null; annotation: string;
};
export type Board = { heading: string; line: number; rows: BoardRow[] };

type Table = { line: number; header: string[]; rows: string[][]; heading: string };

function tables(md: string): Table[] {
   const lines = md.split('\n');
   const out: Table[] = [];
   let heading = '';
   for (let i = 0; i < lines.length; i++) {
      if (/^#{1,6} /.test(lines[i])) heading = lines[i].replace(/^#+ /, '').trim();
      if (!/^\s*\|/.test(lines[i]) || !/^\s*\|[\s:|-]+\|\s*$/.test(lines[i + 1] ?? '')) continue;
      const cells = (r: string) => r.trim().replace(/^\||\|$/g, '').split(/(?<!\\)\|/).map(c => c.trim());
      const header = cells(lines[i]);
      const rows: string[][] = [];
      let j = i + 2;
      for (; j < lines.length && /^\s*\|/.test(lines[j]); j++) rows.push(cells(lines[j]));
      out.push({ line: i + 1, header, rows, heading });
      i = j - 1;
   }
   return out;
}

const isBoardHeader = (h: string[]) =>
   h.length === 5 && ['id', 'work', 'depends on', 'staffing', 'status']
      .every((want, k) => strip(h[k] ?? '').toLowerCase() === want);

export function parseBoards(md: string): { boards: Board[]; fails: Fail[]; staffingTables: Table[] } {
   const fails: Fail[] = [];
   const all = tables(md);
   const boards: Board[] = [];
   const staffingTables = all.filter(t => !isBoardHeader(t.header) &&
      t.header.some(h => /^\**staffing\**$/i.test(strip(h))));

   for (const t of all) {
      if (!isBoardHeader(t.header)) continue;
      const rows: BoardRow[] = [];
      for (const r of t.rows) {
         const raw = '| ' + r.join(' | ') + ' |';
         if (r.length !== 5) {
            const bad = r.find(c => /`[^`]*\|/.test(c)) ?? r.slice(5).join(' | ');
            fails.push({ artifact: 'board', reason: `row splits into ${r.length} cells (unescaped | inside a cell — the row is already truncated in any GFM renderer)`, excerpt: `${strip(delink(r[0] ?? ''))}: …${String(bad).slice(0, 120)}`, line: t.line });
            continue;
         }
         const [idC, workC, depC, staffC, statC] = r;
         const id = strip(delink(idC));
         if (!id) fails.push({ artifact: 'board', reason: 'empty ID cell', excerpt: raw.slice(0, 300), line: t.line });

         // staffing: <Mantle> · <tier>, both verbatim
         const s = strip(delink(staffC));
         const sm = s.match(/^(.+?)\s*·\s*(.+)$/);
         let mantle: string | null = null, tier: string | null = null;
         if (!sm) {
            fails.push({ artifact: 'board', reason: `staffing not "<Mantle> · <tier>"`, excerpt: `${id}: ${JSON.stringify(staffC)}`, line: t.line });
         } else {
            const bareTier = sm[2].replace(/\s*[(—–].*$/, '').trim();
            mantle = MANTLES.includes(sm[1]) ? sm[1] : null;
            tier = TIERS.includes(bareTier) ? bareTier : null;
            sm[2] = bareTier;
            if (!mantle) fails.push({ artifact: 'board', reason: 'unknown mantle', excerpt: `${id}: ${JSON.stringify(sm[1])}`, line: t.line });
            if (!tier) fails.push({ artifact: 'board', reason: 'unknown tier', excerpt: `${id}: ${JSON.stringify(sm[2])}`, line: t.line });
         }

         // status: lifecycle token first, then annotation
         const st = strip(statC);
         const state = STATES.find(x => st.toUpperCase().startsWith(x)) ?? null;
         if (!state) fails.push({ artifact: 'board', reason: 'status does not open with a lifecycle state', excerpt: `${id}: ${JSON.stringify(statC.slice(0, 160))}`, line: t.line });

         // depends on: row ids, "—", or named gates
         const d = strip(delink(depC));
         const noDeps = /^[—–-](\s*\(.*\))?$/.test(d) || d === '';
         const segs = noDeps ? [] : topSplit(d, ['·', ',', ';']);
         const gates = segs.filter(x => /gate|countersign|blessing|blessed|✓|PASSED/i.test(x));
         const deps = segs.filter(x => !gates.includes(x));
         // A dep is a row id: no whitespace, short. Anything else in this column is prose
         // the glass cannot resolve to a row — that is the failure being counted.
         const isId = (x: string) => /^[A-Za-z]{0,6}-?\d{0,3}[a-z]?$/.test(x) && x.length <= 10 && /[0-9A-Za-z]/.test(x);
         const bad = deps.filter(x => {
            const head = x.replace(/\s*\(.*\)\s*$/, '').replace(/\s+(LANDED|MERGED|merged|blessed|ruled|sanctioned|PASS(ED)?)\b.*$/i, '').trim();
            const ids = topSplit(head, ['+', '–', '—']);
            return !ids.length || !ids.every(isId);
         });
         if (bad.length) fails.push({ artifact: 'board', reason: 'depends-on segment is not a row id or named gate', excerpt: `${id}: ${JSON.stringify(bad.join(' | ').slice(0, 160))}`, line: t.line });

         rows.push({ id, work: strip(delink(workC)), workDoc: linkTarget(workC), dependsOn: deps, gates, mantle, tier, state, annotation: state ? st.slice(state.length).replace(/^[\s—–-]+/, '') : st });
      }
      boards.push({ heading: t.heading, line: t.line, rows });
   }
   if (!boards.length) fails.push({ artifact: 'board', reason: 'no canonical board table found', excerpt: all.map(t => '| ' + t.header.join(' | ') + ' |').slice(0, 6).join('\n'), line: 0 });
   return { boards, fails, staffingTables };
}

// ---------- §7 the ledger ----------

export type LedgerEntry = { date: string; mantle: string; row: string | null; body: string; decided: string | null; next: string | null; line: number };

export function parseLedger(md: string): { entries: LedgerEntry[]; tail: LedgerEntry | null; fails: Fail[]; blocks: number } {
   const fails: Fail[] = [];
   const lines = md.split('\n');
   const blocks: { text: string; line: number }[] = [];
   let cur: string[] = [], start = 1;
   for (let i = 0; i < lines.length; i++) {
      if (/^---\s*$/.test(lines[i])) { if (cur.join('').trim()) blocks.push({ text: cur.join('\n'), line: start }); cur = []; start = i + 2; }
      else cur.push(lines[i]);
   }
   if (cur.join('').trim()) blocks.push({ text: cur.join('\n'), line: start });

   const entries: LedgerEntry[] = [];
   for (const b of blocks) {
      const flat = b.text.trim().replace(/\n+/g, ' ').replace(/\s+/g, ' ');
      if (/^#/.test(b.text.trim())) continue; // file header block
      const m = flat.match(/^\*\*([^·*]+?)\s*·\s*([^*]+?)\*\*\s*[—–-]\s*(.*)$/);
      if (!m) {
         fails.push({ artifact: 'ledger', reason: 'entry head not "**<date> · <mantle> (<row>)** — …"', excerpt: flat.slice(0, 220), line: b.line });
         continue;
      }
      const date = m[1].trim();
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) fails.push({ artifact: 'ledger', reason: 'date not ISO YYYY-MM-DD', excerpt: JSON.stringify(date), line: b.line });
      const rm = m[2].trim().match(/^(.*?)\s*\(([^)]*)\)\s*$/);
      const body = m[3];
      const decided = body.match(/Decided:\s*(.+?)(?:\.\s*Next:|\.$|$)/)?.[1] ?? null;
      const next = body.match(/Next:\s*(.+)$/)?.[1] ?? null;
      if (!decided) fails.push({ artifact: 'ledger', reason: 'no "Decided:" clause', excerpt: flat.slice(0, 220), line: b.line });
      if (!next) fails.push({ artifact: 'ledger', reason: 'no "Next:" clause (the baton)', excerpt: flat.slice(0, 220), line: b.line });
      entries.push({ date, mantle: (rm ? rm[1] : m[2]).trim(), row: rm ? rm[2] : null, body, decided, next, line: b.line });
   }
   return { entries, tail: entries.at(-1) ?? null, fails, blocks: blocks.length };
}

// ---------- §5 kickoffs / batons ----------

export type Kickoff = { mantle: string; tier: string | null; text: string; line: number };

export function parseKickoffs(md: string): { kickoffs: Kickoff[]; fails: Fail[]; fences: number } {
   const fails: Fail[] = [];
   const lines = md.split('\n');
   const kickoffs: Kickoff[] = [];
   let fences = 0;
   for (let i = 0; i < lines.length; i++) {
      if (!/^\s*```/.test(lines[i])) continue;
      const start = i;
      let j = i + 1;
      for (; j < lines.length && !/^\s*```\s*$/.test(lines[j]); j++);
      const body = lines.slice(start + 1, j).join('\n');
      i = j;
      const first = body.split('\n').find(l => l.trim());
      if (!first || !/^You are /.test(first.trim())) continue; // not a summons fence
      fences++;
      const m = first.trim().match(/^You are (?:an?|the) ([A-Za-z ]+?) at ([\w.-]+)\.$/);
      if (!m) {
         fails.push({ artifact: 'kickoff', reason: 'first line is not "You are a <Mantle> at <tier>."', excerpt: first.trim().slice(0, 200), line: start + 1 });
         continue;
      }
      const mantle = MANTLES.find(x => x.toLowerCase() === m[1].toLowerCase()) ?? null;
      if (!mantle) fails.push({ artifact: 'kickoff', reason: 'unknown mantle in summons line', excerpt: first.trim().slice(0, 200), line: start + 1 });
      const tier = TIERS.includes(m[2]) ? m[2] : null;
      if (!tier) fails.push({ artifact: 'kickoff', reason: 'unknown tier in summons line', excerpt: first.trim().slice(0, 200), line: start + 1 });
      kickoffs.push({ mantle: mantle ?? m[1], tier, text: body, line: start + 1 });
   }
   return { kickoffs, fails, fences };
}

// baton = the ledger tail's Next clause, classified for the rail (README §3)
export type Baton = { holder: 'session' | 'felix' | 'prose'; text: string; summons: string | null };

export function classifyBaton(next: string | null, tailBlock: string): Baton | null {
   if (!next) return null;
   const fenced = tailBlock.match(/```[\s\S]*?```/)?.[0] ?? null;
   const summons = fenced && /You are (?:an?|the) /.test(fenced) ? fenced : null;
   if (summons) return { holder: 'session', text: next, summons };
   if (/^You are (?:an?|the) /.test(next.trim())) return { holder: 'session', text: next, summons: next };
   if (/\bFelix\b/.test(next)) return { holder: 'felix', text: next, summons: null };
   return { holder: 'prose', text: next, summons: null };
}

// ---------- §8 decisions + the decision queue ----------

export type Decision = { id: string; date: string; decider: string; title: string; body: string; ratified: boolean; pending: boolean; line: number };

export function parseDecisions(md: string): { decisions: Decision[]; queue: Decision[]; fails: Fail[]; candidates: number } {
   const fails: Fail[] = [];
   const lines = md.split('\n');
   const decisions: Decision[] = [];
   let candidates = 0;
   for (let i = 0; i < lines.length; i++) {
      if (!/^\s*[-*]\s*\*\*D\d/.test(lines[i])) continue;
      candidates++;
      let text = lines[i].trim(), j = i + 1;
      for (; j < lines.length && lines[j].trim() && !/^\s*[-*]\s*\*\*D\d/.test(lines[j]) && !/^#{1,6} /.test(lines[j]); j++) text += ' ' + lines[j].trim();
      i = j - 1;
      // attribution runs to the matching ')' — "Architect (02) · ✓ Felix" nests.
      const head = text.match(/^\s*[-*]\s*\*\*D(\d+)\*\*\s*\(/);
      if (!head) {
         fails.push({ artifact: 'decisions', reason: 'entry does not open "- **D<n>** ("', excerpt: text.slice(0, 240), line: i + 1 });
         continue;
      }
      let k = head[0].length, depth = 1;
      for (; k < text.length && depth; k++) { if (text[k] === '(') depth++; else if (text[k] === ')') depth--; }
      const paren = text.slice(head[0].length, k - 1);
      const rest = text.slice(k).replace(/^\s*:\s*/, '');
      if (!/^\s*:/.test(text.slice(k))) {
         fails.push({ artifact: 'decisions', reason: 'no ":" after the attribution', excerpt: text.slice(0, 240), line: i + 1 });
         continue;
      }
      const tm = rest.match(/^\*\*(.+?)\.?\*\*\s*(.*)$/);
      if (!tm) {
         fails.push({ artifact: 'decisions', reason: 'title is not bold-delimited "**<title>.**" — the entry opens straight into prose', excerpt: `D${head[1]}: ${rest.slice(0, 200)}`, line: i + 1 });
      }
      const pm = paren.match(/^(\d{4}-\d{2}-\d{2}),\s*(.+)$/s);
      if (!pm) fails.push({ artifact: 'decisions', reason: 'attribution not "(<ISO date>, <decider>)"', excerpt: `D${head[1]}: ${JSON.stringify(paren.slice(0, 160))}`, line: i + 1 });
      const decider = (pm ? pm[2] : paren).replace(/\s*·?\s*✓\s*Felix\s*$/, '').trim();
      const ratified = /✓\s*Felix/.test(paren);
      const pending = /proposed\s*[—–-]\s*pending Felix countersign/i.test(text);
      decisions.push({ id: `D${head[1]}`, date: pm ? pm[1] : '', decider, title: tm ? tm[1] : rest.split('.')[0], body: tm ? tm[2] : rest, ratified, pending, line: i + 1 });
   }
   // A decision Felix made needs no countersign; the queue is what waits on his pen.
   const queue = decisions.filter(d => d.pending || (!d.ratified && !/^Felix\b/.test(d.decider)));
   if (!decisions.length && candidates) fails.push({ artifact: 'decisions', reason: 'D-shaped lines present but none parsed', excerpt: '', line: 0 });
   return { decisions, queue, fails, candidates };
}

// ---------- §3 ISSUES — the inbox ----------
// Doctrine states the LIFECYCLE (D53) and never states an ENTRY FORMAT.
// Strict reading: entries are `---`-separated blocks after the header. Recorded as such.

export type Issue = { date: string | null; who: string | null; text: string; line: number };

export function parseIssues(md: string): { issues: Issue[]; fails: Fail[]; blocks: number; shape: string } {
   const fails: Fail[] = [];
   const lines = md.split('\n');
   const blocks: { text: string; line: number }[] = [];
   let cur: string[] = [], start = 1;
   for (let i = 0; i < lines.length; i++) {
      if (/^---\s*$/.test(lines[i])) { if (cur.join('').trim()) blocks.push({ text: cur.join('\n'), line: start }); cur = []; start = i + 2; }
      else cur.push(lines[i]);
   }
   if (cur.join('').trim()) blocks.push({ text: cur.join('\n'), line: start });
   const body = blocks.slice(1); // block 0 is the protocol header

   // observed shapes, to name the variance
   const shape = !body.length ? 'drained (header only)'
      : body.some(b => /^##\s/m.test(b.text)) ? '## numbered-heading entries'
      : body.some(b => /^-\s+\d{4}-\d{2}-\d{2}\s*·/m.test(b.text)) ? '- <date> · <who> · <what> bullets'
      : '--- separated prose blocks';

   const issues: Issue[] = [];
   for (const b of body) {
      const t = b.text.trim();
      if (!t) continue;
      const date = t.match(/\d{4}-\d{2}-\d{2}/)?.[0] ?? null;
      const who = t.match(/^From ([^,(]+)/)?.[1]?.trim() ?? t.match(/^-\s*\d{4}-\d{2}-\d{2}\s*·\s*([^·]+)·/)?.[1]?.trim() ?? null;
      if (!date) fails.push({ artifact: 'issues', reason: 'entry carries no date', excerpt: t.slice(0, 200), line: b.line });
      if (!who) fails.push({ artifact: 'issues', reason: 'entry carries no attributable author', excerpt: t.slice(0, 200), line: b.line });
      issues.push({ date, who, text: t, line: b.line });
   }
   return { issues, fails, blocks: blocks.length, shape };
}
