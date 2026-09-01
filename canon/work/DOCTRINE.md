# The Work Doctrine

> *The Grand Architect keeps the canon, Architects think, the dispatch tends, Diggers dig,
> Builders build — a hive building a city; files carry the truth.*

How work is represented in any project: the doc pattern that lets a session start cold in
two minutes, agents run in parallel without collisions, and truth survive every context
wipe. The charters (`canon/mantles/`) say who does what, the Guild's Standard
([STANDARD.md](STANDARD.md), D71) says what the words mean; this file says what the files
are. Distilled from two proven implementations — hexwright (`~/code/hexwright`) and
simmy (`~/code/universal_robots_sdk/cap-mega/simmy`) — birthplaces cited inline; new law
only where evidence forced it.

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
- **Append, distill, strike.** Evidence appends as it lands (findings, ledger,
  bulletin); the Architect distills it into durable docs at review; superseded text is
  struck with a dated note, never silently rewritten.
- **The corpus is current.** When the law changes a form — an id, a mark, a token, a
  path, a header — every document follows in the same landing, history included, by the
  converter (`doctrine migrate`), never by hand and never later: the past keeps its
  meaning and gains the present's names. **History is respelled, never rewritten** — a
  respell is not an edit; speech is not form and stays fenced where judgment decides
  (D81, the currency law).
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
| What is this, what's the plan? | the master doc (`MAP.md` / `README.md`) | §3 |
| What's the state of work? | the board — `BOARD.md`; inline in a subproject README | §4 |
| What do I do right now? | your charge doc | §5 |
| What have we learned? | findings, appended under each charge doc | §6 |
| Where were we? | the `LEDGER.md` tail | §7 |
| What's been decided? | `DECISIONS.md` | §8 |
| What changed mid-flight? | the bulletin — parallel batches only | §9 |
| What came in from the field? | `ISSUES.md` — the incident inbox | §3 |

## 3. The file set and the scaling law

A **full project** (weeks+, multiple mantles) carries at its root:

```
CLAUDE.md      orientation: what this is, hard laws, session protocol — auto-loaded
dream.md       Felix's dream, when one exists — IMMUTABLE: never edited, only read
MAP.md         master doc: architecture, the bet, non-goals, agreements, Done when
BOARD.md       the work state: the board, batch notes, the deferred list
LEDGER.md      append-only session log
DECISIONS.md   blessed choices — D-entries
ISSUES.md      incident inbox: field reports await the Architect's sweep — cleared, never archived
plans/         charge docs; CODA.md at the first ignition
docs/          durable distillations — once findings outgrow the master doc
lab/           disposable code by charge id (lab/<id>/) — runnable scripts, not transcripts
```

A **subproject or small exploration repo** starts as ONE file: `README.md` as the master
doc — what/why, board, decisions section, working agreements, `Done when:` — plus charge
docs. Simmy ran a ten-session parallel campaign this way and never needed more (simmy
README).

**Split rule:** a section moves to its own file when it outgrows the master doc or gains
its own write pattern — decisions split out when the blessing workflow arrives; `docs/`
when the first distillation needs a home; the bulletin exists only during parallel
batches (§9); the coda when the first batch ignites (§10). **Split when it hurts, not
before.**

- **Retention law (D78):** master docs and boards are pruned at rhythm points —
  every Architect review and every close gate carries the prune check: LANDED rows
  compress to status + findings pointer, spent batch notes die, register entries
  fully distilled into their homes are killed whole, checklists every box of which
  is ticked die. **Git is the archive** — deleted, never tombstoned; no ARCHIVE.md,
  which is the bloat relocated plus a hop. The ledger is exempt: its tail-read
  protocol already bounds the read. Birthplace: 034/035's blades, run once each;
  made standing 2026-08-31 (belvedere's README hit 988 lines, simmy's 100k chars —
  the bloat recurs wherever the sweep isn't scheduled).
- **Naming law (D25):** **ALLCAPS for protocol singletons; lowercase-kebab for
  addressable siblings.** A file is ALLCAPS when both tests pass: only one of it can
  exist in its scope, AND sessions are told to read it as protocol — `CLAUDE.md`,
  `MAP.md`, `README.md`, `LEDGER.md`, `DECISIONS.md`, `ISSUES.md`, `DOCTRINE.md`,
  `STANDARD.md`, `CODA.md`, `BULLETIN.md`, `SKILL.md`. One of many addressable siblings
  is lowercase-kebab — charge docs (`plans/004-sync.md` — the id leads, zero-padded
  to three so the directory sorts; the standard §7), mantle charters, tiers,
  templates. `dream.md` (né `initial.md` — D33) stays lowercase by the second test: a
  singleton, but an artifact interpreted once at founding, not a protocol followed.
  Practiced since hexwright/simmy; codified 2026-08-03.
- **Linking law (D58):** durable docs link the files they reference at first mention —
  `[plans/004-sync.md](plans/004-sync.md)`, `[D19](DECISIONS.md)` — one click beats a
  minute's hunt. Anchors only onto real headings: a bold list item resolves no anchor —
  the file link is the value. Boards link their charge docs (this repo's board, since
  founding). A pointer into a large doc names the repo path AND a greppable anchor —
  `belvedere/README.md §6, 'The rework batch' note`, never a bare "§6's note"
  (amended 2026-08-31: an anchorless reference cost Felix minutes among seven spent
  notes — G5's defect).
- **Serialization law (charge 017's verdict):** prose artifacts are schema-markdown;
  field artifacts are data (flows); a field a machine consumer needs enters the
  doctrine grammar — never a storage flip.
- **CLAUDE.md law:** target ≤ ~60 lines (hexwright's budget). What this is (2–3 lines),
  hard laws (project physics only — Felix's global directives already load), session
  protocol, pointers. State digests rot: point at the board and ledger, don't restate
  them. **A law that must bind Fixers lives here or in a hook** — charters bind only
  the mantled, and this file plus the global one is all a Fixer provably loads (D65;
  birthplace: the arborist close-out — prose law held wherever a mantled session ran
  and under-bound freewheeling ones). A subproject adds ONE pointer line to the repo's
  `CLAUDE.md` and keeps its docs with itself (simmy D4).
- **The master doc** holds the durable design AND the board: architecture, the bet,
  defended non-goals, working agreements (project physics — venues, shared and live
  resources, branch rules), the `Done when:`. Corrections distill in as dated amendment
  notes (simmy's `> **S0 correction (08-02).** …` blockquotes) — the doc stays current,
  the history stays visible.
- **dream.md** exists when Felix has an origin vision — and it is **a record, not a
  spec**: the founding interrogates it, the master doc interprets it, and where the
  cornerstone contradicts it the master doc says so with the reasoning. A dream may
  arrive as **drafts, co-developed at the founding sitting** — refined with Felix
  until he calls it ready; `dream.md` lands at his word and is immutable from that
  moment: his words, agents' hands off, git the only historian. (hexwright's law,
  amended 2026-08-31 ⬡✓: hexwright's dream arrived mature by his own hours and the
  law generalized from that accident; Belvedere's froze half-refined and the
  foundation failed on the details. Co-development's ancestors: the standard's nine
  live rounds, the charters' probe forge. Renamed from `initial.md`, D33.)
- **ISSUES.md law (D53):** the project's incident inbox — field reports and
  distillation candidates land there mid-work: Felix's hand, or a session's at his word
  (a Fixer told to file does so and moves on). The project's Architect sweeps at every
  review session: each entry ruled — distilled into the docs, laid as a charge,
  rejected, or escalated by class (canon-shaped entries go to the canon repo's inbox) —
  then **deleted**: the distillation's home records it, the ledger line records
  rejections, git keeps the bytes (entries are committed before they are cleared).
  A cleared inbox is empty — it never becomes a second ledger; protocol rides the
  file's header. Minted at founding; a subproject adopts on first need. Birthplace:
  the canon repo's own inbox (D49, three sweeps run) + simmy's, in daily use.
  **Entry format (D63):** `- <YYYY-MM-DD> · <who> · <what>` — one bullet per entry;
  an entry that needs evidence becomes a `---`-separated block opening with that same
  line, evidence lines under it (bob's invention, canonized). No `Open`/`Harvested`
  sectioning — a sectioned inbox is a second ledger; the clear law stands.
- **plans/ stays flat** until a single board stops working; then subdivide by area
  (hexwright `plans/core/`). An area split is an Architect decision, never a default.

## 4. The board

The board is the project's single work-state table. At full-project scale it lives in
**`BOARD.md`** beside the master doc, holding the fast-moving work state whole — the
table, the batch notes, the deferred list — while the master doc keeps the slow-moving
design (D78; amended 2026-08-31 — the old board-in-master-doc law optimized away one
hop and bought a 25k-token wade: one function, one home). A subproject README carries
its board inline until the split rule triggers (§3). **Any table that staffs sessions
is a board**, and this section is its law — a build board inside a contract doc is not
exempt by its venue (D45).

**A charge is one ignitable unit of work = one charge doc = one session.**

| ID | Work | Depends on | Staffing | Status |
|---|---|---|---|---|

- **ID** — stable, never reused; the charge doc carries it (`plans/023-law-book.md`).
  A charge is its number, zero-padded to three; gates carry **G‹n›**; nothing is
  declared at founding — the building is the namespace, and the namespace law is the
  standard's (`STANDARD.md` §7, D80).
- **Work** — one line: the question or the mission. It opens with the
  **encapsulation** — the ≤6-word linked name (D74); qualifiers follow after `—`.
- **Depends on** — exactly three forms (D63; D74): charge ids that must be LANDED
  first, the qualified cross-building id `<building>:<id>` (resolved against the
  building register — `canon/BUILDINGS.md`, D79 — at lint; a real crossing, used
  sparingly), and `⬡-gate: <text>` for a named gate (a blessing,
  a ruling); "—" when none. Anything else is not a dependency: a physical precondition
  becomes a gate charge (D44), a scheduling note rides the batch note (D28) or the
  Status annotation. This column exists to compute the dependency graph; prose breaks
  it. **The edge test (D73):** an edge exists only where the charge reads its
  dependency's result — ordering preference is schedule, and schedule rides the batch
  note or the flow.
- **Staffing** — mantle · tier, both verbatim (`Digger · opus-high`), **or the literal
  token `⬡-gate`** for a gate charge that is really Felix's (D63) — Belvedere renders
  his card and never auto-ignites it. Either form may carry a parenthetical
  **annotation** — `Builder · opus-high (worktree)`, `⬡-gate (smoke ×3)` — for eyes,
  parsed and ignored by dispatch; an annotation never homes the concurrency plan (the
  batch note and the summons stay its home, D28). **Charges are always staffed** — an
  unstaffed charge is not permitted, ever (D71, lint-hard); a DEFERRED charge keeps
  the staffing it had, `—` where the shelving dissolved it. A sub-slot whose record
  history never held writes `unrecorded` — the typed absence, never a guess (D63 as
  amended). Staffing guidance lives in the tier descriptions (`canon/agents/`) — the
  single home; boards point, never duplicate.
- **Status** — the lifecycle below, plus annotations: dates, findings pointers, unmerged
  branch names. A landing's unresolved remainders are typed (D74):
  `LANDED <date> — holds: <list>` — each hold an `E‹n›` or a `⬡ <text>`; unresolved
  holds pause dependent charges, and clearing is written on the row. Escalations are
  ids: born `E‹n› — <what>`, dead `E‹n› ruled <date>`.

**The lifecycle:** `OPEN → IN FLIGHT → LANDED / KILLED`

- **OPEN** — laid and staffed; ignitable the moment its dependencies are LANDED.
- **IN FLIGHT** — a session owns it, timestamped.
- **LANDED** — contract met: findings filed where the charge doc says, status current,
  commits present; for building charges, the `Done when:` evidenced.
- **KILLED** — ended on purpose, the kill documented with evidence. A documented kill
  is a win, not a failure.
- **BLOCKED** — stopped at a fork the charge doc didn't pre-chew — **Stop and
  escalate.** Transient by law: the charge sits at the Architect's desk until it is
  replaced, killed, or escalated to Felix.
- **PENDING** — an annotation, not a lifecycle state: a named remainder waiting on an
  external precondition (a login, hardware reach). Recorded, not blocking; nobody
  ignites PENDING (simmy's Pi cells; this campaign's Max `/login`). **Never the
  leading token** (D63): write `OPEN — PENDING <precondition>` — **The state leads,
  the annotation follows.**
- **DEFERRED** — an annotation, not a lifecycle state: a laid charge deliberately set
  aside — real, tracked, nobody waiting; un-deferring is a fresh decision. PENDING
  waits on something named; DEFERRED waits on nobody. Never the leading token:
  `OPEN — DEFERRED <reason>` (D69, respelled by D71). The deferred list under the
  board holds un-laid ideas; a laid charge defers in place — ids are stable, deferral
  is a status fact, never a board removal.

Retired synonyms — do not use: DONE, CLOSED (→ LANDED or KILLED for charges; a
completed campaign **sets the keystone**, the standard §2), WIP (→ IN FLIGHT), TODO
(→ OPEN), AUTHORED (a filed design is LANDED; its blessing gates the NEXT charge). The
graveyard of dead words and their successors is the standard's (`STANDARD.md` §9).

**Resolution vocabulary (D63):** gate, merge, and design charges resolve into the five
states, the verdict riding the annotation — `LANDED — PASSED <evidence>`,
`LANDED — MERGED <sha>`, `LANDED — BLESSED <date>` — or `LANDED — ⬡ go <date>` where
Felix authorized without looking (D82; the standard §1). The lifecycle stays five words;
PASSED / MERGED / BLESSED never lead.

**Gates are charges (D44).** A judgment step between charges — a merge review, a landing
verification, a blessing checkpoint — is itself a charge: ID'd, staffed (mantle · tier),
dependencies naming what it gates, kickoff verbatim (riding the batch note or the gated
charge's doc — a gate needs a kickoff, not necessarily its own doc). A gate whose
judgment is executable against the docs — merge-or-reject against a blessed spec and its
`Done when:` — is ignitable: a scoped Architect review (architect charter, Summons). A
gate that is really Felix's — a blessing, a ruling, taste — is a named **⬡-gate**: the
batch pauses there; nobody ignites past it. A gate living only in prose is invisible at
dispatch time — D28's law, applied to sequence (birthplaces: batch 2's blessing pauses;
manny's M2 review; units' gate column, invented in the field the day before this law). A
gate that merges names its instrument verbatim in its kickoff — source branch, target,
PR-vs-push — and verifies THEN merges. **Passing = finished.** The run that proves it
has FINISHED — not started, not predicted — before the merge executes (D48).

**Under the board:**

- **Batch notes** — the Architect lays each batch as a dated note: which charges, the
  shape (serial, parallel, any graph), who tends. One live note per running batch; a
  spent note dies at the batch's close (D78). Parallel-safety is marked here and in
  the charge-doc headers. **Parallel-safe is not parallel-affordable:** safety is
  correctness (no file/doc collisions); affordability is physics (the shared live
  resources bear the simultaneity). When charges contend for live resources — VMs,
  hardware, GUI instances, CPU-heavy builds, timed measurements — the note carries the
  **concurrency plan**: ceiling, shape (grouped sends or strictly serial), and the
  gauge to hold on ("hold timed arms until load < 12"). The plan rides this note AND
  the tending summons verbatim — a constraint living only in a working agreement is
  invisible at dispatch time (snappy §6.8/D9: six charges each read the cell cap as
  its own compliance; nobody owned the sum).
- **The deferred list** — real but out of scope: tracked, not lost (simmy README §7).
  Items enter with a pointer; they leave by promotion to a charge (struck through,
  with "promoted to <id>") or by deletion when the project closes.

## 5. The charge doc

One document, one skeleton — **the mantle says whether a charge digs or builds**; the
sections carry the contract. A charge doc is self-contained and sized to one session;
what a session cannot finish at quality becomes a new charge — never a rushed draft
(this repo's D4, generalized). Every charge doc is **pre-chewed on purpose**: every fork
a cheaper session could meet is either decided in the doc or named as a kill/escalation
point — the reader never guesses.

The skeleton:

```
# <ID> — <title>
**Status:** OPEN — laid <date> · **Depends on:** … · **Staffing:** <mantle · tier>
   (· **Parallel-safe with:** <charges> — when laid into a parallel batch)
   (· **Branch:** <name> — when the charge runs in a worktree, D74)
## Mission | Question(s)
## Inputs — read before working      ← incl. what's known: "do not re-derive"
<the genre core — below>
## Out of scope                      ← mandatory when building; when digging, when creep is live
## Findings                          ← *(append here)*
---
Kickoff (verbatim), fenced
```

**Digging (a Digger's charge):** the questions · the method — a suggested route, not
law: a fork the doc names is the Digger's to take, an unnamed one stops the work ·
**kill criteria, mandatory** — what stops each line, written so a cheaper session
recognizes the trigger without judgment (simmy spike anatomy).

**Building (a Builder's charge):** the goal · the spec, **blessed before ignition** —
who blessed it, when, recorded in the header · **`Done when:`, mandatory and
measurable** — named checks whose output is pasted in as evidence at build time: the
bar is measured, never asserted · **out of scope, mandatory** — the fence; **Creep is
a bug.** (hexwright WO anatomy).

**Kickoff law:** every charge doc ends with its kickoff prompt, fenced, verbatim, in the
canon summons grammar (`canon/mantles/README.md`). Nobody edits a kickoff except the
Architect replacing an un-ignited charge — nothing re-lays. Ignition = kickoff + the
project coda, nothing else. The single-glance test (D45): a kickoff's first line is the
summons line — `You are a <Mantle> at <tier>.` — a kickoff that doesn't open by naming
both is malformed; fix it before ignition.

**Pre-authorization (D54, generalized 2026-08-31):** fetching, vendoring, installing
beyond the repo's existing dependencies, or executing anything pulled from the network
happens only when the charge doc names it — an unnamed need is a stop-and-escalate
fork, never an after-the-fact review. A vendored tree records its exact upstream
version and carries its license FILE — a license named from memory is not a record.
Birthplace: simmy §8 (S8's vendoring: blessed only after a 59-file hash-verify against
upstream tarballs and two license corrections — authorization is the cheap path,
review is the expensive one). **Guarded acts ride the charge the same way:** work that
needs permission-guarded actions — config-dir reads, protected-path writes, committed
fixtures a classifier resents — names them in the charge doc, and the lay lands them
in the repo's `.claude/settings.json` allowlist before ignition: repo settings files
bind dispatched sessions; session approvals do not (the guide's verdict on record,
2026-08-30, at Felix's own fix). A sanctioned act never costs a human round-trip per
file.

## 6. Findings law

Findings are the evidence record: what was learned, with proof. They append under the
charge doc's `## Findings` while the charge runs, and are never edited after it closes —
the distillation (below) carries truth forward; findings remain its provenance. A number
a later charge disproves gains a **dated correction note, appended** — the record
corrects, never rewrites (ruled 2026-08-29, the 026 -ise correction).

1. **Evidence-grade, every claim:** the command and output (or file§ pointer) that
   proved it rides with the claim. **A claim without evidence is a draft** (simmy §8 —
   the ursim-issues forensic standard).
2. **Probes ship with a control.** A negative result is a claim about what didn't
   happen; it counts only when a control proves the probe could have seen the effect.
   Birthplace: the 04 sync dig returned two false negatives that only their control
   arms caught (this repo's ledger, F6/F11) — silence without a control routes
   decisions onto false evidence.
3. **A discovery that changes another charge's plans** goes out the moment it's made:
   to the bulletin during parallel batches (§9), into the report's escalation
   otherwise. Findings sections are the archive; the bulletin is the wire.
4. **Builder findings:** evidence pasted into the charge doc's `Done when:` checklist;
   deviations from spec and adjacent discoveries under `## Findings`; the commits are
   the primary artifact.
5. **Worktree charges:** findings and charge-doc edits ride the charge's branch; the
   board carries the branch name until the Architect merges or rejects at review.
6. **Distill and strike** (the Architect, at review): findings distill into the durable
   docs they amend — master doc, `docs/` pages, D-entries; superseded text is struck
   with a dated note; the real-but-out-of-scope is deferred. After the distillation,
   durable docs are the current truth and findings are how it got there.
7. **Measurements carry their conditions.** A timed or resource-sensitive number's
   evidence includes the host conditions it ran under (the project's gauge — load,
   contention, venue state). Contaminated numbers are re-run in a clean measurement
   window, held PENDING, or struck inadmissible — never averaged into a verdict, never
   shipped silently. Birthplace: snappy §2 law 5 — per-number host records kept a
   load-328 saturation auditable; every batch-1 verdict survived (snappy D9).
8. **Targets are read from the repo.** A state-changing operation — a merge, a push,
   a remediation rewind — takes its target from the live repo at execution time
   (merge-parent forensics), never from a summons' recollection: a summons'
   description of repo state is a hypothesis, not a coordinate. Birthplace:
   node-param G2 — a stale tip, encoded unverified, overshot a rewind by 14 commits
   (D48).

## 7. The ledger

`LEDGER.md` — append-only, one entry per session, newest last, `---` between entries:

```
**<date> · <mantle> · <tier> (<charge id; the session's name-stamp when it ran none>)** — <what changed:
outcomes + pointers>. Decided: <D-ids, or "nothing">. Next: <the handoff>.
```

The head's bold run holds those four things and nothing else (D63) — annotations,
session titles, and color go in the body. **The Next law (D63):** when the baton hands
a session, `Next:` carries the summons — fenced verbatim in the entry when it lives
nowhere else, or by naming the board charge(s) whose docs carry the fences
(`ignite <charge-ids>`; the old `fire` verb stays legal in history) — never re-typed
from memory: a kickoff the Architect replaces must not leave a stale twin here. A
`Next:` that names a next session without its instrument is a dropped baton (D46/D64).
A session owing nothing writes the typed close **`Next: none — <why>`** — never bare
prose ("nothing waits") that no parser can tell from a dropped baton (amended
2026-08-31, B26 F2 — the fourth filing of this ask).

The acceptance test — **The tail alone reboots a cold session.** Write it for the
stranger who reads it next — that stranger is you (hexwright format, canonized).
Sessions too small for a charge still get an entry; the ledger is the one file that
sees everything. Exception at subproject scale: a campaign of small digs may lean on
board + findings alone (simmy did) — the moment a session does work no single charge
doc captures, the ledger starts.

## 8. Decisions

`DECISIONS.md` — the decision register: proposals awaiting blessing, and blessed
rulings not yet distilled into their canon homes. Law lives where it binds — the
master doc, the doctrine, the charters, the auto-loaded files; the register is the
queue and the staging ground, never the archive: git is.

```
- **D<n>** (<date>, <decider> [· ⬡✓ <date>]): **<title>.** <body>
```

- **The title is a label:** the bold delimits the whole title and nothing else —
  a card headline, never a mid-sentence phrase with the bold on its load-bearing word.
- **The ancestry test — before any number:** does this serve the issue an ancestor
  was addressing, better? Then amend the ancestor — the entry, or the canon home
  that carries it — and mint nothing; only a genuinely new issue mints. Ids are
  monotonic, never reused. **Desk-born or field-born:** a field-born law cites a
  session that failed — a finding, a ledger line; a desk-born law cites a reader who
  was annoyed — his word, a ruling at the desk. Desk-born is taste — legitimate, held
  as a glossary, never enforced by a converter — and it mints no formula and no
  graveyard row until the field files a case (the canonization law,
  `canon/mantles/grand-architect.md`).
- **Attribution is honest:** the decider named is whoever actually decided. A decision
  that is really Felix's — money, hardware, external commitments, taste — carries his
  name and waits for him (architect charter). Dispatched and delegated sessions mark
  entries **"(proposed — pending ⬡✓)"**; the blessing converts the mark to
  `⬡✓ <date>` (historical `✓ Felix` marks parse) — or to `⬡ go <date>` when Felix
  authorizes without looking: the ruling proceeds on credit, the review owed, and the
  entry sits on the statement until he reads it (D82).
- **Meaning changes take his blessing** and rewrite the entry to its current truth —
  the ledger line names the change, git holds the old bytes; no in-entry scar owed.
  **Form migrates freely** (the molt clause): a format migration re-emits entries in
  the current grammar, meaning byte-preserved (the converter never paraphrases), the
  migration commit blessed as a whole — and owed, not optional: the currency law (§1,
  D81) generalizes the clause to every form in every document, in the landing that
  changes it. Where a pre-doctrine source never held a
  required field — any required slot — migration writes the literal **`unrecorded`**:
  a typed absence, never a guess; replacing it takes cited evidence and a visible
  commit.
- **The purge:** at a blessed purge, an entry whose law is fully distilled into its
  canon home is killed whole — deleted, never tombstoned; a gap in the numbering is
  a killed entry, and git holds every byte.
- **The decision queue** is not a file: it is the set of proposed-not-yet-blessed
  entries plus open escalations. The tending session surfaces it to Felix at every
  boundary — batch reports list it, ledger entries name it in Next.

## 9. The bulletin — the wire between parallel agents

Exists ONLY while a parallel batch runs; a serial batch never creates one. The batch's
tender creates `plans/BULLETIN.md` (next to the charge docs — simmy's lived at
`spikes/BULLETIN.md`) at the first parallel ignition, protocol in its header.

- **Protocol:** every agent reads the bulletin before each major method section, and
  appends the moment a discovery changes another charge's plans — not at landing time.
- **Entry format** (simmy's, canonized):

  ```
  ## <date> · <from> → <audience>
  <verbatim finding — no paraphrase>
  Evidence: <file§ / command / log pointer>
  ```

- **The verbatim law: A paraphrase is a defect.** Copied excerpts, never summaries —
  the pinned formula (`STANDARD.md` §8).
- **Who writes:** agents append their own entries mid-flight; the tender commits
  bulletin updates, and copies the relevant excerpts from landed findings while others
  still run. Worktree-isolated agents cannot write outside their tree (the harness
  refuses the write; reads pass) — each appends to its own worktree's bulletin copy
  (created if absent), entries headed `→ relay`, left uncommitted; the tender relays
  flagged entries verbatim into the main bulletin as part of tending — everything else
  rides their branch (D50; birthplace: arborist A8, rooted `ec1a6a1`).
- **Late relocation (D50):** when a batch's parallel-isolation window closes and every
  remaining consumer shares one worktree, the bulletin may relocate into that worktree
  (still uncommitted), two conditions mandatory: distillation-completeness verified
  first — every entry has a committed home or pointer — and a never-`git add` line in
  the bulletin's own header, because inside a mergeable branch's worktree one careless
  `-A` ships the relay channel into mainline as durable truth (birthplace: cap-mega
  `feature/tig-avc` @ `9538e14b`, Felix-directed).
- **Archive:** none. Append-only for the campaign's life; the Architect's distillation
  makes entries archival where they stand; findings sections remain the archive of
  record.

## 10. Batches — how the docs run agents

- **Lay, then ignite.** The Architect lays; the dispatch runs. The lay is a board act:
  charges OPEN, dependencies LANDED, staffing named, parallel-safety marked, batch
  note dated — and when charges contend for live resources, the concurrency plan laid
  with it (§4). Gates are laid as charges (§4), ⬡-gates named — and **the lay
  maximizes the run between Felix's judgment calls** (D44): every foreseeable ⬡-fork
  in the arc is surfaced and ruled at blessing time so his rulings travel in the docs;
  what remains of him is the named gates, batched, never dribbled. A batch that stops
  for something the lay could have pre-ruled was mis-laid.
  Cross-charge scheduling is a fork the pre-chew law reserves to the lay: the
  Architect decides it, the summons carries it, the tender enforces it — never left
  to emerge from individually compliant charges. A running batch is amendable: the
  Architect commits the amended batch note and hands the tender the new charges as a
  message carrying the same instruments as the summons — sequencing an independent
  charge behind a running batch it doesn't depend on is mis-laid (D57; birthplace:
  cornerizer batch 8, amended mid-flight 2026-08-16). Every batch has a tender, and
  the default is machine tending, serial batches included (D43/D61's intent — their
  Dispatcher wording is superseded by D71). **The interim truth, plainly:** the
  Dispatcher mantle is dead (D71) and its successor — the flow engine, charge 020's
  cornerstone made law at D73 — is built and smoke-proven (Belvedere B10–B12) but has
  not yet tended a real batch; until it does, the batch note names the tender: **the
  tender kickoff** — `tender: sonnet-medium · plans/TENDER.md`, an instrument
  instantiated once per building from the Dispatcher tombstone's operational law and
  ignited as an unmantled cheap-tier kickoff; it relays verbatim and authors nothing
  (D83 — agents and stigmergon first, every other building holding until
  stigmergon's keystone) — an Architect session, or Felix. The engine retires the
  kickoff the day it tends a real batch: the successor runs before the ancestor
  dies. Felix-tended stays the exception with its reason
  named in the batch note (his own eyes gate each landing — a visual pass, a live
  smoke); batch size is never the reason. The lay composes the longest
  machine-runnable arc — building charges and dispatched review gates in one serial
  batch — and the batch returns to Felix only at escalations and named ⬡-gates,
  resuming on his word where it paused (D61).
- **The flow (D73).** A flow is a batch as data — the declared DAG the dispatch runs
  (the engine: Belvedere B10–B12; the arm contract and scope-arm growth are its D11
  and D12, ratified canon-side). For engine-tended batches **the flow file is the
  batch note** — the board's note points at it (`flow: <name>` + the tender line);
  prose batch notes remain the Felix-tended exception. The engine's law: D10
  wholesale — ambiguity never authorizes and never advances; only declared or
  scope-grown steps ignite — **the blessing covers the scope** (D12); **every flow
  carries a budget** — a ceiling on engine ignitions per blessing; at the ceiling the
  engine pauses and one re-blessing extends; **a step may continue
  a session** rather than ignite fresh when the lay says so — continue when the next
  act consumes this act's judgment, go fresh when the altitude changes; **a gate
  session with no row of its own lands by the row it was staffed for**, never by its
  own session. **The edge test** binds the lay (§4): a Depends-on edge exists only
  where a charge reads its dependency's result — everything else is schedule, and
  schedule rides the note or the flow. The batch report is the flow's rendered close
  plus the close gate's distillation. Flow files are the building's truth and live
  with its `plans/` (interim, while Belvedere is the only reader: `belvedere/flows/`,
  naming the building). The Steward — the same engine unattended — stays gated on
  Felix's word alone (D5).
- **The coda** (the standard §4) is instantiated ONCE per project, as `plans/CODA.md`,
  from the canon core (`canon/mantles/README.md`), filling the three slots:
  working-agreements ref (a master doc §), bulletin path (drop the sentence when
  batches are serial), and worktree specifics (branch rules). It is the fixed closing
  passage of every ignition's kickoff — appended verbatim; nobody edits it
  per-ignition.
- **Worktree law:** the shared checkout's branch is NEVER switched — parallel sessions
  live there (simmy §8). Work that needs a branch runs in a worktree, and its charge
  doc says so; the board records unmerged branches until the Architect merges or
  rejects. A shared branch is never rewound: no force-push, planned or contingent —
  red after a premature merge is an escalation, not a rewind (D48).
- **Venue law (D55):** a charge that mints a disposable live venue — a VM, a
  container, a machine — deletes it at landing; pausing is for mid-work, never for
  done. A teardown the permission guard refuses is reported in the charge's report for
  the Architect's sweep at batch close: a refused delete reported is fine, a venue
  silently kept is not. The project's agreements name the standing set that is never
  swept. Birthplace: simmy §8 — eight machines up coincided with a control-plane panic
  that took every session's venue down; 23 accumulated by 08-06, most from landed
  digs.
- **The batch report** — a table (charge / status / one-line outcome / pointers), plus
  the escalation list and the relay log (what was carried where). Pointers, not prose;
  the findings files are the content. (Format born in the Dispatcher charter §6 — the
  tombstone preserves it; the flow engine inherits it.)

## 11. The session contract

Every session, any mantle:

- **Start:** `CLAUDE.md` (automatic) → the board (`BOARD.md`, or the master doc's
  inline board) → the master doc sections your summons names → the ledger tail → your
  charge doc → the bulletin, when one exists. Two minutes, productive.
- **End:** state written where the docs say it goes — findings appended, statuses
  current, board reconciled (Architect) — then the ledger entry, then commits in
  Felix's git style. **The test for whether a context wipe is free: everything the
  next session needs lives in the repo, not the conversation** — if it doesn't yet,
  write it down first; that's the signal you weren't at a clean boundary (hexwright
  CLAUDE.md, canonized). Suggest the break, and end with **the baton** (D42): open
  escalations and the decision queue first, then exactly one action — ready by
  definition — addressed to one holder, any further work explicitly ordered behind
  it. **A baton must read cold** (the standard's acceptance test), and it takes one
  shape — `Baton — <one holder> → <action>` — **the holder is written** (D74): `⬡`,
  a named session, or **the dispatch** (a batch the machinery tends says so — no
  hand is waited on, the flow runs); the parser reads the written holder, never
  infers it. The action takes one of three shapes (D64): **single** (one
  instrument — the summons fenced verbatim, an `ignite <charge-id>` reference, or
  the named ⬡-action: a blessing, a smoke, a ruling); **batch** (`batch —` marked:
  n parallel instruments, legal iff the holder could ignite all of them now without
  choosing between them — D44's batching, given its shape); **fork** (`fork —`
  marked: the choice IS the action — few exclusive options, every option
  instrumented — choosing A ignites *this* — and a `recommendation:` named, or the
  call explicitly marked taste). A menu of nexts with no ordering, or a kickoff produced
  only on request, is a malformed close. **The null close:** a session owing nothing
  writes no baton — `Next: none — <why>` (§7) is the typed form. **Ambiguity, never
  plurality, is the sin** (D64, amending D46): an uninstrumented option, a menu with
  no recommendation, two holders, or a decision smuggled in prose is a dropped baton.

## 12. Founding a project — the founding ritual

A new project boots onto the doctrine in one founding session:

1. **Felix:** repo + `git init` (branch `master`, never main); a finished dream may
   land as `dream.md` at once — immutable on landing; drafts instead come to the
   sitting (step 3).
2. **Summon the founding Architect** — a foundational session, `fable-max` (architect
   charter staffing):

   ```
   You are an Architect at fable-max.
   Enter by the door — read ~/code/agents/canon/GUILD.md,
   wear ~/code/agents/canon/mantles/architect.md,
   then read ~/code/agents/canon/work/DOCTRINE.md
   and <dream.md | Felix's telling>, and lay the cornerstone.
   ```

3. **The founding session:** where the dream arrived as drafts, **co-develop it with
   Felix first** — interrogate, refine, correct until he calls it ready; `dream.md`
   lands then, frozen (§3). Then — question every requirement, define minimal scope,
   defend against creep — instantiate from
   `canon/work/templates/`: `CLAUDE.md`, the master doc with its board (first charges
   laid and staffed), `LEDGER.md` (entry one), `DECISIONS.md` (the day-one blessings:
   name, scope, non-goals — there are always some), `ISSUES.md` (empty, header only —
   D53), and the register line — the building declared in `canon/BUILDINGS.md`
   (D79): membership is never inferred; the tenant/subproject nuance rides the
   register's own header — and the line is the id namespace too: no prefix is
   declared (the standard §7). Subproject scale: `README.md` alone (§3).
4. **Hand off:** first batch laid, its tender named (§10) — or the first summons
   handed verbatim; ledger appended; committed.

The Grand Architect founds nothing here — that office keeps the canon; every project is
its own Architect's board.

**Retiring a building (D84):** a retirement is a notice, not a close — one paragraph
atop each entry point (`CLAUDE.md`, the master doc), the board row KILLED with the
reason, the register line kept (D79). Nothing else is owed: the successor digs for its
own salvage; git keeps the rest. The weight of an ending scales with what will be
read — a retired building's books are documents built to die (the global file's SCOPE
clause, extended from code to books). Birthplace: Belvedere's close, 2026-08-31 — a
fifth of the building's spend for a fifteen-line notice, and the successor re-surveyed
the salvage regardless (stigmergon 001).

## 13. The vocabulary — the Guild's Standard

The working vocabulary is the Guild's Standard: **[STANDARD.md](STANDARD.md)**, beside
this file (D71 ⬡✓ 2026-08-29) — the entries, the graveyard of dead words and their
successors, the 24 pinned formulas, the punctuation grammar, the read-cold test. The
glossary that lived here is superseded. **Think in any terms; communicate in the
standard.** **Translate the Sovereign's vocabulary; challenge his substance.**

## Templates

`canon/work/templates/` — skeletons with ⟨slots⟩; the founding ritual instantiates them.
Referenced by path, like the mantles; never deployed to config dirs (MAP §4).

| Template | Becomes |
|---|---|
| `claude-md.md` | the project `CLAUDE.md` (named so the skeleton is never auto-loaded) |
| `map.md` | the master doc — `MAP.md`, or trimmed into a `README.md` |
| `ledger.md` | `LEDGER.md` |
| `decisions.md` | `DECISIONS.md` |
| `issues.md` | `ISSUES.md` — the incident inbox |
| `charge.md` | `plans/<id>-<name>.md` — the charge doc; the mantle says whether it digs or builds |

The coda's canon core stays in `canon/mantles/README.md` — summons law lives with
summons grammar; `plans/CODA.md` instantiates it per project (§10).
