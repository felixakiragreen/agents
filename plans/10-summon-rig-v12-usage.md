# 10 — summon rig v1.2: the usage panel

The account row's whole job is quota arbitrage — and today Felix plays it blind. v1.2
puts a condensed per-account usage table in the Ctrl-G panel: session, week and Fable
utilization per account, with a **pacing delta** against each window's reset clock —
green when there's headroom, red when the burn outruns the clock — so the account digit
Felix presses is an informed spend, not a guess. Felix's call (D41): the table, the three
windows, the green/red pacing. Architect's design: everything below.

This is a modification of a landed, tested system — `summon/` with its harness at
`lab/08/run` — not a rebuild. Extend, don't rewrite. **One hard unknown gates the build:
where usage data lives (E2).** Phase A settles it or kills the row; a documented kill is
a win.

## Inputs — read before working

- This brief, then `plans/09-summon-rig-v11.md` and `plans/08-summon-rig.md` (the landed
  contracts + findings — F1/F2 palette law, F9 harness law, F10(b) byte-assertion law)
  and the code: `summon/summon.zsh`, `lab/08/run`.
- `GENESIS.md` row 10; `canon/work/DOCTRINE.md` for findings law.

## E2 — the usage source (Phase A; gates Phase B)

Nothing in this repo knows where per-account utilization lives. Probe in this order and
file the finding — actual file paths, endpoint, field names, freshness — in this doc:

- **(a) Local sidecars, zero credentials.** Inside each config dir:
  `policy-limits.json` (present on both THG accounts), `daemon.status.json`, anything
  else usage-shaped. Question: does any carry per-window utilization + reset timestamps,
  and does it stay fresh without Claude Code running?
- **(b) The OAuth usage endpoint.** Community tooling reads
  `https://api.anthropic.com/api/oauth/usage` with the account's access token; the
  response is believed to carry per-window utilization and `resets_at`. Verify the shape
  yourself — assume nothing from hearsay. Token location per account:
  `$CONFIG_DIR/.credentials.json`, else macOS Keychain (`security
  find-generic-password`). Keychain reads prompt per binary — that is a Felix decision
  (see the gate), never a prompt storm sprung on him.

**Architect's own probe, on the record:** the auto-mode classifier denied both a
Keychain read and a `policy-limits.json` read from an agent session — live config dirs
are guarded territory (D14's spirit). Expect the same; run Phase A with Felix at the
keyboard approving each probe.

**Security law — absolute, all of Phase A and B:**

- Tokens never in argv (`ps` leaks them — curl takes headers on stdin), never in any
  cache, log or finding, never echoed.
- The rig never refreshes or rotates a token. Read-only use of what exists; an expired
  token is a failed fetch is a stale table. Claude Code owns the auth lifecycle, and a
  rig-side refresh could race it and invalidate live sessions.

**The gate:** Phase A ends with the E2 finding filed. If the chosen source needs any new
grant from Felix (Keychain always-allow, a credentials-file read he hasn't blessed) —
STOP, present the finding and the ask, wait. If a source works with zero new grants,
proceed straight to Phase B on it.

**Kill criteria:** no source yields per-window utilization + reset time per account; or
the only source needs credential handling Felix declines; or freshness is so poor the
deltas would lie. Then the row dies with findings filed — that is a landed kill, not a
failure.

## Spec (Phase B)

### 1. The fetcher — `summon-usage`

- One function in `summon.zsh` (peer of `summon-stats`), callable by hand: fetches every
  account in `accounts.tsv`, normalizes, writes one cache file per account —
  `log/usage/<config-dir-basename>.json` (basename is the stable identity; keys and
  labels are Felix-editable). Run by hand it also prints the table + each cache's age —
  it is the diagnostic for "why is my table grey".
- Normalized cache, so the render stays dumb:
  `{"fetched_at": <epoch>, "windows": {"sess": {"used_pct": N, "resets_at": <epoch>,
  "window_secs": N}, "week": {…}, "fable": {…}}}` — a bucket the source doesn't report
  is simply absent. Whatever the source's real field names are, the fetcher owns the
  mapping (file it in the E2 finding).
- **Atomic writes** — tmp + `mv`; a background fetcher racing a render must never serve
  a torn read.
- Limits on everything: `curl -m 5`, one attempt per account, stderr to /dev/null in
  background mode; a failed fetch leaves the old cache untouched.
- On panel open (after first paint, never before): for each account whose cache is
  older than 60s, spawn one disowned background fetch. Two panels racing spawn
  duplicate fetches — harmless under atomic writes, accepted.

### 2. The table — render

Sits between the account row and the hotkey row, aligned to the 9-column gutter, one
line per account in `accounts.tsv` order. Rendering guide (cosmetics per 09-F8: deviate
where the data forces it, document why):

```
account  [0] personal  [1] thg-fgreen ✓  [2] thg-doorbell
usage    0  sess    —    week    —    fable    —
         1  sess 42%+31  week 61%-8   fable 12%+55
         2  sess 78%-13  week 45%+2   fable  —
         [y]ank  [.] eject  [Esc] close  [Enter] invoke
```

- Cell: `<window> <used>%<delta:+d>` — integers, columns aligned across the three
  lines. A bucket the account doesn't have: `—`. An account with no cache file: all
  cells `—`.
- **Pacing delta** = `round(elapsed_pct − used_pct)` where
  `elapsed_pct = 100 × (1 − (resets_at − now)/window_secs)`, clamped to [0,100].
  Worked: session used 42%, resets in 1h21m of a 5h window → elapsed 73% → **+31**
  (headroom, green). Week used 61%, elapsed 48% → **−13** (burning faster than the
  clock, red).
- Palette: a **fresh** line (cache ≤ 10 min) renders in default foreground with the
  delta in `fg=green` (≥ 0) or `fg=red` (< 0); a **stale** line (> 10 min) drops
  entirely to grey, deltas uncolored — vivid means live, grey means don't trust it.
  Colors are trust; stale data never wears them.
- No `log/usage/` directory at all ⇒ the block is absent and the panel is byte-identical
  to v1.1 — the rig without usage configured must not change by one byte.
- Wraps clean at 60 columns like every other row; re-read from cache on every paint
  (the TSV law: the files are the truth), so a background fetch landing mid-panel shows
  on the next keystroke.

### 3. Latency law — unchanged from 08/09

- **Zero forks in the keystroke loop.** The one new fork is the disowned fetch spawn at
  panel open, post-first-paint. Budget: panel-open added latency < 5 ms; per-keystroke
  delay unchanged — re-measure both, numbers in the DoD.

### 4. Telemetry — none, defended

No change to the invocation schema; the usage table is ambient display, not selection.
Recording quota-at-fire so a future Architect can audit whether the arbitrage works is
real but speculative — parked, named in out-of-scope, cut when a question needs it.

## Acceptance criteria — the DoD

Evidence: `lab/08/run` extended, green, no regressions; byte-level assertions in python
per 09-F10(b); fetch shimmed (a `curl` shim serving fixture JSON, a `security` shim if
Keychain is the source).

- [ ] E2 finding filed in this doc: source, shape, field mapping, freshness, and the
      grant story; Felix's gate decision recorded if one was needed
- [ ] `summon-usage` by hand: fetches ×3, normalized caches written atomically, table +
      ages printed; a failed fetch leaves the prior cache intact (asserted)
- [ ] Token hygiene asserted: the shim proves no token in argv; python proves no token
      byte in any cache, log or transcript the harness produced
- [ ] Pacing math unit-asserted at the edges: reset imminent, reset just passed,
      used > elapsed, used 0, clamps
- [ ] Table renders per spec — fixture caches → text + spans: green/red delta spans,
      fresh vs stale arms, missing-bucket `—`, no-cache line, aligned columns, 60-column
      wrap on the live pty
- [ ] No `log/usage/` ⇒ panel byte-identical to v1.1 (asserted against the v1.1 render)
- [ ] Panel-open spawns fetches only for stale caches, after first paint; keystroke loop
      fork-free; both latencies re-measured and under budget
- [ ] README: the usage section — the table, the pacing delta, the trust palette, the
      staleness story, the E2 caveats
- [ ] Felix's visual pass on a live terminal, three real accounts — the smoke only his
      tokens can run

## Out of scope — defended

- Reset countdowns / clock display in the table — the delta *is* the clock, rendered;
  condensed means condensed.
- Quota-at-fire in `invocations.jsonl` — parked until a question needs it.
- A refresh key or usage toggle key — open-time auto-refresh covers it; the reserved-key
  set does not grow.
- Token refresh, re-auth, or any write to any credential store — forbidden, not parked.
- Data format changes to `presets.tsv` / `accounts.tsv`.

## Kickoff — verbatim

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then execute the brief at ~/code/agents/plans/10-summon-rig-v12-usage.md.
Phase A (E2) runs with Felix at the keyboard; its gate is in the brief.
```
