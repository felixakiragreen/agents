/**
 * P5 probe driver — fire one session through the glass's own hands (dogfood).
 *
 *   bun fire.ts <account> <stamp> <model> <effort> <cwd> <summons-file>
 *
 * Prints the hands' JSON verbatim. Every probe in P5 goes through this so the
 * audit log (`hands.jsonl`) carries the evidence with no extra bookkeeping.
 */

const [account, stamp, model, effort, cwd, summonsFile] = process.argv.slice(2);
if (!account || !stamp || !model || !effort || !cwd || !summonsFile) {
	console.error('usage: bun fire.ts <account> <stamp> <model> <effort> <cwd> <summons-file>');
	process.exit(2);
}

const summons = await Bun.file(summonsFile).text();
const body = { account, stamp, cwd, model, effort, color: 'Charcoal', summons, resume: null };
const res = await fetch(`http://127.0.0.1:${process.env.P5_PORT ?? 4400}/hands/fire`, {
	method: 'POST',
	headers: { 'content-type': 'application/json' },
	body: JSON.stringify(body),
});
console.log(res.status, await res.text());
