// Refusals are values (directives §3.4). Every parse and precheck in the engine
// returns one instead of throwing; the callers that face a human — `cli.ts`,
// `bless()` — are the only places one becomes an exit code or a log line.

export type Refusal = { refusal: string };

export const refuse = (message: string): Refusal => ({ refusal: message });

export const isRefusal = (v: unknown): v is Refusal =>
	typeof v === "object" && v !== null && typeof (v as Refusal).refusal === "string";
