// **The gut, held down** (C21 — Felix's word at the rework blessing: *"it was specifically the CMUX
// part I'm ready to remove"*).
//
// Run: bun camera/cli.ts run probes/nag-honesty.probe.ts
//
// The defect this probe exists to keep dead had a screenshot: rows reading NAGGING, 33 minutes and
// 21 hours old, ranked into BLOCKED ON YOU. cmux's `idle_prompt` notification fires sixty seconds
// after `Stop`, for a session that has finished its turn and is asking for nothing, so read as a
// waiting edge it outlives its fact for as long as the session sits there. The census always called
// that beat idle (`census.ts` §BY_EVENT); the deck did not.
//
// Two halves, because the charge had two and either one alone is a half-truth:
//
//  1. **The nag is not a demand.** `fixture-nagged` last spoke 21 hours ago and it renders IDLE,
//     wears no ring, and is in nobody's queue.
//  2. **Presence SURVIVES** — his correction, verbatim: *"I do want to see when there is an agent
//     that's working, or has input / blocked"*. All five live sessions are on the City, the working
//     one says so, and the one real permission prompt is still blocked, still badged, still queued.
//
// The seeded city is the world (`fixtures/seed.ts` §censusText), so both facts are on one page at
// one moment and neither can be true by accident.

import type { Probe } from '../probe';

export const fixture = true;

/** The seeded stamps this probe reads by name — the fixture's own, and nothing live. */
const NAGGED = 'builder-beta-05';        // last word: the 60 s nag, 21 h ago
const BLOCKED = 'digger-alpha-02';       // last word: a permission prompt, 84 s ago
const WORKING = 'builder-alpha-07';      // mid-tool-call

/**
 * The state word the deck prints beside a session (`deck.client.ts` §sessionLines). A session line
 * carries no id — cmux's name is the only handle the deck gives one (D16) — so the row is found by
 * the name it wears, which is also the thing Felix reads it by.
 */
async function word(p: Probe, stamp: string): Promise<string> {
	return (await p.text(`#host-context .line:has-text("${stamp}") .st-word`)).trim().toLowerCase();
}

export default async function (p: Probe): Promise<void> {
	await p.goto('/deck');
	await p.waitFor('#host-context .line');

	// ---------- 1. the nag is not a demand ----------

	// The class is gone from the stylesheet and from the bundle, so it cannot reach an element —
	// but the count is the assertion, because a dot is what Felix actually sees.
	const rings = await p.count('#host-context .dot.w-nagging');
	if (rings !== 0) throw new Error(`${rings} nagging ring(s) on the City — the class C21 removed is drawing again`);

	const nagged = await word(p, NAGGED);
	if (nagged !== 'idle')
		throw new Error(`${NAGGED} stopped 21 h ago and the deck calls it "${nagged}" — a label with no living evidence is a demand for input that outlived its fact`);

	// ---------- 2. presence survives, on the census's own sensors ----------

	const lines = await p.count('#host-context .line');
	if (lines !== 5) throw new Error(`the fixture runs 5 live sessions; the City drew ${lines} — presence is what SURVIVES the gut`);

	const working = await word(p, WORKING);
	if (working !== 'working') throw new Error(`a session mid-tool-call must read working; it read "${working}"`);

	const blocked = await word(p, BLOCKED);
	if (blocked !== 'blocked') throw new Error(`a session on the approval dialog must read blocked; it read "${blocked}"`);

	const blockedRings = await p.count('#host-context .line .dot.w-blocked');
	if (blockedRings !== 1) throw new Error(`exactly one seeded session is blocked; ${blockedRings} line(s) wear the ring`);

	// The law of space (README §3): a removal that leaves the page taller than the viewport has
	// left a hole somewhere above it. The legend lost a swatch here and reflowed; nothing scrolls.
	const page = await p.scrolled('body');
	if (page.top !== 0 || page.height > page.client)
		throw new Error(`the deck scrolled: top ${page.top}, content ${page.height} in a ${page.client} viewport — the law of space says no`);

	console.log(`city       ${lines} live · ${NAGGED} reads ${nagged} · ${BLOCKED} reads ${blocked} · ${rings} nagging rings`);
	console.log(`space      page scroll ${page.top} px · content ${page.height} ≤ viewport ${page.client}`);
	console.log(await p.shoot('nag-honesty-city'));

	// ---------- the queue: one waiting item, and it is the real one ----------

	await p.click('#drawer-toggle');
	await p.waitFor('#host-drawer .qi');

	const waiting = await p.count('#host-drawer .qi[data-kind="waiting"]');
	if (waiting !== 1) throw new Error(`one session is genuinely blocked, so the queue holds 1 waiting item; it holds ${waiting}`);

	const queue = (await p.text('#host-drawer')).replace(/\s+/g, ' ');
	if (queue.includes(NAGGED))
		throw new Error(`${NAGGED} is in the ⬡-queue — the nag was ranked as attention again:\n${queue.slice(0, 400)}`);
	if (!queue.includes(BLOCKED))
		throw new Error(`${BLOCKED} is blocked on a dialog and is NOT in the queue — the gut took real attention with it`);

	console.log(`queue      ${waiting} waiting item · ${BLOCKED} present · ${NAGGED} absent`);
	console.log(await p.shoot('nag-honesty-queue'));
}
