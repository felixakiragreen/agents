// The Works reaches the Chat (C16 §1): a run's node, its step's session, one click.
//
// Run: bun camera/cli.ts run probes/chat-works.probe.ts
//
// This one drives the **real** city and the real telemetry tree, because that is where the round
// trip's run lives (`lab/c16/roundtrip.ts` — a real subject, a real account, a landed step). The
// twin is disarmed as always: the whole path measured here is a read and a swap, and the send
// control on the far end is exactly the one the cold-hands probe proves absent.
//
// It asserts through the pane, not through a query parameter: pick the run in the Focus picker, pick
// the node, and press the `chat` control the Works draws beside the step's session — the same shared
// control every session row on the deck uses (`deck-dom.ts` §chatButton).

import type { Probe } from '../probe';

const BUILDING = 'agents';
const RUN = 'c16/roundtrip';
const STEP = 'note';

export default async function (p: Probe): Promise<void> {
	await p.goto('/deck');
	await p.remember('belvedere.deck.building', BUILDING);
	await p.remember('belvedere.deck.focus', 'works');
	await p.remember('belvedere.deck.layout', { context: 'minimal', focus: 'expanded', action: 'typical', drawer: 'shut' });
	await p.goto('/deck');

	// The run, then the node — the two clicks a human makes.
	await p.waitFor(`[data-flow="${RUN}"]`);
	await p.click(`[data-flow="${RUN}"]`);
	await p.waitFor(`.node[data-node="${STEP}"]`);
	await p.click(`.node[data-node="${STEP}"]`);
	// Scoped to the Action pane: the shut drawer still holds the queue's own chat controls, and a bare
	// selector would wait on one of those instead (B21 F3's family — a selector that answers twice).
	await p.waitFor('#host-action [data-chat-sid]');

	// The session the Works offers is the session the run log named — read it off the wire, so the
	// click is checked against the engine's own coordinate rather than against the DOM's opinion.
	const works = JSON.parse((await p.ask(`/deck/state?b=${BUILDING}`)).body) as {
		works: { runs: { name: string; steps: { id: string; sid: string | null; at: string }[] }[] };
	};
	const step = works.works.runs.find(r => r.name === RUN)?.steps.find(s => s.id === STEP);
	if (step === undefined) throw new Error(`the Works draws no ${RUN}/${STEP} for ${BUILDING}`);
	if (step.sid === null) throw new Error(`${RUN}/${STEP} names no session`);
	const offered = await p.count(`#host-action [data-chat-sid="${step.sid}"]`);
	if (offered !== 1) throw new Error(`${offered} chat controls for ${step.sid} — the node offers the wrong session`);
	const before = await p.shoot('chat-works-node');

	await p.click(`#host-action [data-chat-sid="${step.sid}"]`);
	await p.waitFor('.ct-head');
	const head = await p.text('.ct-head');
	if (!head.includes(`${RUN}/${STEP}`)) throw new Error(`the Chat opened on something else: "${head}"`);
	const turns = await p.count('.ct-turns .ct');
	const marks = await p.count('.ct-map .ct-mark');
	const tables = await p.count('.ct-turns .ct-md-table table');
	const fences = await p.count('.ct-turns .ct-fence');
	const inFences = await p.count('.ct-turns .ct-fence .dw');
	if (inFences !== 0) throw new Error(`${inFences} decoder spans inside a fence — B20 §1 is broken`);
	const after = await p.shoot('chat-works-opened');

	console.log(`node        ${RUN}/${STEP} · ${step.at} · session ${step.sid}`);
	console.log(`the Chat    ${head.replace(/\s+/g, ' ')}`);
	console.log(`rendered    ${turns} turns · ${marks} marks · ${tables} tables · ${fences} fences · ${inFences} spans inside them`);
	console.log(before);
	console.log(after);
}
