// Live identity's tested core: the parse boundary over `cmux workspace list --json`, and the one
// thing that must be true of the read itself — **an unarmed glass never reaches the socket.**
//
// What is NOT here is a live read. Driving Felix's real desktop from `bun test` is the failure B8 F1
// paid for once already (the suite armed the city's HALT flag and left it armed), so this file
// points `BELVEDERE_ENV` at a path that does not exist and asserts the refusal instead. The live
// half — a cmux-side rename reaching the deck, a socket killed mid-poll — is DoD evidence in
// `plans/b18-live-identity.md`, measured through `lab/b18/`.

import { expect, test, describe } from 'bun:test';
import { mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const ROOT = mkdtempSync(join(tmpdir(), 'b18-identity-'));
process.env.BELVEDERE_ENV = join(ROOT, 'no-credential-here');
const { byWorkspace, heldIdentity, identity, toWorkspaces } = await import('./identity');

describe('toWorkspaces — cmux\'s answer, parsed once at the boundary', () => {
	/** Verbatim field names off a live `cmux workspace list --json` (2026-08-27). */
	const wire = {
		window_ref: 'window:1',
		workspaces: [
			{
				id: 'B01C9D0F-C040-40C0-8043-9DE256384376', ref: 'workspace:50', index: 0,
				title: 'p6-live-01', custom_title: 'p6-live-01', custom_color: '#006B6B',
				current_directory: '/Users/felix/code/agents', selected: false, description: null,
				// The conversation cmux also carries is deliberately not read: identity is a name and
				// a colour, and a snapshot that shipped Felix's last prompt to every poll is not that.
				latest_submitted_message: 'P6-C metachars: $(echo pwned) `whoami`',
			},
			{
				id: 'F9A4AEED-4268-4748-86CD-FECF297985DA', ref: 'workspace:24', index: 1,
				title: 'belvedere', custom_title: 'belvedere', custom_color: '#196F3D',
				current_directory: '/Users/felix/code/agents', selected: true,
			},
		],
	};

	test('a workspace arrives as its uuid, its ref, its name and the colour it is wearing', () => {
		expect(toWorkspaces(wire)).toEqual([
			{
				id: 'B01C9D0F-C040-40C0-8043-9DE256384376', ref: 'workspace:50', title: 'p6-live-01',
				color: '#006B6B', cwd: '/Users/felix/code/agents', selected: false,
			},
			{
				id: 'F9A4AEED-4268-4748-86CD-FECF297985DA', ref: 'workspace:24', title: 'belvedere',
				color: '#196F3D', cwd: '/Users/felix/code/agents', selected: true,
			},
		]);
	});

	test('nothing but the identity fields crosses the boundary — the conversation stays in cmux', () => {
		expect(JSON.stringify(toWorkspaces(wire))).not.toContain('pwned');
	});

	test('a workspace wearing no custom colour is null, never a colour the glass chose', () => {
		const bare = toWorkspaces({ workspaces: [{ id: 'W', ref: 'workspace:1', title: 'x', custom_color: null }] });
		expect(bare[0]!.color).toBeNull();
	});

	test('an entry with no id names nothing and is dropped; the rest of the answer still counts', () => {
		const mixed = toWorkspaces({ workspaces: [{ ref: 'workspace:1', title: 'nameless' }, wire.workspaces[1]] });
		expect(mixed.map(w => w.title)).toEqual(['belvedere']);
	});

	test('an answer that is not an answer is empty, not a throw (errors are values)', () => {
		for (const raw of [null, 42, {}, { workspaces: 'no' }, { workspaces: [null, 7] }])
			expect(toWorkspaces(raw)).toEqual([]);
	});

	test('the join the deck draws with is keyed on the uuid — the census\'s own `ws` (P6 F2)', () => {
		const by = byWorkspace({ at: 1, error: null, workspaces: toWorkspaces(wire) });
		expect(by.get('F9A4AEED-4268-4748-86CD-FECF297985DA')?.title).toBe('belvedere');
		expect(by.get('workspace:24')).toBeUndefined();      // a ref is not a key, ever
	});
});

describe('the read itself', () => {
	test('an unarmed glass reads no identity: it says why, and it spawns nothing', async () => {
		const read = await identity();
		expect(read.error).toContain('identity unavailable');
		expect(read.error).toContain('no credential at');
		expect(read.workspaces).toEqual([]);
		expect(read.at).toBeGreaterThan(0);                  // a failed read is still a dated read
	});

	test('the held copy is what the deck composes from, and it is the same object the read returned', async () => {
		const read = await identity();
		expect(heldIdentity()).toEqual(read);
	});

	test('a second call inside the TTL does not read again — one socket call per poll at most', async () => {
		const first = await identity();
		const second = await identity();
		expect(second.at).toBe(first.at);
	});
});

process.on('exit', () => rmSync(ROOT, { recursive: true, force: true }));
