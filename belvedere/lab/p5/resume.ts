/**
 * P5 Q4 — resume through the glass's own hands, the shelf's exact shape.
 *
 *   bun resume.ts <account> <stamp> <cwd> <session-id> <summons-file>
 *
 * Model and effort are sent EMPTY on purpose: that is B5 E2's resume law — a field
 * the glass does not know is omitted from argv, never guessed — and whether the
 * revived session then keeps its first life's posture is the question.
 */
const [account, stamp, cwd, resume, summonsFile] = process.argv.slice(2);
if (!account || !stamp || !cwd || !resume || !summonsFile) {
	console.error('usage: bun resume.ts <account> <stamp> <cwd> <session-id> <summons-file>');
	process.exit(2);
}
const body = {
	account, stamp, cwd, model: '', effort: '', color: 'Charcoal',
	summons: await Bun.file(summonsFile).text(), resume,
};
const res = await fetch(`http://127.0.0.1:${process.env.P5_PORT ?? 4400}/hands/fire`, {
	method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body),
});
console.log(res.status, await res.text());
