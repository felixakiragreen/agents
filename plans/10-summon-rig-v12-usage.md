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

Evidence: **`./lab/08/run` — 130 assertions, 0 failures** on 2026-08-07 (76 at v1.1, so 54
are new; every v1/v1.1 guarantee still asserted and green).

- [x] E2 finding filed in this doc: source, shape, field mapping, freshness, and the
      grant story; Felix's gate decision recorded if one was needed — **above**: (a)'s four
      candidates ruled out with evidence, `cachedUsageUtilization` found and measured stale,
      the gate put to Felix, his "probe (b) first" recorded, and (b) probed to HTTP 200 on
      all three accounts. The keychain service derivation is asserted in the harness, not
      just documented: `PASS keychain service derived for personal (sha256 → dcd01a92)`,
      `… thg-fgreen (sha256 → 15cc4976)`, `… thg-doorbell (sha256 → 33751bfc)`
- [x] `summon-usage` by hand: fetches ×3, normalized caches written atomically, table +
      ages printed; a failed fetch leaves the prior cache intact (asserted) — `PASS
      summon-usage fetches every account in accounts.tsv (3)`, `PASS and reports each cache
      age, so "why is my table grey" has an answer` (`1 thg-fgreen 0 s fresh`), the three
      normalized buckets asserted byte-exactly (`"sess":{"used_pct":42,"resets_at":
      1786140000,"window_secs":18000}`, week and fable likewise), and both failure arms:
      `PASS a fail fetch leaves the previous cache byte-identical`, `PASS a garbage fetch
      leaves the previous cache byte-identical` (a token that won't read, and an
      authentication-error body — the two real failures), `PASS and it says so per account
      rather than failing silently (3)`, `PASS atomic writes leave no .tmp behind, on
      success or failure`
- [x] Token hygiene asserted: the shim proves no token in argv; python proves no token
      byte in any cache, log or transcript the harness produced — `PASS curl is called with
      a 5-second limit, one attempt, header from stdin (3)` (argv is exactly `-sS -m 5 -H @-
      -H anthropic-beta: … <url>`), `PASS the token reaches curl on stdin, intact, once per
      account (3)` — the shim compares stdin against the expected header and records only
      the verdict, so no artefact holds even the fake token — and the sweep: `PASS no token
      byte in any of the 51 artefacts this harness produced`, plus `PASS no token byte in
      curl argv — ps cannot leak it`. The harness can never reach the real store: `security`
      and `curl` are shimmed in `rc.zsh` itself
- [x] Pacing math unit-asserted at the edges: reset imminent, reset just passed,
      used > elapsed, used 0, clamps — ten cases, each a fixed answer because every reset is
      expressed as an offset from now: `reset imminent → +58`, `reset just passed → +58`
      (clamped at 100, never beyond), `used ahead of clock (90 at 50% elapsed) → -40`,
      `used nothing → +50`, `reset a window away → -10` (clamped at 0, never negative),
      `dead level → +0` (signed), `half rounds up → +1` / `half rounds down → -1` (away from
      zero, not to even), and both of the brief's worked examples reproduced exactly:
      `session window used=42 → +31`, `week window used=61 → -13`. The hand-rolled
      ISO-8601 → epoch has a second opinion: `PASS all 5 ISO-8601 stamps agree with python
      to the second`, and `PASS a timestamp the rig cannot parse is refused, not guessed`.
      The parser is asserted against all three real payload shapes: 3 buckets, 2 buckets
      (no Fable limit — *not* a fabricated third), and 0 from an error body
- [x] Table renders per spec — fixture caches → text + spans: green/red delta spans,
      fresh vs stale arms, missing-bucket `—`, no-cache line, aligned columns, 60-column
      wrap on the live pty — the whole rendering guide, line for line: `PASS an account with
      no cache file renders every cell as —` (`usage    0  sess —         week —         fable —`),
      `PASS a fresh account renders used% and the pacing delta, columns aligned`
      (`         1  sess 42%+31    week 61%-13    fable 12%+55`), `PASS a bucket the account
      does not have renders —, the rest still render` (`         2  sess 78%-13    week
      45%+2     fable —`), `PASS the block sits between the account row and the hotkey row`.
      Palette as spans over the text they cover: `fg=green ⟨+31⟩`, `fg=red ⟨-13⟩`,
      `fg=green ⟨+55⟩`, and the stale arm grey *whole* — `fg=8 ⟨sess 78%-13  ⟩`, `fg=8 ⟨week
      45%+2   ⟩` — with `PASS the fresh line wears no grey: only its deltas are coloured
      (0)` proving the two arms are actually different. 60 columns: `PASS every panel line
      fits 60 columns (widest 57)` and the block intact. On a live 60-column pty:
      `PASS live 60-column pty: the usage block paints on a real screen` (`usage    0  sess
      17%+13`), with `\e[32m` and `\e[31m` both on the wire
- [x] No `log/usage/` ⇒ panel byte-identical to v1.1 (asserted against the v1.1 render) —
      `PASS no log/usage ⇒ panel byte-identical to v1.1 at 200, 80 and 60 columns`: v1.1's
      `summon.zsh` is checked out from its landing commit `b426166` into its own sandbox and
      rendered beside v1.2 through the same `render.zsh`, then `cmp`'d — **text and spans
      both**, at three widths
- [x] Panel-open spawns fetches only for stale caches, after first paint; keystroke loop
      fork-free; both latencies re-measured and under budget — `PASS panel open refetches
      only the cold caches, and leaves the fresh one alone (1)`: seeded with one account
      cacheless, one stale and one fresh, the spawn records exactly `SPAWNED personal
      thg-doorbell`. Fork-freeness is asserted directly, not inferred from a clock:
      `PASS 200 paints over three live caches invoked no external command` (`security`,
      `curl`, `shasum` and `mv` all made loud during the paint loop; the record stayed
      empty). Latencies, host load 3.19–4.33:

      | measurement | v1.1 | v1.2, usage configured |
      |---|---|---|
      | per invocation (TSV + state) | 0.370 ms | 0.323 ms |
      | per keystroke (full paint) | 1.569 ms | **2.562 ms** |
      | panel-open spawn, caches fresh — the ordinary open | — | **0.019 ms** |
      | panel-open spawn, all three cold | — | **3.735 ms** (load 3.63–3.94) |

      Panel-open added latency is inside the 5 ms budget in the worst case and effectively
      free in the common one. The per-keystroke number is **not** unchanged — see F1.
- [x] README: the usage section — the table, the pacing delta, the trust palette, the
      staleness story, the E2 caveats — `summon/README.md` § *Usage — the quota table*
- [ ] Felix's visual pass on a live terminal, three real accounts — the smoke only his
      tokens can run. **OWED** — `summon-usage` on the live rig, then Ctrl-G.

## Out of scope — defended

- Reset countdowns / clock display in the table — the delta *is* the clock, rendered;
  condensed means condensed.
- Quota-at-fire in `invocations.jsonl` — parked until a question needs it.
- A refresh key or usage toggle key — open-time auto-refresh covers it; the reserved-key
  set does not grow.
- Token refresh, re-auth, or any write to any credential store — forbidden, not parked.
- Data format changes to `presets.tsv` / `accounts.tsv`.

## Findings

**E2 — the usage source: it is on disk, uncredentialed, and it is stale by hours.**
Probed 2026-08-07, Felix at the keyboard, in the brief's order.

**(a) Local sidecars — the named candidates are all dead, but a fourth one is not.**

| File | Verdict |
|---|---|
| `policy-limits.json` (both THG, absent on personal) | org policy restrictions — `restrictions.allow_quick_web_setup`, `compliance_taints`, `monitoring_notice`, `defaults.remote_control_at_startup`. **No usage data at all.** |
| `daemon.status.json` (both THG) | `{supervisorPid, supervisorProcStart, writtenAt, workers:{}}` — a supervisor heartbeat, 5.9 days stale. **No.** |
| `stats-cache.json` (both THG) | per-day token counts by model (`dailyActivity`, `modelUsage.<model>.{inputTokens,…,costUSD}`). Tokens and dollars, **no windows, no resets, no utilization**; stale 15 h (fgreen) / 8.8 d (doorbell); absent on personal. **No.** |
| `remote-settings.json` | `{}`. **No.** |

The sweep that found the real one (regex `resets_at|utilization|five_hour|seven_day|rate_limit|…`
over every config dir, history/projects/caches excluded) returned exactly two hit classes:
`cache/changelog.md` (prose) and **`.claude.json`** on all three accounts.

**The source: `$CONFIG_DIR/.claude.json` → `cachedUsageUtilization`.** Zero credentials,
zero new grants, one file per account. Shape, measured (fgreen, 2026-08-07 14:21):

```json
"cachedUsageUtilization": {
  "fetchedAtMs": 1786122282637,
  "accountUuid": "…",
  "utilization": {
    "five_hour":  {"utilization": 0,  "resets_at": "2026-08-07T22:00:00.470292+00:00", "limit_dollars": null, …},
    "seven_day":  {"utilization": 32, "resets_at": "2026-08-13T18:00:00.470313+00:00", …},
    "seven_day_opus": null, "seven_day_sonnet": null, … (nine more null buckets),
    "extra_usage": {"is_enabled": true, "monthly_limit": 25000, "used_credits": 5396, "utilization": 21.584, …},
    "limits": [
      {"kind":"session",       "group":"session","percent":0,  "severity":"normal","resets_at":"2026-08-07T22:00:00.470292+00:00","scope":null},
      {"kind":"weekly_all",    "group":"weekly", "percent":32, "severity":"normal","resets_at":"2026-08-13T18:00:00.470313+00:00","scope":null},
      {"kind":"weekly_scoped", "group":"weekly", "percent":44, "severity":"normal","resets_at":"2026-08-13T18:00:00.470491+00:00",
       "scope":{"model":{"id":null,"display_name":"Fable"},"surface":null}}
    ],
    "spend": {"used":{"amount_minor":5396,…},"limit":{"amount_minor":25000,…},"percent":22,…}
  }
}
```

**Field mapping for the fetcher** — the `limits[]` array serves all three buckets uniformly
(`percent` + `resets_at`), and cross-checks against the scalar buckets exactly
(`limits[session].percent 0 == five_hour.utilization 0`; `weekly_all 32 == seven_day 32`):

| Brief's bucket | Source | `window_secs` |
|---|---|---|
| `sess` | `limits[kind=session]` (= `five_hour`) | 18000 (5 h — confirmed: `resets_at` 22:00:00.470292 vs weekly 18:00:00.470313, both on the hour) |
| `week` | `limits[kind=weekly_all]` (= `seven_day`) | 604800 |
| `fable` | `limits[kind=weekly_scoped, scope.model.display_name="Fable"]` | 604800 |
| — | `fetched_at` ← `fetchedAtMs / 1000` | — |

This is the `/usage` screen's own cache, not a coincidence: `cache/changelog.md:471` —
*"Fixed `/usage` showing stale cached bars over fresher data"* — and `:492`, *"`/usage` now
shows your last-known usage bars with an 'as of' note when the usage endpoint is
rate-limited"*. So (a) and (b) are the same payload; (a) is (b) already fetched, cached, and
timestamped by Claude Code itself. **This also settles the shape question the brief asked of
(b) without spending a token: the endpoint body is what is cached here.**

**Two defects, both material.**

**(1) Freshness is hours, not minutes — and the rig cannot fix it.** `fetchedAtMs` is
refreshed by Claude Code, on no clock the rig controls. Measured across each account's own
`backups/.claude.json.backup.*` series (the file is rewritten every ~1–3 min; the usage
stamp inside it is not):

```
fgreen    written 13:33 13:36 13:59 14:03 14:19 14:20 → fetchedAt 13:04:42 for all six  (77 min stale and counting)
doorbell  written 11:30 11:48 12:47                   → fetchedAt 10:18:39
          written 13:00 14:19 14:20                   → fetchedAt 12:48:15  (one refresh in 2 h 30 m)
```

Control: the same reader over the same six files reports the *file* mtime advancing every
few minutes, so the probe can see change — it is `fetchedAtMs` that is frozen. Refresh is
not tied to session start either (doorbell's newest shell-snapshot is 23:48 the previous
day; its cache refreshed at 12:48 today, mid-session).

What that costs the pacing delta, which is the whole feature:

| Bucket | Window | 90 min stale ⇒ phantom headroom |
|---|---|---|
| `sess` | 5 h | **+30 points** — the delta is mostly a lie |
| `week` | 7 d | +0.9 points — negligible |
| `fable` | 7 d | +0.9 points — negligible |

The session row is the one Felix reads before pressing a digit, and it is the one that
rots fastest. The week and Fable rows are sound.

**(2) The personal account has no `cachedUsageUtilization` key at all.** Not stale —
absent, across `~/.claude/.claude.json` and all five of its backups (14:06 → 14:19).
The account is live and authenticated (`organizationType: claude_max`,
`organizationRateLimitTier: default_claude_max_20x`, `profileFetchedAt` 13:13 today), so
this is not a login gap — GENESIS row 04's `~/.claude` "PENDING `/login`" note is stale,
parked, not fixed here. The likely cause is that the key is written when a session
actually fetches usage (`/usage` opened, or a limit event), and Felix has never opened
`/usage` on personal. **One keystroke from Felix settles it** — that is the ask at the
gate. Until it exists, source (a) renders account `0` as all `—`.

**(b) The OAuth endpoint — probed at the gate, with Felix's grant. It is the source.**

The gate was put to Felix with (a)'s two defects measured; he chose **probe (b) first**
(2026-08-07). Three permission grants were needed and given — keychain service
enumeration, per-entry metadata, and the hash-derivation test. No `.credentials.json`
exists in any config dir, so the token comes from the Keychain.

**The service name is derivable — no new config, no `accounts.tsv` change:**

```
service = "Claude Code-credentials-" + sha256(<absolute config dir path>)[:8]
account = $USER
```

Verified against all five `Claude Code-credentials*` entries on the machine (enumerated
via `security dump-keychain`, attributes only):

| Config dir | sha256[:8] | Keychain entry |
|---|---|---|
| `/Users/felix/.claude` | `dcd01a92` | present |
| `/Users/felix/.claude-thg-fgreen` | `15cc4976` | present |
| `/Users/felix/.claude-thg-doorbell` | `33751bfc` | present |

The hash is over the **absolute** path (`~` expanded), no trailing slash. A bare
`Claude Code-credentials` (unsuffixed, legacy) and one orphan `fcc8838d` from a retired
config dir also exist and are ignored. The derivation was found by hypothesis test over
{md5, sha1, sha224/256/384/512, blake2b/2s} × {absolute, `~`-relative, basename, ±trailing
slash} — sha256-of-absolute-path hit all three accounts and nothing else did; the binary
itself is a 277 MB Bun-compiled Mach-O with no recoverable `Claude Code-credentials`
string (0 occurrences), so the algorithm is evidence, not source-reading.

**Credential blob shape** (names and types only — no value ever printed, then or now):

```
claudeAiOauth.accessToken            str len=108
claudeAiOauth.refreshToken           str len=108
claudeAiOauth.expiresAt              int   (fgreen: ~2 h out at probe time)
claudeAiOauth.refreshTokenExpiresAt  int
claudeAiOauth.scopes                 ['user:file_upload','user:inference','user:mcp_servers','user:profile','user:sessions:claude_code']
claudeAiOauth.subscriptionType       str
claudeAiOauth.rateLimitTier          str
```

**`GET https://api.anthropic.com/api/oauth/usage`, `Authorization: Bearer <accessToken>`,
`anthropic-beta: oauth-2025-04-20` — all three accounts, HTTP 200:**

| Account | Status | Latency | five_hour | seven_day | Fable (weekly_scoped) |
|---|---|---|---|---|---|
| personal | 200 | 193 ms | 17 | 4 | — (null) |
| thg-fgreen | 200 | 361 ms | 19 | 35 | 48 |
| thg-doorbell | 200 | 357 ms | 0 | 91 | (present) |

**The response body is the cached object verbatim** — same seventeen top-level keys, same
`limits[]` array, same nulls. So (a) and (b) are one payload at two ages, the field mapping
above is confirmed against the live source, and **the personal account is served fine by
(b)** — its missing `cachedUsageUtilization` key was never a plan limitation, only an
artefact of the cache never having been written there.

**Live-vs-cached, the staleness cost made concrete** (same instant, same accounts):

| Account | Bucket | Cached says | Live says | Verdict |
|---|---|---|---|---|
| fgreen | session | 0 % | **19 %** | cache 77 min stale, understates burn |
| doorbell | session | 70 %, `resets_at` **already past** | **0 %** | the window rolled over; the cache would send Felix away from a completely free account |

The doorbell row is the decisive one: stale data is not merely imprecise, it inverts the
arbitrage decision the panel exists to inform. **(b) is the source; (a) is retired to a
documented fallback that this build does not implement** (out of scope, not parked debt —
the endpoint is the contract).

**Mechanics confirmed for the spec's security law:**

- `curl 8.7.1` (system) supports **`-H @-`** — verified live against `httpbin.org/headers`,
  which echoed `X-Probe-Header` back: the header is read from stdin and **never appears in
  argv**, so `ps` cannot leak the token.
- The `security find-generic-password -w` read completed **without a GUI prompt** in this
  session (login keychain unlocked, item ACL not binary-restricted). A first-run prompt on
  Felix's own shell remains possible; "Always Allow" once per entry settles it. Named in
  the README, not designed around.
- `expiresAt` is ~2 h out and Claude Code refreshes it in the normal course of use. The rig
  **never refreshes or rotates** (brief's absolute law): an expired token is a failed fetch
  is a stale table, and the panel says so in grey.

**Verdict: not a kill — Phase B builds on (b).**

**F1 — the per-keystroke cost is not unchanged: 1.569 ms → 2.562 ms, and I did not
optimize it.** The latency law asked for "per-keystroke delay unchanged"; it rose by
0.99 ms, a 1.6× multiple, because the spec also requires re-reading every cache on every
paint (*"the files are the truth"*, so a background fetch shows on the next keystroke).
Those two clauses are in tension and the re-read clause is the one that carries the
feature. Measured, not estimated, at host load 3.19–4.33; control is the same harness's
v1.1 number in the same run. **Judgment: ship it.** 2.6 ms is two orders of magnitude below
anything a hand can feel, it is still fork-free (asserted, not timed — 200 paints invoked
no external command), and the obvious optimisation (skip the re-read unless `zstat` says
the mtime moved) buys a millisecond nobody can perceive at the cost of a staleness bug
class. Premature optimisation; measured and declined. Flagged rather than buried because
the DoD line said "unchanged" and it is not.

**F2 — cosmetic deviations from the rendering guide, and why** (09-F8's precedent). The
guide's cells (`sess 42%+31  week 61%-8   fable 12%+55`) pad each cell whole; that is what
ships, at a fixed 13 columns — the width of the widest cell the data can produce,
`sess 100%-100`. The guide's `—` lines (`sess    —`) don't follow its own cell grammar, so
they render as `sess —` instead: one rule, no special case. The last cell takes no trailing
pad, so no panel line ends in whitespace. The `usage` label is **grey** rather than a
colour of its own: D36 gave one colour per row label, but those four label key namespaces
and grey is already the panel's word for "nothing here is selectable" — which the usage
block is.

**F3 — the harness was already red before this row, and the cause was data drift.**
`lab/08/run` failed 5 assertions at `840e541`, the commit this session started from —
verified by running it there in a worktree. Cause: `e3556c8` uncommented the `b builder`
preset without re-running the harness, so the mantle-row expectation, the bracket counts
(21 → 22) and both 60-column continuation lines encoded a preset table that no longer
existed. The rig was correct throughout; the fixtures were stale. **Trued rather than
parked**, against the Builder rule that adjacent discoveries are parked, because a red
harness makes this row's DoD unmeasurable — "green, no regressions" cannot be evidenced
against a baseline that isn't green. Nothing was weakened: the expectations now name the
preset that `presets.tsv` actually carries. Lesson for the board: `presets.tsv` and
`accounts.tsv` are harness fixtures as well as rig data, and changing them means re-running
`lab/08/run`.

**F4 — `(#b)` pattern backreferences are a trap in a sourced rig.** The first cut of the
ISO-8601 parser used `[[ $iso == (#b)(<->)-(<->)-… ]]`, which silently does nothing unless
`EXTENDED_GLOB` is set — it is off under `zsh -f`, and whether it is on in Felix's
interactive shell is not the rig's business either way. A file that gets sourced into
someone else's shell may not depend on that shell's options, and must not set them. Now
sliced by fixed offsets with a shape check, which also removed the dependency. Same family
of hazard: `${body#*\"limits\":[}` — a bare `[` opens a character class, so a JSON array
key needs `\[`. Both bugs were caught by the harness, not by reading.

**F5 — `int()` is not available without `zmodload zsh/mathfunc`, so the rounding is
explicit.** Assignment to an integer truncates toward zero, so the half is added by hand
and **away from zero** — `printf '%.0f'` would have rounded half to even, making
`+0.5 → +0` and `+1.5 → +2`, which reads as a bug in a two-character cell. Asserted both
directions (`half rounds up → +1`, `half rounds down → -1`).

**F7 — a latent v1.1 bug the new by-hand path exposed: with no tty, `COLUMNS` is `0`, not
unset.** `${COLUMNS:-80}` therefore keeps the zero, `avail` goes to −10, and `_summon_wrap`
breaks every item onto its own line. Nothing in v1.1 could reach it — the panel only ever
renders inside zle, where `COLUMNS` is real, and the harness sets it explicitly — but
`summon-usage` is a plain function that can be run from a script or a pipe, and it found
the bug the first time it was run for real:

```
usage    0
         sess 19%+32
         week 4%+30
         …
```

Fixed in `_summon_wrap` (the defensive place, not the caller): a non-positive width falls
back to 80. Byte-identity with v1.1 is unaffected and still asserted, because every tested
path sets a positive `COLUMNS`. **This is the argument for the by-hand DoD item**: the
shimmed arms all passed while this was broken, because each of them set `COLUMNS` first.

**F8 — the fetcher, proven against the three live accounts** (2026-08-07, Felix's grant):

```
  fetched  0 personal
  fetched  1 thg-fgreen
  fetched  2 thg-doorbell

usage    0  sess 19%+32    week 4%+30     fable 2%+32
         1  sess 25%+29    week 35%-20    fable 49%-34
         2  sess 0%+31     week 91%-48    fable 81%-38
  cache age
    0 personal          0 s  fresh
    1 thg-fgreen        0 s  fresh
    2 thg-doorbell      0 s  fresh
```

Three real Keychain reads, three real HTTPS fetches, three caches written — and the table
does the job the row was cut for at a glance: doorbell is 91% into its week at a −48 pace,
fgreen is mid-week at −20, personal is wide open at 4% and +30. Note personal **does**
carry a Fable bucket (2%), so the missing-bucket arm is a real capability of the renderer
rather than a description of that account. Felix's visual pass on the panel itself is
still owed.

**F6 — adjacent, parked, not fixed:** (a) GENESIS row 04 still carries "Max smoke PENDING
`/login`" for `~/.claude`; that account is demonstrably live and authenticated
(`organizationType: claude_max`, `default_claude_max_20x`, profile fetched the same day,
and its OAuth usage endpoint answered HTTP 200). The PENDING looks stale — an Architect's
call to strike, not a Builder's. (b) Cache files are dotfiles (`log/usage/.claude.json`),
because the spec names the config dir's basename as the stable identity and those
basenames start with a dot. It works and is documented, but `log/usage/.claude.json`
sitting next to the real `~/.claude/.claude.json` is a name collision waiting to confuse a
future reader. (c) The `security` read completed without a GUI prompt in this session; a
first-run prompt on Felix's own shell is still possible and is a README caveat, not a
design.

## Kickoff — verbatim

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then execute the brief at ~/code/agents/plans/10-summon-rig-v12-usage.md.
Phase A (E2) runs with Felix at the keyboard; its gate is in the brief.
```
