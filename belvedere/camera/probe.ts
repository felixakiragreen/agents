// The eyes — playwright-core driving the installed Chrome, and the small typed API a probe gets.
//
// The API is **closed on purpose**. A probe never touches a playwright `Page`, so a probe cannot
// address a deck the camera did not boot, cannot download, and cannot grow a private protocol of
// its own; and the day the driver is replaced, this file is the whole of the change. Every verb
// here is here because a committed probe needs it — `remember` and `ask` are not conveniences,
// they are the only way to prove the Chat's disarm (`probes/chat.probe.ts`).
//
// **No pixel goldens, ever.** A shot is evidence for a finding and for the agent's own eyes;
// assertions live in `glass/`'s tests, or in the probe's own `text()` reads. Nothing in this
// module compares two images, and nothing ever should — they rot, and a rotting bar is worse
// than no bar.

import { mkdirSync } from 'fs';
import { dirname, isAbsolute, join } from 'path';
import { chromium, type Browser, type Page } from 'playwright-core';
import type { Outcome } from './twin';

/** Everything has a limit (directive 3.1). A probe that hangs is an agent that waits forever. */
const LIMITS = { actionMs: 10_000, gotoMs: 20_000, settleMs: 4_000, scrollMs: 250, keyMs: 20 } as const;

/**
 * The deck is a no-scroll surface under the law of space (README §3), so a shot is viewport-sized
 * and never full-page: what the viewport holds is what Felix would see, and a PNG an agent Reads
 * costs tokens by the pixel.
 */
const VIEWPORT = { width: 1440, height: 900 } as const;

export const shotsDir = () => join(import.meta.dir, 'shots');

/** The verbs. `shoot` answers the file's absolute path — a probe prints it, an agent Reads it. */
export type Probe = {
	/** Navigate to an in-deck path, then let the page settle. */
	goto(path: string): Promise<void>;
	click(selector: string): Promise<void>;
	type(selector: string, text: string): Promise<void>;
	/**
	 * **Real keystrokes**, one at a time, into the element at `selector` — `type` fills a value in
	 * one assignment and fires one `input` event, which is a different experiment.
	 *
	 * B23's composer bar is *"typing 10 characters across ≥3 poll repaints loses zero keystrokes and
	 * zero focus"*, and the defect it hunts is a repaint that replaces the box mid-word: `fill`
	 * cannot see it, because the whole word is already in the box before the first poll lands.
	 */
	press(selector: string, text: string): Promise<void>;
	/** What an input or textarea is holding — the composer bar counts keystrokes with it. */
	value(selector: string): Promise<string>;
	/**
	 * Who has focus, as `<tag>[<the first data- attribute>]`, or `''` for the body. A repaint that
	 * replaced the box Felix was typing in shows up here as focus on nothing.
	 */
	focused(): Promise<string>;
	/** The caret's offset in a textarea — `-1` where the element is not one. */
	caret(selector: string): Promise<number>;
	/** Dwell. The deck polls every three seconds, so *"across ≥3 poll repaints"* is a wait. */
	wait(ms: number): Promise<void>;
	/**
	 * **How many times the page asked the server for something** whose URL contains `part`, off the
	 * browser's own resource timeline.
	 *
	 * This is the leak's measuring instrument (B23 §3). A tenant that hung its listeners on a host it
	 * does not own gained a second set on every swap-in, so one click ran the handler N times — and on
	 * a wire that reaches the server, N handlers are N requests. The deck's audit log records the same
	 * fact one layer down, but a disarmed twin answers 503 before it audits (C17 F1), so the count has
	 * to be taken here.
	 */
	requests(part: string): Promise<number>;
	/** A scroller's position and extent: `top` is `scrollTop`, `height` the content, `client` the pane. */
	scrolled(selector: string): Promise<{ top: number; height: number; client: number }>;
	/** Put a scroller at an offset — how a probe scrolls to the very top and stays there. */
	scrollTo(selector: string, top: number): Promise<void>;
	/**
	 * Whether the first match's box lies inside the viewport. The minimap's bar is **spatial** — a
	 * click lands the marked turn where Felix can see it — and only the geometry can say so.
	 */
	inView(selector: string): Promise<boolean>;
	/** Wait for a selector to be attached and visible. Throws on timeout — a probe asserts by throwing. */
	waitFor(selector: string): Promise<void>;
	/** What the page says at a selector, trimmed. The probe's own assertions read through this. */
	text(selector: string): Promise<string>;
	/**
	 * How many elements match. The verb the structural laws need: "a ⬡ card carries **zero** ignite
	 * wiring" is a count, and counting it in the page beats grepping the served HTML for
	 * `data-ignite` — the DOM knows which card an attribute is inside and a regex does not.
	 */
	count(selector: string): Promise<number>;
	/**
	 * Bring an element into the viewport, and wait for the scroll to finish.
	 *
	 * A shot is viewport-sized on purpose (§VIEWPORT), and the rail is a column taller than one
	 * viewport — so a card below the fold is a card no shot proves. This is the only way to aim
	 * the frame, and it aims it the way Felix's own scroll wheel would.
	 */
	scroll(selector: string): Promise<void>;
	/**
	 * Seed the deck's own memory before the next load — `localStorage`, JSON-encoded exactly as
	 * `deck-dom.ts:remember` writes it. The deck restores its selection from these keys at boot
	 * (`deck.client.ts:61`), so this is how a probe opens the Chat on a session: through the
	 * surface the deck already has, rather than a query parameter invented for probes.
	 */
	remember(key: string, value: unknown): Promise<void>;
	/**
	 * One request from the page's own origin, answered as status + body. This is how a probe
	 * **attempts a write** and reads the refusal verbatim: a disarmed deck draws no send control
	 * at all (`chat.client.ts:347` — the honest-disabled law), so the pixels prove the absence and
	 * this proves the 503 that causes it.
	 */
	ask(path: string, init?: { method?: string; body?: string }): Promise<{ status: number; body: string }>;
	/**
	 * Write a PNG and answer its absolute path. A bare name gets a timestamped file under
	 * `camera/shots/`; an absolute path IS the file, which is how `--out` is honored without a
	 * second way of saying where a shot goes.
	 */
	shoot(name: string): Promise<string>;
};

const stamp = () => new Date().toISOString().replace(/[:.]/g, '-').replace('Z', '');

export const shotPath = (name: string) => join(shotsDir(), `${stamp()}-${name.replace(/[^A-Za-z0-9._-]+/g, '-')}.png`);

/**
 * Let the page stop talking. The deck polls every three seconds forever (`deck.client.ts:1068`),
 * so `networkidle` is a *hope*, not a contract — the timeout is the normal case on `/deck` and it
 * is not an error: the shot is taken either way. What it buys on the static pages is a render that
 * has actually finished.
 */
async function settle(page: Page): Promise<void> {
	try { await page.waitForLoadState('networkidle', { timeout: LIMITS.settleMs }); }
	catch { /* a live deck never goes idle; shoot it as it stands */ }
}

/**
 * Open the eyes on one deck. `channel: 'chrome'` drives the Chrome already installed — no browser
 * download, ever (D54: the camera's only dependency is the driver, named in its charge).
 */
export async function openEyes(base: (path: string) => string): Promise<Outcome<{ probe: Probe; close(): Promise<void> }>> {
	let browser: Browser;
	try { browser = await chromium.launch({ channel: 'chrome', headless: true }); }
	catch (e) {
		return { ok: false, error: `the installed Chrome would not launch headless: ${(e as Error).message}\n`
			+ `The charge's pre-authorized fallback is \`bunx playwright install chromium\` (~130 MB into playwright's cache); record which path shipped.` };
	}

	const page = await browser.newPage({ viewport: VIEWPORT });
	page.setDefaultTimeout(LIMITS.actionMs);

	const probe: Probe = {
		async goto(path) { await page.goto(base(path), { waitUntil: 'load', timeout: LIMITS.gotoMs }); await settle(page); },
		async click(selector) { await page.click(selector); },
		async type(selector, text) { await page.fill(selector, text); },
		async press(selector, text) { await page.locator(selector).first().pressSequentially(text, { delay: LIMITS.keyMs }); },
		async value(selector) { return await page.locator(selector).first().inputValue(); },
		async focused() {
			return await page.evaluate(() => {
				const a = document.activeElement as HTMLElement | null;
				if (!a || a === document.body) return '';
				const key = Object.keys(a.dataset)[0];
				// `dataset` speaks camelCase and the DOM speaks dashes; the probe reads as a selector.
				const attr = key === undefined ? null : `data-${key.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`)}`;
				return attr === null ? a.tagName.toLowerCase() : `${a.tagName.toLowerCase()}[${attr}]`;
			});
		},
		async caret(selector) {
			return await page.locator(selector).first().evaluate(e =>
				e instanceof HTMLTextAreaElement || e instanceof HTMLInputElement ? e.selectionStart ?? -1 : -1);
		},
		async wait(ms) { await page.waitForTimeout(ms); },
		async requests(part) {
			return await page.evaluate(p =>
				performance.getEntriesByType('resource').filter(e => e.name.includes(p!)).length, part);
		},
		async scrolled(selector) {
			return await page.locator(selector).first().evaluate(e =>
				({ top: Math.round(e.scrollTop), height: Math.round(e.scrollHeight), client: Math.round(e.clientHeight) }));
		},
		async scrollTo(selector, top) {
			await page.locator(selector).first().evaluate((e, y) => { e.scrollTop = y; }, top);
			await page.waitForTimeout(LIMITS.scrollMs);
		},
		async inView(selector) {
			return await page.locator(selector).first().evaluate((e, h) => {
				const r = e.getBoundingClientRect();
				return r.bottom > 0 && r.top < h && r.height > 0;
			}, VIEWPORT.height);
		},
		async waitFor(selector) { await page.waitForSelector(selector, { state: 'visible' }); },
		async text(selector) { return (await page.textContent(selector) ?? '').trim(); },
		async count(selector) { return await page.locator(selector).count(); },
		async scroll(selector) {
			await page.locator(selector).first().scrollIntoViewIfNeeded();
			await page.waitForTimeout(LIMITS.scrollMs);   // the deck's own scroll behaviour, settled
		},
		async remember(key, value) { await page.evaluate(([k, v]) => localStorage.setItem(k!, v!), [key, JSON.stringify(value)]); },
		async ask(path, init) {
			return await page.evaluate(async ([url, method, body]) => {
				const res = await fetch(url!, { method: method!, ...(body === null ? {} : { body: body! }) });
				return { status: res.status, body: (await res.text()).trim() };
			}, [path, init?.method ?? 'GET', init?.body ?? null] as [string, string, string | null]);
		},
		async shoot(name) {
			const file = isAbsolute(name) ? name : shotPath(name);
			mkdirSync(dirname(file), { recursive: true });
			await page.screenshot({ path: file });
			return file;
		},
	};

	return { ok: true, result: { probe, close: () => browser.close() } };
}
