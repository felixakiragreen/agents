// The seeded randomness, and the one property the whole barrage rests on:
// **a red reproduces from its seed alone.**
//
// Every draw comes from a *named* stream, not from one sequential generator.
// A single sequence would make every draw depend on every draw before it, so
// adding one call anywhere would silently re-shuffle every topology and every
// ruling — and a seed in a red file would stop meaning what it meant. Naming
// the stream makes each draw a pure function of (seed, name, position).

export type Rng = {
	next(): number;
	/** Inclusive both ends. */
	int(lo: number, hi: number): number;
	pick<T>(xs: readonly T[]): T;
	/** One of `xs`, in proportion to `weight(x)`. */
	weighted<T>(xs: readonly T[], weight: (x: T) => number): T;
	chance(p: number): boolean;
};

/** FNV-1a over the stream's name, folded with the seed. */
export function hash(seed: number, name: string): number {
	let h = (0x811c9dc5 ^ (seed >>> 0)) >>> 0;
	for (let i = 0; i < name.length; i++) {
		h = (h ^ name.charCodeAt(i)) >>> 0;
		h = Math.imul(h, 0x01000193) >>> 0;
	}
	return h >>> 0;
}

/** mulberry32: small, fast, and the same numbers on every machine — which is
 *  the only property that matters here. */
export function stream(seed: number, name: string): Rng {
	let a = hash(seed, name);
	const next = (): number => {
		a = (a + 0x6d2b79f5) | 0;
		let t = Math.imul(a ^ (a >>> 15), 1 | a);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};

	const rng: Rng = {
		next,
		int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)),
		pick: <T,>(xs: readonly T[]): T => {
			if (xs.length === 0) throw new Error("pick from an empty list — the caller has a bug, not bad luck");
			return xs[Math.min(xs.length - 1, Math.floor(next() * xs.length))]!;
		},
		weighted: <T,>(xs: readonly T[], weight: (x: T) => number): T => {
			const total = xs.reduce((sum, x) => sum + weight(x), 0);
			if (total <= 0) return rng.pick(xs);
			let t = next() * total;
			for (const x of xs) { t -= weight(x); if (t <= 0) return x; }
			return xs.at(-1)!;
		},
		chance: (p) => next() < p,
	};
	return rng;
}
