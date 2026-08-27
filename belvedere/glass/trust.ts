/**
 * Claude Code's folder-trust dialog — read, and never answered.
 *
 * A fire into a tree with no trusted ancestor launches, puts the summons in argv, and then sits
 * forever on *"Quick safety check: Is this a project you created or one you trust?"* — no first
 * user turn, no transcript, no census beat (B3 F2, measured). The glass must never answer that
 * dialog; the honest move is to say so on the fire button and to render such a fire as what it
 * is: a workspace waiting on a question only Felix may answer.
 *
 * **Trust is per account.** Every silo keeps its own `<config-dir>/.claude.json`, so the same
 * directory is warm on one account and cold on another — measured at this build row: `personal`
 * trusts `/Users/felix/code` wholesale (nine entries), `thg-fgreen` names thirteen individually
 * and one of them is an explicit refusal. B3 F2 read `~/.claude.json`, which is the file a
 * session with **no** `CLAUDE_CONFIG_DIR` uses; the rig always sets one.
 *
 * **Nearest ancestor wins.** Trust is inherited (a worktree under a trusted repo is warm — B3
 * proved it), and a refusal is also an answer, so the walk stops at the first directory the
 * account has an opinion about. No opinion anywhere up the chain is cold: the dialog will ask.
 */

import { readFileSync } from 'fs';
import { dirname, join } from 'path';

/** Everything has a limit (directive 3.1). The live files are 70–86 KB; this is room, not a guess. */
const MAX_BYTES = 8 << 20;

/** One account's answer for every directory it has an opinion about. `true` is trusted. */
export type Trust = { file: string; roots: Map<string, boolean> };

/** Warm: the dialog will not appear. Cold: it will, and `refused` names an explicit "no". */
export type Verdict = { warm: true; root: string } | { warm: false; refused: string | null };

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
		if (typeof accepted === 'boolean') roots.set(path.replace(/\/+$/, '') || '/', accepted);
	}
	return { file, roots };
}

/** The walk: from the target up to `/`, the first opinion decides. Bounded by the path's depth. */
export function trustOf(target: string, t: Trust): Verdict {
	for (let p = target.replace(/\/+$/, '') || '/'; ; p = dirname(p)) {
		const opinion = t.roots.get(p);
		if (opinion === true) return { warm: true, root: p };
		if (opinion === false) return { warm: false, refused: p };
		if (dirname(p) === p) return { warm: false, refused: null };
	}
}
