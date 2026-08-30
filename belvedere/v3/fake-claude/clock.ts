// The virtual clock. Time in the fake is declared, never observed: acts start at
// a fixed epoch and advance by fixed per-step spans, so two runs of the same
// scenario stamp identical timestamps. A `delay` step is the one act that also
// costs real wall time (kill-window scenarios need a window to be killed in).

/** 2026-01-01T00:00:00.000Z — arbitrary, fixed, and obviously not "now". */
export const EPOCH_MS = Date.parse("2026-01-01T00:00:00.000Z");

/** Each act starts one hour after the last, so turn order reads off a timestamp. */
export const ACT_SPAN_MS = 3_600_000;

/** What each emission costs the virtual clock. */
export const SPAN = {
	hook: 5,
	init: 50,
	thinking: 300,
	text: 900,
	toolUse: 400,
	toolResult: 600,
	deny: 300,
	result: 100,
} as const;

export type Clock = {
	stamp(): string;
	advance(ms: number): void;
	sinceActStart(): number;
};

export function clock(act: number): Clock {
	const start = EPOCH_MS + act * ACT_SPAN_MS;
	let ms = start;
	return {
		stamp: () => new Date(ms).toISOString(),
		advance: (d) => { ms += d; },
		sinceActStart: () => ms - start,
	};
}
