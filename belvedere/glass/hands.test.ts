// The hands' tested core: the parse boundary, the credential gate, the launch line, the audit's
// redaction, and the worktree refusal. What is NOT here is what cannot be faked — a real fire
// against a real cmux socket is DoD evidence in `plans/b4-hands.md`, not a unit test.
//
// Every test that touches disk works inside its own temp directory, wired through the three
// env knobs (`CENSUS_DIR`, `BELVEDERE_ENV`) the paths module already reads.

import { expect, test, describe, afterAll } from 'bun:test';
import { mkdtempSync, mkdirSync, writeFileSync, readFileSync, chmodSync, rmSync, existsSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const scratch = () => mkdtempSync(join(tmpdir(), 'b4-hands-'));

// The env knobs must be set before the module under test resolves its anchors — so the import is
// explicit and ordered, not hoisted. Nothing in this file can touch the real census or the real
// credential: `~/.config/belvedere/env` is never read here, at any point.
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

	test('a file with no CMUX_SOCKET_PASSWORD is a disabled glass, not an empty password', () => {
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
		const parsed = hands.parseFire(good);
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
		expect(hands.parseFire({ ...good, ...patch }).ok).toBe(false);
	});

	test('a summons over the limit is refused whole', () => {
		expect(hands.parseFire({ ...good, summons: 'x'.repeat((64 << 10) + 1) }).ok).toBe(false);
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
		model: 'haiku', effort: 'medium', color: 'Red', summons: 'x', resume: null,
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

describe('the audit', () => {
	/** The log is append-only, so every assertion is about the line this test just wrote. */
	const lastLine = () =>
		JSON.parse(readFileSync(join(ROOT, 'census', 'hands.jsonl'), 'utf8').trimEnd().split('\n').at(-1)!);

	test('records the fire without the words, and can prove them anyway', () => {
		const fire = hands.parseFire({
			account: 'personal', stamp: 'builder-belvedere-01', cwd: tmpdir(),
			model: 'opus', effort: 'high', color: 'Blue', summons: 'SECRET SUMMONS TEXT',
		});
		expect(fire.ok).toBe(true);
		if (!fire.ok) return;

		hands.audit('fire', hands.fireArgs(fire.result), { ok: true, result: { workspace: 'workspace:9' } });
		const record = lastLine();
		expect(JSON.stringify(record)).not.toContain('SECRET SUMMONS TEXT');
		expect(record).toMatchObject({ action: 'fire', ok: true, args: { stamp: 'builder-belvedere-01', summonsBytes: 19 } });
		expect(record.args.summons).toBeUndefined();
		expect(Date.parse(record.ts)).toBeGreaterThan(0);
	});

	test('a refusal is audited as loudly as a success', () => {
		hands.audit('worktree', { repo: '/x', branch: 'bv/b4' }, { ok: false, error: 'branch already exists: bv/b4' });
		expect(lastLine()).toMatchObject({ ok: false, result: 'branch already exists: bv/b4' });
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

	test('a directory that is not a repo is a refusal, not a crash', async () => {
		const dir = scratch();
		mkdirSync(join(dir, 'plain'));
		const made = await hands.worktree({ repo: join(dir, 'plain'), branch: 'x' });
		expect(made.ok).toBe(false);
		rmSync(dir, { recursive: true });
	});
});
