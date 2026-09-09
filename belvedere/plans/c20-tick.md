# C20 — the tick

**Status:** **LANDED** 2026-08-30 · **Depends on:** — · **Staffing:** Builder · opus-high · **Blessed:** ✓ Felix 2026-08-30 (the rework blessing)

## Mission

Close C16 F2's window at the contract. Belvedere IS the engine for the turn it resumes: delivered is the transcript, landed is the run log, and a Belvedere killed between them leaves a step `running` until something opens that run. Today the healer is a hand tool (`lab/c16/settle.ts`). The contract choice is ruled at G5 and **blessed (D23, ✓ Felix 2026-08-30)**: **a `tick` verb on the console, never a supervising process** — citation: the glass-shatters test (README §1, D3's standing bar — a supervisor is one more component whose death strands the same steps one level up; a verb heals from the log alone) and C6 F2's ruled redundancy (`adopt()` already re-derives the turn from the stream file; the verb is that mechanism given a name and a door).

## Inputs — read before working

- C16 F2 (the window, measured the hard way — the instrument's first pass tore Belvedere down 400 ms after the receipt) and `lab/c16/settle.ts` (the proof that one tick heals: `running -> landed done`).
- `v3/engine` — `adopt()` (C6 F2), the run-log law (the log is the register of record); `barrage/sweep.ts` (C14 F5 — pid-liveness guarded by `ps`, and the crash drill's orphans are sacred: never sweep or tick what a drill is about to adopt).
- C16's engine road in `glass/chat.ts` (`mode: 'engine'`) — the one Belvedere surface that drives the engine today; it already waits on the log.

## Spec

1. **The verb.** `console` gains `tick <run>`: `load()`, then for every step `running` whose subject is dead (pid-liveness per `sweep.ts`'s guard), adopt from the stream file and append what the dead process would have — the engine's own mechanism, no new landing logic. Idempotent: a healthy or settled run moves nothing and says so. Exit names what moved.
2. **Ownership stays written.** The road's contract line (any surface that drives the engine owns the turn it resumes) goes into `v3/README.md`'s contract section verbatim, with the tick named as the healer.
3. **The hand tool retires.** `lab/c16/settle.ts` dies; anything it proved moves to the console suite as a real test: the window reproduced on the fake (subject `result` on disk, log `running`, process gone), one tick, `landed done`.
4. **The drills stay sacred.** The tick never runs inside the barrage or the crash drill (C14 F5's exemption is the precedent and the header to copy); nothing in this charge touches `barrage/**` behavior.

## Done when:

- [x] **The window, reproduced and healed at budget 0.** Not simulated — the engine is driven in a subprocess and cut down at its own named crash point (`before-settle:plan`, the seam the barrage's 50 cuts ride), which is exactly where a killed Belvedere dies: the subject's `result` row on disk, the log still `running`, the process that would have appended `landed` gone. Then one `tick`, through the console's own argv. The arc by hand, verbatim:

  ```
  $ V3_ENGINE_CRASH_AT=before-settle:plan bun engine/cli.ts run …/flow.json --bless --run …/console/run
  engine exit 137 (137 = SIGKILL to self, the crash seam)

  $ bun console/cli.ts list --root <root>
  console/run/plan  running  DEAD 2942  sonnet·auto  -  9606a029-d22e-46d0-a2ec-365451740bf9
  console/run/ask   pending  -          -            -  -

  $ bun console/cli.ts tick console/run --root <root>
  console/run/plan  running  ->  landed done
  1 step healed  ·  turns 1/6
  exit 0

  $ bun console/cli.ts tick console/run --root <root>   # again
  console/run  nothing to heal
  0 steps healed  ·  turns 1/6
  exit 0

  $ bun console/cli.ts list --root <root>
  console/run/plan  landed done  -  sonnet·auto  -  9606a029-d22e-46d0-a2ec-365451740bf9
  console/run/ask   pending      -  -            -  -
  ```

  The whole arc is a committed console test — [`v3/console/test/tick.test.ts`](../v3/console/test/tick.test.ts), commit `0c458d4` — which additionally asserts the pid dead, the `"type":"result"` row on disk, and that the landing ignited nothing: `ask` was unblocked by it and is still `pending` on the turns the crashed run had already spent.

- [x] **Idempotence, both controls, log byte-identical.** `readFileSync(log, "utf8")` before and after, asserted equal in both: `tick — a settled run moves zero bytes and says so` (says `nothing to heal`) and `tick — a live subject is not the tick's to adopt: zero bytes, and it names whose it is` (says `solo pid <n> still live, and the engine that spawned them owns their turns`, and the orphan is still alive afterwards — the drill exemption, executable). Both green:

  ```
  $ cd belvedere/v3/console && bun test
   30 pass
   0 fail
   158 expect() calls
  Ran 30 tests across 3 files. [1.64s]
  ```

- [x] **`lab/c16/settle.ts` gone; zero live references.** Deleted at `f2f48d2`.

  ```
  $ grep -rn "settle\.ts" v3/ glass/ camera/ lab/*.ts lab/c16/*.ts
  v3/console/test/tick.test.ts:10:// This file is what `lab/c16/settle.ts` was. The hand tool proved one transition
  ```

  That one hit is the successor's own lineage note, past tense. Every other hit in the subproject is prose or history that does not move — `README.md` (the C20 row), `LEDGER.md`, `plans/BULLETIN.md`, `plans/c16-chat-chapter.md`, this charge, and `lab/c16/rich.jsonl`, a committed real transcript whose *content* names it. Nothing executable imports or invokes it.

- [x] **`v3/README.md` carries the ownership contract + the tick as healer** — the fence's new bullet, `0ef7f32`: *"a surface that drives the engine owns the turn it resumes (C16 F2) … the healer for a step a dead driver left `running` is the console's **`tick` verb, never a supervising process**"*, with the glass-shatters citation, `adopt()`, the zero-bytes rule and the drill exemption. [`v3/console/README.md`](../v3/console/README.md) gains §The tick.

- [x] **`bun v3/gates.ts` ALL GREEN — 10 gates, wall 211.2s, exit 0.**
- [x] **`--glass` ALL GREEN**, twice over: on the live `master` checkout, and in a clean detached checkout of this charge's own HEAD (`f2f48d2`). Both are pasted under [the proving run](#the-proving-run), and the second one exists because the first attempt caught a **neighbour's half-written file** — see F7, which is a fact about parallel batches and not about this charge.
- [x] **Budget 0 real turns.** Zero real `claude` invocations: every subject in this charge is a fake, and the one orphan the live control makes on purpose is a `hang` fake, swept in `afterAll` (`ps -axo pid=,command= | grep fake-claude/cli.ts` → empty).

## The proving run

`bun v3/gates.ts`, on `master` at this charge's own HEAD (`f2f48d2`):

```
| gate | result | counts | wall | exit |
|---|---|---|---|---|
| engine · suite | PASS | 80 pass · 0 fail | 24.7s | 0 |
| barrage · suite | PASS | 41 pass · 0 fail | 24.0s | 0 |
| fake-claude · suite | PASS | 60 pass · 0 fail | 10.3s | 0 |
| console · suite | PASS | 30 pass · 0 fail | 1.6s | 0 |
| engine · types | PASS | 0 errors | 0.2s | 0 |
| barrage · types | PASS | 0 errors | 0.1s | 0 |
| fake-claude · types | PASS | 0 errors | 0.1s | 0 |
| console · types | PASS | 0 errors | 0.1s | 0 |
| gates · types | PASS | 0 errors | 0.1s | 0 |
| barrage | PASS | 1000 runs · 50 cuts · 9/9 mutants | 150.0s | 0 |

ALL GREEN — 10 gates, wall 211.2s
```

`bun v3/gates.ts --glass`, on the live `master` checkout (three lanes' work in the tree; the deck's own suite has grown 583 → 604 under B22 and B23):

```
| gate | result | counts | wall | exit |
|---|---|---|---|---|
| engine · suite | PASS | 80 pass · 0 fail | 24.4s | 0 |
| barrage · suite | PASS | 41 pass · 0 fail | 23.6s | 0 |
| fake-claude · suite | PASS | 60 pass · 0 fail | 10.3s | 0 |
| console · suite | PASS | 30 pass · 0 fail | 1.7s | 0 |
| engine · types | PASS | 0 errors | 0.1s | 0 |
| barrage · types | PASS | 0 errors | 0.1s | 0 |
| fake-claude · types | PASS | 0 errors | 0.1s | 0 |
| console · types | PASS | 0 errors | 0.1s | 0 |
| gates · types | PASS | 0 errors | 0.1s | 0 |
| glass · suite | PASS | 604 pass · 0 fail | 2.3s | 0 |
| glass · types | PASS | 0 errors | 0.2s | 0 |
| barrage | PASS | 1000 runs · 50 cuts · 9/9 mutants | 149.2s | 0 |

ALL GREEN — 12 gates, wall 212.0s
```

And `bun v3/gates.ts --glass` in a **clean checkout of `f2f48d2`** (a detached worktree under `$TMPDIR` with `glass/node_modules` symlinked) — run to attribute the transient red F7 describes, and kept because it is the only measurement of this charge's bytes alone:

```
| glass · suite | PASS | 583 pass · 0 fail | 2.3s | 0 |
| glass · types | PASS | 0 errors | 0.2s | 0 |
| console · suite | PASS | 30 pass · 0 fail | 1.6s | 0 |
| barrage | PASS | 1000 runs · 50 cuts · 9/9 mutants | 149.9s | 0 |
| engine · suite | RED | 76 pass · 1 fail | 24.6s | 1 |

RED: engine · suite — 12 gates, wall 213.6s
```

The one red is the worktree itself, and it is F6: `engine/test/venue.test.ts` asserts the checkout's own path.

```
104 | test("measured, not assumed: the personal account trusts this repo (C8 F2)", () => {
105 | 	const repo = new URL("../../../..", import.meta.url).pathname.replace(/\/$/, "");
106 | 	expect(repo.endsWith("/code/agents")).toBe(true);
error: expect(received).toBe(expected)   Expected: true   Received: false
```

Same 77 tests, same file, and it is green in the live checkout above (`engine · suite | PASS | 80 pass · 0 fail`, B22's three new venue tests included). What this run proves is what it was run for: **the deck's suite and type gate are green on this charge's bytes.**

## Out of scope

- Any supervising/daemon process (refused by the ruling above); Belvedere-side auto-tick (Belvedere stays read-only off the log — C15's law; the engine road's own turn is the one exception, already landed); the venue canonicalization (C16 F1 — on the v3 deferred list with its trigger).

## Findings

**F1 — the healer could not be the engine's `tick()`, and the live control is the measurement that says so. The engine gained `heal()`.**

`settle.ts` reached `adopt()` through `run.tick()`, and the spec's "the engine's own mechanism" reads as that call. It cannot be: `tick()` does two things a healer must never do.

1. **It ignites.** `tick()`'s last loop fires every ready step, and every one of those is a subject turn. In the very case this charge exists for, the heal *creates* the ready step — the landing it appends is what unblocks the next one — so a healer built on `tick()` spends turns nobody asked for. That is the supervising process D23 refused, arriving through the verb's back door.
2. **It adopts live subjects.** `inFlight` is empty in a freshly `load()`ed run, so `tick()` adopts *every* running step, live pid included, and then waits on it — up to the step's full `timeout_ms`. A console verb that watches somebody else's subject to its death and settles it **is** the supervisor.

Measured, not argued. With `await run.tick()` in the verb's place (the only line changed), the live-subject control does not merely fail — it hangs:

```
$ perl -pi -e 's/await run\.heal\(\)/await run.tick()/' cli.ts && bun test test/tick.test.ts
(fail) tick — a live subject is not the tick's to adopt: zero bytes, and it names whose it is [5002.06ms]
  ^ this test timed out after 5000ms.
 3 pass
 1 fail
```

So `v3/engine/engine.ts` gained `heal()` (`e59b3f5`): `tick()` with the fire loop removed and `!alive(at.pid)` added, resolving `unresolved()` turns and adopting dead ones and nothing else. **No new landing logic exists anywhere** — every transition it appends is `adopt()`'s and `resolve()`'s, the same bytes a restarted engine writes. `adopt()` now returns the promise it already stored so `heal()` can await exactly what it started; `tick()`'s behavior is byte-for-byte what it was (engine suite green, barrage 1000/50/9-9 green). This is engine-side work, which the charge's kill criterion sanctions as *exposing the existing mechanism through a verb*; it is named here because the batch note's lane list did not.

**The trap inside the trap, for whoever reads `tick()` next:** the *first* test — the window itself — passes under bare `tick()` too, and it looks like proof that `tick()` does not ignite. It is not. `tick()`'s fire loop reads a `now` that the adopt loop left **stale**, so the step the heal just unblocked is not yet ready *in that fold*. Non-ignition by an accident of statement order in another module is not a property to hang a budget on, and `heal()` makes it structural.

**F2 — pid liveness answers the healer's question in the safe direction only.** The tick asks `alive(pid)` — `kill(pid, 0)`, the same question `adopt()` asks. `barrage/sweep.ts` guards the same read with a `ps` command-line match because it **kills**, and a pid the kernel has recycled is somebody's editor. The tick signals nothing and kills nothing, so the recycled-pid hazard has exactly one direction here: a reused pid reads **live**, the tick says `nothing to heal`, and zero bytes move. It declines on a doubt; it never acts on one. The price is that a step whose subject's pid was reused stays stranded until that pid dies — which is the right price for never adopting another process's turn, and it is why no `ps` guard was copied in.

**F3 — the drills needed no exemption code, and that is the same rule as the idempotence.** C14 F5's sweep needed an explicit carve-out (the crash drill's orphans must live between the cut and the restart, and the sweep kills). The tick needs none: a live pid is never adopted, so a hand that runs it mid-drill moves nothing and signals nothing. It is asserted, not asserted-about — the live control ends with `expect(alive(pid)).toBe(true)` after the tick. Nothing in `barrage/**` was touched and nothing there calls it — `grep -rn "tick\|heal(" barrage/` returns exactly one line, `barrage/README.md:60` describing the harness's own `run()` ("blesses, ticks to terminal"), and zero code.

**F4 — a healed run with a ready step behind it has no driver, and the console has none to offer.** After the tick, `plan` is `landed` and `ask` is ready — and nothing ignites it. `tick` never will; the five driving verbs all address a **paused** step. For the case this charge exists for that is correct and complete: Belvedere drives the one turn it owns, and the run's own engine drives the rest. But a run whose driver died for good is now healed and stopped, and the only thing that moves it is `bun engine/cli.ts run` or a hand. **Not built** — this charge names no driving verb, and a `tick --run` would be the ignition the ruling took off the table. Filed for the tender: if a stopped-but-healed run recurs in the wild, the honest fix is a console verb whose name says it spends money.

**F7 — a parallel lane's gate run can read a neighbour's file mid-save, and the red looks exactly like a real one.** This charge's first `--glass` run came back `glass · suite 583 pass · 4 fail` and `glass · types 1 error`, all four pointing at `attention.ts:273` — `ReferenceError: buildingOf is not defined` / `TS2552`. The file was **clean against HEAD** at that instant, which is what made it look committed. It was not: B22's `7fc8551` renames that call to `homeOf` in both call sites *and* the import, and the run had read the file between the two saves. Ten minutes later the same tree is `604 pass · 0 fail`, types 0.

Two things follow, and B23's own relay names the first: **file-disjoint is not gate-disjoint** — `bun test` and `tsc --noEmit` are whole-tree, so any lane's half-written module is red in every lane's evidence. The second is the trap this charge fell into: **`git status` is not proof of authorship**. A file mid-save is clean against HEAD for the seconds between the editor's write and the next one, so "the file is unmodified, therefore the red is committed" is false, and it very nearly went into this document as an accusation. The check that actually settles it is a **detached checkout of a commit** — `git worktree add --detach <path> <sha>` — where nobody else is typing. That cost one worktree and one gate run, and it is the cheap habit for any charge landing in a parallel batch.

**F6 — one v3 engine test pins the checkout's own path, so the v3 suite cannot be run green from a worktree.** `engine/test/venue.test.ts:106` asserts `repo.endsWith("/code/agents")` on a path derived from `import.meta.url`. In the live checkout that is true; in any worktree — `.claude/worktrees/**` included, which DOCTRINE §10 makes the normal venue for a build charge — it is false, and the whole `engine · suite` gate goes red for a reason that has nothing to do with the charge under test. It cost this charge one run to attribute. The assertion's intent (the account trusts *this* repo) is worth keeping; the read that serves it is `git rev-parse --path-format=absolute --git-common-dir`, which is what `glass/trust.ts` already does and is exactly why a linked worktree inherits trust (B7 F1). **Filed, not fixed** — `engine/test/**` is outside this lane, and the next charge that rides a worktree will hit it on its first gate run.

**F5 — the console's `tick` and the engine's `tick()` are two different things wearing one word.** The blessed name for the verb is `tick` (D23); the engine's `tick()` is one step of the state machine, which ignites. They are not the same concept, so the engine's method is `heal()` and the standard holds at the seam that matters — the docs say "the healer" and never "a tick" for the engine call. Anyone reading `console tick` as "one engine tick" will over-estimate what it does, which is the safe direction of that misreading but worth the two words of prose it now carries in `console/README.md` §The tick.

## Kill criteria

None — the mechanism exists (`adopt()`, `settle.ts` proved it). If adoption turns out to need engine-side surgery beyond exposing the existing mechanism through a verb, stop and escalate with the measured gap.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§5–6 (agreements; the migration
campaign note), ~/code/agents/belvedere/v3/README.md (the fence), and
~/code/agents/belvedere/plans/c16-chat-chapter.md (findings — F2 is the
charge's whole reason),
and execute the charge at ~/code/agents/belvedere/plans/c20-tick.md.
```
