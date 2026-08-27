/**
 * P5 Q2 — the unattended-work summons.
 *
 *   bun work-summons.ts <tag> <repo> <dir> > <tag>.summons.txt
 *
 * Eleven declared tool calls: three Writes, one Read, one Edit, six Bash — one of
 * them a real `git commit`. Nothing here asks a question, so any pause the probe
 * takes is the harness's, not the instruction's.
 */

const [tag, repo, dir] = process.argv.slice(2);
if (!tag || !repo || !dir) {
	console.error('usage: bun work-summons.ts <tag> <repo> <dir>');
	process.exit(2);
}

process.stdout.write(`You are a P5 work probe. Do the eleven steps below in order, exactly as written.
Touch nothing outside ${dir}. Ask no questions. Do not stop early.

1.  Bash: mkdir -p ${dir}
2.  Write ${dir}/one.txt containing the single line: one
3.  Write ${dir}/two.txt containing the single line: two
4.  Write ${dir}/three.txt containing the single line: three
5.  Read ${dir}/one.txt
6.  Edit ${dir}/one.txt, replacing one with one-edited
7.  Bash: ls -1 ${dir}
8.  Bash: git -C ${repo} add ${dir}
9.  Bash: git -C ${repo} commit -q -m "p5: ${tag} unattended work probe" -- ${dir}
10. Bash: git -C ${repo} log -1 --format=%H -- ${dir}
11. Bash: echo P5-WORK-DONE-${tag}

Report step 10's sha and step 11's output on one line each, then stop.
`);
