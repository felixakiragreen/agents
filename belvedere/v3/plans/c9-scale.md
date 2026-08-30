# C9 — scale

**Status:** **LANDED** 2026-08-30 — bar 5 met both halves; budget 81/120 turns,
$3.9689/$8; K1 and K2 never fired (K2 is mis-specified — F1) · **Depends on:**
C13 · **Staffing:** Digger ·
opus-medium — the cornerstone's lay proposed sonnet-high; bound up one notch at
this lay: timed measurements on the live desktop and a sanctioned 25-wide real
burst want condition discipline (findings law 7; C12's opus-medium precedent on
a fully pre-chewed spec)

## Mission

Campaign bar 5: **100 simultaneous fake subjects green through the engine**, and
**real-session scale measured to ≥25** with the cost extrapolation table G4's ⬡
convenes on. The engine is measured **as it stands at C13** — nothing here edits
it (that is why this charge runs before C10). The bet this dig informs: whether
the substrate's §4.8 bar is physics or hope.

## Budget — the line (D21; dollars lead, C8 F9's ruling)

- **≤$8**, summed live from `result.total_cost_usd`, **and ≤120 subject turns**
  (ignitions + resumes, C6 F8); first ceiling → stop, file, ⬡-fork. Expected:
  ~45 turns / ~$3 (C8 F9: ~6.4¢/turn at sonnet·low, trivial prompts).
- Real subjects: sonnet·low under `auto`, T-echo-class prompts (never this
  repo); one turn per subject in the burst arms.
- **Every timed number carries its conditions** (findings law 7): 1-min load
  before and after, account, width, timestamp. A contaminated number re-runs or
  is struck inadmissible — never averaged in.

## Inputs — do not re-derive

- C8 F9 — the per-turn numbers (p50 latencies, ~6.4¢); C8's scorecard row 8
  (width 2 costs no wall); C4 F10 (10 simultaneous cost the wall of one, zero
  census loss).
- C8 F10 / grammar §11 — **`rate_limit_event` exists**; a 25-burst is exactly
  what might induce one. Record every occurrence verbatim; it is a G4-grade
  datum, not noise.
- **The 25-burst is sanctioned:** C4 Q8's ≤10-simultaneous ceiling is raised to
  25 **for this charge's Q2 arm only**, by this lay (the batch note carries the
  concurrency plan). Never above 25.
- The clean room and the fence ([../README.md](../README.md)); work dirs in
  scratch, subjects dead at landing, resume ids in findings.
- The harness note (C6 F9's protocol): blocked reads/adds are listed for
  Felix's `!`, never ground against.

## Questions

1. **Fake ×100 — bar 5's first half.** One flow, 100 parallel steps, fake
   subjects, driven by the engine to a full terminal state: invariants green,
   zero double-ignitions, wall time, peak RSS, fd high-water (100 stream files
   + tails at once). ×3 repeats for variance. A red or a resource wall is the
   measurement, filed with its numbers.
2. **Real scale ladder — bar 5's second half.** Widths 5 → 10 → 25, one
   account (personal — per-account physics is the honest claim), one T-echo
   turn per subject through the engine: spawn-latency distribution per width,
   wall vs width, transcript/lock collisions (expect zero, C4 F10), census
   fidelity N/N, any `rate_limit_event`, cost. Stop the ladder at the first
   substrate-imposed ceiling below 25 — a measured ceiling **is** bar 5's
   answer, filed loudly; never retry into a rate limit.
3. **The cost extrapolation table — G4's exhibit.** From C8 F9's mean and this
   charge's own measured $/turn at width: flows of 10 / 25 / 50 / 100 steps ×
   {fake: $0; real sonnet·low}, dollars and wall time both, conditions named.
   One table, paste-ready for the G4 pack.
4. **Engine health at width.** Across Q1's runs: memory stable (no growth run
   to run), zero orphan processes at terminal, the run log replays exactly
   (`replay ≡ state` at width 100).

## Kill criteria

- **K1 — the budget:** either ceiling → stop the whole dig, ⬡-fork.
- **K2 — account risk:** any auth failure, lockout, or second consecutive
  `rate_limit_event` on the ladder → stop that arm immediately, record, file;
  the account's health outranks the measurement (denominator: per arm).

> **Corrected 2026-08-30, the C9 review (F1):** `rate_limit_event` fires on
> **every** turn with `status: "allowed"` — routine telemetry, so the literal
> criterion would have killed the ladder at turn 2. The trigger reads *"second
> consecutive `rate_limit_event` with `status !== "allowed"`"* — the intent
> the ladder actually ran under (it never fired). The deviation is ratified;
> the spec error was the lay's, and the correction is the lay's too.

## Escalation points

- Any auth, login, or trust dialog — only Felix's hands.
- Any settings/hook change in a live config dir — never; file it.
- Nothing third-party named, nothing authorized (D54).

## Out of scope

Engine edits of any kind (C10's step 0 comes after — the target holds still) ·
the console (C10) · widths above 25 real · cross-account bursts · retention.
**Creep is a bug.**

## Findings

**Bar 5 is met, both halves, and the substrate showed no ceiling below the
sanctioned 25.** 100 simultaneous fake subjects run green through the engine,
12/12 repeats; the real ladder 5 → 10 → 25 runs green twice over on `personal`,
every subject landing its own token, zero session collisions, zero rate-limit
refusals. **Budget: 81/120 turns, $3.9689/$8** — both ceilings held, neither
approached. Instruments: [`lab/c9/`](../lab/c9/) (`drill.ts` · `q1-fake-width.ts`
· `q2-real-ladder.ts` · `q3-cost-table.ts` · `meter.ts`); telemetry in
`summon/log/v3/c9` (real) and `summon/log/v3/c9-fake` (fake), gitignored.

The type gate is exit 0 over the whole lab:

```
$ cd belvedere/v3/lab/c9 && ../../../glass/node_modules/.bin/tsc --noEmit
exit=0
```

---

### Q1 — fake ×100: bar 5's first half. **GREEN.**

`bun q1-fake-width.ts 100 12`, one process, 12 consecutive runs of a 100-step
flow with no edges (so the engine puts the whole width in flight in one tick).
Conditions: 2026-08-30, personal desktop, 1-min load 7.92 before and after every
repeat, load triple `7.92 8.27 8.35`.

| repeat | RSS end MB | fd peak | orphans | landed | replay | inv |
|---|---|---|---|---|---|---|
| 1 | 100 | 31 | 0 | 100/100 | ≡ | 0 |
| 2 | 116 | 106 | 0 | 100/100 | ≡ | 0 |
| 3–9 | 125 → 128 | 106 | 0 | 100/100 | ≡ | 0 |
| 10 | 140 | 106 | 0 | 100/100 | ≡ | 0 |
| 11–12 | 145 | 106 | 0 | 100/100 | ≡ | 0 |

The earlier 6-repeat run of the same command, with the timing columns in full:

```
| repeat | wall s | burst ms | max in flight | turn p50 ms | turn max ms | RSS peak MB | RSS end MB | fd peak | orphans | landed | replay | inv | load before → after |
| 1 | 0.3 | 155 | 100 | 143 | 189 | 96 | 100 | 40 | 0 | 100/100 | ≡ | 0 | 5.98 7.90 8.23 → 5.98 7.90 8.23 |
| 2 | 0.2 | 172 | 100 | 135 | 178 | 114 | 115 | 105 | 0 | 100/100 | ≡ | 0 | 5.98 7.90 8.23 → 5.98 7.90 8.23 |
| 3 | 0.3 | 207 | 100 | 136 | 220 | 124 | 124 | 105 | 0 | 100/100 | ≡ | 0 | 5.98 7.90 8.23 → 5.98 7.90 8.23 |
| 4 | 0.3 | 208 | 100 | 149 | 218 | 131 | 132 | 105 | 0 | 100/100 | ≡ | 0 | 5.98 7.90 8.23 → 5.98 7.90 8.23 |
| 5 | 0.3 | 192 | 100 | 151 | 210 | 136 | 139 | 105 | 0 | 100/100 | ≡ | 0 | 5.98 7.90 8.23 → 5.98 7.90 8.23 |
| 6 | 0.2 | 177 | 100 | 144 | 186 | 139 | 139 | 105 | 0 | 100/100 | ≡ | 0 | 5.98 7.90 8.23 → 5.98 7.90 8.23 |
exit=0
```

**"Simultaneous" is measured, not asserted.** `max in flight` sweeps the log's
own `[ignited, turn-ended]` intervals; ties at millisecond resolution resolve the
*end* first, so the number is a floor. It is **100 on every repeat of every run**
— the whole width really is in flight at once, and the fan-out is not serial in
disguise.

The fake ladder, ×3 repeats each, same session (`bun q1-fake-width.ts <w> 3`):

| width | wall s | burst ms | max in flight | fd peak | landed | replay | inv |
|---|---|---|---|---|---|---|---|
| 10 | 0.0 | 3–5 | 10 | 16 | 10/10 | ≡ | 0 |
| 25 | 0.1 | 23–40 | 24–25 | 24–30 | 25/25 | ≡ | 0 |
| 50 | 0.1 | 69–95 | 50 | 37–55 | 50/50 | ≡ | 0 |
| 100 | 0.3 | 209–225 | 100 | 18–105 | 100/100 | ≡ | 0 |

**No resource wall was reached at 100.** The exit code is the claim: every
invocation above exits 0, and the script's exit is gated on `inv == 0 && replay
≡ && orphans == 0 && landed == width`.

### Q2 — the real ladder: bar 5's second half. **GREEN to 25, no ceiling found.**

`bun q2-real-ladder.ts <width> personal [pass]`, account `personal`, sonnet·low
under `auto`, one T-echo turn per subject (`Reply with nothing but the token
ACK-nnn…`), work dirs in scratch, prompts never naming this repo (C4 F12). Every
rung ran twice. The ladder was never retried into anything and never stopped
early.

| width | pass | wall s | burst ms | turn p50 / p90 / max s | landed | transcripts | session collisions | tokens | rate-limit refusals | cost $ | $/turn | inv |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | p1 | 6.0 | 0 | 6.0 / 6.0 / 6.0 | 1/1 | 1/1 | 0 | 1/1 | 0 | 0.1355 | 0.1355 | 0 |
| 5 | p1 | 6.4 | 3 | 6.0 / 6.0 / 6.4 | 5/5 | 5/5 | 0 | 5/5 | 0 | 0.3227 | 0.0645 | 0 |
| 5 | p2 | 6.6 | 3 | 6.1 / 6.2 / 6.6 | 5/5 | 5/5 | 0 | 5/5 | 0 | 0.3228 | 0.0646 | 0 |
| 10 | p1 | 6.7 | 3 | 6.3 / 6.7 / 6.7 | 10/10 | 10/10 | 0 | 10/10 | 0 | 0.4726 | 0.0473 | 0 |
| 10 | p2 | 7.1 | 7 | 6.0 / 6.6 / 7.1 | 10/10 | 10/10 | 0 | 10/10 | 0 | 0.4720 | 0.0472 | 0 |
| 25 | p1 | 8.9 | 41 | 7.2 / 8.2 / 8.9 | 25/25 | 25/25 | 0 | 25/25 | 0 | 1.1324 | 0.0453 | 0 |
| 25 | p2 | 9.4 | 55 | 7.2 / 8.9 / 9.4 | 25/25 | 25/25 | 0 | 25/25 | 0 | 1.1109 | 0.0444 | 0 |

Load per rung, before → after (findings law 7): w1 `7.04 8.41 8.44 → 6.71 8.32
8.41` · w5 `7.26 8.23 8.37 → 6.89 8.12 8.33` · w10 `7.22 8.17 8.34 → 7.28 8.16
8.34` · w25 `7.28 8.16 8.34 → 13.99 9.61 8.85`. **Every arm started below the
batch note's load-8 gate** — `holdForLoad()` makes that mechanical, and it held
twice during the dig (`load 8.40 > 8 — holding`). The w25 after-load of 13.99 is
the arm's own 25 subjects, not somebody else's noise.

**Census fidelity is per-subject, not a count.** Each subject was told a distinct
token and each token came back in *that step's own* `structured_output.cause` —
`tokens 25/25` at every rung, with `session collisions 0` and one transcript on
disk per session id under `~/.claude`. Nothing crossed. Verbatim, w25 p1:

```
width 25 · wall 8.9 s · burst 41 ms · turn p50 7.2 s p90 8.2 s max 8.9 s · landed 25/25 ·
transcripts 25/25 · session collisions 0 · tokens 25/25 · rate_limit rows 25 / not-allowed 0 ·
cost $1.1324 ($0.0453/turn) · cache write 246732 read 597021 out 2597 · replay ≡ · inv 0
utilization five_hour 0.09 → 0.10 · seven_day 0.50 → 0.50 · statuses allowed
```

**Resume ids** are in the run logs' `ignited` rows — 81 sessions across
`summon/log/v3/c9/q2-*/run.jsonl`, one per subject, e.g. w1's
`2e18a358-31a6-4ca7-b0b6-9e65645ad246`. Recover the set with:

```
cd belvedere/v3/lab/c9 && bun -e '
import { readLog } from "../../engine/log.ts";
import { readdirSync } from "node:fs";
import { RUNS } from "./meter.ts";
for (const d of readdirSync(RUNS).filter((x) => x.startsWith("q2-")).sort())
  for (const e of readLog(`${RUNS}/${d}/run.jsonl`))
    if (e.kind === "ignited") console.log(d, e.step, e.sessionId);'
```

Subjects: all 81 dead at landing, checked by pid against the logs —
`ignited pids 81 · still alive 0`. Work dirs are scratch and die with it.

### Q3 — the cost extrapolation table. **G4's exhibit.**

`bun q3-cost-table.ts` re-reads every rung from the logs and streams; nothing in
it is typed by hand. Wall model fitted by least squares through the measured
rungs, and labelled as a fit wherever it leaves them.

Measured: **$/turn cold cache (width 1) $0.1355 · warm (width ≥ 10, n=4)
$0.0460** · wall `real 5.73 + 0.135·w s` · `fake 0.004 + 0.00253·w s`.

| flow | shape | fake $ | fake wall s | real $ | real wall s | basis |
|---|---|---|---|---|---|---|
| 10 steps | burst (all at once) | 0.00 | 0.03 | 0.46 | 7.1 | measured |
| 10 steps | serial (one at a time) | 0.00 | 0.06 | 0.55 | 59 | measured per-turn, summed |
| 25 steps | burst (all at once) | 0.00 | 0.07 | 1.15 | 9.1 | measured |
| 25 steps | serial (one at a time) | 0.00 | 0.16 | 1.24 | 147 | measured per-turn, summed |
| 50 steps | burst (all at once) | 0.00 | 0.13 | 2.30 | 12.5 | **extrapolated — never run: the real ladder stops at 25** |
| 50 steps | serial (one at a time) | 0.00 | 0.32 | 2.39 | 293 | **extrapolated** |
| 100 steps | burst (all at once) | 0.00 | 0.26 | 4.60 | 19.2 | **extrapolated — never run: the real ladder stops at 25** |
| 100 steps | serial (one at a time) | 0.00 | 0.64 | 4.69 | 587 | **extrapolated** |

Conditions on every real figure: `personal`, sonnet·low, `auto`, T-echo prompts,
2026-08-30, 1-min load ≤ 7.3 at every start. **The table's headline for G4: a
100-step real flow is under five dollars and under twenty seconds wide, or ten
minutes serial — the shape, not the size, is what costs.**

### Q4 — engine health at width. **GREEN, with one number that wants naming.**

- **Memory is bounded, and it is a plateau with steps rather than a flat line.**
  Over 12 consecutive width-100 runs in one process — 1,200 subjects — end-of-run
  RSS went 100 → 116 → 125 → 127 → 128 → 128 → 128 → 128 → 128 → 140 → 145 →
  145 MB. The increments decay to zero and hold for seven runs at a time; this is
  allocator arena behaviour, not a leak, and the honest statement is **bounded at
  ~145 MB for 1,200 subjects, not "no growth"**. A charge that runs an engine for
  days should watch it rather than assume it.
- **Zero orphan processes at terminal**, every run, fake and real: 12 × 100 fake
  pids and 81 real pids all dead when the flow reached terminal.
- **`replay(log)` ≡ `state()` exactly at width 100**, 12/12, by
  `JSON.stringify` deep compare — law 1 holds at the widest thing the campaign
  has run.
- **The nine invariants: 0 violations in every run of this charge** — 12 fake
  width-100 runs, the fake ladder, and all 7 real rungs.

---

**F1 — `rate_limit_event` fires on every single turn with `status: "allowed"`;
it is routine telemetry, and K2 as written would have fired at turn 2.** The
charge's kill criterion says "a second consecutive `rate_limit_event` on the
ladder → stop that arm". Measured at width 1 before the ladder began, one turn
emits exactly one:

```
{"type":"rate_limit_event","rate_limit_info":{"status":"allowed","resetsAt":1788120600,
 "rateLimitType":"five_hour","overageStatus":"rejected","overageDisabledReason":"org_level_disabled",
 "isUsingOverage":false,"unifiedWindows":{"five_hour":{"utilization":0.09,"resetsAt":1788120600},
 "seven_day":{"utilization":0.5,"resetsAt":1788343200}}},...}
```

Evidence: `summon/log/v3/c9/q2-w1-personal/streams/s000.t0.jsonl` — one turn, one
event; and the rung table's `rate_limit rows N / not-allowed 0` at every width,
N always equal to the turn count. **This is a wrong question, and it is answered
rather than dodged:** the ladder was run under the criterion's *intent* — the
alarm is `rate_limit_info.status !== "allowed"`, which never fired, so K2 never
fired either, and no rung was stopped. The literal criterion is unusable and the
Architect should re-word it before any charge inherits it. C8 F10 / grammar §11
name the event's existence; nothing named its ubiquity, and a reader of either
would have got this wrong. **Relayed to the bulletin** (`2a6af07`).

**F2 — a one-shot headless turn costs ~2× a turn in a warm account, and the
whole difference is a cold prompt cache; the cache is shared across simultaneous
subjects.** Width 1: 2 input tokens, 103 output tokens, **33,624
`cache_creation_input_tokens`, 0 `cache_read`**, $0.1355. Width 5, minutes later:
14,931 cache-write and 18,693 cache-read *per turn* — so most of the width read
the cache the width-1 run had written. Width 25: 9,869 write / 23,881 read per
turn, $0.0453. **Per-turn cost falls as width rises** (0.1355 → 0.0645 → 0.0473 →
0.0453) and asymptotes at ~$0.044 once the read is the full ~24 k prompt. Two
consequences: **(a)** any v3 cost estimate that multiplies one per-turn figure by
a step count is wrong in whichever direction the cache falls — N one-turn
sessions pay N partial cache writes, one session resumed N times pays one; **(b)**
**width is cheaper per turn than serial**, which is the opposite of the usual
intuition and is why Q3's table splits the two shapes. Evidence: the `usage`
block of each rung's `result` rows, tabled above by `q3-cost-table.ts`.

**F3 — width is very nearly free in wall time: 25 real subjects cost 1.5× the
wall of one.** 6.0 s at width 1, 8.9/9.4 s at width 25 — a fitted `5.73 +
0.135·w`. Ignition burst (first `ignited` to last) is **3 ms at width 5 and
41–55 ms at width 25**, so the engine's own fan-out is nothing next to a turn.
C4 F10 measured this at 10 and this extends it to 25 with the ladder run twice.
**No substrate-imposed ceiling exists below 25** — the charge's stop condition
never triggered, and the honest limit statement is "not found at 25", never
"there is none". The 25 ceiling is C4 Q8's, raised for this arm alone; nothing
here justifies raising it further without measuring.

**F4 — the engine holds exactly one file descriptor per in-flight subject, not
three.** `fd peak 105` at width 100 (100 tails + this process's five baseline
descriptors), against 106 for the 12-run session. `spawn.ts` opens the stream
and the stderr file, hands both to the child and closes its own copies in a
`finally`, so only the tail's read descriptor survives the spawn. At the
machine's `ulimit -n` of 1,048,576 (`kern.maxfilesperproc` 138,240) the
descriptor budget is not a wall this design can hit. Evidence: `/dev/fd` sampled
every 5 ms in-process, `q1-fake-width.ts`.

**F5 — the substrate hands out a free account-quota gauge, in band, on every
turn.** `rate_limit_info.unifiedWindows.five_hour.utilization` and
`.seven_day.utilization`, both 0..1, ride the `rate_limit_event` of F1. Over
this whole charge they moved `five_hour 0.09 → 0.11` and `seven_day 0.50 → 0.50`
— i.e. 81 sonnet·low turns cost ~2 points of the five-hour window. **A deck can
read the account's remaining quota off any turn's stream without a probe of its
own**, which is the only in-band answer the Guild has to the standing "sessions
cannot see `/usage`" gap. Out of scope here; named for C10 and G4. **Relayed to
the bulletin.**

**F6 — the load gate is worth having and it fired.** `holdForLoad()` refused to
start an arm twice (`load 8.40 > 8 — holding`, `load 8.27 > 8 — holding`) on a
desktop that sat between 6 and 9 all afternoon. A charge that timed arms by hand
on this machine would have published contaminated numbers roughly half the time.
Any future timed charge on this desktop should inherit the gate rather than
re-invent the discipline.

**Out of scope, untouched, filed here:** nothing was changed in `engine/` (the
target held still, as the batch note requires — C10's step 0 lands on unmodified
bytes); no cross-account burst was run; nothing above 25 real was spawned;
retention of the telemetry under `summon/log/v3/c9*` is unruled.

---

```
You are a Digger at opus-medium.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/digger.md,
then read ~/code/agents/belvedere/v3/README.md
and execute the charge ~/code/agents/belvedere/v3/plans/c9-scale.md.
```
