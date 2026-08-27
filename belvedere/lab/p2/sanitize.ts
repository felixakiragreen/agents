/**
 * Prompt sanitizing for the cmux spawn path.
 *
 * Ported minimally from superset `packages/shared/src/agent-prompt-launch.ts`
 * (`sanitizePromptForPty`), read-only per the P2 brief — plus one step that
 * superset does not need.
 *
 * Superset writes launch commands into a PTY as if typed, so prompt bytes hit
 * the line editor as keystrokes: ESC/C1 sequences fire keybindings, a lone CR
 * submits early, a tab triggers completion.  Belvedere's transport is the cmux
 * socket, which adds a hazard of its own: `cmux send` expands the two-character
 * sequences \n \t \r into real control characters (P2 finding T2), so a summons
 * quoting a regex or a JSON string is silently rewritten.  `escapeForCmuxSend`
 * is the guard; `cmux set-buffer` + `paste-buffer` does not need it (T3).
 */

/** Strip PTY-hostile bytes. Keeps newlines; expands tabs to four spaces. */
export function sanitizePromptForPty(prompt: string): string {
	return (
		prompt
			.replace(/\r\n?/g, "\n")
			// ANSI CSI sequences, removed whole so no printable payload survives.
			// biome-ignore lint/suspicious/noControlCharactersInRegex: intentional
			.replace(/(?:\x1b\[|\x9b)[0-?]*[ -/]*[@-~]/g, "")
			// OSC sequences. Terminator required: an unterminated OSC must not
			// swallow the rest of the line — its lead byte falls to the strip below.
			// biome-ignore lint/suspicious/noControlCharactersInRegex: intentional
			.replace(/(?:\x1b\]|\x9d)[^\x07\x1b\x9c\n]*(?:\x07|\x1b\\|\x9c)/g, "")
			// biome-ignore lint/suspicious/noControlCharactersInRegex: intentional
			.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f\x7f-\x9f]/g, "")
			.replaceAll("\t", "    ")
	);
}

/**
 * Escape backslashes so `cmux send` delivers the text literally.
 * Only needed for the `send` verb — see the module note.
 */
export function escapeForCmuxSend(text: string): string {
	return text.replaceAll("\\", "\\\\");
}
