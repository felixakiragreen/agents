// B18 §3 — the color vocabulary, MEASURED (the order: "derived by enumerating what the socket
// accepts … measure once, commit the table with its evidence").
//
// Creates one throwaway workspace, sets every candidate colour on it, records what cmux answers,
// and closes it (D55). Nothing else on the desktop is touched.
//
//   bun belvedere/lab/b18/colors.ts

const q = { CMUX_QUIET: '1' };

async function cmux(...args: string[]): Promise<{ code: number; out: string }> {
	const p = Bun.spawn(['cmux', ...args], { env: { ...process.env, ...q }, stdout: 'pipe', stderr: 'pipe', timeout: 20_000 });
	const [out, err] = await Promise.all([new Response(p.stdout).text(), new Response(p.stderr).text()]);
	return { code: await p.exited, out: (out + err).trim() };
}

const CANDIDATES = [
	// the sixteen `workspace-action --help` prints
	'Red', 'Crimson', 'Orange', 'Amber', 'Olive', 'Green', 'Teal', 'Aqua',
	'Blue', 'Navy', 'Indigo', 'Purple', 'Magenta', 'Rose', 'Brown', 'Charcoal',
	// case
	'red', 'aqua', 'CHARCOAL',
	// the rig's own palette words that are not cmux's (B3 F1)
	'cyan', 'pink', 'grey', 'gray', 'yellow', 'white', 'black',
	// a hex, and two illegals
	'#a5e22c', '#zzzzzz', 'not-a-colour',
];

const created = await cmux('workspace', 'create', '--name', 'b18-colors',
	'--cwd', process.env['HOME'] ?? '/', '--focus', 'false');
const ws = created.out.match(/\b(workspace:\d+)\b/)?.[1];
if (!ws) { console.error('no workspace ref in:', created.out); process.exit(1); }
console.log(`# probe workspace ${ws}`);

const rows: string[] = [];
for (const name of CANDIDATES) {
	const r = await cmux('workspace-action', '--workspace', ws, '--action', 'set-color', '--color', name);
	rows.push(`${name}\t${r.code === 0 ? 'ACCEPTED' : 'REFUSED'}\t${r.out.replace(/\s+/g, ' ')}`);
}

const closed = await cmux('workspace', 'close', ws);
console.log(rows.join('\n'));
console.log(`# closed: ${closed.code === 0 ? 'ok' : 'FAILED'} ${closed.out}`);
