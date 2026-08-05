# 05 — Saturation harvest: snappy batch-1 lessons → canon

**Status:** LANDED 2026-08-05 · **Depends on:** — · **Staffing:** Grand Architect · fable-max

## Mission

Rule on three proposed canon amendments harvested from snappy's batch-1 saturation
incident (2026-08-04): a scheduling law for the doctrine, a resource duty for the
Dispatcher charter, and a measurement-conditions clause for the findings law. Enter what
survives (verbatim or amended) as D-entries pending Felix's countersign; reject the rest
with the defense appended here. Drafted by an Architect session (2026-08-05, Felix
present) and routed here because the Architect never patches canon locally
(`architect.md` §escalation).

## Inputs — read before working

Birthplaces (the harvest law requires them):

- `~/code/universal_robots_sdk/cap-mega/snappy/README.md` — §2 law 5 + its batch-1
  amendment; §6.1 (the breached cell cap), §6.2 (timing law), §6.8 (the schedule rides
  the summons); D8 (Felix's live cap ruling), D9 (venue physics + scheduling law).
- `~/code/universal_robots_sdk/cap-mega/snappy/plans/BULLETIN.md` — the incident live:
  cell announcements, Felix's 18:20 ruling, slot handoffs, clean-window re-runs. 1,131
  lines; the 17:45–20:10 span is the arc.
- Canon targets: `canon/work/DOCTRINE.md` §4, §6, §10; `canon/mantles/dispatcher.md`
  §§1–5.

Do not re-derive: the synopsis below is evidence-checked against the birthplaces —
verify quotes if in doubt, don't re-run the forensics.

## The story — synopsis

2026-08-04, snappy P0 batch 1: six parallel forensics rows, one OrbStack cell each, a
`sonnet-medium` Dispatcher tending. Felix pasted the Dispatcher summons without reading
the Architect's full handoff — the designed autopilot behavior — and left ~45 minutes.

The working agreement (README §6.1) said **"at most 2 snappy cells with live instances
concurrently."** All six rows initialized cells anyway; several **quoted the cap while
breaching it** ("already one over the limit; 03 needs a cell to measure" — at the fourth
and saying so rather than queueing). Each agent read the law as its own compliance;
nobody owned the sum. Host load climbed 6.7 → **328**, swap hit 7.9 GB, the OrbStack
control plane jammed (~17:45–18:50). Felix returned, ruled a live cap (D8: "2 at a
time," amended to 3), and stopped machines himself; the Dispatcher enforced slot
handoffs flawlessly from then on (bulletin 18:20/18:22).

**No data corrupted.** Counts-and-mechanism findings are load-immune; every timing row
re-ran in announced clean windows, parked numbers PENDING, or marked arms inadmissible —
because law 5 forced host conditions to be recorded next to every number, contamination
was visible instead of silent. Both 57-case suite runs green post-recovery; the batch
merged clean at Architect review.

The physics kicker: RAM — the gauge the original cap was reasoned from — **stayed green
through the entire thrash**. Every OrbStack "machine" is a namespace in ONE Linux VM:
one kernel, one 14-core pool, one load average. CPU/paging is the gauge; the quiet unit
is the VM (law-5 amendment, D9).

Snappy is already patched locally (D9, §6.8): schedule + ceiling ride the batch note AND
the Dispatcher summons verbatim; cross-row ceilings are the Dispatcher's first duty;
mechanical enforcement (cell init refusing over-ceiling) parked to simmy's board. This
row exists because the residue is canon-shaped, not snappy-shaped.

## The defect in canon

- `dispatcher.md` §2, verbatim: *"rows marked parallel-safe go out in a single parallel
  send."* Six cells at once was **compliance with canon**, not deviation from it. The
  charter is the birthplace of the failure mode.
- "Parallel-safe" in the doctrine marks doc/file collision safety — a correctness
  judgment. Nothing in canon asks whether the host can bear the simultaneity — a physics
  judgment. The conflation is the root defect; every future project with VMs, GUIs,
  builds, or benchmarks inherits it.
- A prose cap in working agreements is a commons problem in a compliance costume:
  per-agent local reasoning, unowned sum. The proven fix (snappy §6.8): compile the
  constraint into a schedule, carried in the one text guaranteed to be read (the
  summons), owned by the one session that sees every row (the Dispatcher).
- The Dispatcher charter grants **no halt authority** — Felix had to stop the machines
  himself.

## Proposed D-entries — rule on each

Numbered assuming D28–D30 are next free; renumber at entry if DECISIONS moved.

- **D28 — The parallel-affordable law** (edits: `DOCTRINE.md` §4 batch-note bullet +
  §10 the cut). "Parallel-safe" (no file/doc collisions) and "parallel-affordable"
  (shared live resources bear the simultaneity) are separate judgments; the doctrine
  currently knows only the first. When a batch's rows contend for live resources — VMs,
  hardware, GUI instances, CPU-heavy builds, timed measurements — the batch note carries
  the **concurrency plan**: ceiling, waves or strictly-serial, and the gauge to hold on
  (e.g. "hold timed arms until load < 12"); the Dispatcher summons carries the plan
  **verbatim**. A constraint living only in a working agreement is invisible at dispatch
  time. Cross-row scheduling is a fork the pre-chew law reserves to the cut — decided by
  the Architect, never emergent from compliant rows. Birthplace: snappy §6.8 + D9.

- **D29 — The Dispatcher's resource duty** (edits: `dispatcher.md`, four surgical
  amendments). (1) §1 prerequisite: a parallel batch whose rows share live resources
  and whose batch note names no concurrency plan is an escalation **before anything
  dispatches** — same class as a named-but-undefined tier. (2) §2: dispatch follows the
  batch note's plan; "single parallel send" applies only within a wave; held rows go out
  as slots free. (3) §3 tending: read the plan's gauge before each dispatch and at
  wedge-watch cadence; hold while hot. (4) §3/§5: host saturation is an escalation
  trigger, and pausing or stopping running agents to enforce the plan or arrest
  saturation is **logistics, explicitly allowed**. Tier unchanged: sonnet-medium
  enforced slot handoffs flawlessly once the plan existed as orders (bulletin 18:20
  onward) — never escalate tier to compensate for incomplete orders. Birthplace: snappy
  D8/D9, bulletin.

- **D30 — Measurements carry their conditions** (edits: `DOCTRINE.md` §6 findings law,
  new clause). A timed or resource-sensitive measurement's evidence includes the host
  conditions it ran under; contaminated numbers are re-run in a clean window or parked
  PENDING — never averaged, never shipped silently. The one defense in the incident that
  **provably worked**: batch-1's verdicts survived a load-328 thrash auditable because
  per-number host-condition records made contamination visible. Weakest anti-sprawl
  case of the three — rule accordingly. Birthplace: snappy §2 law 5 + D9.

## Rejected for canon — defended (uphold or overturn)

- **Smarter Dispatcher (tier escalation):** the failure was incomplete orders, not
  insufficient judgment; the doctrine's economics need cheap tenders, and the charter's
  staffing note already says measure first.
- **Human reads everything:** an autopilot that is safe only when the human reads every
  word is not an autopilot. The summons being the only guaranteed-read text is D28's
  premise, not a human duty.
- **Machine enforcement in canon** (cell init refuses over-ceiling): the principle is
  already Directive 2.1 (invalid states unrepresentable); the implementation is venue
  tooling — parked on simmy's board where snappy filed it. Canon states the law; venues
  enforce their own physics.
- **Any new artifact:** the batch note and the summons already exist and already reach
  the right readers. Anti-sprawl.

## Deliverables

- A ruling on each of D28–D30: entered (verbatim or amended) in `DECISIONS.md` marked
  "(proposed — pending Felix countersign)" — Felix is in the room; countersign live —
  or rejected with the defense appended under Findings.
- Canon edits per ruling. No deploy run needed: `DOCTRINE.md` is referenced by path,
  never deployed (D16); mantles are read by path (D12).
- Findings appended here; board row 05 trued; ledger appended; committed in Felix's git
  style.

## Out of scope

- Retrofitting snappy/simmy/hexwright onto the amended canon — v2 law (GENESIS §6);
  snappy is already locally patched (D9).
- Building enforcement tooling, anywhere.
- Touching tiers, the global CLAUDE.md, or the sync set.

## Findings

**2026-08-05 · Grand Architect — the harvest ruled.** Birthplaces read before ruling
(harvest law): snappy README §2/§6/D8–D10 and the bulletin arc. The synopsis above
checked clean against all of them — breach-while-quoting verbatim at bulletin:119
("already one over README §6.1's 'at most 2 snappy cells live concurrently'. 03 needs a
cell to measure at all, so it is bringing up `snappy-03` as the fourth"); Felix's ruling
at load 126.87 (bulletin:748); peak 328.72 / swap 7.9 GB (bulletin:919/926); slot
handoffs and HOLDING discipline from 18:20 on (bulletin:754/799/949). No correction
needed.

- **D28 ENTERED, amended.** Edit sites extended beyond DOCTRINE §4/§10 to two surfaces
  the proposal missed: `architect.md` review-loop step 6 (the charter that performs the
  cut must name the plan — law that binds the cut but doesn't live where the cut is
  performed would be D28's own defect one level up) and `templates/genesis.md`'s
  batch-note slot (future projects instantiate the plan from day one).
- **D29 ENTERED, amended.** The four proposed amendments, plus two that complete the
  law's own chain: a §7 forbidden line — *dispatching past the batch note's ceiling, or
  into a hot gauge* — because the single-glance list must catch the incident's exact
  move; and a §8 summons slot carrying the plan verbatim — D28 requires the summons to
  carry it, so the charter's own summons template is the delivery vehicle. §2's intro
  gains "on the batch note's schedule" so the section's command and its bullets can't
  contradict. Tier ruling upheld: `sonnet-medium`, unchanged.
- **D30 ENTERED, amended.** The strike disposition added (the incident record shows all
  three: re-ran / parked PENDING / marked inadmissible), and the clause lands as §6
  **clause 7**, not an insert at 3: clause numbers are live external references — snappy
  cites doctrine §6.5 — and renumbering would break them silently or force a mid-campaign
  retrofit this row's own fence forbids. Survives its anti-sprawl flag on its record:
  the one defense that provably worked.
- **Rejections: all four UPHELD** as defended above — tier escalation (the failure was
  incomplete orders, not judgment), human-reads-everything (kills the autopilot),
  machine enforcement in canon (venue tooling; the principle is already Directive 2.1,
  the implementation is parked on simmy's board), new artifacts (the batch note and the
  summons already reach the right readers).
- **D31 cut in the same session** (Felix's ask, rode the summons): hive-city as canon
  voice. Epigraph amended across all eight carriers; DOCTRINE §1 names stigmergy the
  hive's way; GENESIS §1 closes "Three hives, one city"; the repo CLAUDE.md closer leads
  with the hive. Flavor altitude only — law text stays surgical; no renames (D25); the
  global `canon/CLAUDE.md` untouched (D24 byte-discipline).

D28–D31 queued in `DECISIONS.md`, all **(proposed — pending Felix countersign)**. No
deploy run needed: DOCTRINE and mantles are read by path (D16/D12) — sessions started
after this land see the amended law immediately.

---

Kickoff (verbatim):

```
You are the Grand Architect at fable-max.
Wear ~/code/agents/canon/mantles/grand-architect.md,
then read ~/code/agents/plans/05-saturation-harvest.md and run the harvest:
rule on D28–D30, amend canon where ruled, and queue the countersigns for Felix.
```
