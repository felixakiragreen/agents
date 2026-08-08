# 11 — summon rig v1.3: the live table

**Status:** OPEN · **Depends on:** 10 LANDED · **Staffing:** Builder · opus-high
(proposed) · **Blessed:** ⟨nobody yet — spec drafted by row 10's Builder at Felix's
direction 2026-08-07; an Architect reviews and cuts, Felix blesses. **No build before
this line is filled.**⟩

> Provenance, honestly: this document is a Builder's design, not an Architect's. Felix
> asked how to fix the staleness he saw at row 10's visual pass, chose "write the brief,
> don't build it", and this is that. Everything measured is marked as such; everything
> proposed is the author's judgment and is the Architect's to overrule.

## Goal

The usage table is **live**: `^G` shows numbers that are current at the moment Felix reads
them, without him pressing a key to make them appear. Two mechanisms — a warm-keeper that
refreshes the caches outside the panel so it opens already-current, and an await-mode tick
that repaints the panel when an in-flight fetch lands. In the common case the panel does
strictly what v1.2 does today, with no added wakeups.

## Inputs — read before building

- `plans/10-summon-rig-v12-usage.md` — the whole E2 finding (the source, the keychain
  derivation, the security law) and F1/F7/F9. **The security law of 10 binds this row
  unchanged**: tokens never in argv, never in a cache or log; the rig never refreshes or
  rotates a token.
- `plans/09-summon-rig-v11.md` — **F3** (`zle -I` abandons the display and leaves one stale
  panel per keystroke; the panel must repaint with `zle -R`) and **F9** (the pty cannot
  synchronise on panel content).
- The code: `summon/summon.zsh` (`_summon_widget`, `_summon_usage_*`), `lab/08/run`.
- `GENESIS.md` row 11; `canon/work/DOCTRINE.md` for findings law.

## The problem, stated precisely

Three distinct things get called "staleness". Only the first two are defects, and they
have different fixes:

| # | What it is | Fix |
|---|---|---|
| 1 | The open-time fetch lands in ~300 ms, but the panel repaints **only on a keystroke** — look without typing and the new numbers never appear | await-mode tick (§2) |
| 2 | The cache is cold at open, so the first paint shows old numbers for ~300 ms | warm-keeper (§1) |
| 3 | The API's own numbers lag reality | **not a defect** — quota does not move in the seconds a panel is open |

**Continuous polling while the panel is open is rejected, and the rejection is the
design.** The panel lives about two seconds; re-fetching on a timer would spend a
rate-limited endpoint (`cache/changelog.md:492` — *"`/usage` now shows your last-known
usage bars with an 'as of' note when the usage endpoint is rate-limited"*) on numbers that
cannot have changed. Freshness is won *before* the panel opens (§1), not during it.

## Spec

### 1. The warm-keeper — `precmd`, the higher-value half

- A `precmd` hook: on every prompt, if any account's cache is older than
  `_summon_usage_warm` (**300 s**, proposed), spawn one disowned background fetch for that
  account — the same `_summon_usage_fetch` the panel already spawns.
- **The check must be fork-free**: `fetched_at` already lives inside each cache and
  `_summon_usage_load` reads it with `$(<file)`, no fork. A prompt hook that forks on every
  prompt is a tax on every command Felix runs and would be worse than the problem.
- **Off unless configured**: no `log/usage/` ⇒ the hook returns immediately. Same law as
  the panel block — an unconfigured rig behaves exactly as before.
- **The multi-terminal race is accepted, not solved.** Every open terminal draws prompts,
  so several may notice the same cold cache and fetch at once. Atomic writes make this
  harmless (10's law), and the ceiling is one fetch per terminal per 300 s. If that proves
  too many requests, the fix is a lock file, not a shorter interval — but measure before
  adding one.
- Registered with `add-zsh-hook precmd`, never by assigning `precmd` (which would clobber
  whatever else Felix has).

### 2. Await-mode tick — the panel

- **Measured, not assumed:** `read -k 1 -t <secs>` works inside a zle widget. Probe on
  2026-08-07: a widget looping `read -k 1 -t 0.4` over a 3-second silence recorded
  `ticks=7 keys=1` — seven repaints nobody typed for, then the one real keystroke.
- On panel open, after the first paint, the rig already spawns fetches for cold caches.
  **If and only if it spawned at least one**, the read becomes `read -k 1 -t 0.2`:
  - **timeout** → re-run `_summon_usage_load` and rebuild the panel; repaint with `zle -R`
    **only if the panel string or its spans actually changed**. No change, no repaint.
  - **key** → exactly today's behaviour.
- Await-mode **ends** when every spawned account's `fetched_at` has advanced, or after
  `_summon_usage_await` (**5 s**, proposed) — then the read goes back to plain blocking
  `read -k 1`. Everything has a limit: the panel must not tick forever because one fetch
  died.
- **Nothing spawned ⇒ no ticking at all.** The warm case is byte-for-byte v1.2's loop.

### 3. The two hazards this row must not trip

- **Ticks are not keystrokes.** A tick must not increment `n`, must not append to `keys`,
  and must not count against the `n < 32` runaway guard — otherwise a panel left open
  closes itself after ~6 s and every telemetry line starts lying about what Felix pressed.
  This is the single most likely way to get this row wrong.
- **`zle -R`, never `zle -I`** (09-F3): `zle -I` abandons the display and leaves one stale
  panel on screen per repaint. At 5 repaints a second that is a screen full of garbage.

### 4. Latency law — inherited from 08/09/10, one clause amended

- Zero forks in the keystroke loop, ticks included: a tick re-reads caches with `$(<file)`
  and rebuilds the panel, both fork-free. The only forks remain the disowned fetch spawns.
- **The amended clause:** 10-F1 recorded per-keystroke rising 1.569 → 2.562 ms and Felix
  has not yet ruled on it. A tick costs one paint, so at 0.2 s that is ~1.3% of one core
  **while awaiting only** (≤ 5 s per panel open). Re-measure; if the Architect rules 10-F1
  unacceptable, this row inherits that ruling rather than re-litigating it.

## Acceptance criteria — the DoD

Evidence: `lab/08/run` extended, green, no regressions; the row's numbers pasted in.

- [ ] Warm caches ⇒ **the panel loop is unchanged**: no tick, no timed read, no repaint
      that nobody typed for — asserted, not argued
- [ ] Cold cache ⇒ the panel repaints when the fetch lands, with no keystroke: a live pty
      opens the panel, types nothing, and the transcript shows the numbers changing
- [ ] A tick never touches telemetry: after a panel held open through many ticks, the
      logged `n` and `keys` are exactly what was pressed, and the runaway guard has not
      fired
- [ ] Await-mode is bounded: a fetch that never lands returns the panel to a blocking read
      within the limit, asserted with a shim that never writes a cache
- [ ] No repaint when nothing changed (a tick over unchanged caches emits no `zle -R`)
- [ ] `precmd` hook: fires a refresh only past the interval, only when `log/usage/` exists,
      forks nothing when it decides not to fetch; registered via `add-zsh-hook` and
      removable
- [ ] No `log/usage/` ⇒ panel **and** prompt byte-identical to v1.2 (the v1.2 render is the
      reference, as v1.1 was for row 10)
- [ ] Latencies re-measured: per-keystroke, per-tick, per-prompt-hook, panel-open
- [ ] README: the freshness story — what grey means now, what the warm-keeper does
- [ ] Felix's visual pass: open `^G` on a cold cache and watch the numbers arrive

## Out of scope

- **Polling the endpoint on a timer while the panel is open** — rejected above, with the
  rate-limit evidence. Not parked: argued and closed.
- Any change to the fetch, the normalization, the cache format, or the keychain derivation
  — row 10 landed those and they are not reopened here.
- Token refresh, re-auth, or any write to any credential store — forbidden, inherited.
- A refresh key or usage toggle key — the reserved-key set does not grow (10's fence).
- `launchd`/`cron` as the warm-keeper. A prompt hook needs no install step, no plist and
  no daemon to debug, and Felix's terminals draw prompts all day. Revisit only if the
  prompt hook proves insufficient — with evidence.
- Reset countdowns, quota-at-fire telemetry — still parked from row 10.

## Findings

*(append here — deviations from spec, discoveries, parked adjacents)*

**2026-08-07, post-draft, pre-bless — this spec is already stale where it touches the
spawn, and the Architect must reconcile it with [10-F10](10-summon-rig-v12-usage.md)
before cutting.** The same evening this brief was drafted, v1.2's panel-open spawn was
found wedging the machine — two distinct mechanisms, forensics and the landed hotfix
(a setsid-detached `summon-fetch` worker) are all in 10-F10. Consequences for this row:
§1's "the same `_summon_usage_fetch` the panel already spawns" now means *the detached
worker*, not a `&!` block — the block shape is banned by F10's invariant; §Out of
scope's "any change to the fetch" is already violated by the hotfix and the line should
be re-drawn around the new spawn; and F10 closes with four spawn-architecture options
(keep perl-setsid · precmd-side spawning · zsh-native detach · warm-keeper-only
freshness) that this row is the right desk to decide between — the warm-keeper §1
proposes may itself change the answer, since precmd runs outside zle.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/GENESIS.md §5 and ~/code/agents/plans/11-summon-rig-v13-live-refresh.md,
and build it to its DoD.
```
