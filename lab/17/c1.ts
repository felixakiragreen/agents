// lab/017 — C1: Felix's hand. Replays three real landed changes (plus the countersign
// flip) in both arms and measures the diff he would review.
//
//   R1  row-16 landing        — MAP.md board row status flip     (commit 6b87c4e)
//   R2  D68–D70 proposed      — three D-entries appended         (commit 954ffbd)
//   R2b D63 countersign flip  — amendment mark trued             (commit f3cd47c)
//   R3  grand-architect-11 ledger append   — one session entry                (commit daa0ca3)
//
// Metrics per arm: hunks · ± lines · ± chars · longest line · signal chars (word-diff:
// tokens that actually changed) · signal share = signal ÷ ± chars. Appends are measured
// as reverse diffs of deleting the same content from the current state — identical
// geometry, no history surgery. The S arm edits lab/017/twin/ only and restores via git.

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const DIR = import.meta.dir;
const REPO = join(DIR, '..', '..');
const sh = (cmd: string) => execSync(cmd, { cwd: REPO, maxBuffer: 1 << 24 }).toString();

type Metrics = { hunks: number; plus: number; minus: number; chars: number; longest: number; signal: number };

/** -U0 unified diff geometry + word-diff signal, restricted to hunks matching `only`. */
function measure(diffCmd: string, wordCmd: string, only?: RegExp): Metrics {
	const keep = (raw: string) => {
		const out: string[] = [];
		let inHunk = false, buf: string[] = [];
		for (const l of raw.split('\n')) {
			if (l.startsWith('@@')) {
				if (inHunk && (!only || buf.some(x => only.test(x)))) out.push(...buf);
				inHunk = true; buf = [];
				out.push('@@MARK'); // provisional; dropped if hunk filtered
				continue;
			}
			if (inHunk) buf.push(l);
		}
		if (inHunk && (!only || buf.some(x => only.test(x)))) out.push(...buf);
		// drop marks not followed by kept content
		return out;
	};
	const uni = keep(sh(diffCmd));
	const plusL = uni.filter(l => /^\+/.test(l)), minusL = uni.filter(l => /^-/.test(l));
	const hunks = uni.filter(l => l === '@@MARK').length ? sh(diffCmd).split('\n').filter(l => l.startsWith('@@') && true).length : 0;
	// hunk count: count @@ headers whose hunk survived the filter
	let hunkCount = 0; { let cur: string[] = [], open = false;
		for (const l of sh(diffCmd).split('\n')) {
			if (l.startsWith('@@')) { if (open && (!only || cur.some(x => only.test(x)))) hunkCount++; open = true; cur = []; }
			else if (open) cur.push(l);
		}
		if (open && (!only || cur.some(x => only.test(x)))) hunkCount++;
	}
	const chars = [...plusL, ...minusL].reduce((n, l) => n + l.length - 1, 0);
	const longest = Math.max(0, ...[...plusL, ...minusL].map(l => l.length - 1));
	// word-diff porcelain: '+'/'-' lines are changed tokens — the signal
	let signal = 0; { let cur: string[] = [], open = false; const flush = () => {
			if (open && (!only || cur.some(x => only.test(x))))
				signal += cur.filter(l => /^[+-]/.test(l) && !/^[+-]{3}/.test(l)).reduce((n, l) => n + l.length - 1, 0);
		};
		for (const l of sh(wordCmd).split('\n')) {
			if (l.startsWith('@@')) { flush(); open = true; cur = []; }
			else if (open) cur.push(l);
		}
		flush();
	}
	return { hunks: hunkCount, plus: plusL.length, minus: minusL.length, chars, longest, signal };
}

const mArm = (sha: string, file: string, only?: RegExp) => measure(
	`git show ${sha} -U0 --format= -- ${file}`,
	`git show ${sha} -U0 --word-diff=porcelain --format= -- ${file}`, only);

/** Stage the true before-state, apply the after-state, measure worktree-vs-index. */
function sArm(before: (() => void) | null, edit: () => void, reverse: boolean): Metrics {
	if (before) { before(); execSync('git add lab/017/twin', { cwd: REPO }); }
	edit();
	const m = measure(`git diff ${reverse ? '-R ' : ''}-U0 -- lab/017/twin`,
		`git diff ${reverse ? '-R ' : ''}-U0 --word-diff=porcelain -- lab/017/twin`);
	execSync('git checkout HEAD -- lab/017/twin', { cwd: REPO });
	return m;
}

const twin = (f: string) => JSON.parse(readFileSync(join(DIR, 'twin', f), 'utf8'));
const save = (f: string, d: unknown) => writeFileSync(join(DIR, 'twin', f), JSON.stringify(d, null, '\t') + '\n');

// R1 — the exact status cell 6b87c4e wrote, stripped the way the twin stores it
const newStatus = sh(`git show 6b87c4e:MAP.md`).split('\n').find(l => l.startsWith('| 16 |'))!
	.split(/(?<!\\)\|/).map(c => c.trim()).at(-2)!.replace(/\*\*/g, '').replace(/`/g, '');
const replays: [string, string, Metrics, Metrics][] = [];

const oldStatus = sh(`git show 6b87c4e^:MAP.md`).split('\n').find(l => l.startsWith('| 16 |'))!
	.split(/(?<!\\)\|/).map(c => c.trim()).at(-2)!.replace(/\*\*/g, '').replace(/`/g, '');
const setRow16 = (cell: string) => {
	const b = twin('board.json');
	const r = b[0].rows.find((x: { id: string }) => x.id === '16');
	r.state = cell.split(/[\s]/)[0];
	r.annotation = cell.replace(/^[A-Z ]+?[\s]*[—–-]?\s*/, '').replace(/^(LANDED|OPEN)\s*(—\s*)?/, '');
	save('board.json', b);
};
replays.push(['R1 row-16 landing', 'state flip + annotation', mArm('6b87c4e', 'MAP.md', /\| 16 \|/),
	sArm(() => setRow16(oldStatus), () => setRow16(newStatus), false)]);

replays.push(['R2 D68–D70 append', '3 proposed D-entries', mArm('954ffbd', 'DECISIONS.md'), sArm(null, () => {
	save('decisions.json', twin('decisions.json').filter((d: { id: string }) => !['D68', 'D69', 'D70'].includes(d.id)));
}, true)]);

replays.push(['R2b D63 countersign', 'amendment mark trued', mArm('f3cd47c', 'DECISIONS.md'), sArm(null, () => {
	const d = twin('decisions.json');
	const e = d.find((x: { id: string }) => x.id === 'D63');
	e.body = e.body.replace('· ⬡✓ same day: where a', '— proposed, pending Felix countersign: where a');
	save('decisions.json', d);
}, true)]);

replays.push(['R3 grand-architect-11 ledger append', '1 session entry', mArm('daa0ca3', 'LEDGER.md'), sArm(null, () => {
	const l = twin('ledger.json');
	if (l.at(-1).date !== '2026-08-28') throw new Error('tail is not the grand-architect-11 entry');
	save('ledger.json', l.slice(0, -1));
}, true)]);

const fmt = (m: Metrics) => `${m.hunks}h ±${m.plus}/${m.minus}L ${m.chars}c longest=${m.longest} signal=${m.signal} (${(100 * m.signal / m.chars).toFixed(0)}%)`;
let table = '| replay | arm | hunks | ±lines | ±chars | longest line | signal chars | signal share |\n|---|---|---|---|---|---|---|---|\n';
for (const [name, what, m, s] of replays) {
	console.log(`\n${name} — ${what}`);
	console.log(`  M  ${fmt(m)}`);
	console.log(`  S  ${fmt(s)}`);
	for (const [arm, x] of [['M', m], ['S', s]] as const)
		table += `| ${name} | ${arm} | ${x.hunks} | +${x.plus}/−${x.minus} | ${x.chars} | ${x.longest} | ${x.signal} | ${(100 * x.signal / x.chars).toFixed(0)}% |\n`;
}
writeFileSync(join(DIR, 'c1-metrics.md'), `# C1 metrics — generated by c1.ts\n\n${table}`);
