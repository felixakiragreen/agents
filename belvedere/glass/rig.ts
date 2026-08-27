// The rig's two lookup tables, read per request like everything else: which account a
// config dir is, and what colour a mantle wears. The rig owns both files; the glass reads them.

import { readFileSync } from 'fs';
import { homedir } from 'os';
import { ACCOUNTS, PRESETS } from './paths';

export type Rig = {
	accounts: Map<string, string>;   // absolute config dir → label
	colours: Map<string, string>;    // mantle key (`grand-architect`) → colour name (`green`)
	tiers: Map<string, string>;      // mantle key → the tier its FIRST preset row staffs it at
	mantles: string[];               // longest first, so `grand-architect` beats `architect`
};

/** `~/.claude-thg-fgreen` and `/Users/felix/.claude-thg-fgreen` are one account. */
const abs = (p: string) => (p.startsWith('~/') ? homedir() + p.slice(1) : p).replace(/\/+$/, '');

const rows = (path: string): string[][] => {
	let text: string;
	try { text = readFileSync(path, 'utf8'); } catch { return []; }
	return text.split('\n')
		.filter(l => l.trim() && !l.startsWith('#'))
		.map(l => l.split('\t').map(c => c.trim()));
};

export function readRig(): Rig {
	const accounts = new Map<string, string>();
	for (const [, dir, label] of rows(ACCOUNTS)) if (dir && label) accounts.set(abs(dir), label);

	const colours = new Map<string, string>();
	// One mantle can hold several preset keys (`a` architect fable-high, `A` architect fable-max).
	// **First row wins** for the tier a composer opens that mantle at: the lowercase key is the
	// panel's everyday one, and the second row is the deliberate reach for more thinking.
	const tiers = new Map<string, string>();
	for (const [, mantle, model, effort, colour] of rows(PRESETS)) {
		if (mantle && colour) colours.set(mantle, colour);
		if (mantle && model && effort && !tiers.has(mantle)) tiers.set(mantle, `${model}-${effort}`);
	}

	return { accounts, colours, tiers, mantles: [...colours.keys()].sort((a, b) => b.length - a.length) };
}

/** The census carries `CLAUDE_CONFIG_DIR` verbatim; unset means a session the rig did not fire. */
export const accountLabel = (rig: Rig, configDir: string | null): string | null =>
	configDir === null ? null : rig.accounts.get(abs(configDir)) ?? configDir;

/** A name-stamp is `<mantle>-<building>-<nn>`; the mantle is its longest matching prefix. */
export const mantleOf = (rig: Rig, stamp: string | null): string | null =>
	stamp === null ? null : rig.mantles.find(m => stamp.startsWith(m + '-')) ?? null;
