// Refusals are values (directives §3.4). Every parse and guard in the fake
// returns one instead of throwing; `cli.ts` is the single boundary that prints
// it and dies.

export type Refusal = { refusal: string };

export const refuse = (message: string): Refusal => ({ refusal: message });

export const isRefusal = (v: unknown): v is Refusal =>
	typeof v === "object" && v !== null && typeof (v as Refusal).refusal === "string";
