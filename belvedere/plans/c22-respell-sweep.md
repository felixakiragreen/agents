# C22 — the respell sweep

**Status:** OPEN · **Depends on:** C23; ⬡-gate: the two identity forks (ruled
at the rework blessing) · **Staffing:** Builder · sonnet-high · **Blessed:**
pending

## Mission

Canon C27's successor, run at home: the building's pre-molt prose converges to
the standard — one concept, one word. The 2026-08-29 census counted ~156
live-prose hits (README ×130 + the six rework docs); the purge (C23) and the
G5 re-cuts have moved that number, so **re-census at ignition is the first
act** — the count in findings, before and after.

Two identity forks are Felix's, ruled at the blessing; his rulings ride the
kickoff amendment (D57) and this charge applies them, never re-argues them:

1. **`fire`** — the engine noun vs the graveyard. The hands' API and audit
   speak `fire` (`/hands/fire`, `action:"fire"`); the standard says `ignite`.
   Respelling prose without code forks the deck's copy from its own API.
   Options: (a) one word everywhere — API, audit, prose all `ignite`
   (STANDARD's own law; the callers are few and in-repo); (b) `fire` stays
   the code's noun, prose says ignite, the fork documented as a boundary.
2. **`the glass`** — the building's name for itself (glass vs deck vs
   Belvedere) — pure taste, his.

## Inputs — read before working

- His two rulings (the kickoff amendment).
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
3. If fork 1 ruled (a): the API rename is one sweep — route, client callers,
   audit writers, tests, probes — with the audit's old spelling still
   readable (`recordedIn` both heads forever is the C2 precedent: readers
   accept both, writers write the new).
4. `doctrine lint` 0 after; `bun v3/gates.ts --glass` ALL GREEN after.

## Done when:

- [ ] The census, before and after, in findings (counts per file class);
  after = 0 live-prose pre-molt hits outside quotes and probe history.
- [ ] Fork rulings applied exactly; every exempt quote listed.
- [ ] If (a): zero old-noun identifiers in source (grep-proof), audit readers
  accept both spellings with a test.
- [ ] `doctrine lint` 0; `bun v3/gates.ts --glass` ALL GREEN; budget **0**.

## Out of scope

- Re-arguing either fork; respelling canon (`canon/**` is never this
  building's pen); probe history and findings sections.

## Findings

*(append here — evidence-grade)*

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
~/code/agents/belvedere/README.md §§5–6, and the fork-rulings amendment the
tender hands you,
and execute the charge at ~/code/agents/belvedere/plans/c22-respell-sweep.md.
```
