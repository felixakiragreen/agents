// The Chat on a **headless engine-born session** (C16 §§1–3): opened from the ⬡-queue, reading a
// pause as a conversation, and cold-handed on the engine road.
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
		// The deck's own memory, exactly as a click writes it — no probe-only route (C17 F5). **No
		// session is named**: the queue is the entry point being measured, so the Chat must be empty
		// until the click.
		await p.remember('belvedere.deck.focus', 'chat');
		await p.remember('belvedere.deck.layout', { context: 'minimal', focus: 'expanded', action: 'typical', drawer: 'pinned' });
		await p.goto('/deck');

		// ---- entry point: the ⬡-queue's needs-you item for a paused step ----
		const key = `paused:${run.name}/${run.step}`;
		const state = await p.ask(`/deck/state`);
		const snap = JSON.parse(state.body) as { queue: { key: string; kind: string; sid: string | null; chat: string | null }[] };
		const item = snap.queue.find(i => i.key === key);
		if (!item) throw new Error(`the queue carries no item for the paused step (${snap.queue.length} items)`);
		if (item.chat !== run.sessionId) throw new Error(`the queue item opens on ${item.chat}, not the step's session`);
		if (item.sid !== null) throw new Error(`a headless step offers a pane jump to ${item.sid} — there is no pane`);

		// Pinned rather than merely open: the drawer keeps a track of its own, so the shot carries the
		// queue item and the Chat it opens side by side. (Until B24 this was a workaround — the scrim
		// intercepted every click in an open drawer, B26 F6.)
		const button = `#host-drawer [data-chat-sid="${run.sessionId}"]`;
		await p.scroll(button);
		const queueShot = await p.shoot('chat-engine-queue');
		await p.click(button);
		await p.waitFor('.ct-step');

		// ---- the pause, read as a conversation ----
		const step = await p.text('.ct-step');
		if (!step.includes('needs-⬡ question')) throw new Error(`the pane names no pause: "${step}"`);
		if (!step.includes('release name')) throw new Error(`the pause carries no question: "${step}"`);
		const head = await p.text('.ct-head');
		if (!head.includes(`${run.name}/${run.step}`)) throw new Error(`the head does not name the step: "${head}"`);

		const turns = await p.count('.ct-turns .ct');
		if (turns < 2) throw new Error(`the transcript rendered ${turns} turns`);
		const minimap = await p.count('.ct-map .ct-mark');
		if (minimap !== turns) throw new Error(`${turns} turns and ${minimap} marks — the strip is not the file`);
		const shot = await p.shoot('chat-engine-paused');

		// ---- cold hands, on the engine road ----
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

		console.log(`run         ${run.name}/${run.step} · session ${run.sessionId}`);
		console.log(`queue       ${item.kind} ${item.key} → chat ${item.chat} · pane jump ${item.sid}`);
		console.log(`pane        ${step.replace(/\s+/g, ' ')}`);
		console.log(`transcript  ${turns} turns · ${minimap} minimap marks`);
		console.log(`cold hands  ${wired} send controls · POST /chat/send → ${sent.status} · ${sent.body.replace(/\s+/g, ' ').slice(0, 90)}`);
		console.log(queueShot);
		console.log(shot);
		console.log(cold);
	}
	finally { run.close(); }
}
