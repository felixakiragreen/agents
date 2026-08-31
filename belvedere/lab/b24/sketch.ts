// His sketch, composed against the live register and filed through the deck's own wire (B24 §1:
// *"his sketch (the header) must be expressible verbatim, speakeasy included"*).
//
// Run against a live Belvedere: `bun lab/b24/sketch.ts <port>`. It POSTs to `/desk/arrangement` —
// the same route the drag posts to, the same parse boundary — so what lands in
// `~/code/agents/desk/city-arrangement.json` is written by the deck, not by this script.
//
// Every building the register carries is placed, because the tail is for what he has not filed and
// this is a filing of the whole city. The script refuses if the register grew a building it does
// not name: an arrangement that quietly dropped one would be the exact lie the charge forbids.

import type { Space } from '../../glass/spaces';

const port = process.argv[2] ?? '4477';
const base = `http://127.0.0.1:${port}`;

const bind = (binding: string): Space => ({ id: `b:${binding}`, name: '', color: null, type: null, binding, children: [] });
const nest = (binding: string, children: Space[]): Space => ({ ...bind(binding), children });
const group = (id: string, name: string, type: string | null, color: Space['color'], children: Space[]): Space =>
	({ id: `s:${id}`, name, color, type, binding: null, children });

const URS = 'universal_robots_sdk';
const MEGA = `${URS}/cap-mega`;
const WT = `${MEGA}/.claude/worktrees`;

const spaces: Space[] = [
	group('felix', 'Felix', 'district', 'blue', [
		nest('agents', [nest('agents/belvedere', [bind('agents/belvedere/v3')])]),
		group('rooted', 'Rooted', null, 'green', [
			bind('rooted/archive/arborist'), bind('rooted/archive/repot'), bind('rooted/archive/blossom'),
		]),
		bind('whiteboardy'),
		bind('hexwright'),
	]),
	group('thg', 'THG', 'district', 'purple', [
		nest(`${URS}/bob`, [
			bind(`${URS}/bob/docs/campaigns/lunchbox`),
			bind(`${URS}/bob/docs/campaigns/pods`),
			bind(`${URS}/bob/docs/campaigns/theseus`),
		]),
		group('mega', 'mega', 'the monorepo', null, [
			bind(`${MEGA}/docs`), bind(`${MEGA}/docs/units`), bind(`${MEGA}/docs/waypoint-stepper`),
			bind(`${MEGA}/simmy`), bind(`${MEGA}/snappy`), bind(`${MEGA}/snappy/ch2`),
			bind(`${WT}/cornerizer/docs`), bind(`${WT}/motion-migration/docs`),
			bind(`${WT}/user-manual/manny`), bind(`${WT}/tig-avc/docs`),
		]),
		group('felix-lab', 'felix', 'one-off', null, [
			bind(`${MEGA}/felix/spacex-dashboard`), bind(`${MEGA}/felix/spacex-dashboard-c2`),
		]),
	]),
];

const flat = (ss: readonly Space[]): string[] => ss.flatMap(s => [...(s.binding ? [s.binding] : []), ...flat(s.children)]);

const state = await (await fetch(`${base}/deck/state`)).json() as { register: { buildings: { building: string }[] } };
const known = state.register.buildings.map(b => b.building);
const placed = flat(spaces);
const missed = known.filter(b => !placed.includes(b));
const ghost = placed.filter(b => !known.includes(b));
if (ghost.length) throw new Error(`this sketch names buildings the register does not carry:\n  ${ghost.join('\n  ')}`);

const res = await fetch(`${base}/desk/arrangement`, {
	method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ spaces }),
});
console.log(`${res.status} ${(await res.text()).slice(0, 120).replace(/\s+/g, ' ')}`);
console.log(`register ${known.length} · placed ${placed.length} · unfiled ${missed.length}${missed.length ? `: ${missed.join(', ')}` : ''}`);
