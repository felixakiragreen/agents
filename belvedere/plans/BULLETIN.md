# Batch 2 bulletin

*(Dispatcher appends relayed findings here — verbatim excerpts + file§ pointers only.)*

## → relay — B1 (census) to B2 (glass): three shapes the census reader must know

Measured on a live hooked scratch session, 14 records, one key order across all
lines. Evidence: [b1-census-deploy.md](b1-census-deploy.md) §DoD-1, and the
verbatim `Stop` record pasted there.

1. **`ws` and `sf` are empty STRINGS, never null, when the session is not in a
   cmux pane.** Hooks are venue-blind (P1 F1); the record stamps `--arg`, and jq
   `--arg` of an unset env var yields `""`. A reader testing `sf === null` will
   treat every Ghostty session as pane-joined. Verbatim from the live run:
   `"acct":"/Users/felix/.claude","ws":"","sf":"","pid":"89626"`

2. **`pid` is a STRING, not a number** (same `--arg` reason). The F5 law's
   `kill -0 pid` must parse it first.

3. **`bg` is capped at 16 entries in the hook** (B1's call on P1 F6's named
   concurrent-append guard — 100 in → 16 out, record 1721 B, under the 4096 B
   stdio buffer). The roster is a sample, not a census: never render "N tasks"
   from `bg.length` as if exhaustive.

Also, for B2's "census absent" DoD path: `deploy.ts --check` against the three
live config dirs reports **DRIFT ×3 — no account carries any hooks today**, so
`census.jsonl` will not exist until Felix runs the ritual at G1. P1 verified only
the personal account was clean; all three now are.

(Relayed from `bv/b1-census`, B1 LANDED 2026-08-26 — Dispatcher)

## → relay — B2 (glass) to the G1 Architect and to B3/B5: one escalation, two findings

Evidence: [b2-glass-spine.md](b2-glass-spine.md) §Findings, branch `bv/b2-glass`,
commit `ff18609`.

1. **E1 — "zero caches: re-read disk per request" costs 9 s on the City View, and
   B3's rail inherits it.** Measured warm, three consecutive requests: `/` 9.267 s ·
   9.098 s · 9.049 s, against `/b/agents` 0.024 s and `/b/agents/belvedere` 0.004 s.
   The cost is the register walk, not the parsing: `~/code` is **50 795 directories /
   15 779 `.md` files**, and a bare walk alone is 8 558 ms (3 378 ms with
   `withFileTypes`). 35 worktree checkouts of `cap-mega` and one emoji repo are most
   of it — **inherent to the register's law**, since four of the city's boards live
   only under `.claude/worktrees/`. B2 fixed what it could inside its fence (building
   pages now walk one subtree, 4–174 ms) and left `/` honest, printing its own cost in
   the footer. Three options are written up in the findings; **the ruling is the
   Architect's at G1.** This matters to B3 because the baton rail IS the home page.

2. **F1 — the name-stamp does NOT join through `invocations.jsonl`; B5's shelf should
   not try.** The rig's record carries no session id:
   `$ tail -1 summon/log/invocations.jsonl | jq -r 'keys|join(" ")'` →
   `account cmd color effort keys mantle mode model n name ts`. The real join is the
   session transcript, which the census already hands over as `tp`:
   `{"type":"agent-name","agentName":"dispatcher-agents-01","sessionId":"d285127e-…"}`
   — line 3, 314 bytes in, so a bounded 64 KB head window finds it. Proven live: the
   glass read `dispatcher-agents-01` off a real transcript in the B1-interop run.

3. **F2 — 20 of 38 live sessions house in NO building, and the register is right.**
   Their cwds are `…/cap-mega` and `…/cap-mega/.claude/worktrees/<branch>`, but
   `cap-mega` is not a building — its boards live in `cap-mega/docs`, `/simmy`,
   `/snappy`, so those are the anchors. The glass renders them in an "Off the
   register" panel rather than mis-housing them. **B3's rail will hit this head-on:
   the City View cannot show Felix where most of his live work is.** Doctrine
   question, not a parser branch.

Also confirmed for B1: all three of the bulletin's wire shapes are handled and now
pinned by tests against B1's verbatim `Stop` line, and **B1's real `beat.sh` was
driven end-to-end into B2's reader before either branch merged** — states, name-stamp
and account all rendered correctly, and the SIGKILL case (`pid` dead, last line
`Stop`) was caught by `kill -0`.

(Relayed from `bv/b2-glass`, B2 LANDED 2026-08-26 — Builder)
