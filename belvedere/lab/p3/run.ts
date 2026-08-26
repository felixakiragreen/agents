// P3 runner — parsers vs corpus. `bun run.ts` = coverage table; `bun run.ts --fails` = every excerpt.
import { readdirSync, readFileSync, existsSync, statSync } from 'fs';
import { CORPUS } from './corpus';
import { parseBoards, parseLedger, parseKickoffs, parseDecisions, parseIssues, classifyBaton, type Fail } from './parse';

const read = (p: string) => existsSync(p) ? readFileSync(p, 'utf8') : null;
const mds = (dir: string): string[] => existsSync(dir) && statSync(dir).isDirectory()
   ? readdirSync(dir).filter(f => f.endsWith('.md')).map(f => `${dir}/${f}`) : [];

type Cell = { verdict: string; fails: Fail[] };
const rows: { repo: string; artifact: string; file: string; cell: Cell }[] = [];
const push = (repo: string, artifact: string, file: string, cell: Cell) => rows.push({ repo, artifact, file, cell });
const rel = (p: string) => p.replace(process.env.HOME + '/code/', '');

for (const e of CORPUS) {
   for (const b of e.boards ?? []) {
      const md = read(b);
      if (!md) { push(e.repo, 'board', b, { verdict: 'MISSING', fails: [] }); continue; }
      const r = parseBoards(md);
      const n = r.boards.reduce((a, x) => a + x.rows.length, 0);
      const clean = r.boards.flatMap(x => x.rows).filter(w => w.mantle && w.tier && w.state).length;
      const extra = r.staffingTables.length ? ` +${r.staffingTables.length} non-canonical staffing table(s)` : '';
      push(e.repo, 'board', b, { verdict: `${r.boards.length} board · ${n} rows found · **${clean}/${n} rows fully typed** · ${r.fails.length} field fail${extra}`, fails: r.fails });
   }
   if (e.ledger) {
      const md = read(e.ledger);
      if (!md) push(e.repo, 'ledger', e.ledger, { verdict: 'MISSING', fails: [] });
      else {
         const r = parseLedger(md);
         const baton = r.tail ? classifyBaton(r.tail.next, md.split(/^---\s*$/m).at(-1) ?? '') : null;
         push(e.repo, 'ledger', e.ledger, { verdict: `${r.entries.length}/${r.blocks - 1} entries, tail=${r.tail?.date ?? 'NONE'}, baton=${baton?.holder ?? 'NONE'}, ${r.fails.length} fail`, fails: r.fails });
      }
   }
   if (e.decisions) {
      const md = read(e.decisions);
      if (!md) push(e.repo, 'decisions', e.decisions, { verdict: 'MISSING', fails: [] });
      else {
         const r = parseDecisions(md);
         push(e.repo, 'decisions', e.decisions, { verdict: `${r.decisions.length}/${r.candidates} parsed, queue=${r.queue.length}, ${r.fails.length} fail`, fails: r.fails });
      }
   }
   if (e.issues) {
      const md = read(e.issues);
      if (!md) push(e.repo, 'issues', e.issues, { verdict: 'MISSING', fails: [] });
      else {
         const r = parseIssues(md);
         push(e.repo, 'issues', e.issues, { verdict: `${r.issues.length} block(s), shape="${r.shape}", ${r.fails.length} fail`, fails: r.fails });
      }
   }
   const planFiles = (e.plans ?? []).flatMap(mds);
   if (e.plans?.length) {
      let k = 0, f: Fail[] = [], docs = 0, withKick = 0;
      for (const p of planFiles) {
         const md = read(p)!;
         const r = parseKickoffs(md);
         docs++; if (r.kickoffs.length) withKick++;
         k += r.kickoffs.length;
         f.push(...r.fails.map(x => ({ ...x, excerpt: `${rel(p)}: ${x.excerpt}` })));
      }
      push(e.repo, 'kickoff', (e.plans ?? []).join(','), { verdict: `${withKick}/${docs} work docs carry a summons fence, ${k} kickoffs, ${f.length} fail`, fails: f });
   }
}

// ---- control: fixtures ----
const FX = `${import.meta.dir}/fixtures`;
const control: string[] = [];
{
   const b = parseBoards(read(`${FX}/board.md`)!);
   control.push(`board:    ${b.boards.length} board, ${b.boards[0]?.rows.length} rows, ${b.fails.length} fail  ${b.fails.length ? 'PARSER INDICTED' : 'PASS'}`);
   const l = parseLedger(read(`${FX}/ledger.md`)!);
   control.push(`ledger:   ${l.entries.length} entries, tail=${l.tail?.date}, next=${JSON.stringify(l.tail?.next)}, ${l.fails.length} fail  ${l.fails.length ? 'PARSER INDICTED' : 'PASS'}`);
   const d = parseDecisions(read(`${FX}/decisions.md`)!);
   control.push(`decision: ${d.decisions.length}/${d.candidates}, queue=${d.queue.map(x => x.id).join(',')}, ${d.fails.length} fail  ${d.fails.length ? 'PARSER INDICTED' : 'PASS'}`);
   const k = parseKickoffs(read(`${FX}/kickoff.md`)!);
   control.push(`kickoff:  ${k.kickoffs.length} kickoff (${k.kickoffs[0]?.mantle} · ${k.kickoffs[0]?.tier}), ${k.fails.length} fail  ${k.fails.length ? 'PARSER INDICTED' : 'PASS'}`);
   const i = parseIssues(read(`${FX}/issues.md`)!);
   control.push(`issues:   ${i.issues.length} entries, shape="${i.shape}", ${i.fails.length} fail  ${i.fails.length ? 'PARSER INDICTED' : 'PASS'}`);
}

console.log('=== CONTROL (DOCTRINE §6.2 — a parser failing its own fixture indicts the parser)');
control.forEach(c => console.log('  ' + c));
console.log('\n=== COVERAGE  repo × artifact');
console.log('| repo | artifact | file | result |');
console.log('|---|---|---|---|');
for (const r of rows) console.log(`| ${r.repo} | ${r.artifact} | \`${rel(r.file)}\` | ${r.cell.verdict} |`);

const total = rows.reduce((a, r) => a + r.cell.fails.length, 0);
console.log(`\nTOTAL field failures: ${total} across ${rows.length} cells`);

// Kill criterion (P3): "more than half the live boards need per-repo special-casing".
let found = 0, rowsAll = 0, rowsTyped = 0, boardsAll = 0, boardsFound = 0;
for (const e of CORPUS) for (const b of e.boards ?? []) {
   const md = read(b); if (!md) continue;
   boardsAll++;
   const r = parseBoards(md);
   if (!r.boards.length) continue;
   boardsFound++;
   const rr = r.boards.flatMap(x => x.rows);
   rowsAll += rr.length;
   rowsTyped += rr.filter(w => w.mantle && w.tier && w.state).length;
}
console.log(`BOARD TOTALS: ${boardsFound}/${boardsAll} docs yielded a canonical board · ${rowsAll} rows found · ${rowsTyped} rows fully typed (${(100 * rowsTyped / rowsAll).toFixed(0)}%) · per-repo special cases in this parser: 0`);

if (process.argv.includes('--json')) {
   // Question 3: the glass's data shape, emitted from real parses — not invented.
   const pick = CORPUS.find(x => x.repo === (process.argv[process.argv.indexOf('--json') + 1] ?? 'agents/belvedere'))!;
   const board = parseBoards(read(pick.boards![0])!);
   const led = pick.ledger ? parseLedger(read(pick.ledger)!) : null;
   const dec = pick.decisions ? parseDecisions(read(pick.decisions)!) : null;
   const iss = pick.issues ? parseIssues(read(pick.issues)!) : null;
   const kick = (pick.plans ?? []).flatMap(mds).flatMap(f => parseKickoffs(read(f)!).kickoffs.map(k => ({ ...k, doc: rel(f) })));
   console.log(JSON.stringify({
      building: pick.repo,
      board: board.boards.map(b => ({ heading: b.heading, rows: b.rows })),
      ledgerTail: led?.tail ?? null,
      baton: led?.tail ? classifyBaton(led.tail.next, readFileSync(pick.ledger!, 'utf8').split(/^---\s*$/m).at(-1) ?? '') : null,
      decisionQueue: dec?.queue ?? [],
      issues: iss?.issues ?? [],
      kickoffs: kick,
   }, null, 2));
   process.exit(0);
}

if (process.argv.includes('--fails')) {
   console.log('\n=== FAILURES (verbatim excerpts)');
   for (const r of rows) {
      if (!r.cell.fails.length) continue;
      console.log(`\n--- ${r.repo} · ${r.artifact} · ${rel(r.file)}`);
      const seen = new Map<string, Fail[]>();
      for (const f of r.cell.fails) { const k = f.reason; seen.set(k, [...(seen.get(k) ?? []), f]); }
      for (const [reason, fs] of seen) {
         console.log(`  [${fs.length}×] ${reason}`);
         for (const f of fs.slice(0, 4)) console.log(`     L${f.line}: ${f.excerpt.replace(/\n/g, '\n        ')}`);
      }
   }
}
