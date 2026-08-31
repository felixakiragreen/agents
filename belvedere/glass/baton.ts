// The baton, read — one splitter, one resolver, one collision test, for every surface that draws
// a ledger tail's handoff.
//
// B3 wrote all of this inside the rail, when the rail was the only surface that drew a baton. B26
// gives the deck's attention model the same bucket (`attention.ts`), and two copies of "which
// instrument does this clause hand over" would be two surfaces disagreeing about what Felix is
// being offered — the exact failure D15's one-computation law exists to prevent. So it lives here
// and both import it; B9's rule for a render helper two pages want, one layer up.
//
// Two laws, carried whole from the rail:
//
//  1. **This resolves; it never invents.** A row reference naming no work doc, a doc carrying no
//     kickoff fence, a file that will not read: each answers a `blocked` reason, and the surface
//     prints the reason where the control would have been. A greyed reason beats a guessed ignition.
//  2. **Nothing here parses doctrine.** `doctrine/` says who holds the baton and what its
//     instruments are (D65, one parser in the city). What is computed here is what the parsed shape
//     does not yet carry — D64's `kind`, and D10's collision — and both are named as render-side
//     readings with the field ask filed, never as a second parser (README §6's parked note).

import { readFileSync, statSync } from 'fs';
import { dirname, resolve } from 'path';
import { parseKickoffs, type Baton, type BoardRow, type Building, type Instrument } from '../../doctrine';
import type { BatonOption, Shape } from './deck-model';
import { short } from './html';

const WORK_DOC_BYTES = 2 << 20;

// ---------- the baton's shape (D64, named by D71), read render-side ----------

// A fork is the choice ITSELF; a batch is n things ignited together. Both are prose today, so both
// are matched as prose — and plurality with neither marker is reported, never guessed. The corpus
// still writes `wave`, so the batch matcher keeps reading it: Belvedere's words molt, the corpus's
// words are read as it wrote them.
const FORK = /\bfork\b|\bexclusive\b|\bchoos|\bchoice\b|\beither\b|\boption [a-z]\b/i;
const BATCH = /\bbatch\b|\bwave\b|\bparallel\b|\bboth\b|\ball (?:two|three|four|five)\b/i;

export const shapeOf = (text: string, instruments: number): Shape =>
	instruments <= 1 ? 'single' : FORK.test(text) ? 'fork' : BATCH.test(text) ? 'batch' : 'plural';

/** What names an option in prose: a row id, or the mantle and tier its summons opens with. */
const keysOf = (i: Instrument): string[] =>
	i.kind === 'row' ? [i.row] : [i.mantle, i.tier].filter((x): x is string => !!x);

/**
 * D64 requires a fork to name its recommendation. The span FROM the word "recommend" to the end of
 * its sentence is scanned for the options' own names — the recommendation is what follows the word,
 * and "Recommendation: the Digger" puts a colon between the two, so a clause-split on `:` hands back
 * the empty half. A span naming no option — or naming two — resolves to nothing, and the surface
 * says the recommendation is unreadable rather than badging a coin-flip.
 */
export function recommended(text: string, instruments: Instrument[]): number {
	const from = text.search(/recommend/i);
	if (from < 0) return -1;
	const hay = text.slice(from).split(/(?<=[.!?])\s/)[0]!.slice(0, 240).toLowerCase();
	const hits = instruments.flatMap((i, n) => keysOf(i).some(k => hay.includes(k.toLowerCase())) ? [n] : []);
	return hits.length === 1 ? hits[0]! : -1;
}

/**
 * **D10 — ambiguity never arms.** `classifyBaton` gives the instrument precedence over the word
 * "Felix", so a clause reading *"PENDING Felix's ruling — on a pass, ignite: ⟨fence⟩"* parses as a
 * session baton. All three of the live city's ignitable batons read exactly that way (B3 E2): the
 * parser says session, the prose says his. Until canon rules the holder grammar, a baton whose two
 * readings disagree renders **safe** — the collision named, the summons copyable, no dispatch at
 * all. Copying is reading; the gate stays his.
 *
 * This is render law, not a second parser (D65): the holder stays exactly what `doctrine/` said.
 */
export const collides = (b: Baton) => b.holder === 'session' && /\bFelix\b/.test(b.text);

/**
 * A baton's own instruments are drawn beside it, so leaving their fences in the prose prints every
 * summons twice — the second time mangled, since an inline renderer renders single ticks and a fence
 * is three. **Display shaping only**: the text the buttons, the clipboard and the composer carry is
 * the parser's, untouched.
 */
export const withoutFences = (text: string) => text.replace(/```[\s\S]*?```/g, ' ').replace(/\s{2,}/g, ' ').trim();

// ---------- resolving an instrument to the bytes a session would be given ----------

const readDoc = (p: string) =>
	statSync(p).size > WORK_DOC_BYTES ? readFileSync(p, 'utf8').slice(0, WORK_DOC_BYTES) : readFileSync(p, 'utf8');

const BRANCH_IN_DOC = /\bbranch(?:es)?\s+`([A-Za-z0-9][A-Za-z0-9._/-]{0,79})`/;

/**
 * DOCTRINE §10's worktree law is prose in a work doc; the branch it names is not — so this reads it,
 * narrowly. Only the header block (everything above the doc's first `##`), only a line that names a
 * worktree, and never a line recording a landing.
 *
 * The narrowness is measured, not defensive. "First `` branch `x` `` anywhere in the doc" matched 12
 * of the city's 62 live work docs and **every single hit was retrospective** — `**Status:** LANDED
 * (branch …)`, `## Commits (branch …)`, a nested board row citing where findings live. One of the
 * twelve sat on an OPEN row, where a dispatch would have composed a worktree named after somebody
 * else's finished agent checkout. This rule matches none of the twelve. The real fix is a field, not
 * a regex: the canon-inbox ask rides B3's findings.
 */
export function branchFor(text: string): string | null {
	for (const line of text.split(/^##\s/m)[0]!.split('\n')) {
		if (!/\bworktree\b/i.test(line) || /\bLANDED\b/.test(line)) continue;
		const m = line.match(BRANCH_IN_DOC);
		if (m) return m[1]!;
	}
	return null;
}

const findRow = (b: Building, id: string): { row: BoardRow; file: string } | null => {
	for (const board of b.board) for (const r of board.rows) if (r.id === id) return { row: r, file: board.file };
	return null;
};

export type Resolved = { summons: string; source: string; mantle: string | null; tier: string | null; worktree: { repo: string; branch: string } | null };

/**
 * `ignite <row-id>` → that work doc's kickoff fence (D63g). A work doc carrying several summons
 * fences hands over its last: §5's template puts the row's own kickoff at the foot of the doc.
 */
export function resolveRow(b: Building, id: string): Resolved | { blocked: string } {
	const hit = findRow(b, id);
	if (!hit) return { blocked: `no charge "${id}" on any board in ${b.building}` };
	if (!hit.row.workDoc) return { blocked: `charge ${id} names no work doc — nothing to read a kickoff from` };

	const doc = resolve(dirname(hit.file), hit.row.workDoc.split('#')[0]!);
	let text: string;
	try { text = readDoc(doc); }
	catch (e) { return { blocked: `charge ${id}'s work doc is unreadable: ${(e as Error).message}` }; }

	const k = parseKickoffs(text).kickoffs.at(-1);
	if (!k) return { blocked: `charge ${id}'s work doc carries no kickoff fence: ${short(doc)}` };

	const branch = branchFor(text);
	return {
		summons: k.text, source: `${short(doc)}:${k.line}`, mantle: k.mantle, tier: k.tier,
		worktree: branch ? { repo: b.path, branch } : null,
	};
}

// ---------- one baton, whole ----------

export type Read = {
	shape: Shape;
	collides: boolean;
	/** The parser's own instruments, resolved in order. Empty where the baton hands none. */
	options: BatonOption[];
	/** What each option resolved to beyond its bytes — the rail composes an ignition from these. */
	resolved: (Resolved | null)[];
};

/**
 * One baton, read for whoever draws it: the shape, the collision, and every instrument resolved to
 * the bytes it hands over. **Nothing here composes an ignition** — no stamp is minted, no account is
 * chosen, no model is derived. The rail adds that on top for its own Dispatch buttons; the deck's
 * queue never does.
 */
export function readBaton(b: Building, baton: Baton, ledgerLine: number): Read {
	const shape = shapeOf(baton.text, baton.instruments.length);
	const rec = shape === 'fork' ? recommended(baton.text, baton.instruments) : -1;
	const ledger = `${short(b.files.ledger ?? b.path)}:${ledgerLine}`;

	const options: BatonOption[] = [];
	const resolved: (Resolved | null)[] = [];
	for (const [n, i] of baton.instruments.entries()) {
		const recommendedHere = n === rec;
		if (i.kind === 'summons') {
			const r: Resolved = { summons: i.text, source: ledger, mantle: i.mantle, tier: i.tier, worktree: null };
			resolved.push(r);
			options.push({ label: `${i.mantle ?? 'unknown mantle'} · ${i.tier ?? 'unknown tier'}`,
				source: r.source, summons: r.summons, recommended: recommendedHere, blocked: null });
			continue;
		}
		const r = resolveRow(b, i.row);
		if ('blocked' in r) {
			resolved.push(null);
			options.push({ label: `charge ${i.row}`, source: ledger, summons: '', recommended: recommendedHere, blocked: r.blocked });
			continue;
		}
		resolved.push(r);
		options.push({ label: `charge ${i.row} — ${r.mantle ?? 'unknown mantle'} · ${r.tier ?? 'unknown tier'}`,
			source: r.source, summons: r.summons, recommended: recommendedHere, blocked: null });
	}
	return { shape, collides: collides(baton), options, resolved };
}
