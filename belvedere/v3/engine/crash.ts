// The crash seam. The engine must survive its own death at any instant, and a
// drill that kills it "somewhere around there" proves nothing — so the cut
// points are named, and a run only cuts when the environment names one.
//
//   V3_ENGINE_CRASH_AT=<point> bun cli.ts run <flow>
//
// SIGKILL to self: no unwinding, no flush, no atexit — the log on disk is
// exactly what had been appended, which is the whole question being asked.
// C7's crash injection drives the same seam.

export const CRASH_AT = "V3_ENGINE_CRASH_AT";

export function crashPoint(name: string): void {
	if (process.env[CRASH_AT] !== name) return;
	process.kill(process.pid, "SIGKILL");
}
