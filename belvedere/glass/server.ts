// The glass: one bun server, localhost only. Read-everything; write only what the fence's four
// hands are (README §2) — every other route on this server touches nothing on disk.
//
// Run: bun belvedere/glass/server.ts     → http://127.0.0.1:4400
//
// Every route re-reads disk. A route that throws renders the throw and keeps serving: a
// blank page is a lie, and a dead server is a shattered glass (README §1).

import { readFileSync } from 'fs';
import { join } from 'path';
import { summonRoute } from './composer';
import { deckPage, deckState, readDoc } from './deck';
import { handsRoute } from './hands';
import { inboxRoute } from './inbox';
import { HOST, port } from './paths';
import { buildingPage, cityPage, docPage, errorPage, notFound } from './pages';
import { railPage } from './rail';
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

function route(url: URL): Response {
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
		return Response.json(deckState(url.searchParams.get('b')), { headers: { 'cache-control': 'no-store' } });
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

const server = Bun.serve({
	hostname: HOST,                          // D3: 127.0.0.1 and nothing else, until real auth
	port: port(),
	async fetch(req) {
		try {
			const url = new URL(req.url);
			// The only writing routes in the building, and the only async ones (B4, B6).
			if (url.pathname.startsWith('/hands/')) return await handsRoute(req, url.pathname.slice('/hands/'.length));
			// The fence's third write, and the one with no credential gate: a note is a file write,
			// not a socket call, so cold hands must never cost Felix the ability to say something.
			if (url.pathname === '/inbox') return await inboxRoute(req);
			// The composer POSTs to itself because a summons does not belong in a URL. It writes
			// nothing: the fence's write list is the four hands and the inbox, and this is a page.
			if (url.pathname === '/summon') return html(await summonRoute(req, url));
			if (url.pathname === '/rewalk') return await rewalkRoute(url);
			return route(url);
		}
		catch (e) { return html(errorPage(e), 500); }
	},
});

console.log(`belvedere · the glass · http://${server.hostname}:${server.port}`);
