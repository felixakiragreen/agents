# B12 — the reactive gate + dynamic extension

**Status:** LANDED 2026-08-28 · **Depends on:** B11 · **Staffing:** Builder · opus-high · **Blessed:** Architect, flow-cut sitting 2026-08-27 — **D12 (step-arm vs scope-arm) is Felix's at the batch blessing** (README §6 batch-5 note); this order builds both branches behind one flag and the ruling flips it.

> **Re-seated 2026-08-27 (deck keel, BLESSED):** the DAG surfaces below are the Works (B10 as re-seated); inserted judge nodes draw on its now-line's plan side; `/flow/flow-close` renders as a Works target. Substance unchanged.
>
> **D12 RULED 2026-08-27 — scope-arm** (Felix, "rec"; README §7): the module constant ships scope-arm; the DoD's live branch is §4's scope-arm path, step-arm under test only.

## Goal

The string judges itself and grows while it runs. An escalation-marked landing **auto-fires the scoped Architect sitting into the lane** — the reactive gate ([flow-keel.md](flow-keel.md) §5.1; Felix's ask, B5 sitting; B6's apply button is the prototype) — and the DAG draws the inserted judge node; Felix is carded only when the judge's work leaves something that is genuinely his. The engine re-reads the plan, and the DAG grows mid-flow per D12 (dynamic extension, Felix's word at the B9 close). The campaign's own evidence is the commission: seven escalations in batch 3, six Architect-delegated, every ruling hand-relayed by Felix — while B8's fully-pre-chewed order escalated zero.

## Inputs — read before building

- [flow-keel.md](flow-keel.md) §§4–6 — the reactive gate, dynamic extension, the row-17 evidence pile (the interim classifier below feeds it).
- [B11's](b11-flow-engine.md) landed engine — §4's interim landing law and the pause states are the substrate; this row *consumes* pauses and *inserts* judges.
- `glass/inbox.ts` — B6's apply mechanism (compose the scoped sitting, fire through hands); `flow.judgeTier` (B10 schema).
- D10 — every new affordance inherits ambiguity-never-arms.
- The batch-4 note's blessing item 1 — **judge insertions fire under either D12 ruling**: the reactive gate is the armed contract's landing law executing, not plan growth; D12 governs only new *work* steps.

## Spec

1. **The landing classifier (interim, named interim).** A landed step is **clean** iff its board row parses state `LANDED` and the status annotation matches none of: `/\bE\d+\s*[—-]/` (escalation markers), `/escalat/i`, `/BLOCKED/`. Anything else that B11 paused — malformed row, `KILLED`, dead-no-`Stop`, escalation-marked LANDED — **classifies for the reactive gate** instead of waiting for a human. The pattern list is a constant with a comment naming it interim (the real fix is a machine-readable `holds` on the landing grammar — canon's, keel §6); false-positives fire a judge, which is the cheap direction, and the misclassification log is G2 evidence. Steps that are not board rows (gate sittings) classify on their session state alone.
2. **The reactive gate.** On a gate-classified landing: compose the scoped Architect sitting (B6's apply shape — the sweep template scoped to this building and the gated row), tier `flow.judgeTier`, fire it **into the lane** through the hands; append `{ev: "extended", step: <judge id>}`; the DAG draws the inserted node (B10's vocabulary — an architect-gate node). The lane stays paused while the judge runs. **The verdict is read from the files, not from the judge's mouth:** when the judge's sitting lands, re-classify the gated row — clean now → `resumed`, lane runs on; still unclean → render the **Felix-card** on the lane (the judge left something that is his), nothing fires. Zero new grammar, zero prose parsing of the judge's report.
3. **Judge loop limit.** One judge per gated landing; a judge whose own sitting classifies for a judge does not recurse — Felix-card (everything has a limit).
4. **Dynamic extension.** Each tick re-reads the flow file (B11 pauses new fires on hash mismatch). This row adds the delta reader: parse the changed file, diff by step id. **Under D12 = scope-arm:** a delta that only *adds* steps whose venue/building sit inside the flow's declared `scope` auto-joins — re-arm recorded (`armed` with the new hash, `why: "scope-arm auto-join"`), fires proceed; any edit to an existing step, any removal, any out-of-scope addition still pauses for the click. **Under D12 = step-arm:** every delta pauses for the click (B11's base — this row changes nothing). The flag is one constant read from the flow file schema? No — **the ruling is city law, not per-flow choice**: a single module constant, set by D12's ruling at blessing, named in code with the D-entry.
5. **The close flow, left on disk.** Declare `flows/flow-close.flow.json`: one architect step whose kickoff resolves to the README batch-4 note's G2 fence, one Felix-card behind it (`chapter verdict`). Do not arm it — **Felix's arm is G2's Felix-gate**, the engine's first real act.

## Acceptance criteria — the DoD

All measured against a live glass, evidence pasted; probe sessions ≤2 concurrent, workspaces closed (D55); probe rows for the induced escalation live in a scratch section of a lab fixture doc, never on the real board.

> **Tier amendment carried into this DoD (Felix, relayed at dispatch):** the two named probe sessions — the induced-escalation flow step and the scripted judge — run at **sonnet·low** rather than haiku-low, P5's own landing being that `--model haiku` cannot hold `auto` permission mode and fails to `default` silently. Everything else in the order stands as written. All three sessions this DoD spawns are sonnet·low.
>
> **Venue amendment (this row's):** the fixture city is `~/code/b12-gate-<pid>` rather than a temp root, because a fire needs the trust entry that lives at `~/code` (B7 F1) — and because that directory is **no git repository and has none above it**, a judge sitting told to *"commit in his git style"* cannot reach the real tree. `git status` in `~/code/agents` is compared either side and is the last check in the run.
>
>     bun belvedere/lab/b12/probe.ts    13 checks, three live sessions — ALL GREEN
>
> Pure reasoning is `glass/judge.test.ts` (29 tests: the id grammar, the classifier, the sitting's derivation, the delta reader, every scope-arm refusal) plus `glass/engine.test.ts`'s twelve new ones over `plan()`.

- [x] **The reactive gate fires.** `s1` (Builder · sonnet-low) edited its own board row to `LANDED 2026-08-28 — E1 — the venue policy needs a ruling before S2`, and the engine staffed the sitting instead of carding him — **zero human touches between the arm click and this**:

      landing edge  2026-08-28T14:55:55.144Z  paused:s1
                    "LANDED, and E1 is raised with nothing saying it was ruled (keel §5.1)"
      extended      s1.judge — the same sentence, so the sitting is fired about the reason
      judge fired   2026-08-28T14:55:55.697Z  workspace:109
      **gap 0.553 s**          arm → judge fired, end to end: 18.1 s

  Through the same hand, at the flow's own judge tier, in the gated step's own checkout — `audit 14:55:55.697Z stamp architect-gate-03 model sonnet effort low cwd …/b12-gate-96798/nb/gate` — and its **first user turn IS the composed sitting**, byte-exact three ways:

      summons file  …/census/summons/architect-gate-03.summons.txt  sha f2cd39ffee1ed0e1  510 B
      transcript    ~/.claude/projects/-Users-felix-code-b12-gate-96798-nb-gate/83d9c4fb-….jsonl
                    first user turn                                 sha f2cd39ffee1ed0e1  510 B
      the hands' own receipt                                        sha f2cd39ffee1ed0e1

  The DAG drew it as an insertion, wired to the step it was staffed for, with the lane paused behind it: `s1:paused s2:declared s1.judge:fired`, `data-inserted="yes"`, `path.wire[data-from="s1"][data-to="s1.judge"]` present, `s2` ring `declared` and **unfired**.
- [x] **Resume on truth.** The judge — a real sonnet·low Architect, sent nothing but the composed sitting — read the fixture's board and inbox and trued the row to `E1 ruled 2026-08-28 — …`. The engine read the verdict off the **file**, not off its report:

      judge landed  2026-08-28T14:56:20.146Z  "s1 reads clean now — the sitting did what it was staffed for"
      resumed       2026-08-28T14:56:20.146Z  "the judge sitting cleared s1 — the lane runs on"
      s2 fired      2026-08-28T14:56:20.659Z  workspace:110
      **gap 0.513 s**

- [x] **Felix-card on residue.** A second flow whose judge sat and left the row raised: run-state `paused:r1.judge — "the judge sitting is over and r1 still does not read clean (…) — a judge is never judged, so this one is Felix's"`, and the node rendered in a real Chrome as `felix-card=true · **0 buttons · 0 links · hands/fire 0×** in its markup`, his words on it. **Nothing fired after it**: three fires in the whole hands audit, all three accounted for.
- [x] **No recursion.** A third flow whose judge passed its own limit: `armed → fired:n1 → paused:n1 → extended:n1.judge → fired:n1.judge → paused:n1.judge`, the pause reading *"passed its 1 minute limit … a judge is never judged, so this one is Felix's"*, **exactly one `extended` line** and no step id containing `.judge.judge` anywhere in the log. The limit is structural rather than counted: `gatedOf('x.judge.judge')` is **null**, so a judge's judge has no id to mint.
- [x] **Dynamic extension per D12 — scope-arm, live.** With the lane halted so the growth is *measured* rather than raced (E1), `s2` was appended to the armed flow file and the engine **re-armed itself**:

      armed #1 covered ["*:c64d0cc92741112e","s1:d5372b37c3429959"]
      armed #2 covers  ["*:c64d0cc92741112e","s1:d5372b37c3429959","s2:df085f97e2a5ffb6"]
      why: "scope-arm auto-join (D12): s2 added inside nb/gate · the reactive gate"

  Nothing had fired at that point, and `s2` then fired **with no click ever given to it** — the resume above. An **edit** to a step already armed still stops: `paused — "s1 was edited since the arm — scope-arm joins additions, and an edit is a change to what was authorized"`, no third `armed` line, and the hash still `2d9a6ebb64a5…`. Step-arm rides `judge.test.ts` (`ARM_SCOPE` is a module constant, and `{kind: 'none'}` is B11's base behaviour verbatim).
- [x] **The close flow exists.** `flows/flow-close.flow.json` parses, renders in the Works for `agents/belvedere`, and is **unarmed** (`armedAt null`):

      g2 kickoff sha 43f72319c270a54c (351 B)  ≡  README fence #5 sha 43f72319c270a54c (351 B)
      verdict: gate=felix · awaitingPass=false · 2 nodes

  The Felix-card is inert by construction — a card only carries a pass gesture while `awaitingPass`, and an unarmed flow has nothing to pass.
- [x] **The gates.** `bun test belvedere/glass` → **651 pass / 0 fail in one process** (25 files, 1764 assertions); `bunx --offline tsc --noEmit` → **exit 0**; zero new dependencies. Cost, B3's 20-request protocol over the live register with both flows on the wire: `/deck/state?b=agents/belvedere` `n=20 min=85.7 p50=239.9 **p95=289.9** max=289.9 ms`, 137 kB, against the 500 ms bar — and the close flow's own share, quoting an 89 kB README for its kickoff on every poll, is **0.13 ms** (`readFlows` for both files: p50 0.50 ms). Predecessor probes re-run whole: **B13 · B14 · B15 · B16 · B19 · B20 · B21 · B10 · B11 (probe · lever · smoke) — ALL GREEN, eleven for eleven**; `lab/b17/probe.ts` deliberately not re-run (its two failures are filed at its own landing commit, B11 F8, and it leaks a live workspace when it throws, B16's addendum). Venue restored: all three workspaces closed, the scratch city removed, the city's own HALT flag absent, `git status` in `~/code/agents` byte-identical either side.

## Out of scope

- A `holds` grammar or any board-format change (canon's — the interim classifier's misses are G2 evidence, never local grammar).
- Judging content: the judge is a fired *sitting*; the engine never rules on work, only routes it.
- The Steward (unparked by Felix's word only, README §4); auto-arbitrage; killing sessions; editing truth.

## Findings

**E1 — `trust.ts` reads an auto-created project entry as a refusal, so a plain-directory venue goes COLD the moment a session runs in it, and the arm then refuses a venue that demonstrably works.** Found live, twice, by this row's own DoD: the scope-arm auto-join was refused with *"personal has never trusted /Users/felix/code/b12-gate-91656/nb/gate … refused at …"* **2.1 seconds after a session had successfully started in that very directory**. Claude writes a project entry for every cwd it opens, and an inherited-trust directory gets `hasTrustDialogAccepted: **false**` — because no dialog was ever *accepted* there, not because anything was refused. `trustOf`'s "its own entry wins" then turns that into `{warm: false, refused: <path>}`.

The measured cells across the three live accounts:

    /Users/felix/code/b7-founding-probe          false   ← B7 F1's OWN positive control:
                                                           "reached its first user turn and beat
                                                            the census ten times"
    /Users/felix/code/b12-gate-88694/nb/gate     false   ← three sessions ran there, all landed
    /Users/felix/code/b12-gate-91656/nb/gate     false   ← same, and the arm then refused it
    /Users/felix/code/agents                     true    ← Felix accepted the dialog here
    …/universal_robots_sdk/cap-plasma            false   ← a repo, where `project.repo` already says cold

So on a **plain directory** `false` carries no refusal information at all, and the only cell where it looks right is one the repo rule already decides. **The fix named, not taken: `hasTrustDialogAccepted: false` should fall through to the ancestor walk rather than short-circuit as a refusal** — which gives the right answer in every cell above. Not taken because `trust.ts` is B7's law, P5 F5 (iii) blessed it *"sufficient as-is"*, and changing what `refused` means changes every arm in the city.

**What it costs today:** nothing in production — every real venue is a repository Felix has accepted (`~/code/agents` → `true`), and a worktree step is prechecked against its repo. **What it will cost:** the first flow whose venue is a plain directory arms once and never again, and the sentence it is refused with is factually wrong. It also makes a fixed-venue probe un-re-runnable, which is why this row's fixture city carries the pid. Worked around here by **halting the lane before the growth proof**, so the join is measured before any session opens in the venue — instrumentation, not a fix. **The Architect's, at G2.**

**F1 — the order's own classifier gates 120 of the city's 390 landed rows, including `b10` and `b11` of this very flow. It ships as the misclassification log it asks for, and the classifier is B11's pause.** §1 names three patterns — `/\bE\d+\s*[—-]/`, `/escalat/i`, `/BLOCKED/` — and says false positives are "the cheap direction". Measured over the live register at this landing: **390 `LANDED` rows · `escalationsIn` gates 0 · those three patterns gate 120**, of which `/escalat/i` alone gates **113**. The rows it takes include `agents/belvedere B10` and `B11`, whose annotations read *"nothing escalated"* — so on this row's own flow the order's list would have staffed two fable-high sittings at two rows that said, in words, there was nothing to rule. That is not a cheap direction. §1 was cut at the flow-cut sitting, **before B11 landed**; what B11 then built for this exact question is `attention.ts`'s `escalationsIn` (B14 F2's detector, 0 false positives over 458 rows), and the Architect's own relay says *"an unruled escalation on a `LANDED` row already pauses … B12 turns that pause into a judge fire"*. So the classifier is **`verdictOf`'s pause**, expressed as a `LandingCode` rather than a string match, and `SPEC_PATTERNS` survives in [`judge.ts`](../glass/judge.ts) as the named interim constant §1 asks for — with the measurement on it, pinned in `judge.test.ts` against six verbatim corpus annotations. **The real fix is neither regex: it is a machine-readable `holds` on the landing grammar (keel §6, canon's).**

**F2 — a session that finishes ends on `SessionEnd`, never on `Stop`, so B11's census landing sensor lands nothing and its malformed branch fires on every normally-closed sitting.** Over the live census at this landing: **61 gone sessions, 61 last-event `SessionEnd`, 0 last-event `Stop`** — `Stop` fires when the turn ends, the session then sits idle with a live pid, and closing its workspace appends `SessionEnd`. So `Stop`-as-last-and-gone is the SIGKILL case (P1's own note), not the ordinary one. B11 never felt it because every step in its smoke was a **board row** and the board answered first. B12 does feel it, because an inserted judge has no row. Built accordingly: **a judge is landed by the row it was staffed for, never by its own session** — the census is asked only whether the sitting is *over* (`idle` or `gone`, P1's idle sensor), and that answer is used solely to decide when to card Felix. A consequence worth having: the lane resumes the moment the row is true, while the judge is still alive, rather than when its workspace happens to close. **What it binds:** anything reading `verdictOf`'s census branch as a landing sensor is reading a branch that almost never fires, and the keel §6 `holds` ask now has a second half — *how does a step with no board row land?*

**F3 — a fixture city inside `~/code` is slugged RELATIVELY and one outside is slugged absolutely, and a flow that names the wrong one loses its board with no error.** B10 F5's rule, second face. Measured: `GLASS_CITY=/private/tmp/x` → the register calls the building `/private/tmp/x/nb/gate`; `GLASS_CITY=~/code/b12slug` → it calls the same shape `b12slug/nb/gate`. This row's probe must live under `~/code` (that is where the trust entry a fire needs lives, B7 F1), so its flow files write the **slug**. With the absolute path instead, `buildings.find(b => b.building === flow.building)` is `undefined`, `world.rows` comes back **empty**, and every landing is then judged by the census instead of the board — which under F2 means *malformed* — silently, with no lint anywhere. Caught in a dry rehearsal before a single session was spawned; it would have looked like the gate working for the wrong reason. **Binds every later flow fixture.**

**F4 — a step decided this pass kept its concurrency slot and its checkout until the next tick, and at `concurrency: 1` that starved the judge the same pass had just staffed.** `inFlight` reads the run *log*, which does not yet carry the line `plan()` is about to write, so a step paused at 12:00:00 was still "in flight" for five more seconds. Harmless in B11 (a landing was already excluded by `landed`), fatal here: the gate's whole number is the gap between a landing edge and a judge fire. Fixed at the cause with a `settled` set covering every verdict this pass that ends a step's run — and **`timeout` is deliberately not in it**: that session is still alive and still spending, and the engine kills nothing (B11 §6).

**F5 — the arm now records WHAT it armed, step by step, and "unknown" never auto-joins.** `Flow.hash` says *the plan moved*; the delta reader needs *which parts*, and keeping a copy of the flow file to diff against would put a second truth in the telemetry. So `Step.hash` is sha256 over everything a fire would use (**`depth` excluded** — it is the graph's property, and adding a step elsewhere must not read as editing one nobody touched), and an `armed` line carries `<id>:<hash>` for every step plus one frame mark under `*`, an id `STEP_ID` can never produce. An `armed` line written before this field existed reads back as **null**, and null is never treated as "only additions" — it pauses for the click, which is B11's behaviour and the honest one.

**F6 — D12's "building + chapter" is prose; what scope-arm actually enforces is *what the click already covered*.** A step declares a venue and an account, not a chapter, so "inside the scope" was made checkable as: the flow's **frame** is unmoved (building, scope, concurrency, judge tier), nothing existing was **edited or removed**, every addition's **venue and account** are ones the arm already covers, and every addition passes `refuseStep` — *the same list the arm applies*, extracted so there is one of it. Growth may fill in the plan; it may never reach somewhere new. The ruling is a **module constant** (`ARM_SCOPE`), not a flow field, because a flow that could choose its own arm scope would be a flow that authorized its own growth.

**F7 — the judge inherits the gated step's checkout, and that is single-writer physics rather than convenience.** `plan()` reserves a checkout by its **cwd**, so `~/code/agents` and `~/code/agents/belvedere` do not compare equal even though they are one git tree. Sending a judge to the building's own path while its lane's steps run at the repo root would put two writers in one checkout with the reservation blind to it. A judge therefore takes the gated step's venue where that is `master` — which is also, for free, a venue the arm has already trusted — and falls back to the building path only for a worktree-venue step, where a sitting that trues a board must not commit on a branch nobody merges.

**F8 — probe residue, named not scrubbed (B7 F6's precedent).** Each DoD run leaves one entry in `~/.claude/.claude.json` for its own scratch venue (`/Users/felix/code/b12-gate-<pid>/nb/gate`, `hasTrustDialogAccepted: false`) — written by Claude, for a directory that no longer exists. They are inert, and a Builder does not edit an account's config file (D14's guard is exactly that). Three exist at this landing, from three runs.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§5–6,
~/code/agents/belvedere/plans/flow-keel.md,
and ~/code/agents/belvedere/plans/b12-flow-reactive.md,
and build it to its DoD.
```
