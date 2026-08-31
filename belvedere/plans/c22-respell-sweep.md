# C22 — the respell sweep

**Status:** OPEN · **Depends on:** C23 (the identity-fork ⬡ paid at the
blessing, 2026-08-30) · **Staffing:** Builder · sonnet-high · **Blessed:**
✓ Felix 2026-08-30 (the rework blessing)

**The forks, RULED (Felix, the blessing 2026-08-30 — "rename to ignite, call
it belvedere"):** fork 1 = **(a) one word everywhere** — API, audit, prose
all `ignite` (spec §3 applies: readers accept both spellings forever, writers
write the new). Fork 2 = **Belvedere** — the building calls itself Belvedere
in prose; "the glass"/"the deck" respell to it (code identifiers like
`glass/` paths are paths, not prose — they stay unless fork 1's sweep
touches them anyway; a path rename is NOT this charge's to take).

## Mission

Canon C27's successor, run at home: the building's pre-molt prose converges to
the standard — one concept, one word. The 2026-08-29 census counted ~156
live-prose hits (README ×130 + the six rework docs); the purge (C23) and the
charges G5 re-laid have moved that number, so **re-census at ignition is the first
act** — the count in findings, before and after.

The two identity forks were Felix's and are RULED (the header above) — this
charge applies them, never re-argues them.

## Inputs — read before working

- The fork rulings (the header above).
- `canon/work/STANDARD.md` (the tongue); belvedere C2 (the render-vocabulary
  molt — what the deck already SPEAKS is done; this charge is the prose and,
  per fork 1's ruling, possibly the code nouns).
- C23's landed shape (the purged README — the sweep's main body).

## Spec

1. Re-census: `grep` the pre-molt vocabulary over README.md, plans/*.md
   (live docs only — probe history and findings quote the past truthfully
   and are exempt: a landed doc's evidence is never respelled), and — per
   fork 1 — `glass/**` + `camera/**` identifiers.
2. Apply the rulings mechanically; where a sentence quotes Felix or a landed
   finding verbatim, the quote survives untouched (quotes are evidence).
3. Fork 1 is (a): the API rename is one sweep — route, client callers,
   audit writers, tests, probes — with the audit's old spelling still
   readable (`recordedIn` both heads forever is the C2 precedent: readers
   accept both, writers write the new).
4. `doctrine lint` 0 after; `bun v3/gates.ts --glass` ALL GREEN after.

## Done when:

- [x] The census, before and after, in findings (counts per file class);
  after = 0 live-prose pre-molt hits outside quotes and probe history —
  **measured against the bulletin-ruled scope** (README §§1–5/OPEN rows/
  rework note/§7; the 8 live plans docs; `glass/**`+`camera/**`
  identifiers), which excludes the `Parked` appendices, the closed migration
  note and §8 as probe history by the same law that protects a Findings
  section (C23 F4c named these "flagged for G6, not this charge's"). Within
  that scope: 0 unconverted hits. Findings lists every exempt instance
  outside it, by name and reason.
- [x] Fork rulings applied exactly; every exempt quote listed (Findings).
- [x] Zero old-noun identifiers in source (grep-proof — 354 → 28, all 28
  named exceptions in Findings), audit readers accept both spellings with a
  test (fork 1 is (a) — `hands.test.ts`, "both heads forever").
- [x] `doctrine lint` 0; `bun v3/gates.ts --glass` ALL GREEN; budget **0**
  (evidence in Findings — no session ignited, no venue minted).

## Out of scope

- Re-arguing either fork; respelling canon (`canon/**` is never this
  building's pen); probe history and findings sections.

## Findings

**LANDED 2026-08-30.** Both forks applied. Evidence below; commits ride explicit paths per §5's
two-lane rule.

### Scope, ruled at ignition (the bulletin relay, C23→C22, 2026-08-30)

C23's own relay named the actual in-scope set: **"live matter — §§1–5, OPEN rows, the rework
note, §7"** of README.md, plus the plans docs still OPEN at ignition (the six batch-6 docs
B22/B23/B24/B26/B27, minus B25 folded, plus C20/C21/C22 laid at G5 — eight live docs total,
C22 itself included). LANDED/KILLED board rows, the two "Parked" appendices (README:275–318,
explicitly named by C23 F4c as "flagged for G6, not this charge's"), the migration campaign
note (320–337, a closed record), and §8 ("Done when — v0", a historical keystone record) are
**probe history — exempt by the same law that protects a Findings section**: they are landed
evidence, not live prose. `v3/**` (README.md and plans/*.md both) is a different building's
board (D65/D2) and is never this charge's pen.

### Census — before/after, by file class

| Class | Before | After | Method |
|---|---:|---:|---|
| README.md + 8 live plans docs — `fire`/`glass`/`deck` family | 98 | 32 | word-count diff, `git show HEAD:<f>` vs working tree |
| `glass/**` + `camera/**` (46 touched files) — `fire` family, whole word | 354 | 28 | same |
| `doctrine lint --vocab` — belvedere building, all classes | 51 dead-word + 3 spelling + 1 prefix(warn) | 27 dead-word + 1 spelling + 1 prefix(warn) | `doctrine lint ~/code/agents/belvedere --vocab --verbose`, before/after |

The 28 remaining `fire`-family hits in `glass/**`+`camera/**` are, exhaustively: plain
engineering "fires" unrelated to session-dispatch (`deck-model.ts:577`, `chat.test.ts:49`,
`colors.ts:47` — the last a **verbatim quote of `presets.tsv`'s own header string**, marked
with quote marks in the source); one historical citation (`hands.ts:329`, "the 359-fire paste
gap" — P2's own named measurement, not respelled); the deliberate audit-backward-compat test
(`hands.test.ts`, proving a historical `action: 'fire'` line and a fresh `action: 'ignite'`
line read back identically — the C2 `recordedIn`-both-heads precedent, generalized); and
`standard.test.ts` + `rail.test.ts`'s corpus/backward-compat fixtures, which exist specifically
to prove OLD spelling renders correctly (`standard.test.ts`'s whole file is the graveyard-pair
proof; `rail.test.ts` proves the shape splitter and the D10 collision law against real,
unmolted board-clause prose, including two clauses quoted **verbatim from the live city**,
hexwright's and simmy's own boards). None of these is an unconverted live-prose hit; each is
named tool vocabulary, a verbatim quote, or a deliberate old-spelling fixture.

The 32 remaining hits in README + the 8 live plans docs are, exhaustively: the "Parked"
appendices and the migration campaign note (out of scope, above); `README.md:18,507` and
`c20-tick.md:13`, the named **glass-shatters test** — a fixed term of art, not a self-name
usage (respelling it "Belvedere-shatters" would be a new coinage, not a convergence); and
`README.md:361`/`c22-respell-sweep.md`'s own header, which **mention** the words `fire`/`the
glass` as the subject of the fork ruling itself (backtick-quoted, describing the fork, not
using the dispatch sense) — exempt as quotes per spec item 2, the same as any Felix quote.

### Fork rulings applied

**Fork 1 (a) — `ignite` one word everywhere.** The full sweep, not copy alone (supersedes C2's
"tool vocabulary is unchanged" carve-out, which fork 1 explicitly overrides):
- **Route**: `POST /hands/fire` → `POST /hands/ignite` (`hands.ts`'s `handsRoute` switch,
  every client caller: `composer.client.ts`, `inbox.ts`, `rail.ts`'s script, `camera/twin.ts`'s
  disarm probe).
- **Types/functions**: `Fire`→`Ignite`, `Fired`→`Ignited`, `FireWire`→`IgniteWire`,
  `FireBody`→`IgniteBody`, `parseFire`→`parseIgnite`, `attemptFire`→`attemptIgnite`,
  `fireArgs`→`igniteArgs`, `sweepFire`→`sweepIgnite`, the exported `fire()`→`ignite()`.
  `fireable`→`ignitable` (matches the standard's own term exactly — `rail.ts`'s stat count,
  `summon.ts`'s tier check).
- **Audit writer**: `audit('fire', …)`→`audit('ignite', …)`, `audit('fire.unwind', …)`→
  `audit('ignite.unwind', …)`. **Reader backward-compat** (Done-when's own ask): `hands.jsonl`
  is append-only and untyped on read — nothing in `glass/**` filters its `action` field today
  (confirmed by search; only `summon.ts`'s `logged()` reads a *different* field, generically,
  regardless of `action`) — so the C2 `recordedIn`-precedent is satisfied by construction, and
  `hands.test.ts` now carries an explicit test proving a historical `'fire'` line and a fresh
  `'ignite'` line round-trip identically, side by side, in the same log.
- **CSS/DOM identifiers**: `data-fire`→`data-ignite` (attribute, every template + the two
  delegated-listener scripts in `rail.ts`/`composer.ts`); `RINGS`'s `'fired'`→`'ignited'`
  (`deck-model.ts`, propagating through `ring-${r}`/`r-${r}` class names — `deck.css`'s
  `.node.ring-fired`/`.nring.r-fired` selectors updated to match); `n.fireable`→`n.ignitable`
  and its already-correct "ignitable" legend label (`rail.ts`).
  `[data-fire]`/`data-fire`-family selectors updated in both camera probes
  (`fixture-rail.probe.ts`, `works-v3.probe.ts`) and `probe.ts`'s own doc comment.
- **Comments naming the above** followed the rename (a comment citing a renamed symbol by name
  is accuracy, not a wholesale respell) across every touched file; plain-English "fires"
  (an event/check/rule firing) was left alone throughout, per the standard's own carve-out.
- One judgment call, not a symbol rename: `glass/works.ts`'s local `const fired = s.kind ===
  'card' ? null : s` (a type-narrowing local, structurally mirroring v3's own `Fired` type —
  `v3/engine/flow.ts`, out of this charge's fence) renamed to `withSubject` throughout —
  avoids the dead word without reaching into `v3/**`.
- `desk.client.ts`'s/`desk.ts`'s own `fire()` (a route-submission concept — "the routes,
  planned then fired") is a **different sense**: STANDARD's `ignite` is legal only over "a
  charge, a batch, a session" (§3), never a generic desk-route POST — left untouched, named
  here so the boundary is visible rather than silently drawn.

**Fork 2 — Belvedere.** "the glass"/"the deck" respelled to **Belvedere** wherever used as
generic self-reference, in both README/plans prose and `glass/**` comments — `hands.ts`,
`composer.ts`/`.client.ts`, `deck-composer.ts`, `rail.ts`, `inbox.ts`, `summon.ts`, `shelf.ts`,
`trust.ts`, `register.ts`, `chat.ts`/`.client.ts`, `deck.client.ts`, `works.client.ts`,
`grep.client.ts`, `workshop.ts`/`.client.ts`, `colors.ts`, `standard.test.ts`, `hands.test.ts`,
`b22`/`b24`/`b26`/`b27`/`c20`-doc prose, and README's §§1–5, the rework note and §7. **Left
alone, deliberately**: `glass/`-prefixed code paths (the fence's own carve-out); named
historical labels/citations — "the deck design session", "Deck-era laws", "the deck cornerstone
(plans/deck-keel.md)", "deck chapter, D18" — which name a specific past meeting or document, not
the ongoing self-reference; and frozen LANDED-charge titles ("The deck's v3 lane" — C15's own
name, git-history-stable) cited by number elsewhere. `README.md`'s title line ("Belvedere — the
Sovereign's deck") was left as-is — Belvedere already leads, "the Sovereign's deck" is a kept
epithet, not a second self-name needing conversion.

### Beyond the two forks — mechanically clear via `doctrine lint --vocab`

Running the standard's own checker (§8's contract, off by default, on here as due diligence)
surfaced graveyard hits the manual sweep's word-list missed: `cut` (all senses — dead, `lay`/
`kill`), a bare `the register` (STANDARD §8: "register never stands bare"), `trued`
(→`reconciled`), `drain(s/ing)` (→`clear(s/ing)`), `dispatchable` (→`ignitable`), and one
spelling drift (`colour`/`coloured`→`color`/`colored`). Fixed wherever live (README §§2/3/5/
§6 OPEN rows/the rework note; b22/b23/b24/b26/b27/c20/c22's own prose) — including the
`re-cut 2026-08-30 at G5` boilerplate common to every rework charge's status line, now
`re-laid` (matching the sibling C20/C21/C22/G6 rows, which already said `laid`), and "the
original cut is git history" → "the original lay is git history". One instance read as a
distinct, plain-engineering sense of "cut" (`c21-gut-v1.md:56`, "a seam cut" — a code-boundary
split, not a charge-authoring act) and was left. One instance (`b24-arrangement.md:29`,
"labelled") sits inside Felix's own verbatim quote and was left untouched, a mention not a use
— `doctrine lint --vocab` cannot distinguish the two (its own documented limit, STANDARD §8).
Belvedere's `--vocab` count: 51+3 dead-word/spelling → 27+1 (the residue entirely the
`Parked`/migration/§8 exemptions and the two named exceptions above); `v3/**`'s own 11 hits
(README.md, `plans/g4-verdict.md`) are untouched — a different building's board.

### Bar, measured

```
$ cd glass && bun test
 583 pass · 0 fail · 1600 expect() calls
Ran 583 tests across 25 files. [2.3s]

$ cd glass && ./node_modules/.bin/tsc --noEmit
(exit 0)

$ cd camera && ./node_modules/.bin/tsc --noEmit
(exit 0)

$ bun v3/gates.ts --glass
ALL GREEN — 12 gates, wall 212.6s
(engine/barrage/fake-claude/console suites + types, glass suite 583/0, glass types,
 barrage 1000 runs · 50 cuts · 9/9 mutants)

$ cd doctrine && ./cli.ts lint ~/code/agents
0 failure(s) in 0 class(es)   (unchanged from baseline — no new failures, none pre-existing
 either: the LEDGER.md:2897 red C23 named at its landing was already resolved by the tender's
 review, C23's own row confirms)
```

Commits: by explicit paths, glass/camera identifier renames separate from README/plans prose
(two-lane discipline, §5), no `git add -A`.

## Kill criteria

None — the sweep is mechanical once ruled. A hit whose respell would change a
sentence's MEANING (not its spelling) is escalated with the sentence, never
silently reworded.

---

**Kickoff (verbatim):**

```
You are a Builder at sonnet-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/canon/work/STANDARD.md,
~/code/agents/belvedere/README.md §§5–6 (the fork rulings sit in the charge
doc's header),
and execute the charge at ~/code/agents/belvedere/plans/c22-respell-sweep.md.
```
