/**
 * Claude Code's folder-trust dialog — read, and never answered.
 *
 * A fire into a tree the account has never trusted launches, puts the summons in argv, and then
 * sits forever on *"Quick safety check: Is this a project you created or one you trust?"* — no
 * first user turn, no transcript, no census beat (B3 F2, re-measured here). The glass must never
 * answer that dialog; the honest move is to warn on the fire button and to render such a fire as
 * what it is: a workspace waiting on a question only Felix may answer.
 *
 * **Trust is per account.** Every silo keeps its own `<config-dir>/.claude.json`, so the same
 * directory is warm on one account and cold on another. B3 F2 read `~/.claude.json`, which is the
 * file a session with **no** `CLAUDE_CONFIG_DIR` uses; the rig always sets one, so the operative
 * file is the one inside the config dir.
 *
 * **The unit of trust is the project, and the project is the repository.** Measured at this build
 * row against three live accounts and two deliberate stalls:
 *
 *   · every one of the **36 trust entries** across the three accounts sits exactly on a project
 *     root — not one is a subdirectory of the project it names;
 *   · a plain directory inherits an ancestor's blanket trust: `~/code` is trusted for `personal`,
 *     and a fire into `~/code/b7-founding-probe` (no repo) reached its first user turn and beat
 *     the census ten times;
 *   · **a repository does not**: `~/code/b7-scratch-repo`, a fresh `git init` in that same
 *     trusted `~/code`, stalled with zero census beats and no transcript — and so did a worktree
 *     under it;
 *   · a worktree inherits its repo's trust, because `--git-common-dir` resolves a linked worktree
 *     to the main repo's `.git` — which is why B3's fire into `agents/.claude/worktrees/…` needed
 *     no prompt while this row's identical fire under an untrusted repo did.
 *
 * Cross-checked against the live city: all **9** live sessions carrying a cwd are warm under this
 * rule, and a running session is warm by construction — a single "cold" would have falsified it.
 *
 * The rule that follows is one sentence: **the project root decides.** Its own entry wins; with
 * no entry, a repository is cold and a plain directory asks its ancestors.
 */

import { readFileSync, realpathSync } from 'fs';
import { dirname, join } from 'path';

/** Everything has a limit (directive 3.1). The live files are 70–86 KB; this is room, not a guess. */
const MAX_BYTES = 8 << 20;

/** One account's answer for every project it has an opinion about. `true` is trusted. */
export type Trust = { file: string; roots: Map<string, boolean> };

/** What Claude Code will treat this target as: a repository, or a bare directory. */
export type Project = { path: string; repo: boolean };

/** Warm: the dialog will not appear. Cold: it will — `refused` names an explicit "no". */
export type Verdict =
	| { warm: true; root: string; project: Project }
	| { warm: false; refused: string | null; project: Project };

export function readTrust(configDir: string): Trust {
	const file = join(configDir, '.claude.json');
	const roots = new Map<string, boolean>();

	let raw: unknown;
	try {
		const text = readFileSync(file, 'utf8');
		if (text.length > MAX_BYTES) return { file, roots };
		raw = JSON.parse(text);
	} catch { return { file, roots }; }

	if (typeof raw !== 'object' || raw === null) return { file, roots };
	const projects = (raw as Record<string, unknown>).projects;
	if (typeof projects !== 'object' || projects === null) return { file, roots };

	for (const [path, entry] of Object.entries(projects as Record<string, unknown>)) {
		if (typeof entry !== 'object' || entry === null) continue;
		const accepted = (entry as Record<string, unknown>).hasTrustDialogAccepted;
		if (typeof accepted !== 'boolean') continue;
		// Both spellings, because the two sides are spelled differently: Claude records the cwd it
		// was handed, and `git rev-parse` answers with symlinks resolved. On macOS `/tmp` IS
		// `/private/tmp`, and one entry under it would otherwise be invisible to the walk.
		const literal = path.replace(/\/+$/, '') || '/';
		roots.set(literal, accepted);
		roots.set(real(literal), accepted);
	}
	return { file, roots };
}

/** The path with symlinks resolved, or the path itself where there is nothing on disk to resolve. */
const real = (p: string) => { try { return realpathSync(p); } catch { return p; } };

/**
 * The target's project root: the repository's **main** worktree root when it is inside a repo,
 * the directory itself when it is not. `--git-common-dir` is the whole trick — it answers a
 * linked worktree with the main repo's `.git`, which is precisely the inheritance B3 measured.
 *
 * A path that does not exist is not a repo the glass can resolve, so it answers itself: callers
 * asking about a worktree the hand has not cut yet must ask about its repo instead.
 */
export function projectOf(target: string): Project {
	const git = Bun.spawnSync(['git', '-C', target, 'rev-parse', '--path-format=absolute', '--git-common-dir'],
		{ stdout: 'pipe', stderr: 'pipe' });
	const out = new TextDecoder().decode(git.stdout).trim();
	return git.exitCode === 0 && out !== '' ? { path: dirname(out), repo: true } : { path: real(target), repo: false };
}

/** The project root decides; a plain directory may still borrow an ancestor's blanket trust. */
export function trustOf(target: string, t: Trust): Verdict {
	const project = projectOf(target.replace(/\/+$/, '') || '/');

	const own = t.roots.get(project.path);
	if (own === true) return { warm: true, root: project.path, project };
	if (own === false) return { warm: false, refused: project.path, project };
	// A repository is its own project: `~/code` being trusted did not carry into a fresh repo
	// inside it, measured. Nothing above a repo root is consulted.
	if (project.repo) return { warm: false, refused: null, project };

	for (let p = dirname(project.path); ; p = dirname(p)) {
		const opinion = t.roots.get(p);
		if (opinion === true) return { warm: true, root: p, project };
		if (opinion === false) return { warm: false, refused: p, project };
		if (dirname(p) === p) return { warm: false, refused: null, project };
	}
}
