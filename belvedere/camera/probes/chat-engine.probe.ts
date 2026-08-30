// The Chat on a **headless engine-born session** (C16 §§1–3), and the cold-hands law on that road.
//
// Run: bun camera/cli.ts run probes/chat-engine.probe.ts
//
// The world is minted before the twin boots: `lab/c16/fakerun.ts` really runs the v3 engine on the
// committed `answer-then-land` scenario at layer 0, which leaves a genuine ‹needs-⬡ question› pause
// with a genuine session, transcript and run log under `$TMPDIR`. `$RUNS_DIR` is pointed at it here,
// at module scope, because the camera spawns the twin with this process's environment
// (`camera/twin.ts:132`) — so no camera change is needed to give a probe its own run tree, the same
// way `export const fixture = true` gives it its own city.
//
// Nothing here costs a turn and nothing here reaches an account: the subject is the fake, its config
// dir is the run's own sandbox, and the twin's hands are cold before the browser opens.

import { paused } from '../../lab/c16/fakerun.ts';
import type { Probe } from '../probe';

const run = await paused();
process.env['RUNS_DIR'] = run.root;

export default async function (p: Probe): Promise<void> {
	try {
		// One load first: `localStorage` belongs to an origin, and a page has to exist to have one.
		await p.goto('/deck');
		// The deck's own memory, exactly as a click writes it — no probe-only route (C17 F5).
		await p.remember('belvedere.deck.session', run.sessionId);
		await p.remember('belvedere.deck.focus', 'chat');
		await p.remember('belvedere.deck.layout', { context: 'minimal', focus: 'expanded', action: 'typical', drawer: 'shut' });
		await p.goto('/deck');
		await p.waitFor('.ct-step');

		// What the pane says about the step — the address, the pause, and the question itself.
		const step = await p.text('.ct-step');
		if (!step.includes('needs-⬡ question')) throw new Error(`the pane names no pause: "${step}"`);
		if (!step.includes('release name')) throw new Error(`the pause carries no question: "${step}"`);
		const head = await p.text('.ct-head');
		if (!head.includes(`${run.name}/${run.step}`)) throw new Error(`the head does not name the step: "${head}"`);

		// The conversation is really rendered: the subject's own words, off its own transcript.
		const turns = await p.count('.ct-turns .ct');
		if (turns < 2) throw new Error(`the transcript rendered ${turns} turns`);
		const minimap = await p.count('.ct-map .ct-mark');
		if (minimap !== turns) throw new Error(`${turns} turns and ${minimap} marks — the strip is not the file`);
		const shot = await p.shoot('chat-engine-paused');

		// Cold hands, on the engine road: no send control exists, the reason stands in its place, and
		// the route says 503 in the arming law's own words (the honest-disabled law, B16's, second road).
		// Typed first, so what stands where the button would be is the COLD-HANDS reason and not the
		// compose-time refusal an empty box earns — the disarm is what this half is measuring.
		const box = `textarea[data-chat-draft="${run.sessionId}"]`;
		await p.waitFor(box);
		await p.type(box, 'camera probe — this reply is typed into the composer and never delivered.');
		const wired = await p.count('[data-chat-send]');
		if (wired !== 0) throw new Error(`${wired} send controls drawn on a disarmed deck`);
		const reason = await p.text('.qacts .reason');
		if (!reason.includes('hands disabled')) throw new Error(`the Action pane drew no cold-hands reason — "${reason}"`);
		const sent = await p.ask('/chat/send', { method: 'POST', body: JSON.stringify({ sid: run.sessionId, text: 'this must never be delivered' }) });
		if (sent.status !== 503) throw new Error(`POST /chat/send answered ${sent.status}, not 503 — THE TWIN IS ARMED:\n${sent.body}`);
		const cold = await p.shoot('chat-engine-cold');

		// And the needs-you queue carries the pause as its own item, opening this same view.
		const state = await p.ask(`/deck/state?s=${run.sessionId}`);
		const snap = JSON.parse(state.body) as { queue: { key: string; kind: string; chat: string | null }[] };
		const item = snap.queue.find(i => i.key === `paused:${run.name}/${run.step}`);
		if (!item) throw new Error(`the queue carries no item for the paused step (${snap.queue.length} items)`);
		if (item.chat !== run.sessionId) throw new Error(`the queue item opens on ${item.chat}, not the step's session`);

		console.log(`run         ${run.name}/${run.step} · session ${run.sessionId}`);
		console.log(`pane        ${step.replace(/\s+/g, ' ')}`);
		console.log(`transcript  ${turns} turns · ${minimap} minimap marks`);
		console.log(`cold hands  ${wired} send controls · POST /chat/send → ${sent.status} · ${sent.body.replace(/\s+/g, ' ').slice(0, 90)}`);
		console.log(`queue       ${item.kind} ${item.key} → chat ${item.chat}`);
		console.log(shot);
		console.log(cold);
	}
	finally { run.close(); }
}
