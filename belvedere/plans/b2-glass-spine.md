# B2 — the glass spine

**Status:** **LANDED** 2026-08-26 (branch `bv/b2-glass`) — every DoD item measured and pasted below. **One spec escalation stands (E1: the City View costs 9 s per request under "zero caches") — the Architect's ruling at G1.** · **Depends on:** — · **Staffing:** Builder · opus-high · **Parallel-safe with:** B1 (disjoint dirs; worktree `bv/b2-glass`) **Spec blessed:** 2026-08-26, Architect (fold sitting), on P1–P4; taste gate is Felix's visual pass at G1.

## Goal

The room exists: one bun server rendering the City View and building pages from the truth layer — read-everything, write-NOTHING (this row wields none of the fence's four write powers; the hands are B4).

## Spec

1. **`belvedere/glass/`** — `Bun.serve`, server-rendered HTML, **no framework, no build step** (my_checklist-simple; the Simplicity directives are the law here). Bind `127.0.0.1:4400` explicitly (D3). Zero caches: re-read disk per request.

   > **G1 ruling, 2026-08-26 (Architect — E1):** "zero caches" is scoped to **CONTENT** — no parsed byte renders unless read this request. The **REGISTER** (building paths + mtimes) may stay warm ≤ 30 s, its age printed in the footer where the walk time prints today. Builder option 1 accepted as recommended; option 2 filed canon-side (the walk is `doctrine/`'s); option 3 rejected — the rail makes `/` the lived-in page. Implementation rides B3, which owns the home page.
2. **Data, three sources, read-only:**
   - Buildings: canon [`doctrine/`](../../doctrine/) `parse()` per building — the one parser in the city (D65), imported, never forked. Register = its discovery, which reaches `.claude/worktrees/` (P3).
   - Liveness: tail `summon/log/census/census.jsonl`, group by `sid`, latest-event state machine — `UserPromptSubmit`/`PreToolUse`/`PostToolUse` → working · `Stop` → idle · `Notification(permission_prompt)` → needs-input · `SessionEnd` → gone — then **the F5 law: `kill -0 pid` before rendering any live state; pid dead → gone; census stale/absent → unknown, never working.**
   - Identity: name-stamp from the rig's `invocations.jsonl` (join on session where derivable) or the census `cwd`; mantle color from `summon/presets.tsv`.
3. **Pages:**
   - `/` **City View** — one card per building: name, live-session count, lit windows (one dot per live session, mantle-colored, ring by state), board pulse (OPEN/IN FLIGHT/BLOCKED counts from `parse()`). Unknown-state sessions render as unknown — honesty over optimism.
   - `/b/<building>` **building page** — panels per DOCTRINE §2: the board table (statuses colored, work-doc links resolving — D58), ledger tail (rendered, its baton visible), decision queue (`pending Felix countersign`), ISSUES, live sessions (stamp · state · account · cwd).
4. **Theme:** copy `~/code/felix/src/felikai.css` → `belvedere/glass/felikai.css` (source path in a header comment) and build on its tokens. Exemplars for feel: the SpaceX dashboard (`cap-mega/felix/spacex-dashboard-c2`) and bob's design routes (README §3). Function first — polish iterates at Felix's G1 pass.
5. **Liveness state machine is a pure function** with a table-driven `bun test`.

## Acceptance criteria / DoD — evidence pasted here at build time

Venue: this worktree, branch `bv/b2-glass`. macOS 15.7.3, bun 1.3.10, 22 buildings discovered under `~/code`. No live config dir was touched at all.

- [x] **`/` renders every discovered building; the hand-count matches.** `discover(['~/code'])` finds **22 buildings** (P3 counted 17 pre-molt; the four worktree-only boards are all present). The hand-count is `ps`:

```
$ ps -Ao pid,command | grep -cE '^ *[0-9]+ claude --model'
36
```

The census fixture stamps those **36 real pids** with their real cwds (`lsof`) and real transcript paths, one beat each of `PreToolUse`/`Stop`/`UserPromptSubmit`/ `Notification` cycled, plus five honesty cases: P1's **real SIGKILL capture** (pid 24189, last line `Stop`), a clean `SessionEnd`, a live pid whose last `PreToolUse` is 3 days old, a record with no pid, and one unparseable line. Rendered:

```
buildings      22
live sessions  38          ← 36 real pids + the 2 honestly-unknown cases
working        18          ← 9 PreToolUse + 9 UserPromptSubmit
needs-input     9          ← Notification/permission_prompt
idle            9          ← Stop
unknown         2          ← the stale-working record and the pid-less record
census         78 beats · 1 unreadable
```

40 sids in, 38 live + **2 gone** out: the SIGKILLed session whose census still says `Stop` is caught by `kill -0`, and the clean `SessionEnd`. The malformed line is counted and shown, never swallowed. Sessions housed in buildings: agents 6 · agents/belvedere 1 · bob 9 · whiteboardy 2; the other 20 render in an **Off the register** panel so the hand-count still adds up (see F2).

- [x] **Interop with B1's real hook, before either branch merges.** `beat.sh` taken verbatim from `bv/b1-census` and driven with real hook payloads (no live `settings.json` involved), then read by the glass:

```
$ jq -r '[(.t|todate),.ev,.sid,.pid]|@tsv' census.jsonl      # written by B1's beat.sh
2026-08-27T03:38:34Z  SessionStart      A-live    1
2026-08-27T03:38:34Z  UserPromptSubmit  A-live    1
2026-08-27T03:38:34Z  PreToolUse        A-live    1
2026-08-27T03:38:34Z  SessionStart      B-perm    1
2026-08-27T03:38:34Z  Notification      B-perm    1        (permission_prompt)
2026-08-27T03:38:34Z  Stop              C-ended   1
2026-08-27T03:38:34Z  SessionEnd        C-ended   1
2026-08-27T03:38:34Z  UserPromptSubmit  D-killed  4194303
2026-08-27T03:38:34Z  Stop              D-killed  4194303  ← the F5 lie: dead pid, last line Stop

/b/agents → Live sessions
  stamp                 state        account   cwd     last event
  dispatcher-agents-01  needs-input  personal  agents  Notification
  dispatcher-agents-01  working      personal  agents  PreToolUse Bash
```

C-ended and D-killed are correctly absent. The stamp is read from the real transcript and the account from `accounts.tsv` — the identity chain is live, not mocked.

- [x] **`/b/agents` and `/b/agents/belvedere` render all five panels.**

```
/b/agents            HTTP 200 · 35 208 B · Board ×3 (5. The campaign board · 4. The board ·
                     The wave…) · Ledger tail · Decision queue · ISSUES · Live sessions · Lint — 31
/b/agents/belvedere  HTTP 200 · 11 250 B · Board · Ledger tail · Decision queue · ISSUES ·
                     Live sessions · Lint — 2
```

**Links: 23/23 on `/b/agents` and 11/11 on `/b/agents/belvedere` click through** — every `/doc?p=` href fetched, zero "Unresolved link". Sample: `agents/MAP.md` 25 700 B · `canon/work/DOCTRINE.md` 34 444 B · `plans/18-great-recut.md` 36 866 B · `belvedere/lab/p2/spawn.ts` 5 598 B (a `.ts` target resolves too) · `belvedere/plans/p3-parse-coverage.md` 32 375 B.

The belvedere ledger tail renders head, body, `Decided:` and the baton — and states the baton honestly as **`prose`**, because `fire the Dispatcher` carries no digit and so is not an instrument (D64/P3 §0). That is one of that page's two lint entries.

- [x] **A failing board renders its failure INLINE.** On the real corpus, `cap-mega/snappy` row 09 draws in full with the defect pinned under it:

```
| 09 | Derived-state contract (P1): … — blessed doc
       ┌ board.depends  depends-on segment is neither a row id on this board nor
       └ "Felix-gate: <text>"   09: "08 + Gate A (RULED)"
     | 08 | Architect · fable-max | LANDED (2026-08-05) — … |
```

And a purpose-built control (`brokenville`, five deliberate defects, served with `GLASS_CITY` pointed at a scratch city) — **HTTP 200, 3 948 B, server log clean**:

```
1  A good row                        Builder · opus-high   LANDED  clean
2  A retired status                  board.retired   "DONE" is a retired synonym (§4) — use LANDED
                                     2: "DONE — \"DONE\" is not a lifecycle state"     → UNPARSED
3  A staffing cell that is prose     board.staffing  staffing is not "<Mantle> · <tier>" or "Felix-gate"
                                     3: "some bloke off the street"        → ? · ?      OPEN
4  An unknown tier                   board.tier      unknown tier   4: "opus-turbo"     → Digger · ?
5  A verdict leading the status      board.verdict-leads  a verdict rides the annotation (D63b)
                                     5: "MERGED — verdicts ride the annotation"         → UNPARSED
6  Depends on a row that is not here board.depends   6: "99"                             BLOCKED
```

The panel head names the file and line (`brokenville/README.md:7`), every excerpt is verbatim, and the row still renders. No page blanked; the server never went down.

- [x] **`bun test` green.**

```
$ cd belvedere/glass && bun test
 32 pass
 0 fail
 42 expect() calls
Ran 32 tests across 1 file. [18.00ms]
```

26 state-machine rows (the ten events; F5 pid-dead ×3; no-pid ×3; stale-census ×5, including "idle does not decay" and "a stale record whose pid is dead is gone"), the `isAlive` EPERM case, and **5 wire-contract cases pinned to B1's verbatim `Stop` line** — string pid, `jq --arg` empty strings, and the fields the spine deliberately does not read.

- [x] **Glass-shatters drill.** `kill -9` landed 3 s into a City View walk:

```
=== before ===  agents/**.md digest a3fe86251f07e0c390cde118f3cfe8d4e6527ac2 · live claude sessions 36
=== kill -9 mid-request ===  the in-flight request died with the server (expected)
=== after  ===  agents/**.md digest a3fe86251f07e0c390cde118f3cfe8d4e6527ac2 · live claude sessions 36
DISK: identical
SESSIONS: all 36 alive
cold relaunch to first served byte: 94 ms
```

94 ms — 21× under the 2 s bar.

- [x] **Census absent entirely → docs-only, liveness stated as unknown.** With `CENSUS_DIR=/nonexistent` (the real pre-G1 state: B1's `deploy.ts --check` reports no hooks on any of the three accounts), every page renders in full, the Live-sessions panel reads **`unknown — census not deployed`**, and the City View's census stat says the same. Nothing degrades to "working".

- [x] **Zero writes outside `belvedere/glass/`.**

```
$ git diff --name-status master...HEAD
A  belvedere/glass/README.md       A  belvedere/glass/html.ts       A  belvedere/glass/pages.ts
A  belvedere/glass/census.test.ts  A  belvedere/glass/package.json  A  belvedere/glass/paths.ts
A  belvedere/glass/census.ts       A  belvedere/glass/felikai.css   A  belvedere/glass/rig.ts
A  belvedere/glass/glass.css       A  belvedere/glass/server.ts
M  belvedere/plans/b2-glass-spine.md        ← this findings file, as the order requires
```

## Out of scope

- The baton rail page, fire/dispatch anything, shelf, usage strip, inbox (B3–B6); auth; non-localhost binds; websockets/live-push (manual refresh or meta-refresh is enough for the spine); editing any truth file (forever).

## Findings

### E1 (ESCALATION) — "zero caches: re-read disk per request" costs 9 s on the City View

Spec §1's last clause is the one number the order got wrong, and it is off by ~100× against an interactive page budget. **Measured, three consecutive requests:**

```
/                                          9.267 s   9.098 s   9.049 s
/b/agents                                  0.024 s
/b/agents/belvedere                        0.004 s
/b/whiteboardy                             0.174 s
/b/universal_robots_sdk/cap-mega/snappy    0.014 s
```

The cost is **the register walk, not the parsing**, and it is warm-cache:

```
bare walk of ~/code, statSync per entry (what doctrine does)   8 558 ms   50 795 dirs · 15 779 .md
same walk with readdirSync({withFileTypes:true})               3 378 ms   (2.5× — dirent type, no stat)
discover() end to end (walk + parse + dedupe)                 10 160 ms   22 buildings · 12 970 deduped
per-repo:  universal_robots_sdk 1 376 ms/18 969 dirs · fluentui-emoji 429 ms/13 879 dirs (4 .md files)
```

35 worktree checkouts of `cap-mega` and one emoji repo are most of it. **This is inherent to the register's law** (worktrees must be walked — four of the city's boards live only there), not a bug in the walk.

**What this row did inside the fence.** Building pages no longer walk the city: `buildingPage()` calls `discover([<building>], [<building>])` on one subtree, which still finds nested buildings (so `/b/agents` does not claim belvedere's sessions) and costs 4–174 ms. Only `/` still pays the full 9 s, and it pays it in the open — the footer prints `re-read from disk in 9183 ms · 12970 worktree copies deduped`.

**Three options; the ruling is the Architect's at G1, and none of them is a Builder's to take:**

1. **Amend §1 to scope "zero caches" to CONTENT, not DISCOVERY** — keep the register (the list of building paths + mtimes) for N seconds, re-`parse()` every building every request. Content never goes stale; a building created mid-session appears within N. ~40 lines, and the honest one: the glass would still never render a parsed byte it did not just read. Recommended.
2. **Fix the walk in `doctrine/`** — `withFileTypes` (2.5×, measured) plus skipping descent into a worktree checkout whose tree is a byte-identical twin. Gets `/` to perhaps 2–3 s, not to interactive. It is also *not this row's code*: DoD-7 forbids B2 writing outside `belvedere/glass/`, so it needs a canon-side row.
3. **Leave it at 9 s** and let the baton rail (B3) inherit the same cost on the home page. Defensible only if `/` is rare, and B3's rail makes `/` the page Felix lives on — so this is the option that quietly breaks the product.

Kill criterion not tripped: nothing in the DoD failed, the page is correct, and the spec's intent (never render a stale truth) is met at every price point.

### F1 — the name-stamp join is derivable, but not from `invocations.jsonl`

Spec §2 says "name-stamp from the rig's `invocations.jsonl` (join on session where derivable)". **It is not derivable there** — the rig's record carries no session id:

```
$ tail -1 summon/log/invocations.jsonl | jq -r 'keys|join(" ")'
account cmd color effort keys mantle mode model n name ts
```

A join on `(account, ts)` would be a guess. The real source is the **session transcript**, which the census already hands us as `tp`:

```
$ jq -c 'select(has("agentName"))' …/d285127e-….jsonl | head -1
{"type":"agent-name","agentName":"dispatcher-agents-01","sessionId":"d285127e-5a40-49e0-994f-b6c3ec5ed8f6"}
```

It lands on **line 3, 314 bytes in**, so the reader scans a bounded 64 KB head window rather than a multi-megabyte transcript. A session renamed after that window reads as unstamped — honest, and cheap. **B5's shelf should resume by this stamp, not by anything joined out of `invocations.jsonl`.**

### F2 — most live work is "off the register", and the register is right

20 of 38 live sessions in the DoD-1 render housed in **no** building. Their cwds are `…/cap-mega`, `…/cap-mega/.claude/worktrees/<branch>`, and similar — and `cap-mega` is not a building: its boards live in `cap-mega/docs`, `cap-mega/simmy`, `cap-mega/snappy`, so those are the anchors and the parent directory is not one. The glass renders them in an **Off the register** panel rather than hiding or mis-housing them.

This is the register's law working correctly, and it is also a product problem the rail (B3) will hit head-on: the City View cannot show Felix where most of his live work is. The fix is a doctrine question (does a repo root with no artifact of its own deserve a card?), not a parser branch — **filed for the Architect, not patched here.**

### F3 — for B4 and B5: what the spine deliberately does not read

`ws`, `sf`, `pmt`, `mode`, `aid`, `at` and `bg` are parsed off the wire and dropped at `toBeat()`. The pane join (`ws`/`sf`) is B4's jump-in; the WIP roster (`bg`, capped at 16 by B1 — bulletin §3, so **never render "N tasks" as exhaustive**) and `aid`/`at` subagent attribution are B5's gauges. Adding them is one line each in `census.ts`; the tests name every one of them so nobody adds them by accident.

### F4 — an account of `—` is honest, not a bug

When `CLAUDE_CONFIG_DIR` is unset the record carries `""` and the glass renders the account as `—`. Unset almost certainly means the default `~/.claude` (personal), but that is an inference, and this row's law is honesty over optimism. If Felix wants the inference made, it is one line in `rig.ts` — an Architect's call, not a Builder's.

### F5 — the two spec deviations worth naming

1. **`/doc?p=<path>`** is not in the spec by name; the DoD's "rendered links resolve (D58)" needs somewhere for a link to go, and a read-only viewer under `CITY` is the smallest thing that works. It refuses anything outside `~/code` and truncates at 2 MB.
2. **Only inline markdown is rendered** (links, `code`, **bold**) — block structure comes from the parser. A markdown library would be a dependency this row does not get to grow (D54).

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md
and ~/code/agents/belvedere/plans/b2-glass-spine.md,
and build the order.
```
