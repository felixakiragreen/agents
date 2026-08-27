# B21 — the Grep

**Status:** OPEN · **Depends on:** B15; B16; B19 · **Staffing:** Builder ·
opus-high · **Blessed:** the deck keel as amended 2026-08-27 (the mid-batch-5
block), on Felix's field note (ISSUES this date, ruled same sitting).

## Goal

"What was that session where I was talking about 'bob summons'?" — one
keystroke, one query, one click, and the Chat is open at that turn.
Everything the city writes is greppable — transcripts across all three
accounts, the register's doctrine docs, `plans/`, the desk — fast, bounded,
grouped, and **every hit instantly jumpable**.

## Inputs — read before building

- [deck-keel.md](deck-keel.md) §3's amended block (the commission).
- B5's shelf join (the transcript corpus ×3 accounts — discovery exists;
  reuse, never re-derive), B15's line-anchored doc viewer, B16's hotswap
  (the session jump target), B19's desk editor.
- B13's drawer (results live there — the overlay genre, pinnable).
- The limits law (directives §3.1): every search bounded — time, hits,
  file size.

## Spec

1. **The corpus, by kind:** *Sessions* — transcript JSONL ×3 account dirs
   (B5's discovery); *Docs* — the register's doctrine files + `plans/`
   city-wide (the walk knows them); *Desk* — `desk/`. Census/audit
   telemetry excluded (noise, and gitignored truth-less by law).
2. **The mechanism.** Shell out to `rg` (fixed argv, `--json`, case-smart)
   when on PATH; fall back to bounded `grep -rn` with the degradation named
   in the UI (slower, honest). Bounds hard-coded: per-kind hit cap (~50),
   overall timeout (~3 s), max file size skip — a capped result set SAYS it
   was capped (no silent truncation, B-row law). No index until measurement
   demands one (premature optimization law; `rg` over this corpus is
   fast).
3. **Entry + results.** A header search box, focusable by keystroke (`/`
   and Cmd+K both — pre-chewed); results render in the **drawer**, grouped
   Sessions / Docs / Desk, each hit: encapsulated source (session name per
   D16 identity · doc path · note title), the matching line with the term
   marked, age, and **the jump**.
4. **The jumps.** A session hit → **Chat hotswaps** to that session
   scrolled to the matching turn (map the matched JSONL line to its turn;
   B16's windowing accepts a target anchor). A doc hit → the Workshop
   viewer at the line (B15). A desk hit → the desk editor at the note
   (B19). Dead sessions jump too — the Chat renders stillness honestly;
   resume stays a deliberate act.
5. **Transcript honesty.** Raw JSONL search matches escaped content —
   plain words and phrases match verbatim; strings crossing JSON escapes
   (quotes, newlines) may not. The limitation is NAMED in the order and in
   a help tooltip, not discovered by Felix ("phrase with quotes? try the
   words"). A miss class this creates is a finding, not a patch.
6. **Decoded results.** Hit lines pass through B20's decoder — a result
   mentioning `B18` decodes like everything else.

## Acceptance criteria — the DoD

- [ ] **The commissioning query, live:** search `bob summons` → hits in ≥2
  accounts' transcripts, grouped; click one → the Chat opens that session
  at the matching turn (DOM + timestamps pasted).
- [ ] A doc hit jumps to the line-anchored viewer; a desk hit opens the
  note (one each, evidenced).
- [ ] Bounds proven: an induced over-cap query renders the cap notice; the
  timeout fires on an induced slow arm (evidence); the `rg`-absent
  fallback path tested once with its degradation banner.
- [ ] Warm query p95 < 1 s over the real corpus (protocol + numbers
  pasted); the search never rides the request thread into a stall (worker
  law, B8 F3).
- [ ] Case-smart works (lower → insensitive, mixed → sensitive — or the
  chosen rule, asserted); the term is marked in result lines.
- [ ] Zero new deps; suite green one process; `bunx --offline tsc
  --noEmit` exit 0.

## Out of scope

- An index, embeddings, fuzzy search (measured need first); searching
  census/audit telemetry; editing from results; v0 pages.

## Findings

*(append here)*

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§5–6,
~/code/agents/belvedere/plans/deck-keel.md,
and ~/code/agents/belvedere/plans/b21-grep.md,
and build it to its DoD.
```
