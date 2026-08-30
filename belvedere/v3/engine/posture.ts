// The posture law, per (model, posture) — grammar §4's measured matrix, not a
// per-model rule (C4 F6.3 killed that). Two gates, both loud:
//
//   at bless   — a pair the substrate cannot grant is refused before anything
//                ignites, never silently downgraded;
//   at ignite  — `system/init.permissionMode` is read back and compared with
//                what was asked, because posture asked is not posture granted
//                and the difference is silent (C4 F6.2).

import { refuse, type Refusal } from "./refusal.ts";
import type { Posture } from "./flow.ts";

/** haiku holds acceptEdits and bypassPermissions and does the work; asked for
 *  `auto` it is granted `default` and writes nothing (grammar §4, haiku rows). */
const isHaiku = (model: string): boolean => /haiku/i.test(model);

export function postureLegal(model: string, posture: Posture): true | Refusal {
	if (isHaiku(model) && posture === "auto")
		return refuse(`(${model}, auto) is refused: haiku is granted \`default\` for \`auto\` and does no work (grammar §4)`);
	return true;
}

/** What `init.permissionMode` must say for the ask to have been honoured. */
export const postureGranted = (asked: Posture, granted: string | null): boolean => granted === asked;
