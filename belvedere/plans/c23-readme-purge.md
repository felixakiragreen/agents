# C23 — the master-doc purge

**Status:** LANDED 2026-08-30 · **Depends on:** — · **Staffing:** Architect · fable-high · **Blessed:** ✓ Felix 2026-08-30 (the rework blessing — README §6, paid in-session)

## Mission

This README fails the doctrine's two-minute cold read: ~1000 lines, over a single 25k-token Read, LANDED rows carrying paragraph-length status cells, seven spent batch notes. The blade is canon's own precedent, C34 → C35 (`~/code/agents/plans/c35-map-purge.md` — MAP re-cut the same way, Grand-Architect-run): **LANDED rows compress to status + findings link; spent batch notes die; §7 entries fully distilled into §§1–5 are killed whole; dead numbers strip; live holds survive verbatim.** Cut once, against the settled v3 world — ruled at G5 per the campaign note (Felix's question 2026-08-30).

## Inputs — read before working

- `~/code/agents/plans/c35-map-purge.md` and `c34-register-purge.md` — the blade's own findings (what a purge keeps, what it kills, where it slipped).
- DOCTRINE §2 (the cold session's questions — the purged doc must answer them) and §4 (board law — rows stay lint-clean through compression).
- This board's live matter, which survives **verbatim**: every OPEN/IN FLIGHT row, the rework batch note, typed holds, §§1–5's standing agreements and laws, the future-campaigns filings, §7 entries not yet distilled.

## Spec

1. **LANDED/KILLED rows** compress to: encapsulation · status + date · one outcome clause · the findings link. Review annotations and evidence paragraphs live on in the charge docs git history already keeps — the row points, never repeats.
2. **Spent batch notes** (batches 1–7, migration batches 1–3) die whole; the migration campaign note compresses to its arc's one-line-per-step record with G5's close; the rework batch note survives verbatim (it is live).
3. **§7**: an entry whose every clause is distilled into §§1–5 dies whole with a one-line tombstone only if a live row cites it by number; otherwise nothing marks the grave (git is the grave).
4. **Nothing is summarized into new claims** — the purge deletes and compresses; it never writes new facts. A sentence that must be written fresh to bridge a cut is flagged in findings.
5. `doctrine lint` 0 before (baseline) and after; every kill is one git-visible deletion.

## Done when:

- [x] The README reads whole in a single Read (< 25k tokens, count printed). Evidence: 1105 → 539 lines, 147,549 → 44,678 bytes at `0183a88`; the full file returned in ONE Read call (25k cap). Count: the Read tool's own meter priced the pre-purge file at 44,152 tokens for 147,549 B (~3.34 B/token) — the purged file is ≈ 13.4k tokens by the same meter, and the successful single Read is the hard proof.
- [x] `doctrine lint` 0 after; the board parses to the same live rows (OPEN/IN FLIGHT set identical before/after, diff-proven). Evidence: baseline was NOT 0 — one pre-existing red, `ledger.row — "G5, cont."` at `LEDGER.md:2897` (D63f), in a file this charge never touches (append-only ledger; filed to ISSUES). After: byte-identical lint output — the same single failure, nothing new; board `53/53 rows typed` both sides; `belvedere/v3` ok both sides. Live-set diff: `diff live-before live-after` → empty, `LIVE-SET IDENTICAL` ({B22, B23, B24, B26, B27, C20, C21, C22, C23, G6} — 10 rows, all OPEN).
- [x] Live matter verbatim: a diff over the surviving blocks shows moves and deletions only, zero rewrites (the C35 bar). Evidence: `git diff -U0` at `0183a88` — 52 insertions / 618 deletions; the added lines are exactly the 43 compressed LANDED/KILLED row lines plus 10 lines of the compressed campaign note (grep-partitioned, listed in the session). Every other hunk is pure deletion, so §§1–5, the ten live rows, the rework note, both deferred lists, the Parked list, the 15 surviving §7 entries and §8 are byte-untouched.
- [x] DOCTRINE §2's cold questions each answerable from the purged doc — walked one by one in findings (F2).
- [x] Budget **0 real turns.** No session ignited, no venue minted.

## Out of scope

- The respell (C22's, after this); the plans/ docs (charge docs are not the master doc); any new content, ruling, or reordering of live law.

## Findings

- **F1 — the cut (2026-08-30).** README 1105 → 539 lines, 147,549 → 44,678 bytes at `0183a88`. Died: 43 LANDED/KILLED status cells compressed to state + date + one outcome clause + findings link (Work cells trimmed to the linked encapsulation; Depends-on and Staffing cells byte-preserved — C35 F4's mis-parse class avoided by construction: the script rebuilt rows around the untouched cells); the batch notes for batches 1–7 and migration batches 1–3 with their nine spent fenced summonses; the batch-3/5 close blocks, the HELD-superseded note, the post-probe-return note; the migration campaign note's five step elaborations; eight §7 entries killed whole under DOCTRINE §8's purge clause — D1, D4, D5, D6, D7, D8, D9, D18 — each verified fully distilled into §§1–5 before deletion (D1→title, D4→§5 substrate bullet + §4, D5→§4, D6→§3, D7→§1's amendment blockquote, D8→§3's deployment paragraph, D9→§2+§3, D18→§2's write list items 5–7); zero tombstones owed — no live row or live note cites a killed number. Survived verbatim: all 10 OPEN rows, every Depends-on cell (paid ⬡-gate parentheticals included), the rework batch note with its blessing record, both deferred lists and the Parked list, §§1–5 whole, 15 §7 entries, §8 whole, C12's live ⬡ hold (`launchctl` for Felix's `!`), the `bv/c29-summon-harness` unmerged-branch remainder in the campaign note.
- **F2 — the §2 cold walk.** *How do we work here?* — repo CLAUDE.md + §5 (untouched). *What is this, what's the plan?* — §§1–4 (untouched). *State of work?* — §6, 53 rows, statuses identical. *What do I do right now?* — the rework note + OPEN rows, each linking its charge doc. *What have we learned?* — every compressed row carries its findings link; the docs hold the evidence. *Where were we?* — LEDGER.md tail (§5 ledger-locality, untouched). *What's been decided?* — §7's 15 entries; git holds the killed eight (DOCTRINE §8 teaches the gap). *What changed mid-flight?* — plans/BULLETIN.md; note: the README's only bulletin pointer died with the migration batch-2 note — the coda and DOCTRINE §9 still route agents there (flagged, not patched: the purge writes no new facts). *What came in from the field?* — §5's ISSUES bullet (untouched).
- **F3 — fresh-written tokens, flagged (spec 4).** Three classes, no new facts: (a) splice punctuation and the normalized "findings in [X]" tail inside compressed status cells — every content clause is the row's own text; (b) the campaign note's step-5 status "(**LANDED 2026-08-30**)" replacing "(un-laid; …)" — a status truth the G5 row evidences, not a new claim; (c) "The arc:" trimmed from "The arc — laid batch by batch, never before its inputs exist:".
- **F4 — deviations and tensions, named.** (a) The baseline `doctrine lint` was 1, not the spec's 0 — a pre-existing `ledger.row` red at `LEDGER.md:2897` ("G5, cont."), outside this charge's fence (append-only ledger, out of scope); the bar was held as "nothing new": after-lint is byte-identical to before. Filed to ISSUES for the G6 sweep. (b) §8's keystone evidence block kept whole — C35 compressed MAP's keystones to one line, but this charge's Spec doesn't name §8; deferred to the next Architect sweep, not taken. (c) Both deferred lists reference dead vehicles ("next-cut candidates at G3"; "when canon C32 lands at the flow-1 close" — G3 KILLED, agents-flow-1 abandoned at D22): kept verbatim — re-ruling deferred items is review work this charge excludes; flagged for G6. (d) Batch-5's parked candidate 7 (split-neighborhood) and the 08-28 account-knob ruling were verified alive in [b24-arrangement.md](b24-arrangement.md) §candidate-7 and [b27-qol-close.md](b27-qol-close.md) §6 before their batch notes died.

## Kill criteria

If compression would force rewriting a live hold or an undistilled §7 entry to keep the doc coherent, keep it verbatim and note the tension — the purge never trades truth for size.

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
