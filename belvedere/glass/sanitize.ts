/**
 * Summons sanitizing, ported from P2's `lab/p2/sanitize.ts` (itself a minimal port of
 * superset's `sanitizePromptForPty`).
 *
 * The summons never reaches the session as keystrokes — it rides as argv, read back out of a
 * file by `"$(cat …)"` (P2 §S). But the *launch command* is typed into a fresh shell, and the
 * file is read by a shell too, so a stray ESC, a lone CR or a hard tab in the summons is a
 * live keybinding, an early submit, or a completion trigger. Strip them once, at the boundary.
 *
 * P2's `escapeForCmuxSend` did not come with it: the hands never use `cmux send` for text
 * (T2 — it rewrites literal `\n` `\t` `\r`), so the escape has no caller and no reason to exist.
 */

/** Strip PTY-hostile bytes. Keeps newlines; expands tabs to four spaces. */
export function sanitizeSummons(summons: string): string {
	return summons
		.replace(/\r\n?/g, '\n')
		// ANSI CSI sequences, removed whole so no printable payload survives.
		// biome-ignore lint/suspicious/noControlCharactersInRegex: intentional
		.replace(/(?:\x1b\[|\x9b)[0-?]*[ -/]*[@-~]/g, '')
		// OSC sequences. Terminator required: an unterminated OSC must not swallow the rest of
		// the line — its lead byte falls to the strip below.
		// biome-ignore lint/suspicious/noControlCharactersInRegex: intentional
		.replace(/(?:\x1b\]|\x9d)[^\x07\x1b\x9c\n]*(?:\x07|\x1b\\|\x9c)/g, '')
		// biome-ignore lint/suspicious/noControlCharactersInRegex: intentional
		.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]/g, '')
		.replaceAll('\t', '    ');
}
