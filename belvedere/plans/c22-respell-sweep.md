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
G5 re-cuts have moved that number, so **re-census at ignition is the first
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

- [ ] The census, before and after, in findings (counts per file class);
  after = 0 live-prose pre-molt hits outside quotes and probe history.
- [ ] Fork rulings applied exactly; every exempt quote listed.
- [ ] Zero old-noun identifiers in source (grep-proof), audit readers accept
  both spellings with a test (fork 1 is (a)).
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
~/code/agents/belvedere/README.md §§5–6 (the fork rulings sit in the charge
doc's header),
and execute the charge at ~/code/agents/belvedere/plans/c22-respell-sweep.md.
```
