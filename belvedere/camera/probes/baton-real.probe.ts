// **The baton on the real corpus** (B26) — the three states the fixture city cannot hold.
//
// Run: bun camera/cli.ts run probes/baton-real.probe.ts
//
// **Deliberately NOT in the standing family** (`probes/standing.txt`), and for the reason B23 F12
// wrote down: a standing probe declares its own world, and this one reads two trees other processes
// write — the city's ledgers and the engine's telemetry root. It is a committed instrument, run by
// hand, exactly as `works-v3.probe.ts` is. The hermetic half of this charge is `baton.probe.ts`.
//
// What only the real corpus can show:
//
//  1. **A Felix-holder baton carrying a fenced summons.** Today's grammar gives a parser-`felix`
//     baton no instrument at all (`classifyBaton`: an instrument makes it a session baton), so the
//     live city's *"PENDING Felix's ruling — on a pass, ignite: ⟨fence⟩"* clauses are exactly the
//     D10 collision — his by prose, a session's by parse. Three of the city's six ignitable batons
//     read that way (B3 E2), and the fixture has none.
//  2. **The collision rendered.** Named on the item, bytes copyable, zero ignite wiring.
//  3. **The Works closing the loop.** A landed terminal node in a building whose tail hands a baton
//     says so, and the click lands on that baton's own queue item.
//
// The bytes are checked against the ledger **on disk**, not against the page's own claim: the whole
// promise is that what the composer receives is what the ledger wrote.

import { readFileSync } from 'fs';
import type { Probe } from '../probe';

/** The one building this probe names, and only because the Works needs a run that really ran. */
const BUILDING = 'agents';
const RUN = 'c10/rehearsal';

type Wire = {
	queue: {
		key: string; kind: string; building: string; doc: string;
		baton: { holder: string; collides: boolean; options: { summons: string; source: string; blocked: string | null }[] } | null;
	}[];
};

export default async function (p: Probe): Promise<void> {
	await p.goto('/deck');
	await p.remember('belvedere.deck.building', BUILDING);
	await p.remember('belvedere.deck.focus', 'works');
	// Pinned, never merely open: `.app` is a stacking context and `#scrim` is a root-level sibling
	// above it, so an open drawer cannot be clicked (findings E1; C16's probe hit the same wall).
	await p.remember('belvedere.deck.layout', { context: 'minimal', focus: 'expanded', action: 'minimal', drawer: 'pinned' });
	await p.goto('/deck');
	await p.waitFor('#host-drawer .qi');

	// ---------- 1. a Felix-holder baton, carrying a fence ----------

	const snap = JSON.parse((await p.ask('/deck/state')).body) as Wire;
	const batons = snap.queue.filter(i => i.kind === 'baton' && i.baton);
	if (!batons.length) throw new Error('the live city hands no baton at all — this probe has nothing to measure');

	// Named by what it IS, never by which building it is in: a probe that pins a ledger tail by name
	// is a probe the next session's tail breaks (B23 F12).
	// Bar 1 is about a fence **in the ledger**, so the option has to be a `summons` instrument rather
	// than a charge reference: a `row` instrument's bytes are read out of that charge's own work doc
	// (`baton.ts` §resolveRow) and the ledger never carried them. The option says which it is by
	// naming its source — the item's own file for a fence, a plan for a charge.
	const fenced = (i: Wire['queue'][number]) =>
		i.baton!.options.find(o => o.blocked === null && i.doc.endsWith(o.source.split(':')[0] ?? '\u0000'));
	const his = batons.find(i => i.baton!.collides && fenced(i));
	if (!his) throw new Error(`no live baton is both his by prose and a fence in its own ledger — ${batons.length} batons read`);

	const bytes = fenced(his)!.summons;
	const ledger = readFileSync(his.doc, 'utf8');
	if (!ledger.includes(bytes))
		throw new Error(`the item's bytes are not in the ledger it names (${his.doc}) — the deck composed something the corpus did not write`);

	const row = `#host-drawer .qi[data-key="${CSS_ESCAPE(his.key)}"]`;
	await p.scroll(row);
	// Both readings on the head: the parser's word, and the prose's beside it (D10).
	const pill = await p.text(`${row} .pill`);
	const theirs = await p.text(`${row} .pill.tone-felix`);
	if (theirs !== 'his by prose')
		throw new Error(`a collided baton must read as his at a glance; the head says "${pill}" and nothing else`);
	await p.click(`${row} .more > summary`);
	await p.waitFor(`${row} .qopt`);

	// ---------- 2. the collision, rendered — note and copy, and no wiring at all ----------

	const collision = await p.text(`${row} .note.bad`);
	if (!collision.includes('never arms'))
		throw new Error(`a collided baton must name the collision on the item; it says "${collision.slice(0, 120)}"`);

	const wired = await p.count('#host-drawer [data-ignite], #host-drawer [data-apply]');
	if (wired !== 0)
		throw new Error(`${wired} ignite wire(s) in the ⬡-queue — an ambiguous holder never arms (D10)`);
	const copies = await p.count(`${row} [data-copy-option]`);
	if (copies < 1) throw new Error('D10 allows the copy and this card drew none — copying is reading');

	const dispatchable = batons.filter(i => i.baton!.holder === 'session' && !i.baton!.collides).length;
	console.log(`corpus     ${batons.length} batons · ${dispatchable} session-held and uncollided · ${batons.filter(i => i.baton!.collides).length} collided`);
	console.log(`his        ${pill} + ${theirs} · ${his.building} · ${bytes.length} chars, found verbatim in ${his.doc.split('/').at(-1)}`);
	console.log(`d10        collision named · ${copies} copy · ${wired} ignite wires`);
	console.log(await p.shoot('baton-real-collided'));

	// ---------- 3. the composer receives the ledger's own fence ----------

	await p.click(`${row} .qopt:has([data-summons]) [data-compose-with]`);
	await p.waitFor('#host-action textarea.summons-in');
	const held = (await p.value('#host-action textarea.summons-in')).trim();
	if (held !== bytes.trim())
		throw new Error(`the composer holds ${held.length} chars and the ledger's fence is ${bytes.trim().length}`);
	if (!ledger.includes(held))
		throw new Error('the composer holds bytes the ledger does not contain');

	console.log(`composer   ${held.length} chars held ≡ the ledger's fence, byte for byte`);
	console.log(await p.shoot('baton-real-composer'));

	// ---------- 4. the Works closes the loop ----------

	// Back to the run: the composer took Focus, so the Works is chosen the way a click chooses it.
	await p.click('[data-focus-on="works"]');
	await p.waitFor('.graph');
	await p.click(`[data-flow="${RUN}"]`);
	await p.waitFor(`[data-flow="${RUN}"][data-on="yes"]`);

	const mine = snap.queue.find(i => i.kind === 'baton' && i.building === BUILDING);
	if (!mine) throw new Error(`${BUILDING} hands no baton, so no node in it can say it did`);

	const handed = await p.count('.graph .node[data-ring="landed"] .handed');
	if (handed !== 1)
		throw new Error(`${RUN} is a chain, so exactly one landed node is terminal; ${handed} said they handed a baton`);

	await p.click('.graph .node .handed');
	await p.waitFor(`#host-drawer .qi-aim`);
	const landedOn = await p.text('#host-drawer .qi-aim .qname');
	const aimKey = await p.count(`#host-drawer .qi-aim[data-key="${CSS_ESCAPE(mine.key)}"]`);
	if (aimKey !== 1)
		throw new Error(`the jump landed on "${landedOn}", which is not ${BUILDING}'s own baton item`);

	console.log(`the works  1 landed terminal node says it handed a baton · the jump landed on "${landedOn}"`);
	console.log(await p.shoot('baton-real-works'));
}

/** `CSS.escape` lives in the browser, not here — and a queue key is a slug, so this is its whole job. */
const CSS_ESCAPE = (key: string) => key.replace(/["\\]/g, '\\$&');
