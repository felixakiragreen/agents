# C23 — the master-doc purge

**Status:** OPEN · **Depends on:** — · **Staffing:** Architect · fable-high ·
**Blessed:** pending (the rework blessing)

## Mission

This README fails the doctrine's two-minute cold read: ~1000 lines, over a
single 25k-token Read, LANDED rows carrying paragraph-length status cells,
seven spent batch notes. The blade is canon's own precedent, C34 → C35
(`~/code/agents/plans/c35-map-purge.md` — MAP re-cut the same way,
Grand-Architect-run): **LANDED rows compress to status + findings link; spent
batch notes die; §7 entries fully distilled into §§1–5 are killed whole; dead
numbers strip; live holds survive verbatim.** Cut once, against the settled
v3 world — ruled at G5 per the campaign note (Felix's question 2026-08-30).

## Inputs — read before working

- `~/code/agents/plans/c35-map-purge.md` and `c34-register-purge.md` — the
  blade's own findings (what a purge keeps, what it kills, where it slipped).
- DOCTRINE §2 (the cold session's questions — the purged doc must answer
  them) and §4 (board law — rows stay lint-clean through compression).
- This board's live matter, which survives **verbatim**: every OPEN/IN FLIGHT
  row, the rework batch note, typed holds, §§1–5's standing agreements and
  laws, the future-campaigns filings, §7 entries not yet distilled.

## Spec

1. **LANDED/KILLED rows** compress to: encapsulation · status + date · one
   outcome clause · the findings link. Review annotations and evidence
   paragraphs live on in the charge docs git history already keeps — the row
   points, never repeats.
2. **Spent batch notes** (batches 1–7, migration batches 1–3) die whole; the
   migration campaign note compresses to its arc's one-line-per-step record
   with G5's close; the rework batch note survives verbatim (it is live).
3. **§7**: an entry whose every clause is distilled into §§1–5 dies whole
   with a one-line tombstone only if a live row cites it by number;
   otherwise nothing marks the grave (git is the grave).
4. **Nothing is summarized into new claims** — the purge deletes and
   compresses; it never writes new facts. A sentence that must be written
   fresh to bridge a cut is flagged in findings.
5. `doctrine lint` 0 before (baseline) and after; every kill is one
   git-visible deletion.

## Done when:

- [ ] The README reads whole in a single Read (< 25k tokens, count printed).
- [ ] `doctrine lint` 0 after; the board parses to the same live rows
  (OPEN/IN FLIGHT set identical before/after, diff-proven).
- [ ] Live matter verbatim: a diff over the surviving blocks shows moves and
  deletions only, zero rewrites (the C35 bar).
- [ ] DOCTRINE §2's cold questions each answerable from the purged doc —
  walked one by one in findings.
- [ ] Budget **0 real turns**.

## Out of scope

- The respell (C22's, after this); the plans/ docs (charge docs are not the
  master doc); any new content, ruling, or reordering of live law.

## Findings

*(append here — evidence-grade)*

## Kill criteria

If compression would force rewriting a live hold or an undistilled §7 entry
to keep the doc coherent, keep it verbatim and note the tension — the purge
never trades truth for size.

---

**Kickoff (verbatim):**

```
You are an Architect at fable-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/agents/plans/c35-map-purge.md and c34-register-purge.md
(the blade), ~/code/agents/canon/work/DOCTRINE.md §§2 and 4,
and execute the charge at ~/code/agents/belvedere/plans/c23-readme-purge.md —
a scoped doc-surgery session: the purge is the charge's fence, no review
duties ride it.
```
