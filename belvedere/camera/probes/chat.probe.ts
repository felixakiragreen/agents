// The disarm, proven in pixels — and the reason the camera has `remember` and `ask` at all.
//
// Run: bun camera/cli.ts run probes/chat.probe.ts
//
// The Chat's send is a socket write and goes cold with the credential (`server.ts`, D18 class 1),
// and the deck obeys the honest-disabled law: on a cold deck **no send control is drawn at all** —
// the reason stands where the button would have been (`chat.client.ts:347`). So this probe proves
// the disarm from both sides: the pixels show the reason in place of the button, and the page's
// own `POST /chat/send` answers 503 with the arming law's words.
//
// Nothing here reaches a real session. The twin's hands are cold before the browser opens
// (`twin.ts` §the disarm probe) and its desk is a scratch drawer, so the draft this types lands in
// `$TMPDIR`, never in Felix's.

import type { Probe } from '../probe';

const TEXT = 'camera probe — this text is typed into the composer and never delivered.';

export default async function (p: Probe): Promise<void> {
	// One load to reach the origin, one read to find a session the deck itself already knows about.
	await p.goto('/deck');
	const state = await p.ask('/deck/state');
	if (state.status !== 200) throw new Error(`/deck/state answered ${state.status}: ${state.body}`);
	const snap = JSON.parse(state.body) as { census: { sessions: { sid: string; stamp: string | null }[] } };
	const target = snap.census.sessions[0];
	if (!target) throw new Error('the census carries no session — the Chat has nothing to open on');

	// The deck's own memory is how a target is chosen; the probe writes the same keys a click writes
	// (`deck.client.ts:52–62`) rather than inventing a probe-only route into the app.
	await p.remember('belvedere.deck.session', target.sid);
	await p.remember('belvedere.deck.focus', 'chat');
	await p.remember('belvedere.deck.layout', { context: 'minimal', focus: 'typical', action: 'expanded', drawer: 'shut' });
	await p.goto('/deck');

	const box = `textarea[data-chat-draft="${target.sid}"]`;
	await p.waitFor(box);
	await p.type(box, TEXT);
	const before = await p.shoot('chat-typed');

	// The attempt. The button is absent by law, so the send is made the way the button would have
	// made it — from the page's own origin, at the same route, with the same body.
	const sent = await p.ask('/chat/send', { method: 'POST', body: JSON.stringify({ sid: target.sid, text: TEXT }) });
	if (sent.status !== 503) throw new Error(`POST /chat/send answered ${sent.status}, not 503 — THE TWIN IS ARMED:\n${sent.body}`);
	if (!sent.body.includes('hands disabled')) throw new Error(`503, but not the arming law's refusal:\n${sent.body}`);

	// And the same refusal on the glass, where Felix would read it.
	const reason = await p.text('.qacts .reason');
	if (!reason.includes('hands disabled')) throw new Error(`the Action pane drew no cold-hands reason — it says "${reason}"`);
	if ((await p.text('.qacts')).includes('send ·') || reason === '') throw new Error('a send control is drawn on a disarmed deck');
	const after = await p.shoot('chat-503');

	console.log(`target      ${target.stamp ?? target.sid}`);
	console.log(`send        ${sent.status} · ${sent.body.replace(/\s+/g, ' ')}`);
	console.log(`on the deck ${reason}`);
	console.log(before);
	console.log(after);
}
