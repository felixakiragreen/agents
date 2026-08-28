/**
 * **The composer, in Action** (keel §3: *"Action follows Focus: at rest, the Summon composer"*).
 *
 * v0's `/summon` was a form that had to be *submitted* to tell you what it would do. The deck's is
 * live: every knob move re-resolves the whole plan — stamp, tier, colour, venue, worktree, trust —
 * and the summons the session will read sits on screen while you move them. Three laws hold it.
 *
 *  1. **One logic, round-tripped.** Resolution is `POST /deck/compose`, server-side, where the
 *     register, the trust files, the lineage logs and `git` are (`deck-composer.ts` §mechanism).
 *     This file holds knobs and draws answers; it derives nothing, so there is no second copy to
 *     drift. **The bytes it fires are the bytes it was handed** — never a re-derivation assembled
 *     from the DOM.
 *  2. **The building names the work, the cwd is only the venue.** The building is the City's
 *     selection — the deck's one cross-pane fact (keel §3's ontology) — so clicking `agents/belvedere`
 *     and firing at `~/code/agents` stamps `…-belvedere-NN`. That is the field report's own case,
 *     closed at the model.
 *  3. **Ambiguity never arms** (D10). The button exists only on a resolved plan the hands' own
 *     `parseFire` accepted, with the credential armed; every knob move disarms it until the next
 *     answer lands, because a button wired to a stale plan is a fire nobody reviewed.
 *
 * **This is the one file on the deck that may reach `/hands/fire`** — and it is why every other
 * tenant's DoD greps its own source for that string rather than the bundle (B17 F1). Everything
 * else on this deck reads, gestures, or moves his eyes.
 */

import type { ComposeDraft, ComposePlan, PaneState, UsageWire } from './deck-model';
import { selection } from './deck-view';
import { ago, button, el, receipt, remember, remembered, say } from './deck-dom';

/** Everything has a limit: one re-resolve per settled keystroke run, one usage fetch per minute. */
const DEBOUNCE_MS = 160;
const USAGE_MS = 60_000;

const DRAFT_KEY = 'belvedere.deck.draft';

const EMPTY: ComposeDraft = {
	building: '', cwd: '', account: '', mantle: '', model: '', effort: '',
	theater: '', increment: '', branch: '', summons: '', template: '',
};

/** localStorage is a per-viewer convenience and never load-bearing: anything unexpected is no memory. */
const toDraft = (raw: unknown): ComposeDraft | null => {
	if (typeof raw !== 'object' || raw === null) return null;
	const r = raw as Record<string, unknown>;
	const out = { ...EMPTY };
	for (const k of Object.keys(EMPTY) as (keyof ComposeDraft)[])
		if (typeof r[k] === 'string') out[k] = r[k] as string;
	return out;
};

let draft: ComposeDraft = remembered(DRAFT_KEY, toDraft) ?? { ...EMPTY };
let plan: ComposePlan | null = null;
let usage: UsageWire[] | null = null;
let usageAt = 0;
let resolving = false;
let pending = false;
let debounce = 0;
/** The chip just pressed, sent once and cleared — `draft.template` is what stays sticky. */
let clicked = '';

let host: HTMLElement | null = null;
let state: PaneState = 'minimal';

/** Region hosts, built once at mount so the summons box keeps its caret through every re-resolve. */
type Regions = { head: HTMLElement; card: HTMLElement; knobs: HTMLElement; text: HTMLTextAreaElement; extra: HTMLElement };
let regions: Regions | null = null;

// ---------- the round trip ----------

const post = async <T>(path: string, body: unknown): Promise<T> => {
	const r = await fetch(path, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
	return await r.json() as T;
};

/**
 * Re-resolve. Coalesced rather than queued: a knob moved while an answer is in flight sets a flag,
 * and one more round trip follows — so dragging across five mantle chips costs two requests, not
 * five, and the last one always wins.
 */
async function resolve(): Promise<void> {
	if (resolving) { pending = true; return; }
	resolving = true;
	try {
		const asked = clicked;
		clicked = '';
		plan = await post<ComposePlan>('/deck/compose', { ...draft, building: selection.building ?? '', clicked: asked });
		// The answer IS the draft: a template sets mantle and tier together (D45), and a sticky one
		// re-speaks the summons at whatever the knobs now say. Re-seating from the answer rather than
		// from what was on screen is what keeps one logic one logic.
		draft = { ...draft, ...plan.draft };
		remember(DRAFT_KEY, draft);
		if (regions && regions.text.value !== draft.summons && document.activeElement !== regions.text)
			regions.text.value = draft.summons;
	}
	catch (e) { plan = null; say('composer', `compose failed — ${e instanceof Error ? e.message : String(e)}`); }
	finally { resolving = false; }
	if (pending) { pending = false; void resolve(); }
	else draw();
}

/** Every knob's one gesture: write it down, disarm, and ask. */
function knob(patch: Partial<ComposeDraft>, wait = 0): void {
	draft = { ...draft, ...patch };
	remember(DRAFT_KEY, draft);
	plan = null;                                   // D10: a stale plan may not keep a live button
	draw();
	clearTimeout(debounce);
	if (wait) debounce = window.setTimeout(() => void resolve(), wait);
	else void resolve();
}

/**
 * The bill, fetched (B17 §4) — **on expand, and once a minute while it is open**. Never on the
 * deck's poll: a token read and an HTTPS round trip every three seconds is a price nobody agreed to.
 */
async function fetchUsage(): Promise<void> {
	if (Date.now() - usageAt < USAGE_MS) return;
	usageAt = Date.now();
	try { usage = await (await fetch('/deck/usage', { headers: { accept: 'application/json' } })).json() as UsageWire[]; }
	catch (e) { say('usage', `usage fetch failed — ${e instanceof Error ? e.message : String(e)}`); return; }
	draw();
}

// ---------- the fire: the one wire on this deck that spawns ----------

async function doFire(): Promise<void> {
	const p = plan;
	if (!p?.fire || !p.handsArmed) return;
	// The body the page is showing, not one rebuilt from it. The only field that moves is the cwd,
	// and only because the worktree does not exist until the hand makes it (B7's proven order).
	const body = { ...p.fire };
	say('composer', 'firing…');
	try {
		if (p.worktree) {
			const cut = await post<{ ok: boolean; error?: string; result?: { path: string } }>(
				'/hands/worktree', { repo: p.worktree.repo, branch: p.worktree.branch });
			if (!cut.ok || !cut.result) return say('composer', `worktree refused — ${cut.error ?? 'no path'}`);
			body.cwd = cut.result.path;
			say('composer', `worktree ${cut.result.path} · firing…`);
		}
		const r = await post<{ ok: boolean; error?: string; result?: { workspace: string; sha: string | null; bytes: number } }>(
			'/hands/fire', body);
		if (!r.ok || !r.result) return say('composer', `refused — ${r.error ?? 'no result'}`);
		const same = r.result.sha === p.sha;
		// A stalled fire is a stalled fire: a cold venue opens a workspace and stops at the trust
		// dialog, so it must never read as a session that started (B7's amendment).
		say('composer', p.trust && !p.trust.warm
			? `opened ${r.result.workspace} · WAITING on Claude's folder-trust prompt — jump in and answer it; nothing has been read`
			: `fired ${r.result.workspace} · ${body.stamp} · ${r.result.bytes} B · sha ${r.result.sha}`
				+ ` · ${same ? 'identical to the previewed bytes' : `DIFFERS from the previewed ${p.sha}`}`);
		void resolve();                                // the stamp just spent an ordinal; mint the next
	}
	catch (e) { say('composer', String(e)); }
}

// ---------- drawing ----------

const label = (text: string) => el('span', 'label', text);

/** A toggled button group. No dropdowns, ever (design law §3) — the buttons ARE the state. */
function chips(
	current: string, options: { value: string; text: string; sub?: string; color?: string | null }[],
	pick: (value: string) => void,
): HTMLElement {
	const box = el('div', 'btns');
	for (const o of options) {
		const b = button('btn', '');
		b.dataset['on'] = o.value === current ? 'yes' : 'no';
		b.dataset['value'] = o.value;
		if (o.color) {
			const sw = el('span', 'swatch');
			sw.style.background = o.color;
			b.append(sw);
		}
		b.append(el('span', 'btn-t', o.text));
		if (o.sub) b.append(el('span', 'sub', o.sub));
		b.addEventListener('click', () => pick(o.value));
		box.append(b);
	}
	return box;
}

/** One knob. `data-knob` names it, so a reader — and a probe — can say WHICH control moved. */
function group(knob: string, name: string, body: HTMLElement | HTMLElement[]): HTMLElement {
	const g = el('div', 'group');
	g.dataset['knob'] = knob;
	g.append(label(name));
	for (const b of ([] as HTMLElement[]).concat(body)) g.append(b);
	return g;
}

function textKnob(name: string, value: string, placeholder: string, set: (v: string) => void): HTMLElement {
	const i = el('input', 'path') as HTMLInputElement;
	i.type = 'text';
	i.value = value;
	i.spellcheck = false;
	i.placeholder = placeholder;
	i.dataset['knob'] = name;
	i.addEventListener('input', () => set(i.value));
	return i;
}

const cellText = (c: { pct: number | null; delta: number | null }) =>
	c.pct === null ? '—' : `${c.pct}% ${c.delta !== null && c.delta >= 0 ? '+' : ''}${c.delta ?? ''}`;

/** The account's own number, on its own chip — the standing law: usage wherever accounts are chosen. */
function accountSub(account: string): string {
	const u = (usage ?? plan?.usage ?? []).find(x => x.account === account);
	if (!u) return 'no usage';
	const sess = u.cells.find(c => c.bucket === 'sess');
	const age = u.ageSeconds === null ? 'never' : ago(Date.now() / 1000 - u.ageSeconds);
	return `${sess ? cellText(sess) : '—'} · ${u.source === 'live' ? age : `${u.source} ${age}`}`;
}

/**
 * The bill in full: three windows per account, the source each figure came from, and its age.
 * **A figure whose provenance is hidden is a figure nobody can price** — `live` is a fetch this
 * glass made, `cache` is the rig's file (the 391-minute number, now labelled), `none` is neither.
 */
function usageBlock(): HTMLElement {
	const box = el('div', 'usage');
	box.append(label('usage — live, fetched by the deck itself'));
	for (const u of usage ?? plan?.usage ?? []) {
		const line = el('div', `uline s-${u.source}`);
		line.append(el('span', 'acct', u.account));
		for (const c of u.cells) {
			const cell = el('span', c.pct === null ? 'cell empty' : 'cell');
			cell.append(el('span', 'bucket', c.bucket), el('b', 'pct', c.pct === null ? '—' : `${c.pct}%`));
			if (c.delta !== null) cell.append(el('b', `delta ${c.delta < 0 ? 'burning' : 'headroom'}`, `${c.delta >= 0 ? '+' : ''}${c.delta}`));
			line.append(cell);
		}
		line.append(el('span', 'fetched', u.ageSeconds === null ? `${u.source} · never` : `${u.source} · ${ago(Date.now() / 1000 - u.ageSeconds)} old`));
		if (u.error) line.append(el('span', 'bad', u.error));
		box.append(line);
	}
	const out = el('span', 'out', receipt('usage'));
	out.dataset['outFor'] = 'usage';
	box.append(out);
	return box;
}

/** One fact line — the plan's own record, in the law of space's currency: a label and a value. */
function kv(k: string, v: HTMLElement | string): HTMLElement {
	const row = el('div', 'kv');
	row.append(label(k), typeof v === 'string' ? el('span', '', v) : v);
	return row;
}

function planCard(): HTMLElement {
	const card = el('section', 'plan-card');
	// The card is always ABOUT a building, even when there is nothing composed yet — Action follows
	// Focus, and a card that would not say which building it belongs to is a card in the wrong pane.
	card.dataset['building'] = plan?.building?.building ?? selection.building ?? '';
	if (!plan) {
		card.dataset['tone'] = 'wait';
		card.append(el('p', 'quiet prose', resolving ? 'resolving…' : 'move a knob and the plan resolves here.'));
		return card;
	}
	const p = plan;
	if (p.blocked !== null) {
		card.dataset['tone'] = 'blocked';
		card.append(el('span', 'pill tone-purple', 'blocked'), el('p', 'prose bad', p.blocked));
		return card;
	}
	card.dataset['tone'] = p.warnings.length ? 'warn' : 'ready';
	// The plan's facts, on the element that states them: what the page is showing IS what the button
	// will post, so they are readable without parsing a sentence — by a reader, and by a probe.
	card.dataset['stamp'] = p.stamp;
	card.dataset['tier'] = p.tier;
	card.dataset['color'] = p.color;
	card.dataset['theater'] = p.theater;
	card.dataset['cwd'] = p.worktree?.path ?? p.cwd ?? '';
	card.dataset['sha'] = p.sha;
	card.dataset['bytes'] = String(p.bytes);
	card.dataset['account'] = p.fire?.account ?? '';
	const head = el('div', 'plan-h');
	head.append(el('span', `pill tone-${p.warnings.length ? 'orange' : 'green'}`, p.warnings.length ? 'read the warnings' : 'ready'));
	const swatch = el('span', 'swatch');
	swatch.style.background = p.color;
	swatch.title = `cmux colour ${p.color} — felikai's own, through the rig's table`;
	head.append(swatch, el('b', 'stamp-name', p.stamp), el('code', '', p.tier));
	card.append(head);

	card.append(kv('building', p.building ? `${p.building.building} → theater "${p.theater}" · ${p.theaterNote}` : 'none — pick one in the City'));
	card.append(kv('cwd', p.worktree ? `${p.worktree.path} — cut first from ${p.worktree.repo} on ${p.worktree.branch}` : p.cwd ?? '—'));
	card.append(kv('trust', p.trust === null ? '—' : p.trust.warm
		? `warm — ${p.trust.root} is trusted for ${p.draft.account || p.accounts[0] || ''}`
		: `cold — project ${p.trust.where}`));
	card.append(kv('bytes', `${p.bytes} B · sha ${p.sha} · resolved in ${p.ms.toFixed(0)} ms`));

	for (const w of p.warnings) {
		const box = el('details', 'warn');
		box.append(el('summary', '', w.name));
		box.append(el('p', 'prose bad', w.text));
		card.append(box);
	}
	return card;
}

function acts(): HTMLElement {
	const box = el('div', 'acts');
	const p = plan;
	const go = button('go', 'fire', 'spawn the session this plan describes') as HTMLButtonElement;
	// D10, structurally: no plan, a refusal, or cold hands and there is nothing to press. The button
	// is disabled rather than absent so the affordance's *state* is readable at a glance.
	go.disabled = !p?.fire || !p.handsArmed;
	go.dataset['armed'] = go.disabled ? 'no' : 'yes';
	go.addEventListener('click', () => void doFire());
	const copy = button('alt', 'copy summons', 'copying is reading — the gate stays Felix\'s');
	copy.addEventListener('click', () => {
		void navigator.clipboard.writeText(plan?.summons ?? '')
			.then(() => say('composer', `copied ${plan?.bytes ?? 0} B`))
			.catch(e => say('composer', `clipboard refused: ${e}`));
	});
	const out = el('span', 'out', receipt('composer'));
	out.dataset['outFor'] = 'composer';
	box.append(go, copy, out);
	if (p && !p.handsArmed) box.append(el('p', 'quiet prose', `hands cold — ${p.handsNote}. Everything here still composes: the plan, the stamp and the trust verdict are all reads.`));
	return box;
}

const LEGEND: [string, string][] = [
	['tone-green', 'ready — composed, and the hands\' own parse boundary accepts it'],
	['tone-orange', 'warning — it will fire, and something on it deserves a second look'],
	['tone-purple', 'blocked — nothing to arm; the reason is on the card'],
	['tone-grey', 'a chip\'s second line is its own number — the account\'s session window, the mantle\'s preset tier'],
];

function legend(): HTMLElement {
	const box = el('div', 'legend-deck');
	box.append(label('legend'));
	for (const [cls, text] of LEGEND) {
		const key = el('span', 'lkey');
		key.append(el('span', `pill ${cls}`, ' '), el('span', '', text));
		box.append(key);
	}
	return box;
}

function drawKnobs(box: HTMLElement): void {
	const p = plan;
	const accounts = p?.accounts ?? [];
	const account = p?.draft.account || draft.account || accounts[0] || '';
	box.append(group('account', 'account · usage', chips(account,
		accounts.map(a => ({ value: a, text: a, sub: accountSub(a) })), v => knob({ account: v }))));

	box.append(group('mantle', 'mantle', chips(draft.mantle, (p?.mantles ?? []).map(m =>
		({ value: m.name, text: m.name, sub: m.preset || 'no preset', color: m.color })), v => knob({ mantle: v }))));

	box.append(group('model', 'model', chips(draft.model, [{ value: '', text: 'preset', sub: p?.preset || '—' },
		...['fable', 'opus', 'sonnet', 'haiku'].map(v => ({ value: v, text: v }))], v => knob({ model: v }))));
	box.append(group('effort', 'effort', chips(draft.effort, [{ value: '', text: 'preset', sub: p?.preset || '—' },
		...['low', 'medium', 'high', 'xhigh', 'max'].map(v => ({ value: v, text: v }))], v => knob({ effort: v }))));

	if (state !== 'expanded') return;

	box.append(group('theater', `theater — ${p?.theaterNote ?? 'the building\'s own name'}`,
		textKnob('theater', draft.theater, p?.theater ?? 'from the building', v => knob({ theater: v }, DEBOUNCE_MS))));
	box.append(group('increment', `increment — minted from both lineage logs and the live census${p?.increment === null ? '' : ` (next is ${p?.increment})`}`,
		textKnob('increment', draft.increment, String(p?.increment ?? ''), v => knob({ increment: v }, DEBOUNCE_MS))));
	box.append(group('cwd', 'venue — where it runs; empty is the building itself',
		textKnob('cwd', draft.cwd, p?.building?.path ?? '~/code/…', v => knob({ cwd: v }, DEBOUNCE_MS))));
	box.append(group('branch', 'worktree branch — empty fires in the venue itself',
		textKnob('branch', draft.branch, 'bv/b17-something', v => knob({ branch: v }, DEBOUNCE_MS))));

	box.append(group('template', 'template — fills the summons, and sets the mantle and tier it speaks as',
		chips(draft.template, (p?.templates ?? []).map(t => ({ value: t.key, text: t.name })),
			v => { clicked = v; knob({}); })));
}

function draw(): void {
	if (!host) return;
	const r = regions;
	if (!r) return;

	r.head.textContent = '';
	r.head.append(el('span', 'big', 'summon'));
	const pill = el('span', `pill tone-${plan === null ? 'grey' : plan.blocked !== null ? 'purple' : plan.warnings.length ? 'orange' : 'green'}`,
		plan === null ? (resolving ? 'resolving' : 'draft') : plan.blocked !== null ? 'blocked' : plan.warnings.length ? 'warn' : 'ready');
	r.head.append(pill);
	if (plan?.stamp) r.head.append(el('b', 'stamp-name', plan.stamp));

	// Minimal is one word and a mark, and that is the law (keel §2). Everything below is hidden by
	// the pane's own `data-state`, so nothing is built that cannot be read.
	if (state === 'minimal') {
		r.card.textContent = '';
		r.knobs.textContent = '';
		r.extra.textContent = '';
		return;
	}

	r.card.textContent = '';
	r.card.append(planCard());
	const pre = el('pre', 'summons-out');
	pre.textContent = plan?.summons ?? draft.summons;
	r.card.append(pre, acts());

	r.knobs.textContent = '';
	drawKnobs(r.knobs);

	r.extra.textContent = '';
	if (state === 'expanded') r.extra.append(usageBlock(), legend());
}

// ---------- the tenant's half of Action ----------

/**
 * The Workshop owns both hosts (Action follows Focus), and hands this one its Action pane. It is a
 * plain module rather than a second `FocusView` because there is no second Focus here: the composer
 * IS what Action holds at rest, and the Chat (B16) and the Works (B10) hold their own.
 */
export const composer = {
	mount(into: HTMLElement): void {
		host = into;
		into.textContent = '';
		const head = el('div', 'c-head');
		const card = el('div', 'c-card');
		const knobs = el('div', 'c-knobs');
		const text = el('textarea', 'prose summons-in') as HTMLTextAreaElement;
		text.rows = 6;
		text.spellcheck = true;
		text.placeholder = 'the first user turn, byte for byte';
		text.value = draft.summons;
		// The first keystroke makes the words his: a sticky template stops re-writing what he typed.
		text.addEventListener('input', () => knob({ summons: text.value, template: '' }, DEBOUNCE_MS));
		const extra = el('div', 'c-extra');
		into.append(head, card, text, knobs, extra);
		regions = { head, card, knobs, text, extra };
		draw();
		void resolve();
	},

	unmount(): void {
		clearTimeout(debounce);
		host = null;
		regions = null;
	},

	/**
	 * Every poll and every state change. The composer is the one place on the deck Felix *types*, so
	 * the poll must not rebuild it (B14 F4's law, taken to its conclusion): the snapshot is held for
	 * the City's selection and nothing else, and a draw happens only when something it draws moved.
	 */
	draw(actionState: PaneState): void {
		const opened = state === 'minimal' && actionState !== 'minimal';
		// The City moving is the one snapshot fact this pane cares about, and it is the whole of the
		// stamp: a different building is a different theater, so it re-resolves and nothing else does.
		const moved = plan !== null && plan.draft.building !== (selection.building ?? '');
		state = actionState;
		if (opened || (state !== 'minimal' && usage === null)) void fetchUsage();
		if (moved) void resolve();
		else draw();
	},

	/** Test seam and nothing else: the module is a singleton, so a suite must be able to reset it. */
	reset(): void { draft = { ...EMPTY }; plan = null; usage = null; usageAt = 0; },
};
