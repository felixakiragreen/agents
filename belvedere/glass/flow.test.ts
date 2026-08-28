// The flow file's tested core: the parse boundary, every named refusal, the run log, and the two
// pure functions the drawing hangs off (`ringOf`, `lit`).
//
// What is NOT here is the drawing itself — ranks in DOM order, SVG edges measured against real
// boxes, a Felix-card with nothing on it to press. Those are browser facts and a fake DOM would
// only prove the fake (B13 F1), so they ride `lab/b10/probe.ts`.
//
// Every disk anchor is wired through the env knobs `paths.ts` reads **per call**, and every one is
// saved and restored: a suite that leaves `FLOWS_DIR` pointing at its own scratch directory decides
// the next file's results (B8 §4's lesson, one door further along).

import { expect, test, describe, afterAll, beforeEach } from 'bun:test';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { homedir, tmpdir } from 'os';
import { join } from 'path';
import { lit, ringOf, type WorksNode } from './deck-model';
import { armedAt, blocksOf, DEFAULT_TIMEOUT_MINUTES, fenceOf, readFlow, readFlows, readRun, stateOf, type Flow } from './flow';
import { worksFlow, worksOf, worksUsage } from './works';
import { readRig } from './rig';

const CITY = join(import.meta.dir, '../../..');          // the real `~/code`, whatever `$HOME` is
const REAL = join(import.meta.dir, '../flows');
const ROOT = mkdtempSync(join(tmpdir(), 'b10-flow-'));
const FLOWS = join(ROOT, 'flows');
const CENSUS = join(ROOT, 'census');
mkdirSync(FLOWS, { recursive: true });
mkdirSync(join(CENSUS, 'flows'), { recursive: true });

const saved = { flows: process.env.FLOWS_DIR, city: process.env.GLASS_CITY, census: process.env.CENSUS_DIR };
const restore = (k: keyof typeof saved, name: string) => {
	if (saved[k] === undefined) delete process.env[name]; else process.env[name] = saved[k];
};
afterAll(() => {
	restore('flows', 'FLOWS_DIR');
	restore('city', 'GLASS_CITY');
	restore('census', 'CENSUS_DIR');
	rmSync(ROOT, { recursive: true, force: true });
});

/** The city's own flow file, read as bytes — every mutation below starts from exactly this. */
const SOURCE = JSON.parse(readFileSync(join(REAL, 'flow-batch-1.flow.json'), 'utf8')) as Record<string, unknown>;

const real = (): void => { process.env.FLOWS_DIR = REAL; process.env.GLASS_CITY = CITY; process.env.CENSUS_DIR = CENSUS; };

/** A mutated copy in scratch, parsed. The fixture is real; only the mutation under test is not. */
function mutated(name: string, change: (f: Record<string, unknown>) => void): ReturnType<typeof readFlow> {
	const copy = JSON.parse(JSON.stringify(SOURCE)) as Record<string, unknown>;
	change(copy);
	process.env.FLOWS_DIR = FLOWS;
	process.env.GLASS_CITY = CITY;
	writeFileSync(join(FLOWS, `${name}.flow.json`), JSON.stringify(copy, null, '\t'));
	return readFlow(name);
}

const steps = (f: Record<string, unknown>) => f['steps'] as Record<string, unknown>[];
const failOf = (r: ReturnType<typeof readFlow>) => (r.ok ? { code: 'ok', error: '' } : r.fail);

// ---------- the real flow file ----------

describe('flow-batch-1 — the chapter’s own DAG, parsed', () => {
	beforeEach(real);

	test('five steps, ranked by dependency depth, each with the name it wrote itself', () => {
		const r = readFlow('flow-batch-1');
		expect(r.ok).toBe(true);
		const f = (r as { ok: true; flow: Flow }).flow;
		expect(f.building).toBe('agents/belvedere');
		expect(f.concurrency).toBe(1);
		expect(f.judgeTier).toBe('fable-high');
		expect(f.steps.map(s => s.id)).toEqual(['p5', 'b10', 'b11', 'b12', 'g2']);
		expect(f.steps.map(s => s.depth)).toEqual([0, 1, 2, 3, 4]);
		// The encapsulation is a FIELD here, not a derivation — the schema writes it from birth (B9 F1).
		for (const s of f.steps) expect(s.name.split(/\s+/).length).toBeLessThanOrEqual(6);
		expect(f.steps.map(s => `${s.mantle} · ${s.tier}`)).toEqual([
			'Digger · opus-high', 'Builder · opus-high', 'Builder · opus-high', 'Builder · opus-high', 'Architect · fable-high',
		]);
		expect(f.steps.at(-1)!.gate.kind).toBe('felix');
		expect(f.steps.slice(0, 4).every(s => s.gate.kind === 'none')).toBe(true);
	});

	test('the g2 kickoff IS the README’s G2 fence — resolved, not copied', () => {
		const f = (readFlow('flow-batch-1') as { ok: true; flow: Flow }).flow;
		const g2 = f.steps.find(s => s.id === 'g2')!;
		// Extracted a second way, deliberately: a regex over the whole document rather than the
		// line-walk `fenceOf` does, so the two readings agree about which bytes the fence is.
		const readme = readFileSync(join(import.meta.dir, '../README.md'), 'utf8');
		const blocks = [...readme.matchAll(/^```[^\n]*\n([\s\S]*?)^```/gm)].map(m => m[1]!.replace(/\n$/, ''));
		expect(blocks.length).toBeGreaterThanOrEqual(5);
		expect(g2.kickoff.text).toBe(blocks[4]!);
		expect(g2.kickoff.fence).toBe(5);
		expect(g2.kickoff.text).toContain('You are an Architect at fable-high.');
		expect(g2.kickoff.text.endsWith('close batch 5.')).toBe(true);
	});

	test('every declared kickoff resolves to real bytes, and says which fence it came from', () => {
		const f = (readFlow('flow-batch-1') as { ok: true; flow: Flow }).flow;
		for (const s of f.steps) {
			expect(s.kickoff.text.length).toBeGreaterThan(40);
			expect(s.kickoff.doc).not.toBeNull();
			expect(s.kickoff.fence).toBeGreaterThan(0);
		}
	});

	test('readFlows finds it, and worksOf hands it to the drawing with its edges', () => {
		expect(readFlows().filter(r => r.ok).length).toBeGreaterThanOrEqual(1);
		// Two flows declared for this building since B12 left the close flow on disk (§5), so the
		// assertion names the one it is about rather than counting the directory.
		const w = worksOf('agents/belvedere')!;
		expect(w.flows.length).toBeGreaterThanOrEqual(1);
		const batch1 = w.flows.find(x => x.name === 'flow-batch-1')!;
		expect(batch1.nodes.length).toBe(5);
		expect(batch1.edges).toEqual([
			{ from: 'p5', to: 'b10' }, { from: 'b10', to: 'b11' },
			{ from: 'b11', to: 'b12' }, { from: 'b12', to: 'g2' },
		]);
		// The mantle's hue is the rig's table through felikai's (B18 F1): Builder is felikai blue.
		expect(batch1.nodes.find(n => n.mantle === 'Builder')!.color).toBe('#0362b2');
		// A building nobody declared a flow for gets an empty list, never somebody else's flow.
		expect(worksOf('agents')!.flows).toEqual([]);
		expect(worksOf(null)).toBeNull();
	});

	test('the bill is three accounts wide, and every figure carries the cache’s age', () => {
		const bill = worksUsage(readRig());
		expect(bill.length).toBe(3);
		expect(bill.map(u => u.account).sort()).toEqual(['personal', 'thg-doorbell', 'thg-fgreen']);
		for (const u of bill) expect(u.cells.map(c => c.bucket)).toEqual(['sess', 'week', 'fable']);
	});
});

// ---------- the fence reader ----------

describe('fenceOf — a kickoff is quoted, never copied', () => {
	test('1-based ordinals, inner text only, no trailing newline', () => {
		const doc = 'a\n```\none\n```\nb\n```sh\ntwo\nlines\n```\nc\n';
		expect(fenceOf(doc, 1)).toBe('one');
		expect(fenceOf(doc, 2)).toBe('two\nlines');
		expect(fenceOf(doc, 3)).toBeNull();
	});

	test('an unterminated fence at EOF is not a block', () => {
		expect(fenceOf('```\nopen forever\n', 1)).toBeNull();
	});
});

// ---------- the refusals: parser-as-lint, one named error each (§3) ----------

describe('the refusals — a flow that will not parse renders its failure and files nothing', () => {
	afterAll(real);

	test('a duplicate step id', () => {
		const f = failOf(mutated('dup', c => { steps(c)[1]!['id'] = 'p5'; }));
		expect(f.code).toBe('duplicate-id');
		expect(f.error).toContain('declared twice');
	});

	test('a dependency on a step that is not here', () => {
		const f = failOf(mutated('dep', c => { steps(c)[1]!['depends'] = ['b14']; }));
		expect(f.code).toBe('unknown-dep');
		expect(f.error).toContain('b14');
	});

	test('a cycle', () => {
		const f = failOf(mutated('cycle', c => { steps(c)[0]!['depends'] = ['g2']; }));
		expect(f.code).toBe('cycle');
		expect(f.error).toContain('never become ready');
	});

	test('a kickoff whose fence is not there', () => {
		const missing = failOf(mutated('nofile', c => { steps(c)[0]!['kickoff'] = { doc: 'agents/belvedere/plans/nothing.md', fence: 1 }; }));
		expect(missing.code).toBe('kickoff');
		const past = failOf(mutated('nofence', c => { steps(c)[0]!['kickoff'] = { doc: 'agents/belvedere/README.md', fence: 99 }; }));
		expect(past.code).toBe('kickoff');
		expect(past.error).toContain('no fence #99');
	});

	test('a name over six words', () => {
		const f = failOf(mutated('long', c => { steps(c)[0]!['name'] = 'one two three four five six seven'; }));
		expect(f.code).toBe('name-too-long');
		expect(f.error).toContain('more than 6 words');
	});

	test('an account the rig does not know', () => {
		const f = failOf(mutated('acct', c => { steps(c)[0]!['account'] = 'nobody'; }));
		expect(f.code).toBe('unknown-account');
		expect(f.error).toContain('nobody');
	});

	test('a mantle or a tier outside doctrine’s own vocabulary', () => {
		expect(failOf(mutated('mantle', c => { steps(c)[0]!['tier'] = 'Wizard · opus-high'; })).code).toBe('unknown-tier');
		expect(failOf(mutated('tier', c => { steps(c)[0]!['tier'] = 'Builder · opus-turbo'; })).code).toBe('unknown-tier');
		expect(failOf(mutated('judge', c => { c['judgeTier'] = 'fable-turbo'; })).code).toBe('unknown-tier');
	});

	test('a venue kind that is neither master nor worktree', () => {
		expect(failOf(mutated('venue', c => { steps(c)[0]!['venue'] = { kind: 'somewhere' }; })).code).toBe('unknown-venue');
		expect(failOf(mutated('venue2', c => { steps(c)[0]!['venue'] = { kind: 'worktree', repo: 'agents' }; })).code).toBe('unknown-venue');
	});

	// B11 widened this: a venue's path is RESOLVED at the parse boundary, so `~/` never leaves this
	// module (directive 2.2). The trust precheck, the worktree hand and the fire's cwd all take a
	// path, and a string that might still need expanding is exactly the untrusted value the boundary
	// exists to kill. The rendering puts the `~` back (`html.ts` §tilde) — the venue phrase asserted
	// further down is still `worktree ~/code/agents:…`, so nothing Felix reads has changed.
	test('a worktree venue is legal, carries its branch, and its path is resolved', () => {
		const r = mutated('wt', c => { steps(c)[0]!['venue'] = { kind: 'worktree', repo: '~/code/agents', branch: 'bv/b11-engine' }; });
		expect(r.ok).toBe(true);
		expect(r.ok && r.flow.steps[0]!.venue).toEqual({ kind: 'worktree', repo: join(homedir(), 'code/agents'), branch: 'bv/b11-engine' });
	});

	test('bytes that are not a flow at all', () => {
		process.env.FLOWS_DIR = FLOWS;
		writeFileSync(join(FLOWS, 'broken.flow.json'), '{ this is not json');
		expect(failOf(readFlow('broken')).code).toBe('malformed');
		writeFileSync(join(FLOWS, 'empty.flow.json'), '{"building":"x","scope":"y","created":"z","steps":[]}');
		expect(failOf(readFlow('empty')).code).toBe('field');
		expect(failOf(readFlow('nothing-here')).code).toBe('unreadable');
		expect(failOf(readFlow('../../etc/passwd')).code).toBe('unreadable');
	});

	test('a failed flow is carried to the page, named, and never dropped', () => {
		process.env.FLOWS_DIR = FLOWS;
		const w = worksOf('agents/belvedere')!;
		expect(w.fails.length).toBeGreaterThan(0);
		expect(w.fails.some(f => f.code === 'malformed' && f.file.endsWith('broken.flow.json'))).toBe(true);
	});
});

// ---------- the run log: written by B11, rendered here ----------

describe('run-state — the engine’s working memory, read by timestamp', () => {
	const write = (name: string, lines: unknown[]) =>
		writeFileSync(join(CENSUS, 'flows', `${name}.run.jsonl`), lines.map(l => JSON.stringify(l)).join('\n') + '\n');

	beforeEach(() => { process.env.CENSUS_DIR = CENSUS; });
	afterAll(real);

	test('no log at all is not an empty log', () => {
		const run = readRun('never-armed');
		expect(run.present).toBe(false);
		expect(run.lines).toEqual([]);
		expect(stateOf(run, 'p5')).toEqual({ ring: 'declared', last: null });
	});

	test('every event maps onto a ring, and the last word by TIMESTAMP wins', () => {
		write('rings', [
			{ ts: 100, ev: 'armed' },
			{ ts: 300, ev: 'landed', step: 'p5', sid: 'aaa' },
			{ ts: 200, ev: 'fired', step: 'p5', sid: 'aaa', workspace: 'workspace:9' },   // out of order on purpose
			{ ts: 210, ev: 'fired', step: 'b10', sid: 'bbb' },
			{ ts: 220, ev: 'paused', step: 'b11', why: 'a Felix-card' },
			{ ts: 230, ev: 'refused', step: 'b12', why: 'haiku holds no auto mode' },
			{ ts: 240, ev: 'armed', step: 'g2' },
			{ ts: 250, ev: 'extended', step: 'g2' },
			{ ts: 260, ev: 'resumed', step: 'b10', sid: 'bbb' },
			'not json at all',
		]);
		const run = readRun('rings');
		expect(run.present).toBe(true);
		expect(run.malformed).toBe(1);
		expect(armedAt(run)).toBe(100);
		expect(stateOf(run, 'p5').ring).toBe('landed');
		expect(stateOf(run, 'b10').ring).toBe('fired');       // `resumed` is a fire continuing
		expect(stateOf(run, 'b11').ring).toBe('paused');
		expect(stateOf(run, 'b12').ring).toBe('refused');
		expect(stateOf(run, 'g2').ring).toBe('declared');     // armed and extended are authorizations
		expect(stateOf(run, 'nobody').ring).toBe('declared');
	});

	test('a line with no ts or an event nobody declared is unreadable, never guessed at', () => {
		write('junk', [{ ev: 'fired', step: 'p5' }, { ts: 1, ev: 'exploded', step: 'p5' }, { ts: 2, ev: 'fired', step: 'p5' }]);
		const run = readRun('junk');
		expect(run.malformed).toBe(2);
		expect(run.lines.length).toBe(1);
	});

	test('the drawing reads the log through worksFlow, node by node', () => {
		process.env.FLOWS_DIR = REAL;
		process.env.GLASS_CITY = CITY;
		const f = (readFlow('flow-batch-1') as { ok: true; flow: Flow }).flow;
		write('flow-batch-1', [
			{ ts: 10, ev: 'armed' },
			{ ts: 20, ev: 'fired', step: 'b10', sid: 'live-one', workspace: 'workspace:12' },
		]);
		const drawn = worksFlow(f, readRig(), join(CITY, 'agents/belvedere'));
		expect(drawn.armedAt).toBe(10);
		expect(drawn.run.present).toBe(true);
		const b10 = drawn.nodes.find(n => n.id === 'b10')!;
		expect(b10.run).toEqual({ ring: 'fired', ev: 'fired', at: 20, sid: 'live-one', workspace: 'workspace:12', why: null });
		expect(drawn.nodes.find(n => n.id === 'g2')!.run.ring).toBe('declared');
		rmSync(join(CENSUS, 'flows', 'flow-batch-1.run.jsonl'), { force: true });
	});
});

// ---------- the two pure functions the drawing hangs off ----------

const node = (over: Partial<WorksNode> = {}): WorksNode => ({
	id: 'b11', name: 'Arm and engine', mantle: 'Builder', color: '#0362b2', tier: 'opus-high',
	account: 'personal', venue: 'master ~/code/agents', depends: [], depth: 0, inserted: false, gate: 'none', card: null,
	kickoff: 'You are a Builder…', from: null,
	run: { ring: 'declared', ev: null, at: null, sid: null, workspace: null, why: null },
	blocks: [], timeoutMinutes: DEFAULT_TIMEOUT_MINUTES, awaitingPass: false, ...over,
});

describe('ringOf — the engine’s log outranks the board, and the drawing says which spoke', () => {
	test('the log where it has spoken', () => {
		const n = node({ run: { ring: 'fired', ev: 'fired', at: 1, sid: 'x', workspace: null, why: null } });
		expect(ringOf(n, 'LANDED')).toEqual({ ring: 'fired', from: 'run' });
	});

	test('the board where it has not — which is what makes past and future one drawing', () => {
		expect(ringOf(node(), 'LANDED')).toEqual({ ring: 'landed', from: 'board' });
		expect(ringOf(node(), 'IN FLIGHT')).toEqual({ ring: 'fired', from: 'board' });
		expect(ringOf(node(), 'BLOCKED')).toEqual({ ring: 'paused', from: 'board' });
		expect(ringOf(node(), 'KILLED')).toEqual({ ring: 'refused', from: 'board' });
		expect(ringOf(node(), 'OPEN')).toEqual({ ring: 'declared', from: 'board' });
	});

	test('and neither, where a step names no row at all', () => {
		expect(ringOf(node(), null)).toEqual({ ring: 'declared', from: 'none' });
		expect(ringOf(node(), 'SOMETHING ELSE')).toEqual({ ring: 'declared', from: 'none' });
	});
});

describe('lit — fired, and the census says its session is still beating', () => {
	const fired = node({ run: { ring: 'fired', ev: 'fired', at: 1, sid: 'alive', workspace: null, why: null } });

	test('a beating sid lights the node', () => {
		expect(lit(fired, 'fired', new Set(['alive']))).toBe(true);
	});

	test('a dead sid is fired and not beating — never lit, never landed', () => {
		expect(lit(fired, 'fired', new Set(['someone-else']))).toBe(false);
	});

	test('nothing but a fired ring can be lit', () => {
		expect(lit(fired, 'landed', new Set(['alive']))).toBe(false);
		expect(lit(node(), 'fired', new Set(['alive']))).toBe(false);      // fired with no sid at all
	});
});

describe('the permission clause (P5 F5) — the model IS the posture, refused at arm', () => {
	beforeEach(real);

	test('haiku is blocked, by name, with the finding on it', () => {
		const f = (readFlow('flow-batch-1') as { ok: true; flow: Flow }).flow;
		const haiku = { ...f.steps[0]!, tier: 'haiku-low' };
		expect(blocksOf(haiku).length).toBe(1);
		expect(blocksOf(haiku)[0]).toContain('P5');
		expect(blocksOf(haiku)[0]).toContain('auto');
	});

	test('every model that holds `auto` is arm-able as declared', () => {
		const f = (readFlow('flow-batch-1') as { ok: true; flow: Flow }).flow;
		for (const tier of ['sonnet-low', 'opus-high', 'fable-max']) expect(blocksOf({ ...f.steps[0]!, tier })).toEqual([]);
		expect(f.steps.flatMap(blocksOf)).toEqual([]);
	});
});
