# B9 — the visual law sweep

**Status:** LANDED 2026-08-27 · **Depends on:** B7 · **Staffing:** Builder · opus-medium · **Batch 3 (amended 2026-08-27):** last row before the close gates, strictly serial, straight to master **Spec blessed:** 2026-08-27, Architect, on Felix's design laws (README §3, his words this date).

## Goal

Every page conforms to the design laws before Felix's visual pass. B5–B7 build to the laws natively (their Builders read §3 at kickoff); B9 sweeps what predates them — B2's city/building pages, B3's rail, B4's banner and strip.

## Spec

1. **Typography:** Inter for running prose; IosevkaFelix for numbers, titles, buttons, and tabular data. IosevkaFelix is local to the machine (reference by family). Inter is vendored into `glass/assets/` as woff2 — **that one fetch (SIL OFL files) is this row's named third-party (D54); nothing else.** No network font at serve time (glass-shatters).
2. **Legends:** mantle-colour legend and status-ring legend on `/city` and the rail — compact, dismiss-less, always visible.
3. **Encapsulation-first:** cards, rows, and panels lead with the short name derived render-side — the text before the first ` — `/`: ` seam, ≤ 6 words; an [expand] control reveals the full text. Derivation never invents words: a text with no seam renders whole. (The field ask is row-17 evidence, not a new parser — if derivation needs per-repo special cases, STOP and file the evidence instead.)
4. **City grouping:** buildings group by parent directory (`~/code/<x>`); off-register sessions group the same way — the panel becomes directory groups, same honesty.
5. **Sorting:** attention first (batons, gates, escalations), recency informs order within groups, never dictates across them.
6. **No dropdowns anywhere** — toggled or wrapping button groups.

> **Amended 2026-08-27 (Architect, the B5 E1 ruling):** the WIP gauges — shelf panel, rail, City View, one read — gain the **auditor delta**: beside the census figure, one approximate process count (B5 E1's own `[c]laude` grep), labeled — "6 tracked · ≈38 claude processes visible". The census stays the **sole identity authority** (P1 F5): the auditor is a count, never sessions — it houses nothing, joins nothing, and is never merged into cards. It is the sensor's standing drift alarm (the `sync/check` pattern): the gap is the pre-horizon floor today, decays with it, and any post-horizon reopening means a sensor is lying. DoD gains: the delta line rendered on all three views.

## Acceptance criteria / DoD — evidence pasted here at build time

All measured against a real glass on the live city (`GLASS_PORT=4409`, `~/code`, 2026-08-27), pages captured with `curl`.

- [x] **Fonts: Inter vendored and served off the glass; nothing reaches the network.** `assets/inter-latin-400.woff2` + `-700` + `inter-LICENSE.txt` (SIL OFL 1.1, "Copyright 2020 The Inter Project Authors"), 21 564 B / 22 904 B, magic `wOF2`. **Not fetched: copied from a licensed copy already in the city** (`~/code/rooted/web/node_modules/@fontsource/inter/files/`) — the order's named third-party is the font, and taking it offline is strictly cheaper than the D54 fetch it authorised. Served byte-identical:

      $ curl -sD - -o font.woff2 http://127.0.0.1:4409/assets/inter-latin-400.woff2 | head -3
      HTTP/1.1 200 OK
      Content-Type: font/woff2
      Cache-Control: public, max-age=604800, immutable
      $ shasum -a 256 font.woff2 belvedere/glass/assets/inter-latin-400.woff2
      2301bb030a2bcaa9c763cc4771bd717aac16709c29eaba00673fcbe7cdf99a59  font.woff2
      2301bb030a2bcaa9c763cc4771bd717aac16709c29eaba00673fcbe7cdf99a59  …/assets/inter-latin-400.woff2

      **Zero network at serve time, proven structurally rather than by a devtools
      screenshot**: `grep -cE 'https?://'` over the served `/glass.css`, `/felikai.css`
      and every page = **0**, and the only `url()` in either stylesheet is
      `url('/assets/inter-latin-400.woff2')` / `-700`. Division of the two faces:
      `body { font-family: var(--mono) }` (Iosevka Felix, installed — *family: Iosevka
      Felix* in `system_profiler`, never vendored), so numbers, titles, buttons, `.stat b`,
      `th`/`td` and `.encap` are Iosevka by default and **`.prose` opts prose into Inter** —
      `.rail-text` (the ledger clause on every card), every note that is a sentence, panel
      bodies, queue and ISSUES entries: `class="prose"` occurrences per page —
      `/` **90** · `/b/agents` **69** · `/b/agents/belvedere` **35** · `/shelf` 5 ·
      `/summon` 4 · `/city` 2 (the City View is a card wall of names and figures — almost
      nothing on it is running prose).
- [x] **Legends on `/city` and the rail**, compact, dismiss-less, no control inside:
      rail **15 keys** (fireable / his / countersign / dropped baton, the four liveness
      rings, the eight mantle hues off `presets.tsv`, unstamped), city **12 keys** (the
      five board-state pills, the rings, the mantle hues). `class="legend"` present on
      `/`, `/city`, `/shelf`, `/summon`.
- [x] **Encapsulation-first, with a working [expand]** — derived, never invented.
      Live rail: **11 of 38 cards** carry a name, all 11 with an `[expand]`; the other
      **27 render whole** because their own first line has no ≤6-word head (F1).
      Quoted from the live rail — encapsulated:
      `<p class="encap">Felix's Phase-1 acceptance ruling</p><details class="more">
      <summary>expand</summary><p class="rail-text">…` — and seamless, rendered whole with
      no control at all: `<p class="rail-text">venue D2 ✓ Felix via keel §11</p>`.
      Building page `/b/agents/belvedere`: **13 names, 27 expands** — every board row's
      Work cell leads with the work's name and hides the rest
      (`<a …>Census join</a><details class="more"><summary>expand</summary><p class="prose">Census
      join — hook events, payloads, CMUX_* env, …`), and each Status cell keeps its state
      pill and hides the landing essay behind the date it starts with. **The rule earns
      itself on live data**: an `[expand]` must reveal more than the card already shows,
      so `**The continuous flow — the` (all `parseIssues` gives of `agents/ISSUES.md`:297)
      renders whole — 0 of 20 ISSUES entries on `/b/agents` encapsulate, and none pretends
      to hide anything.
- [x] **`/city` grouped by parent directory, off-register the same way.** Live:

      ~/code/universal_robots_sdk  [16 buildings · 4 lit]
      ~/code/agents                [2 buildings · 3 lit]
      ~/code/rooted                [2 buildings · 0 lit]
      ~/code/whiteboardy           [1 building · 0 lit]
      ~/code/hexwright             [1 building · 0 lit]
      Off the register: ~/code/universal_robots_sdk [1 session]

      A worktree checkout groups with its repo (`agents/.claude/worktrees/bv/x/belvedere`
      → `agents`), and a path outside `~/code` is named `outside the city`, never housed.
- [x] **Attention first, recency within** — the live dump, ranks computed by
      `attentionOf`, order as rendered:

      ## ~/code/agents
         rank 0  lit 3  2026-08-27T16:52  agents
         rank 2  lit 0  2026-08-27T16:33  agents/belvedere
      ## ~/code/universal_robots_sdk
         rank 0  lit 4  2026-08-27T16:41  universal_robots_sdk/bob
         rank 1  lit 0  2026-08-27T16:38  …/campaigns/pods
         rank 1  lit 0  2026-08-27T16:08  …/campaigns/lunchbox
         rank 1  lit 0  2026-08-27T14:20  …/campaigns/theseus
         …
         rank 3  lit 0  2026-08-14T03:36  …/felix/spacex-dashboard-c2

      The rank is monotone down every group and the timestamps fall only *inside* a rank —
      `spacex-dashboard-c2` is two weeks stale and last **because of its rank**, not its
      date. On the rail the same law: cards sort by rank, then by entry date descending
      (pinned in `rail.test.ts`).
- [x] **The auditor delta, on all three views** (the amendment). Live, one instant:
      `8 tracked · ≈35 claude processes visible · 27 beyond the census` on the rail, on
      `/city` and in the shelf's WIP panel, each labelled as the sensor's drift alarm.
      The census stays the sole identity authority: the count joins nothing, houses
      nothing and reaches no card. Cost measured: `auditorCount()` **36.4 ms median**
      (N=10, `ps -axo command=`).
- [x] **No `<select>` in any served page** — `grep -c '<select'` = **0** on `/`, `/city`,
      `/shelf`, `/summon`, `/b/agents`, `/b/agents/belvedere`, `/doc`. The rail's account
      picker was the glass's last one; it is now a radio group wearing `.btn`
      (`type="radio"` ×2, exactly one `checked`, group named after the shot's own reserved
      name-stamp so two pickers can never collide).
- [x] **The rail stayed fast at browsing speed** — 20 requests 2 s apart, crossing the
      register TTL: `n=20 min=0.076s p50=0.095s p95=0.111s max=0.125s` (bar 500 ms; B8's
      p95 was 45 ms and the 36 ms auditor spawn is most of the delta — F3).
- [x] **`bun test belvedere/glass` 302 pass / 0 fail in one process** (271 before this
      row; +31 pinning the new laws), **`bunx --offline tsc --noEmit` exit 0**,
      `git status` clean but for `?? .claude/`, which predates this session.

## Out of scope

New pages or panels · flow/dispatch features · `doctrine/` · rig ground · felikai palette changes (theme stands; this row applies laws, not taste).

## Findings

**F1 — 27 of the live rail's 38 cards have no name in their own prose, and the derivation must not invent one.** The rule is Felix's: the head before the first seam, ≤ 6 words. Two seams are read, **the spaced dash first and a colon only where the line has no dash** — his own examples are `B8: glass hardenings` and `E1: register policy`, where the id and the name are one phrase and the dash divides that phrase from the prose; taking the colon first would name every row after its id alone. On the live city that derivation names 11 cards and declines 27. The declines are honest, not broken: most are gates whose whole text is already a name (`blessing`, `Felix's plan sketch`, `venue D2 ✓ Felix via keel §11` — rendering them whole is the correct answer), and the rest are Next clauses whose first line runs eight or more words before its dash (`gate 26 is the sitting for both inbox entries — …`). **No per-repo special case was added and none should be** — this is the row-17 evidence the spec asked for: **the shapes need a name FIELD**, one to six words, written by the session that files the entry. A parser cannot recover a name nobody wrote, and 71% of the city's cards currently do not write one. (Two small render-side rules do earn their place and are general: a seam falling inside a `**bold**` span drops the orphaned marker, since the marker was never a word; and an `[expand]` that would reveal less than the card already shows is not drawn — measured on `agents/ISSUES.md`:297, where `parseIssues` hands over one line of a five-line entry and the disclosure would have added two words.)

**F2 — the `pages` ↔ `gauges` import cycle the auditor delta would have opened, and where `ago()` belongs.** `gauges.ts` imported `ago` from `pages.ts`; putting the auditor in `gauges.ts` (right: it is a gauge, and the census must not grow a second liveness authority — P1 F5) and rendering it on `/city` would have made the two files import each other. ESM tolerates that until the day a module-scope constant runs first, and this glass has already paid once for hidden module-load order (B8 F1). `ago()` is a display primitive, so it moved to `html.ts`, which imports nothing local but `paths` — the cycle never existed. **For anything the flow chapter adds: a render helper that both a page and a panel want belongs in `html.ts`, not in whichever file wrote it first.**

**F3 — the auditor costs 36 ms of the request thread, and that is now most of the rail's latency.** `ps -axo command=` is 35–51 ms (N=10, median 36.4), and the rail's p95 went 45 ms → 111 ms across this row. It is a spawn, not a walk, so B8 F3's worker law does not bite (the bar is the work, not the pattern) and 111 ms is a fifth of the 500 ms bar. But it is the third of three views paying it per request, and the cheap fix if it ever matters is the register's own pattern — a short TTL on the count, not a worker. **Named, not built: a cache is a policy question and this row applies laws.** Also measured while counting: **B5 E1's `[c]laude` grep reads 41 where the CLI processes are 36** — the five extra are shell snapshots whose path contains `.claude` (`/bin/zsh -c source /Users/felix/.claude/shell-snapshots/…`). The auditor matches `argv[0]`'s basename and drops the harness's own `bg-pty-host`/`bg-spare` helpers, so the alarm counts sessions' processes rather than its own noise. The gap it reports today is **27 of 35** — B5 E1's horizon, undecayed.

**F4 — the radio picker's `:checked` read is the one thing this row could not prove without a browser.** The Chrome extension was not connected (`Browser extension is not connected`), so the fire path's new line — `shot.querySelector('[data-account] input:checked').value` — is pinned by markup tests (input immediately before its label, one `checked`, unique group name per shot) and by nothing that ran a click. **The batch-close live fire from the rail is Felix's gate and is exactly this path**: if it fires as the right account, the picker is proven; if the fire 400s on `account`, this line is where to look.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-medium.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md
and ~/code/agents/belvedere/plans/b9-visual-law.md,
and build the order.
```
