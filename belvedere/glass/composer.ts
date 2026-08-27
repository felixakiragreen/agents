/**
 * `/summon` — the blank page, fired. The rail fires batons and the shelf fires resumes; both
 * answer "what did the city already decide?". This page answers the other question: **anything**
 * — new work, a new building, an ad-hoc sitting — with no terminal in the loop (B7's goal).
 *
 * Four laws shape it:
 *
 *  1. **Compose, then fire.** The form is inert: picking a mantle or typing a summons writes
 *     nothing and decides nothing. One `Compose` press re-renders the page with the resolved
 *     target, tier, name-stamp, colour, worktree plan and trust verdict, and only THAT render
 *     carries a fire button. The review of the rendered plan is the authorization (D11's shape,
 *     applied to one fire) — and the button carries the exact JSON the page is showing, never a
 *     re-derivation a script assembled from the DOM.
 *  2. **The hands' own boundary decides what arms.** After composing, the body is run through
 *     `parseFire` — the very function `POST /hands/fire` parses with — and its refusal is
 *     rendered instead of a button. One gate, not a second copy of one (D10's family).
 *  3. **No client state and no dropdowns** (design law, README §3). Every choice is a radio in a
 *     toggled button group, so the browser holds the selection, the back button walks the
 *     history, and there is nothing to lose. The one script is the fire click, exactly as the
 *     rail and the shelf carry it.
 *  4. **A cold directory is named, never answered.** A fire into a tree the chosen account has
 *     never trusted stalls on Claude's folder-trust dialog with no transcript and no census beat
 *     (B3 F2). The composer reads the trust roots, warns on the button, and renders such a fire
 *     honestly — a workspace opened is not a session started.
 *
 * The form POSTs to this same path because the summons rides in the body: a GET would put a
 * 4 KB summons in a URL. **`POST /summon` writes nothing** — it is a page, not a hand; the
 * fence's write list is untouched (README §2).
 */

import { existsSync, statSync } from 'fs';
import { homedir } from 'os';
import { isAbsolute, join, resolve } from 'path';
import { MANTLES } from '../../doctrine';
import { readCensus } from './census';
import { pacing, readUsage, usageNote, usageStrip, type Usage } from './gauges';
import { handsState, parseFire } from './hands';
import { esc, label, page, pill, short, type Tone } from './html';
import { sweepSummons } from './inbox';
import { registerNote } from './pages';
import { register, type Entry } from './register';
import { readRig, type Rig } from './rig';
import { colourOf, compose, lineage, mantleKey, nextStamp, tierParts, type Composed } from './summon';
import { readTrust, trustOf, type Verdict } from './trust';

/** Everything has a limit (directive 3.1). The hands cap the summons at 64 KB; the form is smaller. */
const LIMITS = { bodyBytes: 128 << 10, summonsChars: 32 << 10, slots: 8 } as const;

const CRUMBS = '<a href="/">rail</a> <span>/</span> <a href="/city">city</a> <span>/</span> <a href="/shelf">shelf</a> <span>/</span> <span>summon</span>';

// ---------- the draft: the parse boundary ----------

/**
 * Every control on the page, as strings. Empty always means *unset* and resolves downstream —
 * an unset tier axis takes the mantle's preset, an unset stamp is minted, an unset branch is no
 * worktree. There is no third state to represent, so there is no third state.
 */
export type Draft = {
	where: string;      // a register building's absolute path; '' ⇒ the free path below
	cwd: string;        // the free path, `~`-relative or absolute
	account: string;
	mantle: string;
	model: string;
	effort: string;
	stamp: string;
	branch: string;
	summons: string;
};

const one = (q: URLSearchParams, key: string) => (q.get(key) ?? '').trim();

/**
 * The form's bytes into a trusted `Draft`. The summons is the one field kept verbatim but for
 * its line endings: **an HTML textarea submits CRLF** and the hands normalise to LF at their own
 * boundary (`sanitize.ts`), so normalising here keeps the text the page shows, the JSON the
 * button carries and the bytes the session receives one single string.
 */
export const readDraft = (q: URLSearchParams): Draft => ({
	where: one(q, 'where'), cwd: one(q, 'cwd'), account: one(q, 'account'),
	mantle: one(q, 'mantle'), model: one(q, 'model'), effort: one(q, 'effort'),
	stamp: one(q, 'stamp'), branch: one(q, 'branch'),
	summons: (q.get('summons') ?? '').replace(/\r\n?/g, '\n'),
});

// ---------- the templates ----------

/** Canon says "the Grand Architect"; everything else takes its article from its own first letter. */
const article = (mantle: string) =>
	mantle === 'Grand Architect' ? 'the' : /^[AEIOU]/.test(mantle) ? 'an' : 'a';

/**
 * A template is a whole opening, not a paragraph: it carries the mantle it speaks as and the tier
 * that mantle opens at, and applying one sets both. A summons fence already names its mantle and
 * its tier (D45) — a chip that filled only the words would leave the page disagreeing with itself.
 *
 * `tier: null` means "whatever `presets.tsv` staffs this mantle at" — the rig's table, not a
 * second copy of it. The strings themselves are hardcoded (spec §2): canon grammar is read by
 * humans from the doctrine, never parsed out of it by this page.
 */
export type Template = {
	key: string;
	name: string;
	mantle: string;
	tier: string | null;
	body: (o: { tier: string; target: string | null }) => string;
};

/** DOCTRINE §12's fenced summons, verbatim — slot and all. The dream is Felix's to name. */
export const FOUNDING = `You are an Architect at fable-max.
Wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/agents/canon/work/DOCTRINE.md
and <dream.md | Felix's telling>, and found the project.`;

export const TEMPLATES: readonly Template[] = [
	...MANTLES.map(mantle => ({
		key: mantleKey(mantle)!,
		name: mantle,
		mantle,
		tier: null,
		body: ({ tier }: { tier: string }) =>
			`You are ${article(mantle)} ${mantle} at ${tier}.\n`
			+ `Wear ~/code/agents/canon/mantles/${mantleKey(mantle)}.md,\n`
			+ `then read <context> and <verb>.`,
	})),
	{ key: 'founding', name: 'founding Architect', mantle: 'Architect', tier: 'fable-max', body: () => FOUNDING },
	{
		key: 'sweep', name: 'inbox sweep', mantle: 'Architect', tier: 'fable-high',
		body: ({ target }) => sweepSummons(target ?? '<building>'),
	},
];

/**
 * The chip that was clicked wins over the radios it disagrees with — it is the later gesture, and
 * only the pressed submit button's name reaches the server, so `template` is present on exactly
 * the one request that asked for it and never sticks.
 */
export function applyTemplate(draft: Draft, key: string, rig: Rig, target: string | null): Draft {
	const t = TEMPLATES.find(x => x.key === key);
	if (!t) return draft;
	const tier = t.tier ?? rig.tiers.get(mantleKey(t.mantle) ?? '') ?? 'opus-high';
	const parts = tierParts(tier);
	return { ...draft, mantle: t.mantle, model: parts?.model ?? '', effort: parts?.effort ?? '',
		summons: t.body({ tier, target }) };
}

// ---------- the plan ----------

/** `~/code/x` is how the city writes a path; the filesystem wants the other spelling. */
const untilde = (p: string) => p.startsWith('~/') ? homedir() + p.slice(1) : p;

export type Target = { path: string } | { blocked: string };

/** The chip's building, or — when the chip says *elsewhere* — the path in the field beside it. */
export function targetOf(draft: Draft): Target {
	const raw = untilde(draft.where || draft.cwd);
	if (raw === '') return { blocked: 'no target — pick a building, or type a path beside "elsewhere"' };
	if (!isAbsolute(raw)) return { blocked: `the target must be an absolute path — got "${raw}"` };
	const path = resolve(raw);
	try { if (!statSync(path).isDirectory()) return { blocked: `not a directory: ${path}` }; }
	catch { return { blocked: `does not exist: ${path}` }; }
	return { path };
}

/** Slots the canon grammar leaves for Felix. A fired `<verb>` is a session with no instruction. */
export const slotsIn = (summons: string): string[] =>
	(summons.match(/<[^<>\n]{1,60}>|⟨[^⟨⟩\n]{1,60}⟩/g) ?? []).slice(0, LIMITS.slots);

/**
 * The worktree the fire will land in, when a branch is named. The repo is **derived, never asked
 * for**: `/hands/worktree` resolves its own `git rev-parse --show-toplevel`, so a second field
 * would only be a second way to get it wrong. It is resolved here too, and only here, so the
 * rendered plan names the exact path the hand will make (and the trust walk asks about that path,
 * not about its parent).
 */
export type Cut = { repo: string; branch: string; path: string } | { blocked: string };

export function worktreeCut(target: string, branch: string): Cut {
	const git = Bun.spawnSync(['git', '-C', target, 'rev-parse', '--show-toplevel'], { stdout: 'pipe', stderr: 'pipe' });
	const repo = new TextDecoder().decode(git.stdout).trim();
	if (git.exitCode !== 0 || repo === '') return { blocked: `not inside a git repo: ${target}` };
	const path = join(repo, '.claude/worktrees', branch);
	if (existsSync(path)) return { blocked: `worktree path already exists: ${path}` };
	return { repo, branch, path };
}

export type Plan = {
	draft: Draft;
	account: string;
	target: string | null;
	targetNote: string;
	tier: string;
	preset: string;
	stamp: string;
	cut: Cut | null;
	trust: { verdict: Verdict; file: string; where: string } | null;
	slots: string[];
	fire: Composed;
	refusal: string | null;       // what `parseFire` — the hands' own gate — says about this body
};

/**
 * The draft, resolved against disk. Every field the page prints comes from here, and the fire
 * button carries `fire.body` and nothing else.
 *
 * The stamp is minted unless the one in the field still names this lineage: an edited ordinal or
 * a hand-written suffix survives every recompose, and switching mantle or building re-mints
 * rather than firing a Builder under an Architect's name. The counter reads three sources — both
 * logs and the live census (`summon.ts` §nextStamp).
 */
export function plan(rig: Rig, draft: Draft): Plan {
	const accounts = [...rig.accounts.values()];
	const account = accounts.includes(draft.account) ? draft.account : accounts[0] ?? '';

	const t = targetOf(draft);
	const target = 'path' in t ? t.path : null;
	const targetNote = 'blocked' in t ? t.blocked : '';

	const key = mantleKey(draft.mantle) ?? '';
	const preset = rig.tiers.get(key) ?? '';
	const presetParts = tierParts(preset);
	const model = draft.model || presetParts?.model || '';
	const effort = draft.effort || presetParts?.effort || '';
	const tier = model && effort ? `${model}-${effort}` : '';

	const prefix = target ? lineage(draft.mantle, target) : null;
	const known = readCensus().sessions.map(s => s.stamp).filter((s): s is string => s !== null);
	const stamp = prefix && draft.stamp.startsWith(prefix + '-') ? draft.stamp
		: prefix ? nextStamp(draft.mantle, target!, new Set(), known) ?? '' : draft.stamp;

	const cut = target && draft.branch ? worktreeCut(target, draft.branch) : null;

	// A worktree the hand has not cut yet is not a repo git can resolve, so the question is asked
	// of the repo it will be cut from — which IS the inheritance (`trust.ts` §projectOf).
	const askAbout = cut && 'repo' in cut ? cut.repo : target;
	const configDir = [...rig.accounts].find(([, l]) => l === account)?.[0] ?? null;
	const trust = askAbout && configDir
		? (({ file, roots }) => ({ file, where: askAbout, verdict: trustOf(askAbout, { file, roots }) }))(readTrust(configDir))
		: null;

	const fire: Composed = target === null ? { blocked: targetNote }
		: compose(rig, { summons: draft.summons, mantle: draft.mantle || null, tier, cwd: target, account, stamp });

	// The page arms only what the hands would accept. One boundary, asked early.
	const checked = 'body' in fire ? parseFire(fire.body) : null;

	return {
		draft, account, target, targetNote, tier, preset, stamp, cut, trust,
		slots: slotsIn(draft.summons), fire,
		refusal: checked && !checked.ok ? checked.error : null,
	};
}

// ---------- render ----------

const radios = (name: string, options: { value: string; text: string; sub?: string }[], current: string) =>
	`<div class="btns">${options.map((o, n) => {
		const id = `${name}-${n}`;
		return `<input type="radio" class="pick" name="${esc(name)}" id="${esc(id)}" value="${esc(o.value)}"${o.value === current ? ' checked' : ''}>`
			+ `<label class="btn" for="${esc(id)}">${esc(o.text)}${o.sub ? `<span class="sub">${esc(o.sub)}</span>` : ''}</label>`;
	}).join('')}</div>`;

const group = (name: string, body: string) => `<div class="group">${label(name)}${body}</div>`;

/** The session-window pacing delta, beside the account that would spend it (design law §3). */
function accountSub(u: Usage | undefined, nowSeconds: number): string {
	const q = u?.windows.sess;
	if (!q) return 'no cache';
	const d = pacing(q, nowSeconds);
	return `${q.pct}% ${d >= 0 ? '+' : ''}${d}`;
}

const LEGEND = `<section class="legend">
	${label('legend')}
	<span class="key"><span class="pill tone-green">ready</span> composed, and the hands' own parse boundary accepts it</span>
	<span class="key"><span class="pill tone-orange">warning</span> it will fire — and something on it deserves a second look</span>
	<span class="key"><span class="pill tone-purple">blocked</span> nothing to arm: the reason is on the card</span>
	<span class="key">a chip's second line is its own number — the account's session window, the mantle's preset tier</span>
</section>`;

/**
 * The composed plan, and the only place on this page a fire button can exist. Its three states are
 * the legend's three: blocked (a reason, no button), warning (a button and what it will cost),
 * ready. A warning never disarms — an untrusted directory and an unfilled slot are both things
 * Felix may mean, and the glass reports rather than refuses. What DOES disarm is the hands'
 * refusal, because that fire would 400 anyway, and cold hands, because there is nothing to fire with.
 */
export function planCard(p: Plan, armed: boolean): string {
	if ('blocked' in p.fire || p.refusal !== null)
		return `<section class="panel tone-purple plan">
			<h2>Nothing composed</h2>
			<p class="prose note bad">${esc('blocked' in p.fire ? p.fire.blocked : p.refusal ?? '')}</p>
			<p class="prose note">Fill the form below and press <b>compose</b>. Nothing here has touched disk.</p>
		</section>`;

	const body = p.fire.body;
	const cold = p.trust !== null && !p.trust.verdict.warm;
	const warnings: string[] = [];
	if (p.trust && !p.trust.verdict.warm)
		warnings.push(`<b>untrusted directory</b> — the session will wait on Claude's trust prompt; jump in to answer it.
			${p.trust.verdict.refused
				? `<code>${esc(short(p.trust.verdict.refused))}</code> is refused for <b>${esc(p.account)}</b>.`
				: p.trust.verdict.project.repo
					? `<code>${esc(short(p.trust.verdict.project.path))}</code> is a repository <b>${esc(p.account)}</b> has never trusted, and a repository never borrows an ancestor's trust.`
					: `Nothing at or above <code>${esc(short(p.trust.verdict.project.path))}</code> is trusted for <b>${esc(p.account)}</b>.`}
			Trust is per account and lives on the project root; the glass reads <code>${esc(short(p.trust.file))}</code> and never answers that dialog.`);
	if (p.slots.length)
		warnings.push(`<b>unfilled slots</b> — the summons still carries ${p.slots.map(s => `<code>${esc(s)}</code>`).join(' ')}.
			The session will read them as written.`);
	if (p.cut && 'blocked' in p.cut) warnings.push(`<b>no worktree</b> — ${esc(p.cut.blocked)}. The fire will land in the target itself.`);

	const tone: Tone = warnings.length ? 'orange' : 'green';
	const wt = p.cut && 'path' in p.cut ? p.cut : null;

	const kv = (k: string, v: string) => `<div class="kv">${label(k)}<span>${v}</span></div>`;
	const facts = [
		kv('as', `${esc(p.account)} · <b>${esc(body.stamp)}</b> · <code>${esc(body.model)}-${esc(body.effort)}</code> · ${pill(body.color, 'grey', 'the cmux workspace colour, from presets.tsv')}`),
		kv('cwd', wt ? `<code>${esc(short(wt.path))}</code> — cut first from <code>${esc(short(wt.repo))}</code> on branch <code>${esc(wt.branch)}</code>`
			: `<code>${esc(short(body.cwd))}</code>`),
		kv('trust', p.trust === null ? '—' : p.trust.verdict.warm
			? `warm — <code>${esc(short(p.trust.verdict.root))}</code> is trusted for ${esc(p.account)}`
			: `<span class="bad">cold</span> — project <code>${esc(short(p.trust.verdict.project.path))}</code>`),
	].join('');

	const notes = warnings.length
		? `<div class="warn">${warnings.map(w => `<p class="prose note bad">${w}</p>`).join('')}</div>` : '';

	const disabled = armed ? '' : ' disabled';
	const wtAttr = wt ? ` data-worktree="${esc(JSON.stringify({ repo: wt.repo, branch: wt.branch }))}"` : '';
	const coldAttr = cold ? ' data-cold="1"' : '';

	return `<section class="panel tone-${tone} plan">
		<h2>${warnings.length ? 'Composed — read the warnings' : 'Composed'}</h2>
		${facts}${notes}
		<pre class="summons" data-summons>${esc(body.summons)}</pre>
		<div class="acts">
			<button type="button" class="go" data-fire="${esc(JSON.stringify(body))}"${wtAttr}${coldAttr}${disabled}>fire</button>
			<button type="button" class="alt" data-copy>copy summons</button>
			<span class="out" data-out>${esc(`${Buffer.byteLength(body.summons)} B`)}</span>
		</div>
	</section>`;
}

export function form(p: Plan, rig: Rig, entries: Entry[], usages: Usage[], nowSeconds: number): string {
	const d = p.draft;
	const byLabel = new Map(usages.map(u => [u.account, u]));

	const buildings = entries.map(e => ({ value: e.path, text: e.building }))
		.sort((a, b) => a.text.localeCompare(b.text));
	const where = group('building', radios('where', [...buildings, { value: '', text: 'elsewhere ▸' }], d.where)
		+ `<input class="path" type="text" name="cwd" value="${esc(d.cwd)}" spellcheck="false"
			placeholder="~/code/… — used when the chip says elsewhere">`);

	const account = group('account · usage', radios('account',
		[...rig.accounts.values()].map(a => ({ value: a, text: a, sub: accountSub(byLabel.get(a), nowSeconds) })), p.account));

	const mantle = group('mantle', radios('mantle',
		MANTLES.map(m => ({ value: m, text: m, sub: rig.tiers.get(mantleKey(m) ?? '') ?? 'no preset' })), d.mantle));

	const model = group('model', radios('model',
		[{ value: '', text: 'preset', sub: p.preset || '—' }, ...['fable', 'opus', 'sonnet', 'haiku'].map(v => ({ value: v, text: v }))], d.model));
	const effort = group('effort', radios('effort',
		[{ value: '', text: 'preset', sub: p.preset || '—' }, ...['low', 'medium', 'high', 'xhigh', 'max'].map(v => ({ value: v, text: v }))], d.effort));

	const templates = group('template — fills the summons, and sets the mantle and tier it speaks as',
		`<div class="btns">${TEMPLATES.map(t =>
			`<button class="btn ges" type="submit" name="template" value="${esc(t.key)}">${esc(t.name)}</button>`).join('')}</div>`);

	const stamp = group('name-stamp — minted from the lineage, editable',
		`<input class="path" type="text" name="stamp" value="${esc(p.stamp)}" spellcheck="false" placeholder="&lt;mantle&gt;-&lt;theater&gt;-NN">`);
	const branch = group('worktree branch — empty fires in the target itself',
		`<input class="path" type="text" name="branch" value="${esc(d.branch)}" spellcheck="false" placeholder="bv/b9-something">`);

	return `<form class="composer" method="post" action="/summon">
		<div class="filters">${where}</div>
		<div class="filters">${account}${mantle}</div>
		<div class="filters">${model}${effort}</div>
		<div class="filters">${templates}</div>
		<textarea class="prose summons-in" name="summons" rows="9" spellcheck="true" maxlength="${LIMITS.summonsChars}"
			placeholder="the first user turn, byte for byte">${esc(d.summons)}</textarea>
		<div class="filters">${stamp}${branch}</div>
		<div class="acts"><button class="go" type="submit" name="compose" value="1">compose</button>
			<span class="out">nothing is written until <b>fire</b>; composing only reads.</span></div>
	</form>`;
}

/** The one script: fire (worktree first when the plan says so) and copy, one delegated listener. */
const SCRIPT = `<script>
document.addEventListener('click', async ev => {
	const btn = ev.target.closest('button[data-fire], button[data-copy]');
	if (!btn) return;
	const card = btn.closest('.plan'), out = card.querySelector('[data-out]');
	const text = card.querySelector('[data-summons]').textContent;
	if (btn.hasAttribute('data-copy')) {
		try { await navigator.clipboard.writeText(text); out.textContent = 'copied ' + text.length + ' chars'; }
		catch (e) { out.textContent = 'clipboard refused: ' + e; }
		return;
	}
	const post = async (hand, body) => {
		const r = await fetch('/hands/' + hand, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
		return [r.status, await r.json()];
	};
	btn.disabled = true;
	const body = JSON.parse(btn.dataset.fire);
	try {
		if (btn.dataset.worktree) {
			out.textContent = 'worktree…';
			const [code, r] = await post('worktree', JSON.parse(btn.dataset.worktree));
			if (!r.ok) { out.textContent = code + ' ' + r.error; btn.disabled = false; return; }
			body.cwd = r.result.path;
			out.textContent = 'worktree ' + r.result.path + ' · firing…';
		} else out.textContent = 'firing…';
		const [code, r] = await post('fire', body);
		if (!r.ok) { out.textContent = code + ' ' + r.error; btn.disabled = false; return; }
		// A stalled fire is a stalled fire: a cold directory opens a workspace and stops at the
		// trust dialog, so it must never read as a session that started (B7 §amendment).
		out.textContent = btn.dataset.cold
			? 'opened ' + r.result.workspace + ' · WAITING on Claude\\'s trust prompt — jump in and answer it; nothing has been read'
			: 'fired ' + r.result.workspace + ' · ' + body.stamp + ' · sha ' + r.result.sha + ' · ' + r.result.bytes + ' B';
	} catch (e) { out.textContent = String(e); btn.disabled = false; }
});
</script>`;

export function composerPage(q: URLSearchParams): string {
	const t0 = performance.now();
	const now = Date.now() / 1000;
	const reg = register();
	const rig = readRig();
	const hands = handsState();
	const usages = readUsage(rig);

	// A template is applied against the target the rest of the form already names, so the sweep
	// template can say which building it sweeps before anything is composed.
	const raw = readDraft(q);
	const template = (q.get('template') ?? '').trim();
	const seen = targetOf(raw);
	const draft = template ? applyTemplate(raw, template, rig, 'path' in seen ? seen.path : null) : raw;

	const p = plan(rig, draft);

	const banner = hands.armed ? '' : `<section class="panel"><h2>Hands disabled</h2>
		<p class="prose note">The composer is read-only — <code>/hands/*</code> answers 503 until the credential is armed.
		Everything here still composes: the plan, the stamp and the trust verdict are all reads.
		<br><span class="bad">${esc(hands.note)}</span></p></section>`;

	const strip = `<section class="strip">
		<div class="stat"><span class="label">buildings</span><b>${reg.entries.length}</b></div>
		<div class="stat"><span class="label">templates</span><b>${TEMPLATES.length}</b></div>
		<div class="stat"><span class="label">stamp</span><b class="small">${esc(p.stamp || '—')}</b></div>
		<div class="stat"><span class="label">tier</span><b class="small">${esc(p.tier || '—')}</b></div>
		<div class="stat"><span class="label">hands</span><b class="small">${hands.armed ? pill('armed', 'green') : pill('disabled', 'orange')}</b></div>
	</section>`;

	const ms = performance.now() - t0;
	return page('Belvedere — the composer', CRUMBS,
		banner + strip + planCard(p, hands.armed) + usageStrip(usages, now) + form(p, rig, reg.entries, usages, now) + LEGEND + SCRIPT,
		`composed in ${ms.toFixed(0)} ms · ${usageNote(usages)} · ${registerNote(reg, '/summon')}`);
}

/**
 * `GET /summon` is the blank page; `POST /summon` is the same page with the form's own bytes.
 * Neither writes: the POST exists only because a summons does not belong in a URL.
 */
export async function summonRoute(req: Request, url: URL): Promise<string> {
	if (req.method !== 'POST') return composerPage(url.searchParams);
	const raw = await req.text();
	if (Buffer.byteLength(raw) > LIMITS.bodyBytes)
		return composerPage(new URLSearchParams({ summons: `the form exceeded ${LIMITS.bodyBytes} bytes and was not read` }));
	return composerPage(new URLSearchParams(raw));
}
