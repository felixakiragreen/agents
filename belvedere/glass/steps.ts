/**
 * The engine's steps, addressed by **session id** — the Chat's second door (C16).
 *
 * B16's Chat found a target two ways: the census (anything it has heard beat) and the three
 * accounts' transcript trees (everything older than the sensor's horizon). Neither knows a
 * **layer-0** run: a fake subject's config dir is the run's own sandbox, so its transcript sits
 * under the run dir and no account tree carries it. And neither knows that a session it *can* find
 * belongs to a step the engine is holding — which is the difference between a reply that travels a
 * cmux pane and a reply that travels the engine's own resume.
 *
 * So this module answers one question: **given a session id, which run's step is it, and can that
 * step be driven?** Everything it answers with is read through the engine's own exports —
 * `findRunDirs`/`readRun` find and open a run, the fold derives the state, `drivable` says whether
 * the account holding these sessions is knowable, `transcriptPath` names the file (D65's
 * one-parser law, the shape `works.ts` already keeps). Nothing here writes, fires or drives.
 */

import { statSync } from 'fs';
import type { Building } from '../../doctrine';
import { drivable, findRunDirs, readRun, type RunHandle } from '../v3/console/runs.ts';
import { summoned } from '../v3/console/summon.ts';
import { isRefusal } from '../v3/engine/refusal.ts';
import { transcriptPath } from '../v3/engine/transcript.ts';
import type { ChatStep } from './deck-model';
import { short } from './html';
import { buildingOf } from './pages';
import { runsRoot } from './paths';

/**
 * Everything has a limit (directive 3.1). The telemetry tree held 65 run dirs and 1 703 steps the
 * day this landed, and this read sits on the same three-second poll the Works does — so the walk is
 * whole (one `statSync` per dir) and the **read** is the newest few. The number is `works.ts`'s own
 * on purpose: a run the Works draws is a run the Chat can open, and two different bounds over one
 * tree would be two different answers to "which runs does this deck know".
 */
export const LIMITS = { read: 12 } as const;

/** One located step: the run it belongs to, the venue holding its session, and its transcript. */
export type Located = ChatStep & {
	dir: string;
	configDir: string;
	workDir: string;
	transcript: string;
	sessionId: string;
};

const touched = (dir: string): number => {
	try { return statSync(`${dir}/run.jsonl`).mtimeMs; } catch { return 0; }
};

/** The newest run dirs, newest first — the console's own walk (dotted names included, C12 F1). */
export const recentRuns = (root: string = runsRoot(), limit: number = LIMITS.read): string[] =>
	findRunDirs(root).sort((a, b) => touched(b) - touched(a)).slice(0, limit);

/**
 * Every step of the runs this deck reads, keyed by the session id it ignited.
 *
 * A step appears once it has ever ignited: `pending` steps never had a session and a card never
 * will. A log that will not read is skipped in silence **here** and reported by the Works, which is
 * the surface parser-as-lint already gave it (README §1) — one refusal, drawn once.
 */
export function stepIndex(buildings: readonly Building[] = [], root: string = runsRoot()): Map<string, Located> {
	const found = new Map<string, Located>();
	for (const dir of recentRuns(root)) {
		let handle;
		try { handle = readRun(dir, root); }
		catch { continue; }
		if (isRefusal(handle)) continue;
		for (const step of stepsOf(handle, buildings)) found.set(step.sessionId, step);
	}
	return found;
}

/**
 * The session each step was fired on, off the log's own ignitions — **not** off the fold's state.
 *
 * A landed step's state has forgotten its session and the log has not (C8 F8, and the console's
 * `list` reads it the same way). Taking the state's word would mean the Chat losing a conversation
 * the moment the reply it just delivered landed the step, which is the one moment Felix wants to
 * read it.
 */
function sessionsIn(handle: RunHandle): Map<string, string> {
	const found = new Map<string, string>();
	for (const e of handle.entries)
		if (e.kind === 'ignited' || e.kind === 'resumed') found.set(e.step, e.sessionId);
	return found;
}

function stepsOf(handle: RunHandle, buildings: readonly Building[]): Located[] {
	const open = summoned(handle.dir);
	const drives = drivable(handle);
	const last = handle.entries.at(-1) ?? null;
	const sessions = sessionsIn(handle);
	const out: Located[] = [];
	for (const [id, at] of Object.entries(handle.state.steps)) {
		const sessionId = sessions.get(id) ?? null;
		if (sessionId === null) continue;
		out.push({
			run: handle.name,
			step: id,
			at: at.at,
			causes: at.at === 'paused' ? [...at.causes] : [],
			why: at.at === 'paused' ? at.detail : '',
			account: handle.account,
			venueFrom: handle.venueFrom,
			building: buildingOf(handle.venue.workDir, [...buildings])?.building ?? null,
			// A layer-0 run's config dir is the sandbox the run made and owns — which is exactly what a
			// null account says (C14's shape), so there is no second reading of "fake" to get wrong.
			fake: handle.account === null,
			refusal: isRefusal(drives) ? drives.refusal : null,
			summoned: open.has(id),
			logAt: last === null ? null : Date.parse(last.at) / 1000,
			where: `${short(handle.dir)} · ${id}`,
			dir: handle.dir,
			sessionId,
			configDir: handle.venue.configDir,
			workDir: handle.venue.workDir,
			transcript: transcriptPath(handle.venue.configDir, handle.venue.workDir, sessionId),
		});
	}
	return out;
}

/** The paused steps of the runs this deck reads — what the needs-you queue lists (C16 §3). */
export const pausedSteps = (buildings: readonly Building[] = [], root: string = runsRoot()): Located[] =>
	[...stepIndex(buildings, root).values()].filter(s => s.at === 'paused');
