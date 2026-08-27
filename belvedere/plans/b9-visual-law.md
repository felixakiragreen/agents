# B9 — the visual law sweep

**Status:** OPEN · **Depends on:** B7 · **Staffing:** Builder · opus-medium ·
**Batch 3 (amended 2026-08-27):** last row before the close gates, strictly serial,
straight to master
**Spec blessed:** 2026-08-27, Architect, on Felix's design laws (README §3, his
words this date).

## Goal

Every page conforms to the design laws before Felix's visual pass. B5–B7 build to
the laws natively (their Builders read §3 at kickoff); B9 sweeps what predates
them — B2's city/building pages, B3's rail, B4's banner and strip.

## Spec

1. **Typography:** Inter for running prose; IosevkaFelix for numbers, titles,
   buttons, and tabular data. IosevkaFelix is local to the machine (reference by
   family). Inter is vendored into `glass/assets/` as woff2 — **that one fetch
   (SIL OFL files) is this row's named third-party (D54); nothing else.** No
   network font at serve time (glass-shatters).
2. **Legends:** mantle-colour legend and status-ring legend on `/city` and the
   rail — compact, dismiss-less, always visible.
3. **Encapsulation-first:** cards, rows, and panels lead with the short name
   derived render-side — the text before the first ` — `/`: ` seam, ≤ 6 words;
   an [expand] control reveals the full text. Derivation never invents words: a
   text with no seam renders whole. (The field ask is row-17 evidence, not a new
   parser — if derivation needs per-repo special cases, STOP and file the
   evidence instead.)
4. **City grouping:** buildings group by parent directory (`~/code/<x>`);
   off-register sessions group the same way — the panel becomes directory groups,
   same honesty.
5. **Sorting:** attention first (batons, gates, escalations), recency informs
   order within groups, never dictates across them.
6. **No dropdowns anywhere** — toggled or wrapping button groups.

> **Amended 2026-08-27 (Architect, the B5 E1 ruling):** the WIP gauges — shelf
> panel, rail, City View, one read — gain the **auditor delta**: beside the
> census figure, one approximate process count (B5 E1's own `[c]laude` grep),
> labeled — "6 tracked · ≈38 claude processes visible". The census stays the
> **sole identity authority** (P1 F5): the auditor is a count, never sessions —
> it houses nothing, joins nothing, and is never merged into cards. It is the
> sensor's standing drift alarm (the `sync/check` pattern): the gap is the
> pre-horizon floor today, decays with it, and any post-horizon reopening means
> a sensor is lying. DoD gains: the delta line rendered on all three views.

## Acceptance criteria / DoD — evidence pasted here at build time

- [ ] Fonts: prose renders Inter (vendored, served locally), data/titles/buttons
      IosevkaFelix — shown per page; zero network requests at serve time.
- [ ] Legends present on `/city` and the rail.
- [ ] Rail cards and building panels lead with encapsulations + working [expand];
      a seamless text renders whole (one example of each quoted).
- [ ] `/city` grouped by parent directory, off-register included.
- [ ] Sort order: one screenshot/dump showing attention-first with recency within.
- [ ] No `<select>` in any served page (`grep -c '<select'` → 0).
- [ ] `bun test belvedere/glass` green · `bunx tsc --noEmit` green (B8's gate) ·
      `git status` clean but for intended files.

## Out of scope

New pages or panels · flow/dispatch features · `doctrine/` · rig ground · felikai
palette changes (theme stands; this row applies laws, not taste).

## Findings

*(append here)*

---

**Kickoff (verbatim):**

```
You are a Builder at opus-medium.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md
and ~/code/agents/belvedere/plans/b9-visual-law.md,
and build the order.
```
