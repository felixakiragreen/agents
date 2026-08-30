// Deterministic identifiers. Every id the fake emits comes from here, so
// (scenario, seed, argv) fixes every byte of the stream and the transcript.
// Each act draws from its own stream — same seed, different act, no collision.

const BASE62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

export type Ids = {
	uuid(): string;
	toolUse(): string;
	message(): string;
	request(): string;
	taskId(): string;
};

/** mulberry32 — 32 bits of state, no dependencies, identical on every host. */
function random(seed: number): () => number {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** The act's own id stream: the seed folded with the act index. */
export function ids(seed: number, act: number): Ids {
	const rnd = random((seed ^ Math.imul(act + 1, 0x9e3779b9)) >>> 0);
	const hex = (n: number) =>
		Array.from({ length: n }, () => "0123456789abcdef"[Math.floor(rnd() * 16)]!).join("");
	const b62 = (n: number) =>
		Array.from({ length: n }, () => BASE62[Math.floor(rnd() * 62)]!).join("");
	return {
		uuid: () =>
			`${hex(8)}-${hex(4)}-4${hex(3)}-${"89ab"[Math.floor(rnd() * 4)]!}${hex(3)}-${hex(12)}`,
		toolUse: () => `toolu_${b62(24)}`,
		message: () => `msg_${b62(24)}`,
		request: () => `req_${b62(24)}`,
		taskId: () => hex(17),
	};
}
