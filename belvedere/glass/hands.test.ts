// The hands' tested core: the parse boundary, the credential gate, the launch line, the audit's
// redaction, and the worktree refusal. What is NOT here is what cannot be faked — a real ignition
// against a real cmux socket is DoD evidence in `plans/b4-hands.md`, not a unit test.
//
// Every test that touches disk works inside its own temp directory, wired through the two env
// knobs (`CENSUS_DIR`, `BELVEDERE_ENV`) `paths.ts` reads — per call, so this file's anchors hold
// however the suite is ordered and whatever imported the module first (B8 §4).

import { expect, test, describe, afterAll } from 'bun:test';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, chmodSync, rmSync, existsSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const scratch = () => mkdtempSync(join(tmpdir(), 'b4-hands-'));

// Nothing in this file can touch the real census or the real credential: `~/.config/belvedere/env`
// is never read here, at any point. The import stays explicit and ordered because the knobs must
// be in place before the FIRST call, and a hoisted static import invites the old frozen-env bug
// back by looking harmless.
const ROOT = scratch();
const ENV_FILE = join(ROOT, 'env');
process.env.CENSUS_DIR = join(ROOT, 'census');
process.env.BELVEDERE_ENV = ENV_FILE;
const hands = await import('./hands');

/** Put the credential file into a named state; `null` removes it. */
function credential(text: string | null, mode = 0o600): void {
	if (text === null) { rmSync(ENV_FILE, { force: true }); return; }
	writeFileSync(ENV_FILE, text);
	chmodSync(ENV_FILE, mode);
}

afterAll(() => rmSync(ROOT, { recursive: true, force: true }));

describe('the credential gate', () => {
	test('absent file disables the hands, and says which file', () => {
		credential(null);
		const state = hands.handsState();
		expect(state.armed).toBe(false);
		expect(state.note).toContain(ENV_FILE);
	});

	test('a 0600 file with the password arms them', () => {
		credential('# belvedere\nCMUX_SOCKET_PASSWORD=hunter2\n');
		expect(hands.handsState()).toEqual({ armed: true, note: 'armed' });
		expect(hands.readCredential()).toEqual({ ok: true, result: 'hunter2' });
	});

	test('a group- or world-readable file is refused, not read', () => {
		credential('CMUX_SOCKET_PASSWORD=hunter2\n', 0o644);
		const cred = hands.readCredential();
		expect(cred.ok).toBe(false);
		expect(cred.ok ? '' : cred.error).toContain('mode 644');
		expect(cred.ok ? '' : cred.error).not.toContain('hunter2');   // never the value, ever
	});

	test('a file with no CMUX_SOCKET_PASSWORD is a disabled Belvedere, not an empty password', () => {
		credential('SOMETHING_ELSE=1\nCMUX_SOCKET_PASSWORD=\n');
		expect(hands.readCredential().ok).toBe(false);
	});

	test('quotes around the value are shell syntax, not password', () => {
		credential('CMUX_SOCKET_PASSWORD="s p a c e"\n');
		expect(hands.readCredential()).toEqual({ ok: true, result: 's p a c e' });
	});
});

describe('the parse boundary', () => {
	const good = {
		account: 'personal', stamp: 'builder-belvedere-01', cwd: tmpdir(),
		model: 'opus', effort: 'high', color: 'Blue', summons: 'You are a Builder.',
	};

	test('a whole request passes and arrives trusted', () => {
		const parsed = hands.parseIgnite(good);
		expect(parsed.ok).toBe(true);
		expect(parsed.ok && parsed.result.resume).toBe(null);
	});

	test.each([
		['stamp with a space', { stamp: 'builder belvedere' }],
		['stamp with a slash', { stamp: '../../etc/passwd' }],
		['stamp uppercase', { stamp: 'Builder-01' }],
		['empty summons', { summons: '' }],
		['colour with a shell escape', { color: "Blue'; rm -rf /" }],
		['effort with a flag', { effort: '--dangerously' }],
		['cwd that is relative', { cwd: 'belvedere' }],
		['cwd that does not exist', { cwd: '/no/such/place/at/all' }],
		['resume that is not an id', { resume: 'yesterday' }],
	])('refuses %s', (_name, patch) => {
		expect(hands.parseIgnite({ ...good, ...patch }).ok).toBe(false);
	});

	test('a summons over the limit is refused whole', () => {
		expect(hands.parseIgnite({ ...good, summons: 'x'.repeat((64 << 10) + 1) }).ok).toBe(false);
	});

	test('worktree refuses path tricks in the branch', () => {
		for (const branch of ['../escape', 'a/../../b', 'trailing/', '-flag', ''])
			expect(hands.parseWorktree({ repo: tmpdir(), branch }).ok).toBe(false);
		expect(hands.parseWorktree({ repo: tmpdir(), branch: 'bv/b4-hands' }).ok).toBe(true);
	});

	test('halt needs a name, and keeps it to one line', () => {
		expect(hands.parseHalt({ requester: '  ' }).ok).toBe(false);
		const parsed = hands.parseHalt({ requester: 'felix\nvia\tbelvedere' });
		expect(parsed.ok && parsed.result.requester).toBe('felix via belvedere');
	});

	test('focus takes a session id and nothing else', () => {
		expect(hands.parseFocus({ sid: 'd285127e-0000-4000-8000-00000000abcd' }).ok).toBe(true);
		expect(hands.parseFocus({ sid: 'surface:1' }).ok).toBe(false);
		expect(hands.parseFocus('nope').ok).toBe(false);
	});
});

describe('the launch line', () => {
	const req = {
		account: 'personal', stamp: 'digger-belvedere-smoke', cwd: '/Users/felix/code/agents',
		model: 'haiku', effort: 'medium', color: 'Red', summons: 'x', resume: null, building: '',
	};

	test('is one line, config-dir prefixed, and reads the summons from its file', () => {
		const cmd = hands.launchCommand(req, '/Users/felix/.claude', '/tmp/s.txt');
		expect(cmd).toBe(
			`cd '/Users/felix/code/agents' && CLAUDE_CONFIG_DIR='/Users/felix/.claude' claude `
			+ `'--model' 'haiku' '--effort' 'medium' '-n' 'digger-belvedere-smoke' "$(cat '/tmp/s.txt')"`);
		expect(cmd.includes('\n')).toBe(false);
	});

	test('carries no /color turn — the colour is a socket property (P2)', () => {
		expect(hands.launchCommand(req, '/Users/felix/.claude', '/tmp/s.txt')).not.toContain('/color');
	});

	test('resume adds exactly two argv tokens', () => {
		const uuid = 'd285127e-0000-4000-8000-00000000abcd';
		const plain = hands.launchCommand(req, '/d', '/tmp/s.txt');
		const resumed = hands.launchCommand({ ...req, resume: uuid }, '/d', '/tmp/s.txt');
		expect(resumed).toBe(plain.replace(` "$(cat`, ` '--resume' '${uuid}' "$(cat`));
	});

	test("a summons path with a quote in it cannot break out", () => {
		const cmd = hands.launchCommand(req, '/d', "/tmp/it's.txt");
		expect(cmd).toContain(`"$(cat '/tmp/it'\\''s.txt')"`);
	});
});

/**
 * B5's law: **a resume omits what Belvedere does not know, and never invents a first user turn.**
 * The shelf resumes sessions that have been dead for weeks; a summons injected at that moment
 * would wake an agent with no instruction and set it working — the self-inflicted DoS the whole
 * row exists to prevent.
 */
describe('the resume widening (B5)', () => {
	const UUID = 'd285127e-0000-4000-8000-00000000abcd';
	const bare = { account: 'personal', cwd: tmpdir(), color: 'Charcoal', stamp: '', model: '', effort: '', summons: '' };

	test('a resume may carry no stamp, no tier and no summons', () => {
		const parsed = hands.parseIgnite({ ...bare, resume: UUID });
		expect(parsed.ok).toBe(true);
	});

	test('a FRESH ignition still requires every one of them', () => {
		for (const patch of [{}, { stamp: 'builder-belvedere-01' }, { stamp: 'builder-belvedere-01', model: 'opus' }])
			expect(hands.parseIgnite({ ...bare, ...patch, resume: null }).ok).toBe(false);
	});

	test('a resume still refuses a malformed field — empty is legal, junk is not', () => {
		for (const patch of [{ stamp: 'Not A Stamp' }, { model: '--dangerously' }, { effort: 'VERY' }, { color: "x'; rm -rf /" }])
			expect(hands.parseIgnite({ ...bare, ...patch, resume: UUID }).ok).toBe(false);
	});

	test('an empty field drops its flag; the line ends at --resume, with no user turn', () => {
		const parsed = hands.parseIgnite({ ...bare, resume: UUID });
		expect(parsed.ok).toBe(true);
		if (!parsed.ok) return;
		expect(hands.launchCommand(parsed.result, '/Users/felix/.claude-thg-fgreen', null)).toBe(
			`cd '${tmpdir()}' && CLAUDE_CONFIG_DIR='/Users/felix/.claude-thg-fgreen' claude '--resume' '${UUID}'`);
	});

	test('a stamped resume keeps its own name and adds nothing else', () => {
		const parsed = hands.parseIgnite({ ...bare, stamp: 'digger-agents-04', resume: UUID });
		expect(parsed.ok).toBe(true);
		if (!parsed.ok) return;
		expect(hands.launchCommand(parsed.result, '/d', null)).toBe(
			`cd '${tmpdir()}' && CLAUDE_CONFIG_DIR='/d' claude '-n' 'digger-agents-04' '--resume' '${UUID}'`);
	});

	test('the workspace is named by the stamp, or by the transcript it revives — never ""', () => {
		const named = hands.parseIgnite({ ...bare, stamp: 'digger-agents-04', resume: UUID });
		const nameless = hands.parseIgnite({ ...bare, resume: UUID });
		expect(named.ok && hands.workspaceName(named.result)).toBe('digger-agents-04');
		expect(nameless.ok && hands.workspaceName(nameless.result)).toBe('resume-d285127e');
	});
});

describe('the audit', () => {
	/** The log is append-only, so every assertion is about the line this test just wrote. */
	const lastLine = () =>
		JSON.parse(readFileSync(join(ROOT, 'census', 'hands.jsonl'), 'utf8').trimEnd().split('\n').at(-1)!);

	test('records the ignition without the words, and can prove them anyway', () => {
		const ignite = hands.parseIgnite({
			account: 'personal', stamp: 'builder-belvedere-01', cwd: tmpdir(),
			model: 'opus', effort: 'high', color: 'Blue', summons: 'SECRET SUMMONS TEXT',
		});
		expect(ignite.ok).toBe(true);
		if (!ignite.ok) return;

		hands.audit('ignite', hands.igniteArgs(ignite.result), { ok: true, result: { workspace: 'workspace:9' } });
		const record = lastLine();
		expect(JSON.stringify(record)).not.toContain('SECRET SUMMONS TEXT');
		expect(record).toMatchObject({ action: 'ignite', ok: true, args: { stamp: 'builder-belvedere-01', summonsBytes: 19 } });
		expect(record.args.summons).toBeUndefined();
		expect(Date.parse(record.ts)).toBeGreaterThan(0);
	});

	test('a refusal is audited as loudly as a success', () => {
		hands.audit('worktree', { repo: '/x', branch: 'bv/b4' }, { ok: false, error: 'branch already exists: bv/b4' });
		expect(lastLine()).toMatchObject({ ok: false, result: 'branch already exists: bv/b4' });
	});

	/**
	 * Fork 1 (C22, "one word everywhere"): the writer now spells `ignite`, but `hands.jsonl` is
	 * append-only and every line already on disk still says `fire` — the C2 precedent
	 * (`recordedIn` accepts both `countersign ` and `bless `) generalizes here: a reader must
	 * never choke on the old head. Nothing in this module parses `action` back out of the log
	 * (it is written, never re-read, by any glass code today), so the proof is that the log
	 * itself stays honest JSONL regardless of which spelling wrote a given line — old and new
	 * lines round-trip identically, side by side.
	 */
	test('a historical `fire` line and a fresh `ignite` line read back identically — both heads forever', () => {
		hands.audit('fire', { stamp: 'legacy-line' }, { ok: true, result: { workspace: 'workspace:1' } });
		const legacy = lastLine();
		hands.audit('ignite', { stamp: 'fresh-line' }, { ok: true, result: { workspace: 'workspace:2' } });
		const fresh = lastLine();
		expect(legacy).toMatchObject({ action: 'fire', ok: true, args: { stamp: 'legacy-line' } });
		expect(fresh).toMatchObject({ action: 'ignite', ok: true, args: { stamp: 'fresh-line' } });
		expect(Object.keys(legacy).sort()).toEqual(Object.keys(fresh).sort());
	});
});

describe('the HALT flag', () => {
	test('is an ISO timestamp and a requester, last writer winning', () => {
		const done = hands.halt({ requester: 'felix via belvedere' });
		expect(done.ok).toBe(true);
		if (!done.ok) return;
		const text = readFileSync(done.result.path, 'utf8');
		expect(text).toBe(`${done.result.at} felix via belvedere\n`);
		expect(text.split('\n').length).toBe(2);

		hands.halt({ requester: 'felix again' });
		expect(readFileSync(done.result.path, 'utf8')).toContain('felix again');
	});
});

describe('the worktree hand', () => {

	/** A real repo, because `git worktree add` is the thing under test. No network, no remotes. */
	function repo(): string {
		const dir = scratch();
		for (const args of [['init', '-q', '-b', 'master'], ['config', 'user.email', 't@t'], ['config', 'user.name', 't']])
			Bun.spawnSync(['git', '-C', dir, ...args]);
		writeFileSync(join(dir, 'README.md'), '# scratch\n');
		Bun.spawnSync(['git', '-C', dir, 'add', '-A']);
		Bun.spawnSync(['git', '-C', dir, 'commit', '-qm', 'seed']);
		return dir;
	}

	test('creates the branch checkout under .claude/worktrees, then refuses to repeat it', async () => {
		const dir = repo();
		const made = await hands.worktree({ repo: dir, branch: 'bv/b4-scratch' });
		expect(made.ok).toBe(true);
		if (!made.ok) return;
		expect(made.result.path.endsWith('/.claude/worktrees/bv/b4-scratch')).toBe(true);
		expect(existsSync(join(made.result.path, 'README.md'))).toBe(true);

		const again = await hands.worktree({ repo: dir, branch: 'bv/b4-scratch' });
		expect(again.ok).toBe(false);
		expect(again.ok ? '' : again.error).toBe('branch already exists: bv/b4-scratch');

		Bun.spawnSync(['git', '-C', dir, 'worktree', 'remove', made.result.path]);
		expect(existsSync(made.result.path)).toBe(false);
		rmSync(dir, { recursive: true });
	});

	test('audits itself when called as a library — the route is not the only door', async () => {
		const dir = repo();
		await hands.worktree({ repo: dir, branch: 'bv/b4-audited' });
		const last = JSON.parse(readFileSync(join(ROOT, 'census', 'hands.jsonl'), 'utf8').trimEnd().split('\n').at(-1)!);
		expect(last).toMatchObject({ action: 'worktree', ok: true, args: { branch: 'bv/b4-audited' } });
		rmSync(dir, { recursive: true });
	});

	test('a directory that is not a repo is a refusal, not a crash', async () => {
		const dir = scratch();
		mkdirSync(join(dir, 'plain'));
		const made = await hands.worktree({ repo: join(dir, 'plain'), branch: 'x' });
		expect(made.ok).toBe(false);
		rmSync(dir, { recursive: true });
	});
});

// ---------- B18: the write-through hands, and the jump's target resolution ----------

describe('the write-through parse boundary (D18 class 2)', () => {
	const SID = '0199622a-1111-4222-8333-444455556666';

	test('a rename is a session id and one line of title, collapsed', () => {
		expect(hands.parseRename({ sid: SID, title: '  the   kitten \n' }))
			.toEqual({ ok: true, result: { sid: SID, title: 'the kitten' } });
	});

	test('a title made of whitespace is refused — a workspace with no name is one he cannot find', () => {
		const out = hands.parseRename({ sid: SID, title: '   ' });
		expect(out.ok).toBe(false);
		expect(out.ok ? '' : out.error).toContain('title is empty');
	});

	test('everything has a limit: a title over 64 characters is refused, naming the rule', () => {
		const out = hands.parseRename({ sid: SID, title: 'x'.repeat(65) });
		expect(out.ok).toBe(false);
		expect(out.ok ? '' : out.error).toContain('64');
	});

	test('a workspace ref is not a session id — the target is the census key or nothing (P6 F2)', () => {
		// A ref that does not resolve is delivered to the FOCUSED workspace by cmux, so a hand that
		// accepted one could rename whatever Felix is looking at. Only a `sid` gets in here.
		for (const sid of ['workspace:24', '', 'not a uuid'])
			expect(hands.parseRename({ sid, title: 'x' }).ok).toBe(false);
	});

	test('a recolor takes a cmux name or a hex, and refuses anything else at the door', () => {
		expect(hands.parseRecolor({ sid: SID, color: '#3f9608' }))
			.toEqual({ ok: true, result: { sid: SID, color: '#3f9608' } });
		expect(hands.parseRecolor({ sid: SID, color: 'Aqua' }).ok).toBe(true);
		// `cyan` is shaped like a colour name and cmux refuses it (B3 F1): the boundary lets it
		// through and cmux's own words come back on the card. `#zzz` is not even a shape.
		expect(hands.parseRecolor({ sid: SID, color: 'cyan' }).ok).toBe(true);
		expect(hands.parseRecolor({ sid: SID, color: '#zzzzzz' }).ok).toBe(false);
		expect(hands.parseRecolor({ sid: SID, color: '' }).ok).toBe(false);
	});
});

describe('findSurface — where a panel actually sits now', () => {
	// `cmux tree --all --json --id-format both`, cut down to the shape the jump reads.
	const tree = {
		windows: [{
			id: 'WIN-1',
			workspaces: [
				{ id: 'WS-A', panes: [{ surfaces: [{ id: 'SF-1' }] }] },
				{ id: 'WS-B', panes: [{ surfaces: [{ id: 'SF-2' }, { id: 'SF-3' }] }] },
			],
		}],
	};

	test('a surface resolves to the workspace AND the window it is in — both are needed to be seen', () => {
		expect(hands.findSurface(tree, 'SF-3')).toEqual({ workspace: 'WS-B', window: 'WIN-1' });
	});

	test('a surface the desktop no longer carries is null — the jump refuses rather than guessing', () => {
		expect(hands.findSurface(tree, 'SF-GONE')).toBeNull();
		expect(hands.findSurface(null, 'SF-1')).toBeNull();
		expect(hands.findSurface({ windows: 'nonsense' }, 'SF-1')).toBeNull();
	});
});

/**
 * §placement — where a fire lands (B22 candidate 6). Every socket call is out of reach here; what
 * is testable is the arithmetic that decides *which* uuid those calls address, and it is exactly
 * where the class lives: a name matched loosely, or a ref that outlived its breath, is how an
 * ignition lands in a workspace Felix was looking at.
 */
describe('placement: the home, the name→uuid join, and the ref that may not escape its breath', () => {
	const list = {
		workspaces: [
			{ id: 'WS-AAA', ref: 'workspace:1', title: 'belvedere' },
			{ id: 'WS-BBB', ref: 'workspace:2', title: 'belvedere-notes' },
			{ id: 'WS-CCC', ref: 'workspace:3', custom_title: 'belvedere' },
			{ id: 'WS-DDD', ref: 'workspace:4' },
		],
	};

	test('a building names its home by its last segment, and no building names none', () => {
		expect(hands.homeName('agents/belvedere')).toBe('belvedere');
		expect(hands.homeName('agents')).toBe('agents');
		expect(hands.homeName('universal_robots_sdk/simmy')).toBe('simmy');
		expect(hands.homeName('')).toBeNull();
	});

	test('the name match is EXACT — a prefix is a different workspace of his, never a home', () => {
		expect(hands.workspacesNamed(list, 'belvedere')).toEqual(['WS-AAA', 'WS-CCC']);
		expect(hands.workspacesNamed(list, 'belvedere-notes')).toEqual(['WS-BBB']);
		expect(hands.workspacesNamed(list, 'belv')).toEqual([]);          // never fuzzy (B25's kill criterion)
		expect(hands.workspacesNamed(null, 'belvedere')).toEqual([]);
		expect(hands.workspacesNamed({ workspaces: 'nonsense' }, 'x')).toEqual([]);
	});

	test('two homes are an ambiguity, and an ambiguity is a mint — the count is what decides', () => {
		// `place()` reads exactly this: one ⇒ land, anything else ⇒ mint. Two of Felix's workspaces
		// wearing one name never get guessed between (D10's spirit).
		expect(hands.workspacesNamed(list, 'belvedere').length).toBe(2);
	});

	test('a ref converts to a uuid inside the breath that made it, and an unknown ref converts to nothing', () => {
		expect(hands.uuidOfList(list, 'workspace:3')).toBe('WS-CCC');
		expect(hands.uuidOfList(list, 'workspace:9')).toBeNull();          // refused, never delivered to the focused one
		expect(hands.uuidOfList(null, 'workspace:1')).toBeNull();
	});

	test('the surface listing is `--id-format both`, and the ref is matched whole', () => {
		const listing = [
			'* surface:74 226CF97B-D560-452D-9ABB-7652A2D87820  b22-scratch  [selected]',
			'  surface:76 5D2BC487-C29E-453C-82ED-96C287AFF2AF  Terminal',
		].join('\n');
		expect(hands.uuidOfRef(listing, 'surface:76')).toBe('5D2BC487-C29E-453C-82ED-96C287AFF2AF');
		expect(hands.uuidOfRef(listing, 'surface:7')).toBeNull();          // not a prefix match
		expect(hands.uuidOfRef('', 'surface:1')).toBeNull();
	});

	test('the building is parsed at the boundary like every other field, or refused by name', () => {
		const body = {
			account: 'personal', stamp: 'builder-belvedere-01', cwd: ROOT,
			model: 'opus', effort: 'high', color: 'Blue', summons: 'go',
		};
		expect(hands.parseIgnite({ ...body, building: 'agents/belvedere' }))
			.toMatchObject({ ok: true, result: { building: 'agents/belvedere' } });
		expect(hands.parseIgnite(body)).toMatchObject({ ok: true, result: { building: '' } });   // absent is legal
		for (const bad of ['../escape', '/absolute', 'a b', 'a/b/c/d/e/f/g'])
			expect(hands.parseIgnite({ ...body, building: bad }).ok).toBe(false);
	});
});

/**
 * §the ignited-for join and §retirement, both read out of the audit — so both are measured against
 * one written by hand. The audit is the only place the ignition's knowledge of the building
 * survives; if this read is wrong, a session houses where it sits rather than where it works.
 */
describe('the audit as the join: which building ignited a stamp, and which workspace is ours to close', () => {
	const AUDIT = join(ROOT, 'census/hands.jsonl');

	const write = (...lines: unknown[]) => {
		mkdirSync(join(ROOT, 'census'), { recursive: true });
		writeFileSync(AUDIT, lines.map(l => JSON.stringify(l)).join('\n') + '\n');
	};

	test('stamp → building, last ignition wins, and a stamp nobody ignited is simply absent', () => {
		write(
			{ action: 'ignite', ok: true, args: { stamp: 'builder-belvedere-01', building: 'agents/belvedere' }, result: { workspace: 'WS-1', minted: true } },
			{ action: 'ignite', ok: false, args: { stamp: 'builder-belvedere-02', building: 'agents/belvedere' }, result: 'refused' },
			{ action: 'ignite', ok: true, args: { stamp: 'architect-simmy-03', building: 'universal_robots_sdk/simmy' }, result: { workspace: 'WS-2', minted: false } },
			{ action: 'ignite', ok: true, args: { stamp: 'builder-belvedere-01', building: 'agents' }, result: { workspace: 'WS-3', minted: true } },
			'not json at all',
		);
		const homes = hands.ignitedFor();
		expect(homes.get('builder-belvedere-01')).toBe('agents');           // last ignition wins
		expect(homes.get('architect-simmy-03')).toBe('universal_robots_sdk/simmy');
		expect(homes.has('builder-belvedere-02')).toBe(false);              // a refusal ignited nothing
		expect(homes.has('digger-agents-99')).toBe(false);                  // a hand-started session
	});

	test('only a workspace the audit records as OUR mint may ever be retired (D55)', () => {
		write(
			{ action: 'ignite', ok: true, args: { stamp: 'a', building: 'agents' }, result: { workspace: 'WS-MINE', minted: true } },
			{ action: 'ignite', ok: true, args: { stamp: 'b', building: 'agents' }, result: { workspace: 'WS-HIS', minted: false } },
		);
		expect(hands.mintedByBelvedere('WS-MINE')).toBe(true);
		expect(hands.mintedByBelvedere('WS-HIS')).toBe(false);              // landed in, never made — his
		expect(hands.mintedByBelvedere('WS-NEVER-SEEN')).toBe(false);
	});

	test('an unreadable or absent audit is no homes and no mints, never a throw', () => {
		rmSync(AUDIT, { force: true });
		expect(hands.ignitedFor().size).toBe(0);
		expect(hands.mintedByBelvedere('WS-MINE')).toBe(false);
	});
});
