// The glass: one bun server, localhost only. Read-everything; write only what the fence's four
// hands are (README §2) — every other route on this server touches nothing on disk.
//
// Run: bun belvedere/glass/server.ts     → http://127.0.0.1:4400
//
// Every route re-reads disk. A route that throws renders the throw and keeps serving: a
// blank page is a lie, and a dead server is a shattered glass (README §1).

import { readFileSync } from 'fs';
import { join } from 'path';
import { chatQuery, chatRoute } from './chat';
import { summonRoute } from './composer';
import { deckPage, deckState, readDoc } from './deck';
import { deskRoute } from './desk';
import { composeRoute } from './deck-composer';
import { decodeQuery } from './decoder';
import { flowRoute, kick, startEngine } from './engine';
import { handsRoute } from './hands';
import { inboxRoute } from './inbox';
import { HOST, port } from './paths';
import { buildingPage, cityPage, docPage, errorPage, notFound } from './pages';
import { railPage } from './rail';
import { readRig } from './rig';
import { refreshUsage, usageWire } from './usage';
import { shelfPage } from './shelf';
import { boot, rewalk } from './register';

const HERE = import.meta.dir;
const ASSETS: Readonly<Record<string, string>> = { '/felikai.css': 'felikai.css', '/glass.css': 'glass.css', '/deck.css': 'deck.css' };

/**
 * The deck's client bundle (B13): repo TypeScript, bundled once at server start, served from
 * memory. No framework, no CDN, nothing off this origin — the fence's zero-new-dependencies line
 * holds on the client too (D54).
 *
 * A build failure **stops the server**. It can only mean the repo's own TypeScript does not
 * bundle, which is a defect to be seen now rather than a `/deck` that serves a shell around
 * nothing: a blank page is a lie (this file's own law), and a silently scriptless app is a
 * blank page with furniture.
 */
const bundle = await Bun.build({ entrypoints: [join(HERE, 'deck.client.ts')], target: 'browser' });
if (!bundle.success) throw new AggregateError(bundle.logs, 'the deck bundle failed to build');
const DECK_JS = await bundle.outputs[0]!.text();

/**
 * The vendored prose face (B9 §1). One directory, one extension, no path from the URL: the fonts
 * are a fixed list, so a request names a key and never a file. Nothing else on this server serves
 * bytes off disk by name.
 */
const FONTS: Readonly<Record<string, string>> = {
	'/assets/inter-latin-400.woff2': 'assets/inter-latin-400.woff2',
	'/assets/inter-latin-700.woff2': 'assets/inter-latin-700.woff2',
};

const html = (body: string, status = 200) =>
	new Response(body, { status, headers: { 'content-type': 'text/html; charset=utf-8' } });

async function route(url: URL): Promise<Response> {
	const asset = ASSETS[url.pathname];
	if (asset) return new Response(readFileSync(join(HERE, asset), 'utf8'), { headers: { 'content-type': 'text/css; charset=utf-8' } });

	const font = FONTS[url.pathname];
	// Immutable bytes under a fixed name: the browser asks once per glass, not once per page.
	if (font) return new Response(readFileSync(join(HERE, font)),
		{ headers: { 'content-type': 'font/woff2', 'cache-control': 'public, max-age=604800, immutable' } });

	// The deck (B13): one shell, one bundle, one snapshot. `/deck/state` is a read like every other
	// route here — it writes nothing and it never walks the city on this thread (see `deck.ts`).
	if (url.pathname === '/deck') return html(deckPage());
	if (url.pathname === '/deck.js') return new Response(DECK_JS,
		{ headers: { 'content-type': 'text/javascript; charset=utf-8' } });
	// `?b=<building>` is the Workshop asking for one building's detail (B15). One endpoint still:
	// the deck polls once and names what it has open, rather than opening a second poll beside this.
	if (url.pathname === '/deck/state')
		return Response.json(await deckState(url.searchParams.get('b'), url.searchParams.get('s')),
			{ headers: { 'cache-control': 'no-store' } });
	// An earlier transcript window (B16), on a scroll rather than on the clock — the viewer's own
	// pattern (`/deck/doc`): bytes Felix asked for once, never a second recurring read.
	if (url.pathname === '/deck/chat')
		return Response.json(chatQuery(url.searchParams), { headers: { 'cache-control': 'no-store' } });
	// The decoder (B20): one code word, resolved against its own building and then canon. A read
	// like everything else here — it is asked on a hover and answers a value, never a throw.
	if (url.pathname === '/deck/decode')
		return Response.json(decodeQuery(url.searchParams), { headers: { 'cache-control': 'no-store' } });
	// The composer's live preview (B17): one knob move, one round trip, one resolved plan. A **read**
	// — the register, the trust files, the lineage logs and `git`, nothing written — and deliberately
	// off the poll: it answers a gesture, not a clock. `POST` because a summons does not belong in a
	// URL, exactly as `/summon` has always argued.
	if (url.pathname === '/deck/usage')
		return Response.json(usageWire(await refreshUsage(readRig())), { headers: { 'cache-control': 'no-store' } });
	// The viewer inside Focus. A read, fenced to the city like `/doc`, answering a value either way —
	// an unresolved link renders its reason rather than nothing (the field report's item 3).
	if (url.pathname === '/deck/doc') {
		const p = url.searchParams.get('p');
		return Response.json(p ? readDoc(p) : { ok: false, error: '/deck/doc needs a ?p=<path>' },
			{ headers: { 'cache-control': 'no-store' } });
	}

	if (url.pathname === '/') return html(railPage());       // the morning (B3)
	if (url.pathname === '/city') return html(cityPage());
	if (url.pathname === '/shelf') return html(shelfPage(url.searchParams));   // resume anything (B5)

	if (url.pathname === '/doc') {
		const p = url.searchParams.get('p');
		return p ? html(docPage(p)) : html(notFound('/doc needs a ?p=<path>'), 400);
	}

	if (url.pathname.startsWith('/b/')) {
		const slug = decodeURIComponent(url.pathname.slice(3)).replace(/\/+$/, '');
		const body = buildingPage(slug);
		return body ? html(body) : html(notFound(`No building "${slug}" — the register is discovery over the city, so a building with no doctrine artifact simply is not one.`), 404);
	}

	return html(notFound(url.pathname), 404);
}

/**
 * The button beside the printed age. It refreshes the glass's own memory of which directories are
 * buildings — not the city, which it never touches — so it is not a hand and asks no fence
 * question (B8 §1). It answers only once the new walk is the held copy, then sends the browser
 * back where it came from: one click, one fresh page. `to` is an in-site path or it is `/`.
 */
async function rewalkRoute(url: URL): Promise<Response> {
	await rewalk();
	const to = url.searchParams.get('to') ?? '/';
	const back = /^\/(?!\/)/.test(to) ? to : '/';
	return new Response(null, { status: 303, headers: { location: back } });
}

// The register walk is seconds of filesystem (register.ts). Pay it at boot, off the request
// path, so the first rail Felix opens in the morning is already warm.
boot();

// The engine's clock (B11 §2). It starts HERE and only here — a module-scope interval would drive
// Felix's real desktop from any test process that imported `engine.ts` (B8 F1's lesson). A pass over
// a city with no armed flow reads the run logs and stops; nothing is armed until he clicks.
startEngine();

const server = Bun.serve({
	hostname: HOST,                          // D3: 127.0.0.1 and nothing else, until real auth
	port: port(),
	async fetch(req) {
		try {
			const url = new URL(req.url);
			// The only writing routes in the building, and the only async ones (B4, B6).
			// A hand changes the world the engine reasons over — a worktree cut, a HALT set — so the
			// tick runs after every one of them rather than waiting out its five seconds (B11 §2).
			if (url.pathname.startsWith('/hands/')) {
				const answered = await handsRoute(req, url.pathname.slice('/hands/'.length));
				kick();
				return answered;
			}
			// The arm, and his pass on a card (B11). Credential-gated inside, like every hand: an arm
			// authorizes socket writes. The engine writes nothing but run-state and hands calls, so the
			// fence's write list is unchanged (README §2).
			if (url.pathname.startsWith('/flow/')) return await flowRoute(req, url.pathname.slice('/flow/'.length));
			// The voice (B16, D18 class 1). Its two halves sit on opposite sides of the arming switch
			// on purpose: `send` is a socket write and goes cold with the credential; `draft` is a
			// file write under `desk/` and must never go cold with it (B6 F3's law).
			if (url.pathname.startsWith('/chat/')) return await chatRoute(req, url.pathname.slice('/chat/'.length));
			// The desk (B19, D18 class 3): files under `desk/` and nowhere else. It sits in FRONT of the
			// arming switch for the same reason the inbox does, and its reads share the door because the
			// drawer is one thing. Nothing on this path reaches a socket, and nothing here commits.
			if (url.pathname.startsWith('/desk/')) return await deskRoute(req, url.pathname.slice('/desk/'.length));
			// The fence's third write, and the one with no credential gate: a note is a file write,
			// not a socket call, so cold hands must never cost Felix the ability to say something.
			if (url.pathname === '/inbox') return await inboxRoute(req);
			// The composer POSTs to itself because a summons does not belong in a URL. It writes
			// nothing: the fence's write list is the four hands and the inbox, and this is a page.
			if (url.pathname === '/summon') return html(await summonRoute(req, url));
			// The deck's composer, same argument, same non-write: `POST` because a summons does not
			// belong in a URL. It resolves a draft and answers a plan; the fire is still the hands'.
			if (url.pathname === '/deck/compose') return await composeRoute(req);
			if (url.pathname === '/rewalk') return await rewalkRoute(url);
			return await route(url);
		}
		catch (e) { return html(errorPage(e), 500); }
	},
});

console.log(`belvedere · the glass · http://${server.hostname}:${server.port}`);
