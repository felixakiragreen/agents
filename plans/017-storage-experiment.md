# 017 — v3: the storage experiment

**Status:** LANDED 2026-08-28 — verdict RETAIN (D65's ruling confirmed with numbers; line drawn per-artifact; row 018 not re-scoped; row-19/-20 inputs named in §Verdict); harness in `lab/017/` — was: brief cut 2026-08-28 (grand-architect-11); Felix-gate PAID 2026-08-28 (Belvedere v0 + the deck + the flow chapter landed; batch 5 closed — 14 rows, zero kills, 651 tests green; gate called paid by Felix's own summons of this date) · **Depends on:** 016 · **Staffing:** Digger · fable-high

## Question

**Does structured-source truth beat schema-markdown for the three consumers — Felix's hand, a session's cold start, and the glass?** (D65: tested, never decreed — the verdict is numbers.) One building as lab. The standing ruling under test: *the schema is the standard; serialization is per-consumer* — doctrine-markdown is the canonical write surface **until this row dethrones it with numbers**, or confirms it with them.

Sub-questions, each owed a measured answer:

1. **Write + review (Felix's hand):** which arm makes a real change — a row landing, a D-entry + countersign, a ledger append — cheaper to write correctly and cheaper to review in a git diff? Which arm's hand-edit damage reaches the parser silently?
2. **Cold start (a session):** over a fixed question battery and write tasks, which arm yields higher correctness, fewer tokens, and more first-try-conforming writes?
3. **The glass (tools):** which arm carries the fields the city keeps needing as data — without heuristics? At what parser cost and with what failure modes?
4. **The line:** if the answer differs per consumer or per genre (flows vs boards vs ledgers), where exactly does the line fall? A hybrid verdict is a legal verdict.

## Inputs — read before working (do not re-derive)

- [D65](../DECISIONS.md) — the mandate and the three consumers; [D63](../DECISIONS.md) — the markdown grammar under test; [DOCTRINE §§4, 7, 8](../canon/work/DOCTRINE.md).
- The M-arm's field numbers already exist — the 18-wave ([plans/018-great-recut.md](018-great-recut.md) §findings): city lint 718 → 310 post-wave; **14 tool/grammar defect classes filed in one wave**; three silent hand-damage classes measured in the wild (blank-line board truncation ×3 sightings, unescaped `|`, bold-run orphan, ~38 missing ledger separators in snappy). One strict parser held 22 buildings with **zero per-repo special cases** — the counter-arm is real and the brief instructs you to weigh it honestly.
- The S-arm's field numbers already exist — Belvedere's flow chapter ran a real batch as data: `belvedere/flows/*.flow.json` behind [belvedere/glass/flow.ts](../belvedere/glass/flow.ts) — 12 named arm-time refusals, sha-integrity arming, append-only event log ([flow-keel](../belvedere/plans/flow-keel.md), [b10](../belvedere/plans/b10-flow-dag.md), [b11](../belvedere/plans/b11-flow-engine.md), [b12](../belvedere/plans/b12-flow-reactive.md)).
- **The case file** — [flow-keel §6](../belvedere/plans/flow-keel.md): six field asks where prose carries load the shapes need — `kind` (move/wave/fork), the fork's `recommendation`, a row's `branch`, the baton's `holder`/precondition, a landing's `holds`, `encapsulation` (the ≤6-word name). Plus the batch-5 close's list (canon inbox 2026-08-28, drained at grand-architect-11 — git keeps the bytes): 27 of 38 live rail cards had no extractable name; tier renders whole because model·effort is one token; `FC-`/`GA-` ids resolve to no artifact; escalations have no field (a regex classifier gates 120 of 390 landed rows, 113 on `/escalat/i` alone — including rows whose annotations read "nothing escalated"); `parseDecisions` false-pends D21 — the entry that *defines* the countersign marker. Every one of these is a datum: something markdown-as-truth made a tool guess at.
- P3 §5's JSON shapes are the normative parse of a conforming corpus (D65) — `doctrine parse --json` emits them; the S-arm twin starts there.

## The arms

- **Arm M (incumbent):** the lab building's working tree as-is — D63 schema-markdown, `doctrine/` as its parser.
- **Arm S (challenger):** the same truth as structured source — JSON per the normative shapes, extended ONLY where the case file names a missing field — with a derived read-only markdown render (a small script; the render is a view, never written). Writes happen in the JSON. The twin is built once from `parse --json` output, hand-corrected against the known parser gaps, and its fidelity to arm M is asserted before any measurement runs (a diff of re-rendered vs parsed meaning — your control).

**The lab is `~/code/agents`** — the richest corpus, and the one building all three consumers provably touch today (Felix reads this MAP; sessions cold-start on it by law; the glass renders it). The twin lives in `lab/017/` and never touches the working tree. Named fallback if the corpus busts the session budget: `~/code/hexwright` (small, 0 lint failures) — and the cost that forced the fallback is itself finding #1.

## Method — suggested route, forks named

1. **Build the twin** (arm S) from `doctrine parse --json`; assert fidelity (the control above). Record the construction cost — tokens, wall time, hand-corrections count: that number is the migration-cost estimate row 018's re-scope needs.
2. **C1 — Felix's hand.** Replay three real, already-landed changes in both arms (pick from this repo's history; cite the commits). Report per arm: diff line/hunk counts, signal-vs-syntax ratio (changed lines that carry meaning vs delimiters/structure), and a side-by-side exhibit for Felix's eyes at review. Damage surface: enumerate the wave's silent-damage classes and classify each per arm — *reaches the parser silently* vs *refused loud at write*. No new survey needed — the wave's findings are the M-arm data.
3. **C2 — cold start.** A fixed battery — ~10 read questions (dispatchability, gates, what did D-n decide, where does row X's baton point) + 3 write tasks (a conforming ledger entry, a new row, a status flip) — run by dispatched fresh sessions at **sonnet-high, ×3 reps per arm** (Agent tool, tier preset verbatim — D47). Same battery both arms; grade reads against `parse --json` ground truth mechanically; grade writes by lint-clean (M) / schema-valid (S) on first try. Report correctness, tokens, conformance. If the signal is ambiguous at n=3, ONE opus-medium confirmation rep per arm; never inflate n beyond that.
4. **C3 — the glass.** Score the case-file fields per arm: carryable without heuristics? (M: derived render-side or paused per D10; S: a field is a field.) Parser cost: `doctrine/` SLOC + the wave's 14 defect classes vs the twin's validator SLOC + its refusal classes. Count ambiguity absorbed render-side today (the glass's D10 warning cards, the classifier's 120-of-390) as the M-arm's standing tax — and count the counter-arm's win the same breath: zero per-repo special cases, one parser, every fix city-wide.
5. **Verdict.** Per-consumer numbers → per-consumer verdicts → the recommendation: retain / dethrone / **hybrid with the line drawn** (e.g. flows-as-data stands, boards stay markdown, ledger heads gain fields). Explicit re-scope recommendation for row 018's continuation, and the named inputs row 020 (the continuous-flow keel) takes from you. Numbers carry their conditions (DOCTRINE §6.7).

## Kill criteria

- Twin construction exceeds the session's budget on the fallback lab too → kill; the documented conversion cost IS the finding.
- C2 variance ≥ the between-arm difference after the confirmation rep → that consumer reports "inconclusive at affordable n", with the numbers; never a decree.
- Any measurement that would require editing `canon/`, `doctrine/`, or live corpus files → out of scope; name it and move on.

## Deliverables

Findings appended here — numbers per consumer per arm, conditions attached, verdict + recommendation + row-18 re-scope + row-20 inputs; twin + battery + grader in `lab/017/` (committed — the harness is the evidence); status + commits.

## Out of scope

- Migrating anything live; edits to `canon/`, `doctrine/`, or any building's docs.
- Designing new schema fields beyond measuring the case-file list — design is row 020's and the Grand Architect's.
- The serialization of Belvedere's own runtime state (event logs, census) — already data; not in question.

## Findings

*(append here — evidence-grade: every claim carries the command and output that proved it; probes ship with a control)*

### C0 — twin construction (2026-08-28, Digger · fable-high)

**The twin cost almost nothing: one pass, zero fidelity iterations, 2 hand-correction classes (29 instances, both automated).** `lab/017/build-twin.ts` reads the corpus through doctrine's own primitives and emits `lab/017/twin/{board,ledger,decisions, issues,kickoffs}.json` — 2 boards · 31 rows, 53 ledger entries, 70 decisions, 31 kickoffs, 0 issues (drained). Evidence: `bun lab/017/build-twin.ts && bun lab/017/render.ts && bun lab/017/check-fidelity.ts` → `FIDELITY: OK — every typed field identical, corpus vs re-rendered twin` (commit `9f6a79a`). Control proven negative-able: planting `tier: "opus-high"` into ledger[10] turns the check red (`FIDELITY: FAILED — 1 diff(s)`), rebuild restores green.

- **Hand-corrections, both parser gaps the brief pre-named, neither a judgment call:** (1) `unrecorded` tier/mantle carried as the literal string where the parser nulls it with an "unknown tier" fail — 28 instances (27 ledger + 1 board row 000), 18-wave escalation #1; (2) D21's countersign became a field (`countersigned: true`) — the regex false-pend (`parse.ts:338` matching the marker the entry itself quotes) doesn't survive into the twin. D6 was left un-countersigned **on purpose**: the doc genuinely carries no ✓, so the twin carries the truth, not a repair.
- **Migration-cost estimate for row 018's re-scope:** ~12K session tokens and <2 min wall for this building's full truth layer (token counter 14.892M → 14.880M around the build; files authored in one sitting, first fidelity run green). The conversion is parser-output-shaped, so per-building cost scales with parse cleanliness, not size — a building the 18-wave already migrated converts mechanically; whiteboardy-class ledgers (96/104 blocks unparsed) would pay the wave's repair cost first, not a twin cost.
- **Scope note (construction choices, declared):** DOCTRINE §4's zero-row template board excluded (grammar skeleton, not truth); ledger entries carry `{date, mantle, tier, row, body}` with `decided`/`next`/`block` derived at parse — the normative shapes' derived fields are not double-stored; kickoffs taken from `parse --json` baseline verbatim (the 3 log-tradition `You are` fences were already fails, not kickoffs — no correction needed).

### C1 — Felix's hand (2026-08-28)

**Verdict-shaped result: the arms split by CHANGE TYPE, not by winner.** Four real landed changes replayed both arms (`bun lab/017/c1.ts`, commit `10294db`; full table in `lab/017/c1-metrics.md`; M = the real commits `6b87c4e`/`954ffbd`/`f3cd47c`/`daa0ca3`, S = the same semantic change applied to the twin, before-state staged so word-diff measures the true delta):

| replay | M (hunks · ±lines · ±chars · longest · signal) | S (same) |
|---|---|---|
| R1 row-16 landing (status flip) | 1h · ±1/1 · 1707c · **1465** · 77% | 1h · ±2/2 · 1405c · 1277 · **92%** |
| R2 D68–D70 append | 1h · +58 · 4450c · **84** · 100% | 1h · +24 · 4634c · 1862 · 100% |
| R2b D63 countersign flip (43 signal chars) | 1h · ±2/2 · 307c · 85 · **14%** | 1h · ±1/1 · 4915c · **2467** · 1% |
| R3 grand-architect-11 ledger append | 1h · +37 · 2679c · **85** · 100% | 1h · +7 · 2803c · 2709 · 100% |

- **S wins in-place STATE edits:** R1's flip is its own crisp line (`"state": "OPEN"` → `"LANDED"`) and signal share rises 77→92% — in M the flip is buried inside a 1,465-char single-line row a reviewer must word-scan.
- **M wins in-place PROSE edits, decisively:** R2b changes 43 chars; M's hand-wrapped lines localize it to 307 diff chars (14% signal) while S rewrites one 2,467-char JSON line (4,915 diff chars, 1% signal). JSON strings cannot wrap — every prose edit is a whole-line rewrite. This is structural, not fixable by pretty-printing.
- **Appends are a wash on signal (both 100%)** but M's longest diff line is 84–85 chars (hand-wrapped) vs S's 1,862–2,709 (one line per prose field) — in a default git diff the M append is readable top-to-bottom; the S append needs word-diff tooling or a renderer. S's syntax overhead on appends is real but small (+4% / +5% chars).
- **Damage surface (probes with controls, `bun` one-shot in the C1 session log; classes from the 18-wave, plus JSON's own):** M's two killer classes confirmed silent ON THIS CORPUS — a blank line before row 012 of the MAP board drops **11 rows with zero new fails** (23→12 rows, fails 1→1); deleting one ledger `---` merges two entries and the fail count goes **DOWN** (53→52 entries, fails 26→25 — damage reads as improvement). M's unescaped `|` is loud at lint (board.pipe), silent only until lint runs. S: a stray newline in a string and a trailing comma refuse loud at `JSON.parse` (`SyntaxError` both); S's own silent class exists — **duplicate key, last-wins, silently** (`{"state":"OPEN","state":"LANDED"}` → LANDED, no error), invisible to parse-then-validate, catchable only by a raw-text pass. Score: silent classes that can corrupt meaning — M: 3 confirmed in the wild (blank-line, missing `---`, D21-class regex false-pend); S: 1 (duplicate key, not yet sighted in the wild).

### C2 — cold start (2026-08-28)

**No arm dominates on correctness; arm S never cost more tokens; write conformance is a perfect wash. The failures that did occur each trace to a nameable mechanism, not to serialization noise.** Battery: 10 reads + 3 writes (`lab/017/c2/battery.md`), dispatched fresh sessions, tier preset verbatim (D47), sonnet-high ×3 per arm + the sanctioned opus-medium confirmation rep ×1 per arm; graded mechanically (`bun lab/017/c2/grade.ts`; raw answers in `lab/017/c2/runs/`, usage in `runs-meta.json`).

| rep · tier | M reads | M writes | M tokens · wall | S reads | S writes | S tokens · wall |
|---|---|---|---|---|---|---|
| 1 · sonnet-high | 10/10 | 3/3 | 140,615 · 83s | 9/10 | 3/3 | 136,984 · 150s |
| 2 · sonnet-high | 10/10 | 3/3 | 140,207 · 76s | 10/10 | 3/3 | 104,517 · 256s |
| 3 · sonnet-high | 10/10 | 3/3 | 140,391 · 77s | 9/10 | 3/3 | 139,382 · 188s |
| 4 · opus-medium | 7/10 | 3/3 | 71,546 · 76s | 10/10 | 3/3 | 50,861 · 83s |

- **The only S misses are one cell, systematic:** q1 (dispatchable rows), where S1/S3 answered `["13","17"]` — **the stale-lead wart amplified**: MAP rows 13/14's status cells still LEAD with `OPEN` while their landings live only in annotation prose ("→ **LANDED 2026-08-22**"). The typed `state` field carries the stale token at full strength; 2 of 3 sonnet reps trusted it over the prose. Every M rep, reading prose first, got human truth. **The wart is a live corpus defect** (parked for rows 18/19: a lint rule "state token contradicts a LANDED verdict in the annotation" would catch it in both arms) — S is more faithful to what is written, including what is written wrong.
- **The only M read-misses are the opus-medium rep** (q1 `[]`, q4 holder "the row-17 Digger… already in flight", q7 `[]`). q1/q4 are **contaminated, named per §6.7**: this experiment runs inside its own lab building, and M4 read this very work doc's freshly-appended findings and concluded row 017 was in flight — defensible against live truth, wrong against the board the grader reads. The condition: **arm M was measured against a moving corpus (findings appending mid-experiment); arm S against a frozen twin.** q7 `[]` stands as a genuine miss — the grand-architect-11 ledger tail names "Felix countersigns D68–D70" in the M corpus verbatim, and the sonnet M reps all found it. Neither trap fired for S4 (opus read both field and annotation: q1 `["17"]`, q7 exact).
- **Correctness verdict: inconclusive at affordable n, per the kill criterion** — after the confirmation rep, within-arm variance (M swings 30/30 → 7/10 by tier; S 28/30 → 10/10) exceeds the between-arm difference (≤2 points either direction). What IS concluded: both arms are highly readable to fresh sessions; every observed failure is a corpus defect surfaced differently (stale lead → S; prose-synthesis burden + self-reference → M), and **the D21 false-pend trap fired for nobody** in either arm (q7's D21 excluded 8/8).
- **Tokens: S ≤ M in all four pairings** — −2.6%/−25.4%/−0.7% at sonnet-high (mean 127.0K vs 140.4K), **−28.9% at opus-medium** (50.9K vs 71.5K). Direction consistent, magnitude variable (S σ≈16K vs M σ≈0.2K at sonnet-high). Wall time inverts: S took 1.9–3.4× longer at sonnet-high (12–17 tool calls navigating JSON vs M's flat 10) — cheaper to read, slower to walk.
- **Writes: 24/24 first-try-conforming across both arms** (every w1/w2/w3, all 8 runs, graded by the same doctrine parser — M directly, S after the render serializer). On a post-18a clean corpus with the grammar in reach, conformance does not discriminate the arms at all.

### C3 — the glass (2026-08-28)

**Of the case file's nine field asks, seven are plain fields in arm S with zero heuristics; in arm M all seven live render-side as regexes, prose scans, or D10 pauses. The remaining two are schema-design questions either arm must send to row 020.**

| case-file ask | arm M today | arm S |
|---|---|---|
| `kind` (move/wave/fork) | prose — `classifyBaton` reads instruments, "never the exclusivity: the fork's mark is prose" (`doctrine/src/parse.ts:265`) | a field |
| fork `recommendation` | prose | a field |
| row `branch` | annotation prose, regex extraction | a field |
| baton `holder` / precondition | `/\bFelix\b/` heuristic — **inverted on this repo's own live tail**: `parse --json` says `holder: "session"` while the Next clause opens "**Felix countersigns D68–D70**" (the `fire 17` instrument wins the classifier; the grand-architect-11 ledger already names this for row 020) | a field |
| landing `holds` | prose | a field |
| `encapsulation` (≤6-word name) | nowhere — 27 of 38 live rail cards had no extractable name (batch-5 close, brief's case file) | a field |
| escalation | `/escalat/i` classifier gates 120 of 390 landed rows, 113 on that regex alone, including rows reading "nothing escalated" (case file) | a field |
| tier as model·effort | atomic token both arms — splitting it is schema design (row 020) | same |
| `FC-`/`GA-` id registry | absent both arms — vocabulary gap (rows 20/21) | same |

- **Parser cost (SLOC, `wc -l`):** doctrine/ total 1,199 (grammar 90 · parse 377 · building 258 · lint 99 · migrate 279 · cli 79 · index 17) vs the twin stack 273 (build-twin 119 — one-time converter · render 62 · validate 92). Scope-matched — M's parse+grammar+lint 566 vs S's steady-state render+validate 154, **~3.7×** — because in S the grammar is field access; the only parsing left is JSON.parse. Not counted for S: doctrine's register discovery and migrate have no S equivalent yet; a city-wide S arm would rebuild some of `building.ts`.
- **Refusal/defect classes:** M filed **14 tool/grammar defect classes in one wave** (18-wave escalations, the brief's own datum). S's validator names 8 refusal classes, all loud, and closes the dupkey silent class with a raw-text scan (`bun lab/017/validate.ts` → `VALIDATE: OK`; negative control: a planted `Diggr` + a planted dangling `dependsOn: ["99"]` → exactly 2 failures, exit 1).
- **The standing tax, counted both ways (brief's instruction):** M absorbs ambiguity render-side today — the glass's D10 warning cards, the 120-of-390 classifier — and in exchange holds the counter-arm's win: **one strict parser held 22 buildings with zero per-repo special cases; every fix lands city-wide.** Arm S inherits that win only if the schema stays one-per-city (a per-repo twin dialect would be the same drift the Standards Office exists to kill).

### Verdict (2026-08-28, Digger · fable-high)

**Per consumer:**

| consumer | verdict | the deciding numbers |
|---|---|---|
| Felix's hand | **M retained — split by change type, M net** | M wins in-place prose edits ~14× on diff economy (R2b: 307c vs 4,915c for 43 signal chars — JSON strings cannot wrap) and appends on legibility (longest line 85 vs 2,709); S wins state flips (crisp field line, 92% vs 77% signal) and refuses loud where M's two worst classes damage silently (11 rows gone, fails 1→1; a merged ledger entry, fails go DOWN) |
| cold start | **inconclusive at affordable n — no arm dominates; kill-criterion clause applied** | reads M 37/40 vs S 38/40 overall with every miss a corpus defect surfaced differently; writes 24/24 both arms; tokens S ≤ M in 4/4 pairings (−0.7% to −28.9%); wall time S 1.9–3.4× slower at sonnet-high |
| the glass | **S wins decisively** | 7/9 case-file asks are plain fields vs render-side regex/pause; holder heuristic inverted on the live tail; 120-of-390 classifier tax; steady-state parser code ~3.7× smaller |

**The line (sub-question 4), drawn per-ARTIFACT, not per-consumer:** an artifact whose truth is mostly prose — decisions, ledger bodies, board annotations, briefs — stays schema-markdown: that is where Felix's hand actually writes, where M's diff economy wins, and where 24/24 first-try conformance shows the grammar costs sessions nothing. An artifact whose truth is mostly fields — flows, batons-as-instruments, event logs, the census — is data: Belvedere's flows-as-data stands, proven by its own chapter. Where the glass needs a field from a prose artifact, **the field enters the D63 grammar so the one parser types it — never a storage flip**: C2 showed the failure modes live in corpus defects and heuristics, not in serialization, and C3's seven field asks are exactly the heuristics to retire.

**Recommendation: RETAIN, confirmed with numbers, not decree** — D65's standing ruling (*the schema is the standard; serialization is per-consumer; doctrine-markdown is the canonical write surface*) survives its trial. The challenger was real: S is cheaper to cold-read (every pairing), safer against silent damage (3 wild classes vs 1 unsighted), and the glass's clear winner — but the write surface belongs to the hand, and the hand's work is prose. The gap S wins on closes from inside the ruling: fields into the grammar (row 020), silent classes into the linter (row 019).

**Row-18 re-scope: none — 17 did not win; the continuation wave proceeds as cut.** One addition from this row's evidence: **the stale-lead repair** — MAP rows 13/14 still lead `OPEN` with their landings buried in annotation prose (2 of 3 S sonnet reps mis-answered dispatchability off it; the mechanical parse calls row 013 dispatchable today). Fix the two cells in the wave; the guard is row 019's (below). The migration-cost question 18 carried is settled: twin conversion of a POST-WAVE building is ~12K tokens/<2 min (C0) — conversion cost is dominated by wave repair, not format.

**Row-19 inputs (named):** priority evidence for two already-filed defects — blank-line board truncation and the missing-`---` merge are the only damage classes that corrupt silently AND the merge DECREASES the fail count (C1 probes); plus one new lint rule this row minted: **stale-lead** — a leading state token contradicted by a LANDED/KILLED verdict in its own annotation is a failure (would have caught rows 13/14 in both arms); plus the D21 false-pend fix already routed at grand-architect-11 (C0 carries the field-shaped answer: countersign state as data, not regex).

**Row-20 inputs (named):** the C3 scorecard verbatim — seven fields with per-field evidence (kind · recommendation · branch · holder/precondition · holds · encapsulation · escalation), the holder-inversion live repro (`parse --json` on this repo, 2026-08-28: `holder: "session"` under a Next that opens "**Felix countersigns D68–D70**"), the tier model·effort split and FC-/GA- registry as open vocabulary (row 021 adjacent), and C2's conformance datum: grammar-field additions cost the hand nothing measurable (24/24 first-try, both arms, sonnet AND opus).

**Postscript (2026-08-28, ~15:05 — appended before landing):** the countersign-close session committed `b5dc9c6` at 15:01:49, DURING the opus-medium confirmation reps: D68 folded into D63, D69 ⬡✓, D70 withdrawn, MAP row 017 flipped IN FLIGHT. M4 (dispatched ~15:01, 75s run) therefore read the POST-close corpus — and its three "wrong" reads are exactly that corpus's truth: q1 `[]` (17 in flight), q4 "the row-17 Digger… in flight", q7 `[]` (nothing pending). **M4's read scores are struck inadmissible per §6.7** (graded against a truth that moved), leaving M with no admissible confirmation rep; its token number stands as a gauge only. The correctness verdict — inconclusive at affordable n — survives unchanged (admissible: M 30/30 sonnet; S 28/30 sonnet + 13/13 opus). The deeper datum: **the live corpus is shared mutable state — S4's frozen twin gave reproducible answers, M4's live read gave current ones, and the grader can only reward one.** Any future C2-style measurement freezes BOTH arms or grades against a commit, not a working tree.

**Conditions on every number (§6.7):** single building (the richest, post-18a-clean — a whiteboardy-class corpus would shift C0 and C2); n=3+1 per arm, one battery, one day, tiers sonnet-high/opus-medium via Agent-tool presets (D47); the M arm was measured against a live corpus that grew its own findings mid-experiment (M4's q1/q4 contaminated, named in C2) while S read a frozen twin; C1 signal metrics are word-diff-based on 4 replays, not a survey.

---

**Kickoff (verbatim):**

```
You are a Digger at fable-high.
Wear ~/code/agents/canon/mantles/digger.md,
then read ~/code/agents/MAP.md §5 (v3 note)
and ~/code/agents/plans/017-storage-experiment.md,
and execute the brief.
```
