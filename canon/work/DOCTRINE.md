# The Work Doctrine

> *The Grand Architect keeps the canon, Architects think, Dispatchers tend, Diggers dig,
> Builders build — a hive building a city; files carry the truth.*

How work is represented in any project: the doc pattern that lets a session start cold in
two minutes, agents run in parallel without collisions, and truth survive every context
wipe. The mantles (`canon/mantles/`) say who does what; this file says what the files are.
Distilled from two proven implementations — hexwright (`~/code/hexwright`) and simmy
(`~/code/universal_robots_sdk/cap-mega/simmy`) — birthplaces cited inline; new law only
where evidence forced it.

## 1. First principles

- **Files carry the truth.** Sessions coordinate through documents, not memory —
  stigmergy, the hive's way: agents leave trails, trails direct agents (hexwright
  GENESIS §7). Anything worth keeping is written where the next session will look; a
  conversation is a cache that WILL be dropped.
- **One function, one home.** No document does two jobs; no truth lives in two places.
  Duplication is how docs rot — the copy nobody updated becomes a lie.
- **The two-minute start.** Every artifact exists to answer a cold session's question
  (§2). If a session needs twenty minutes of rediscovery, the docs failed, not the
  session.
- **Append, fold, strike.** Evidence appends as it lands (findings, ledger, bulletin);
  the Architect folds it into durable docs at review; superseded text is struck with a
  dated note, never silently rewritten.
- **A documented kill is a win.** The campaign learns as much from a clean NO as from a
  YES (simmy README §6).
- **Anti-sprawl.** Documents and directories are instantiated when needed, never before
  — the filing cabinet is not built ahead of the files (hexwright GENESIS §7). A weekend
  repo is not a seven-file bureaucracy (§3).
- **Auto-loaded bytes are taxed.** `CLAUDE.md` loads into every session — every line
  pays rent or moves out.

## 2. The artifacts — a cold session's questions

| The question | The answer | Law |
|---|---|---|
| How do we work here? | `CLAUDE.md` — auto-loaded orientation | §3 |
| What is this, what's the plan? | the master doc (`GENESIS.md` / `README.md`) | §3 |
| What's the state of work? | the board, in the master doc | §4 |
| What do I do right now? | your work doc — a brief or an order | §5 |
| What have we learned? | findings, appended under each work doc | §6 |
| Where were we? | the `LEDGER.md` tail | §7 |
| What's been decided? | `DECISIONS.md` | §8 |
| What changed mid-flight? | the bulletin — parallel batches only | §9 |

## 3. The file set and the scaling law

A **full project** (weeks+, multiple mantles) carries at its root:

```
CLAUDE.md      orientation: what this is, hard laws, session protocol — auto-loaded
dream.md       Felix's dream, when one exists — IMMUTABLE: never edited, only read
GENESIS.md     master doc: architecture, the bet, non-goals, board, agreements, DoD
LEDGER.md      append-only session log
DECISIONS.md   ratified choices — D-entries
plans/         work docs (briefs + orders); RIDER.md once dispatching starts
docs/          durable distillations — once findings outgrow the master doc
lab/           disposable code by row id (lab/<id>/) — runnable scripts, not transcripts
```

A **subproject or spike repo** starts as ONE file: `README.md` as the master doc —
what/why, board, decisions section, working agreements, DoD — plus work docs. Simmy ran
a ten-session parallel campaign this way and never needed more (simmy README).

**Split rule:** a section moves to its own file when it outgrows the master doc or gains
its own write pattern — decisions split out when the countersign workflow arrives; `docs/`
when the first fold needs a home; the bulletin exists only during parallel batches (§9);
the rider when the first batch dispatches (§10). Never split ahead of need.

- **Naming law (D25):** **ALLCAPS for protocol singletons; lowercase-kebab for
  addressable siblings.** A file is ALLCAPS when both tests pass: only one of it can
  exist in its scope, AND sessions are told to read it as protocol — `CLAUDE.md`,
  `GENESIS.md`, `README.md`, `LEDGER.md`, `DECISIONS.md`, `DOCTRINE.md`, `RIDER.md`,
  `BULLETIN.md`, `SKILL.md`. One of many addressable siblings is lowercase-kebab — work
  docs (`plans/04-sync.md`), mantle charters, tiers, templates. `dream.md` (né
  `initial.md` — D33) stays lowercase by the second test: a singleton, but an artifact
  interpreted once at founding, not a protocol followed. Practiced since
  hexwright/simmy; codified 2026-08-03.
- **CLAUDE.md law:** target ≤ ~60 lines (hexwright's budget). What this is (2–3 lines),
  hard laws (project physics only — Felix's global directives already load), session
  protocol, pointers. State digests rot: point at the board and ledger, don't restate
  them. A subproject adds ONE pointer line to the repo's `CLAUDE.md` and keeps its docs
  with itself (simmy D4).
- **The master doc** holds the durable design AND the board: architecture, the bet,
  defended non-goals, working agreements (project physics — venues, shared and live
  resources, branch rules), definition of done. Corrections fold in as dated amendment
  notes (simmy's `> **S0 correction (08-02).** …` blockquotes) — the doc stays current,
  the history stays visible.
- **dream.md** exists when Felix has an origin dump — his dream for the project;
  everything else is born from it. Immutable from the moment it lands: the master doc
  interprets it; nobody edits it (hexwright's law; renamed from `initial.md`, D33).
- **plans/ stays flat** until a single board stops working; then subdivide by area
  (hexwright `plans/core/`). An area split is an Architect decision, never a default.

## 4. The board

The board is the project's single work-state table, and it lives in the master doc — not
a separate `BOARD.md`: that's an extra hop on every cold start, and neither parent ever
needed one. **Any table that staffs sessions is a board**, and this section is its law —
a build board inside a contract doc is not exempt by its venue (D45).

**A row is one dispatchable unit of work = one work doc = one session.**

| ID | Work | Depends on | Staffing | Status |
|---|---|---|---|---|

- **ID** — stable, never reused; the work doc carries it (`plans/04-sync.md`).
- **Work** — one line: the question (brief) or the mission (order).
- **Depends on** — row ids that must be LANDED first ("—" when none), plus any named
  gate (a countersign, a blessing).
- **Staffing** — mantle · tier, both verbatim (`Digger · opus-high`). Staffing guidance
  lives in the tier descriptions (`canon/agents/`) — the single home; boards point,
  never duplicate.
- **Status** — the lifecycle below, plus annotations: dates, findings pointers, unmerged
  branch names.

**The lifecycle:** `OPEN → IN FLIGHT → LANDED / KILLED`

- **OPEN** — cut and staffed; dispatchable the moment its dependencies are LANDED.
- **IN FLIGHT** — a session owns it, timestamped.
- **LANDED** — contract met: findings filed where the work doc says, status current,
  commits present; for orders, the DoD evidenced.
- **KILLED** — ended on purpose, the kill documented with evidence. A documented kill
  is a win, not a failure.
- **BLOCKED** — stopped at a fork the work doc didn't pre-chew. Transient by law: the
  row sits at the Architect's desk until it is re-cut, killed, or escalated to Felix.
- **PENDING** — an annotation, not a lifecycle state: a named remainder waiting on an
  external precondition (a login, hardware reach). Recorded, not blocking; nobody
  dispatches PENDING (simmy's Pi cells; this campaign's Max `/login`).

Retired synonyms — do not use: DONE, CLOSED (→ LANDED or KILLED), WIP (→ IN FLIGHT),
TODO (→ OPEN), AUTHORED (a filed design is LANDED; its blessing gates the NEXT row).

**Gates are rows (D44).** A judgment step between rows — a merge review, a landing
verification, a blessing checkpoint — is itself a row: ID'd, staffed (mantle · tier),
dependencies naming what it gates, kickoff verbatim (riding the batch note or the gated
row's work doc — a gate needs a kickoff, not necessarily its own doc). A gate whose
judgment is executable against the docs — merge-or-reject against a blessed spec and
DoD — is dispatchable: a scoped Architect review (architect charter, Summons). A gate
that is really Felix's — a countersign, a budget blessing, taste — is a **named
Felix-gate**: the chain pauses there; nobody dispatches past it. A gate living only in
prose is invisible at dispatch time — D28's law, applied to sequence (birthplaces:
batch 2's countersign pauses; manny's M2 review; units' gate column, invented in the
field the day before this law).

**Under the board:**

- **Batch notes** — the Architect cuts each batch as a dated note: which rows, parallel
  or sequential, who tends (a Dispatcher, or Felix direct). Parallel-safety is marked
  here and in the work-doc headers. **Parallel-safe is not parallel-affordable:** safety
  is correctness (no file/doc collisions); affordability is physics (the shared live
  resources bear the simultaneity). When rows contend for live resources — VMs, hardware,
  GUI instances, CPU-heavy builds, timed measurements — the note carries the
  **concurrency plan**: ceiling, waves or strictly-serial, and the gauge to hold on
  ("hold timed arms until load < 12"). The plan rides this note AND the Dispatcher's
  summons verbatim — a constraint living only in a working agreement is invisible at
  dispatch time (snappy §6.8/D9: six rows each read the cell cap as its own compliance;
  nobody owned the sum).
- **The parked list** — real but out of scope: tracked, not lost (simmy README §7).
  Items enter with a pointer; they leave by promotion to a row (struck through, with
  "promoted to <id>") or by deletion when the project closes.

## 5. Work docs — briefs and orders

Two genres, one skeleton. **A brief digs; an order builds.** Both are self-contained and
sized to one session; what a session cannot finish at quality becomes a new row — never a
rushed draft (this repo's D4, generalized). Both are **pre-chewed on purpose**: every
fork a cheaper session could meet is either decided in the doc or named as a
kill/escalation point — the reader never guesses.

The shared skeleton:

```
# <ID> — <title>
**Status:** … · **Depends on:** … · **Staffing:** <mantle · tier>
   (· **Parallel-safe with:** <rows> — when cut into a parallel batch)
## Mission | Question(s)
## Inputs — read before working      ← incl. what's known: "do not re-derive"
<the genre core — below>
## Deliverables
## Out of scope                      ← mandatory in orders; in briefs when creep is live
## Findings                          ← *(append here)*
---
Kickoff (verbatim), fenced
```

**The brief core (Digger):** the questions · the method — a suggested route, not law:
a fork the brief names is the Digger's to take, an unnamed one stops the work ·
**kill criteria, mandatory** — what stops each line, written so a cheaper session
recognizes the trigger without judgment (simmy spike anatomy).

**The order core (Builder):** the goal · the spec, **blessed before dispatch** — who
blessed it, when, recorded in the header · **acceptance criteria / DoD, mandatory and
measurable** — named checks whose output is pasted in as evidence at build time ·
**out of scope, mandatory** — the fence; creep is a bug (hexwright WO anatomy).

**Kickoff law:** every work doc ends with its kickoff prompt, fenced, verbatim, in the
canon summons grammar (`canon/mantles/README.md`). Nobody edits a kickoff except the
Architect re-cutting the row. Dispatch = kickoff + project rider, nothing else. The
single-glance test (D45): a kickoff's first line is the summons line — `You are a
<Mantle> at <tier>.` — a kickoff that doesn't open by naming both is malformed; fix it
before dispatch.

## 6. Findings law

Findings are the evidence record: what was learned, with proof. They append under the
work doc's `## Findings` while the row runs, and are never edited after it closes — the
fold (below) carries truth forward; findings remain its provenance.

1. **Evidence-grade, every claim:** the command and output (or file§ pointer) that
   proved it rides with the claim. A claim without evidence is a draft (simmy §8 — the
   ursim-issues forensic standard).
2. **Probes ship with a control.** A negative result is a claim about what didn't
   happen; it counts only when a control proves the probe could have seen the effect.
   Birthplace: the 04 sync spike returned two false negatives that only their control
   arms caught (this repo's ledger, F6/F11) — silence without a control routes
   decisions onto false evidence.
3. **A discovery that changes another row's plans** goes out the moment it's made: to
   the bulletin during parallel batches (§9), into the report's escalation otherwise.
   Findings sections are the archive; the bulletin is the wire.
4. **Builder findings:** evidence pasted into the order's DoD checklist; deviations
   from spec and adjacent discoveries under `## Findings`; the commits are the primary
   artifact.
5. **Worktree rows:** findings and work-doc edits ride the row's branch; the board
   carries the branch name until the Architect merges or rejects at review.
6. **Fold and strike** (the Architect, at review): findings fold into the durable docs
   they amend — master doc, `docs/` pages, D-entries; superseded text is struck with a
   dated note; the real-but-out-of-scope is parked. After the fold, durable docs are
   the current truth and findings are how it got there.
7. **Measurements carry their conditions.** A timed or resource-sensitive number's
   evidence includes the host conditions it ran under (the project's gauge — load,
   contention, venue state). Contaminated numbers are re-run in a clean window, parked
   PENDING, or struck inadmissible — never averaged into a verdict, never shipped
   silently. Birthplace: snappy §2 law 5 — per-number host records kept a load-328
   saturation auditable; every batch-1 verdict survived (snappy D9).

## 7. The ledger

`LEDGER.md` — append-only, one entry per session, newest last, `---` between entries:

```
**<date> · <mantle> (<row id, when the session ran one>)** — <what changed: outcomes +
pointers>. Decided: <D-ids, or "nothing">. Next: <the handoff — the next summons
verbatim when known>.
```

The acceptance test: **the tail alone reboots a cold session.** Write it for the
stranger who reads it next — that stranger is you (hexwright format, ratified). Sessions
too small for a row still get an entry; the ledger is the one file that sees everything.
Exception at subproject scale: a pure spike-board campaign may lean on board + findings
alone (simmy did) — the moment a session does work no single work doc captures, the
ledger starts.

## 8. Decisions

`DECISIONS.md` — one entry per ratified choice: the choice, the why, evidence pointers.
Monotonic ids, never reused, never rewritten:

```
- **D<n>** (<date>, <decider> [· ✓ Felix]): **<title>.** <body>
```

- **Attribution is honest:** the decider named is whoever actually decided. A decision
  that is really Felix's — money, hardware, external commitments, taste — carries his
  name and waits for him (architect charter).
- **Dispatched and delegated sessions** mark entries **"(proposed — pending Felix
  countersign)"**; countersign converts the mark to `✓ Felix`, amendments recorded in
  place ("amended at countersign: …" — this repo's D9).
- **Amendment law:** append, never rewrite — "(amended <date>: …)" inside the entry, or
  a superseding entry that names what it supersedes.
- **The decision queue** is not a file: it is the set of proposed-not-yet-countersigned
  entries plus open escalations. The tending session surfaces it to Felix at every
  boundary — batch reports list it, ledger entries name it in Next.

## 9. The bulletin — the wire between parallel agents

Exists ONLY while a parallel batch runs; sequential campaigns never create one. The
Dispatcher creates `plans/BULLETIN.md` (next to the work docs — simmy's lived at
`spikes/BULLETIN.md`) at the first parallel dispatch, protocol in its header.

- **Protocol:** every agent reads the bulletin before each major method section, and
  appends the moment a discovery changes another row's plans — not at landing time.
- **Entry format** (simmy's, ratified):

  ```
  ## <date> · <from> → <audience>
  <verbatim finding — no paraphrase>
  Evidence: <file§ / command / log pointer>
  ```

- **Verbatim law:** copied excerpts, never summaries — a paraphrase is a defect
  (dispatcher charter).
- **Who writes:** agents append their own entries mid-flight; the Dispatcher commits
  bulletin updates, and copies the relevant excerpts from landed findings while others
  still run. Worktree agents append via the MAIN checkout's absolute path and leave the
  append uncommitted — everything else rides their branch.
- **Archive:** none. Append-only for the campaign's life; the Architect's fold makes
  entries archival where they stand; findings sections remain the archive of record.

## 10. Batches — how the docs run agents

- **The Architect cuts; the Dispatcher runs.** The cut is a board act: rows OPEN,
  dependencies LANDED, staffing named, parallel-safety marked, batch note dated — and
  when rows contend for live resources, the concurrency plan cut with it (§4). Gates
  are cut as rows (§4), Felix-gates named — and **the cut maximizes the run between
  Felix's judgment calls** (D44): every foreseeable Felix-fork in the arc is surfaced
  and ruled at blessing time so his rulings travel in the docs; what remains of him is
  the named gates, batched, never dribbled. A chain that stops for something the cut
  could have pre-ruled is a mis-cut.
  Cross-row scheduling is a fork the pre-chew law reserves to the cut: the Architect
  decides it, the summons carries it, the Dispatcher enforces it — never left to emerge
  from individually compliant rows. Dispatch mechanics, tending, relay, and the batch
  report are the Dispatcher charter's law — the doctrine fixes only the files they touch.
- **The rider** is instantiated ONCE per project, as `plans/RIDER.md`, from the canon
  template (`canon/mantles/README.md`), filling the three slots: working-agreements ref
  (a master doc §), bulletin path (drop the sentence when batches are sequential), and
  worktree specifics (branch rules). It is appended verbatim to every dispatched
  kickoff; nobody edits it per-dispatch.
- **Worktree law:** the shared checkout's branch is NEVER switched — parallel sessions
  live there (simmy §8). Work that needs a branch runs in a worktree, and its work doc
  says so; the board records unmerged branches until the Architect merges or rejects.
- **The batch report** (dispatcher charter §6): a table — row / status / one-line
  outcome / pointers — plus the escalation list and the relay log. Pointers, not prose;
  the findings files are the content.

## 11. The session contract

Every session, any mantle:

- **Start:** `CLAUDE.md` (automatic) → the master doc, or the sections your summons
  names → the ledger tail → your work doc → the bulletin, when one exists. Two minutes,
  productive.
- **End:** state written where the docs say it goes — findings appended, statuses
  current, board trued (Architect) — then the ledger entry, then commits in Felix's git
  style. **The test for whether clearing is free: everything the next session needs
  lives in the repo, not the conversation** — if it doesn't yet, write it down first;
  that's the signal you weren't at a clean boundary (hexwright CLAUDE.md, ratified).
  Suggest the break, and end with **the baton** (D42): open escalations and the
  decision queue first, then exactly one fire-now next move — the next summons
  verbatim, or the named Felix-action (a countersign, a smoke, a ruling) when the next
  move is his — any further moves explicitly ordered behind it. A menu of nexts with
  no ordering, or a kickoff produced only on request, is a malformed close.

## 12. Founding a project — the genesis ritual

A new project boots onto the doctrine in one founding session:

1. **Felix:** repo + `git init` (branch `master`, never main); the origin dump lands as
   `dream.md` if one exists — immutable from that moment.
2. **Summon the founding Architect** — a foundational session, `fable-max` (architect
   charter staffing):

   ```
   You are an Architect at fable-max.
   Wear ~/code/agents/canon/mantles/architect.md,
   then read ~/code/agents/canon/work/DOCTRINE.md
   and <dream.md | Felix's telling>, and found the project.
   ```

3. **The founding session:** interrogate the vision — question every requirement,
   define minimal scope, defend against creep — then instantiate from
   `canon/work/templates/`: `CLAUDE.md`, the master doc with its board (first rows cut
   and staffed), `LEDGER.md` (entry one), `DECISIONS.md` (the day-one ratifications:
   name, scope, non-goals — there are always some). Subproject scale: `README.md`
   alone (§3).
4. **Hand off:** first batch cut or first summons handed verbatim; ledger appended;
   committed.

The Grand Architect founds nothing here — that mantle keeps the canon; every project is
its own Architect's board.

## 13. Glossary — the working verbs

- **bless** — approve a spec or design for construction. Orders build only against
  blessed specs; the blessing (who, when) is recorded in the order.
- **ratify** — make a choice a D-entry.
- **countersign** — Felix confirms a proposed D-entry (`✓ Felix`).
- **mint** — bring a new canonical artifact into existence (a tier, a template).
- **park** — set aside as real but out of scope, onto the parked list; tracked, not
  lost.
- **true** — bring a record back to match reality (the board: statuses, dependencies,
  staffing).
- **fold** — distill findings into the durable docs they amend.
- **strike** — visibly retire superseded text with a dated note; never silent deletion
  in a durable doc.
- **pre-chew** — decide every meetable fork in the work doc, or name it a kill or
  escalation point, so a cheaper session never guesses.
- **cut** — author into existence on the board or record (a row, a batch, a D-entry).
- **baton** — what a session ending facing Felix ends with: escalations, then exactly
  one fire-now next move — the next summons verbatim, or the named Felix-action —
  further moves ordered behind it (D42).
- **Felix-gate** — a gate row whose judgment is really Felix's (a countersign, a
  blessing, taste): the chain pauses there; nobody dispatches past it (D44).

## Templates

`canon/work/templates/` — skeletons with ⟨slots⟩; the genesis ritual instantiates them.
Referenced by path, like the mantles; never deployed to config dirs (GENESIS §4).

| Template | Becomes |
|---|---|
| `claude-md.md` | the project `CLAUDE.md` (named so the skeleton is never auto-loaded) |
| `genesis.md` | the master doc — `GENESIS.md`, or trimmed into a `README.md` |
| `ledger.md` | `LEDGER.md` |
| `decisions.md` | `DECISIONS.md` |
| `brief.md` | `plans/<id>-<name>.md` — Digger work |
| `order.md` | `plans/<id>-<name>.md` — Builder work |

The rider template stays in `canon/mantles/README.md` — summons law lives with summons
grammar; `plans/RIDER.md` instantiates it per project (§10).
