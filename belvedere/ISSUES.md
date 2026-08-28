# Issues — Belvedere's incident inbox (D53 pattern)

Field reports, render failures (parser-as-lint, [README §1](README.md)), and
sovereign-inbox entries (D63: `- <date> · Felix (via Belvedere) · <what>`) land
here — Felix's hand, a session's at his word, or the glass's third write
([README §2](README.md)). Entry format (D63): `- <YYYY-MM-DD> · <who> · <what>` —
one bullet per entry; an entry needing evidence becomes a `---`-separated block
opening with that line. This building's Architect sweeps at every sitting: each
entry ruled — folded, cut as a row, rejected, or escalated (canon-shaped entries
go to the canon repo's inbox) — then deleted; entries are committed before they
are drained. A swept inbox is empty.

---

- 2026-08-27 · Builder (B15) · **Lane A and lane B are file-disjoint and NOT commit-disjoint: `git add -A belvedere` from the build chain commits the probe lane's uncommitted work-in-progress.** The batch-5 note calls the lanes parallel-safe on `lab/p5|p6/` vs `glass/`, and the files are disjoint — but both lanes land on `master` in **one shared checkout**, so a scoped-by-directory add is not scoped by lane. Measured by doing it: four of B15's five commits (`7ac9186`, `08b4394`, `36b36d8`) each carried live P6 files (`lab/p6/lib.ts`, `q1.ts`, `wire.ts`, `sink.py`, `arm.ts`, `keys.ts`, fixtures) into a B15 commit message while `p6-live-01` was still running. Nothing was lost, reverted or overwritten — the files are on disk and tracked — but the ledger's attribution is wrong and a Builder can silently commit a Digger's half-written probe. History deliberately not rewritten under a live concurrent session. **Fold candidate: the concurrency plan in a two-lane batch note owes a commit rule, not just a file rule** — scoped `git add <path>` per row, or lane B on a worktree.
- 2026-08-27 · Builder (B14) · **A Dispatcher-tended chain has no legal baton holder, and Belvedere's own ledger tail has linted as a dropped baton for three entries running (B13, P5, B14).** `classifyBaton` knows `session | felix | prose`; a lane whose next row is fired by a *Dispatcher* is none of those, so `Next: **B15 — the Workshop** (…), the Dispatcher's to fire` parses as prose and `batonFails` files `ledger.baton`. Writing `fire B15` instead would make it worse, not better: the rail would compose a live Dispatch button for work the batch note says is the Dispatcher's, which is exactly the class D10 exists to prevent. Fold candidate for the canon baton grammar (B3 F4/F5's neighbourhood — the ask for `Baton.kind` is already filed); the glass changed nothing.
