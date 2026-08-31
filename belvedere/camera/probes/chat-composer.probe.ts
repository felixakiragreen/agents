// **A poll may never cost a keystroke** (B23 §1) — the composer face of the repaint law.
//
// Run: bun camera/cli.ts run probes/chat-composer.probe.ts
//
// The punch list, verbatim: *"I type one letter into the Reply box and the textfield unfocuses"*.
// The class is C15 F3's — a `paint()` signature carrying state the region's own contents depend on
// — arriving from the other side: the Action pane's signature carried the **refusal codes**, which
// are a function of what Felix has typed, so the first character of an empty box flipped `empty`
// off, the signature changed, and `paint` rebuilt the host with his textarea inside it.
//
// This probe types ten characters one key at a time and then dwells past three polls, because both
// halves are the bar: a rebuild on the FIRST keystroke and a rebuild on a LATER poll are the same
// defect wearing two clocks. Nothing here is delivered — the twin's hands are cold.

import type { Probe } from '../probe';

const WORD = 'belvedere!';
/** Three polls at three seconds each, plus the slack a settle costs. */
const DWELL = 10_000;

export default async function (p: Probe): Promise<void> {
	await p.goto('/deck');
	const state = await p.ask('/deck/state');
	if (state.status !== 200) throw new Error(`/deck/state answered ${state.status}: ${state.body}`);
	const snap = JSON.parse(state.body) as { census: { sessions: { sid: string; stamp: string | null }[] } };
	const target = snap.census.sessions[0];
	if (!target) throw new Error('the census carries no session — the Chat has nothing to open on');

	await p.remember('belvedere.deck.session', target.sid);
	await p.remember('belvedere.deck.focus', 'chat');
	await p.remember('belvedere.deck.layout', { context: 'minimal', focus: 'typical', action: 'expanded', drawer: 'shut' });
	await p.goto('/deck');

	const box = `textarea[data-chat-draft="${target.sid}"]`;
	await p.waitFor(box);
	// An empty box is the sharp case: the first character is the one that flips `empty` off.
	await p.type(box, '');
	await p.click(box);

	// Ten characters, one at a time, checking after EVERY key — the first one is the reported bug,
	// and a probe that only checks at the end cannot say which key was lost.
	for (const [i, ch] of [...WORD].entries()) {
		await p.press(box, ch);
		const who = await p.focused();
		if (who !== 'textarea[data-chat-draft]')
			throw new Error(`keystroke ${i + 1} of ${WORD.length} ("${ch}") cost the focus — it is on ${who === '' ? 'the body' : who}`);
		const got = await p.value(box);
		if (got !== WORD.slice(0, i + 1)) throw new Error(`after keystroke ${i + 1} the box holds "${got}", not "${WORD.slice(0, i + 1)}"`);
	}
	const caret = await p.caret(box);
	if (caret !== WORD.length) throw new Error(`the caret sits at ${caret}, not at ${WORD.length} — the end of what he typed`);
	const typed = await p.shoot('chat-composer-typed');

	// And now the clock: three polls landing on a box nobody is touching.
	await p.wait(DWELL);
	const after = await p.focused();
	if (after !== 'textarea[data-chat-draft]')
		throw new Error(`${DWELL / 1000} s of polling cost the focus — it is on ${after === '' ? 'the body' : after}`);
	const held = await p.value(box);
	if (held !== WORD) throw new Error(`${DWELL / 1000} s of polling left "${held}" in the box, not "${WORD}"`);
	const stillAt = await p.caret(box);
	if (stillAt !== WORD.length) throw new Error(`${DWELL / 1000} s of polling moved the caret to ${stillAt}, not ${WORD.length}`);
	const dwelt = await p.shoot('chat-composer-polled');

	console.log(`target      ${target.stamp ?? target.sid}`);
	console.log(`keystrokes  ${WORD.length}/${WORD.length} kept · focus held on every one · caret ${caret}`);
	console.log(`the dwell   ${DWELL / 1000} s (≥3 polls) · focus ${after} · box "${held}" · caret ${stillAt}`);
	console.log(typed);
	console.log(dwelt);
}
