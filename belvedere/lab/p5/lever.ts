/**
 * P5 Q3 — the lever arm: `glass/hands.ts`'s own fire recipe plus one argv token.
 *
 *   bun lever.ts <account> <stamp> <model> <effort> <cwd> <summons-file> [permission-mode]
 *
 * Disposable by design. It exists only because `/hands/fire` cannot yet express a
 * permission mode — that is the very gap this probe measures. The launch line is
 * `launchCommand()`'s, token for token, with `--permission-mode` inserted after
 * `--effort`; omit the last argument and it IS the hands' line, which is how the
 * control arm runs on the same instrument as the treatment.
 *
 * No credential is read: the cmux socket admits any local process of Felix's
 * (B4 E1 / D9), so the CLI resolves the password from cmux Settings itself.
 */

const [account, stamp, model, effort, cwd, summonsFile, mode] = process.argv.slice(2);
if (!account || !stamp || !model || !effort || !cwd || !summonsFile) {
	console.error('usage: bun lever.ts <account> <stamp> <model> <effort> <cwd> <summons-file> [permission-mode]');
	process.exit(2);
}

const CONFIG: Record<string, string> = {
	personal: `${process.env.HOME}/.claude`,
	'thg-fgreen': `${process.env.HOME}/.claude-thg-fgreen`,
	'thg-doorbell': `${process.env.HOME}/.claude-thg-doorbell`,
};
const configDir = CONFIG[account];
if (!configDir) { console.error(`unknown account ${account}`); process.exit(2); }

const q = (s: string) => `'${s.replaceAll("'", `'\\''`)}'`;
const summonsPath = `${import.meta.dir}/summons/${stamp}.summons.txt`;
await Bun.write(summonsPath, await Bun.file(summonsFile).text());

const flags = ['--model', model, '--effort', effort];
if (mode) flags.push('--permission-mode', mode);
flags.push('-n', stamp);
const command = `cd ${q(cwd)} && CLAUDE_CONFIG_DIR=${q(configDir)} claude ${flags.map(q).join(' ')} "$(cat ${q(summonsPath)})"`;

console.log(command);
const p = Bun.spawnSync(['cmux', 'workspace', 'create', '--name', stamp, '--cwd', cwd, '--focus', 'false', '--command', command]);
console.log(p.exitCode, p.stdout.toString().trim(), p.stderr.toString().trim());
