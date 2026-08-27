// The glass: one bun server, localhost only, read-everything and write-nothing.
//
// Run: bun belvedere/glass/server.ts     → http://127.0.0.1:4400
//
// Every route re-reads disk. A route that throws renders the throw and keeps serving: a
// blank page is a lie, and a dead server is a shattered glass (README §1).

import { readFileSync } from 'fs';
import { join } from 'path';
import { HOST, PORT } from './paths';
import { buildingPage, cityPage, docPage, errorPage, notFound } from './pages';

const HERE = import.meta.dir;
const ASSETS: Readonly<Record<string, string>> = { '/felikai.css': 'felikai.css', '/glass.css': 'glass.css' };

const html = (body: string, status = 200) =>
	new Response(body, { status, headers: { 'content-type': 'text/html; charset=utf-8' } });

function route(url: URL): Response {
	const asset = ASSETS[url.pathname];
	if (asset) return new Response(readFileSync(join(HERE, asset), 'utf8'), { headers: { 'content-type': 'text/css; charset=utf-8' } });

	if (url.pathname === '/') return html(cityPage());

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

const server = Bun.serve({
	hostname: HOST,                          // D3: 127.0.0.1 and nothing else, until real auth
	port: PORT,
	fetch(req) {
		try { return route(new URL(req.url)); }
		catch (e) { return html(errorPage(e), 500); }
	},
});

console.log(`belvedere · the glass · http://${server.hostname}:${server.port}`);
