# B5 — the shelf and the gauges

**Status:** LANDED 2026-08-27 · **Depends on:** B4 (resume fires through hands) · **Staffing:**
Builder · opus-high · **Batch 3:** third row, strictly serial, straight to master
**Spec blessed:** 2026-08-26, Architect (G1), on P4 §R + B2 F1/F3 + row-10's rig
usage panel.

## Goal

Any session, any account, live or weeks dead — one click to stand in it. And the
bill on the wall: usage ×3 and WIP, because a one-click dispatcher that hides the
load is how a sovereign DoS's himself.

## Spec

1. **Shelf** (`/shelf`): enumerate `~/.claude*/projects/<slug>/*.jsonl` across all
   three accounts (dirs from `summon/accounts.tsv`). Identity per B2 F1: the
   name-stamp comes from the transcript's `agent-name` line, scanned in a bounded
   64 KB head window — **never joined out of `invocations.jsonl`** (carries no
   session id). Show: stamp/unstamped, building (by cwd), account, age, live/dead
   (census + `kill -0` where live). Filters: building, account, age. Resume =
   `POST /hands/fire` with the P4-proven resume recipe (uuid; by-stamp where the
   stamp is current).
2. **Usage strip**: render `summon/log/usage/` ×3 (row-10 fetcher's files —
   **render only, never fetch**; the rig owns fetching). Stale files → greyed
   with age shown (the D41 palette law's spirit: staleness greys furniture, never
   figures).
3. **WIP gauges**: from census — live sessions per account and per building;
   subagent counts (`aid`/`at`); background tasks from `bg` — **never rendered as
   exhaustive** (B1 caps `bg` at 16; label "16+" at the cap). Per B2 F3: extend
   `census.ts` to surface `ws sf aid at bg` (one line each; the tests name them).
4. Everything degrades honestly: census absent → shelf still lists transcripts,
   gauges say "census not deployed".

## Acceptance criteria / DoD — evidence pasted here at build time

- [x] **Shelf resumes one dead session from EACH of the three accounts.** Three
      `POST /hands/fire`, payloads lifted verbatim off the rendered buttons, each
      against a session confirmed dead first (`kill -0` on its census pid):

      c6c6685a … pid=38990  last=SessionEnd  -> DEAD
      1ae93191 … (no census record at all)   -> DEAD
      acceab69 … (no census record at all)   -> DEAD

      → `workspace:12` · `workspace:13` · `workspace:14`, all
      `{"ok":true,"summonsPath":null,"sha":null,"bytes":0}`. Each came back on **its
      own transcript, under its own account** — the census's own word, one line each:

      {"sid":"c6c6685a","ev":"SessionStart","acct":"/Users/felix/.claude",
       "tp":"/Users/felix/.claude/projects/-Users-felix-code-agents/c6c6685a-….jsonl"}
      {"sid":"1ae93191","ev":"SessionStart","acct":"/Users/felix/.claude-thg-fgreen",
       "tp":"/Users/felix/.claude-thg-fgreen/projects/-Users-felix-code-agents/1ae93191-….jsonl"}
      {"sid":"acceab69","ev":"SessionStart","acct":"/Users/felix/.claude-thg-doorbell",
       "tp":"/Users/felix/.claude-thg-doorbell/projects/-Users-felix-code-agents/acceab69-….jsonl"}

      **And no turn was injected.** The newest user turn in each transcript is still
      the original session's, 10–12 hours old, against a resume at 14:31Z:

      c6c6685a  user turns: 1   last: 2026-08-27T04:28:04.312Z
      1ae93191  user turns: 2   last: 2026-08-27T01:58:15.870Z
      acceab69  user turns: 2   last: 2026-08-27T01:58:38.081Z

      All three then rendered live on the shelf with the resume replaced by
      **jump to panel** (`digger-belvedere-live` · `p2probe-agents-04` ·
      `p2probe-agents-05`, all `live · resting`). Venue restored: the three
      workspaces closed (`OK workspace:12/13/14`), `cmux workspace list` back to the
      single `workspace:2` it held before.
- [x] **A renamed/unstamped session renders unstamped.** **307 of 723** transcripts
      carry no `agent-name` record at all and the strip counts them out loud; the
      berth leads with the honest word and the uuid, never a guess:

      | |unstamped| |f51f69ba| |dead| |thg-doorbell| |off the register| |40m|

      Only **9** of those 307 carry a `custom-title` — a title is what a human typed,
      a stamp is what `claude -n` wrote, and the shelf never promotes one to the
      other (pinned: `census.test.ts` §identity). A session renamed *after* the 64 KB
      head window reads its census stamp instead, also pinned.
- [x] **Usage strip matches the rig's own panel, same instant, nine cells ×3
      accounts.** Left column is the rig's OWN `_summon_usage_delta` sourced out of
      `summon.zsh` and run over its own caches; right column is the served page,
      both at `EPOCHSECONDS=1787840561`:

      === the rig's own function, over its own caches — EPOCHSECONDS=1787840561
        .claude                sess   13%+58   week   12%+5    fable  9%+8
        .claude-thg-fgreen     sess   8%+10    week   45%+53   fable  56%+42
        .claude-thg-doorbell   sess   —        week   23%+3    fable  14%+12
      === the glass, same instant — EPOCHSECONDS=1787840561
        personal               sess   13%+58   week   12%+5    fable  9%+8
        thg-fgreen             sess   8%+10    week   45%+53   fable  56%+42
        thg-doorbell           sess   —        week   23%+3    fable  14%+12

      The doorbell's absent `sess` bucket reads `—` on both. Getting here cost one
      real fix: the rig rounds the delta **away from zero** and `Math.round` rounds
      half toward +∞ — a one-point disagreement on exact halves, now pinned by test.
      Caches were 21 m old at capture, so all three lines rendered `stale`: furniture
      greyed, every figure at full contrast (asserted both ways in `gauges.test.ts`).
- [x] **Gauges match a hand-count, and the 16-cap renders `16+`.** At capture the
      panel read personal 2 working · thg-fgreen 2 working + 1 idle + 1 unknown ·
      thg-doorbell 0; buildings `agents` 3, `universal_robots_sdk/bob` 3. The
      census hand-count (last beat per sid, `kill -0` by hand) returned **exactly
      those six sessions**, same accounts, same cwds. **`ps` returned 38** — see
      **E1**: the gap is the sensor's horizon, and the panel now prints it.
      The cap was **induced, not simulated**: 18 background shells launched in one
      live session, and the hook's own record capped at 16 —

      {"ev":"SubagentStop","sid":"f9a617dd-…","pid":"21191","n":16,
       "types":{"shell":15,"subagent":1}}

      That verbatim line, served through a real glass on a temp `CENSUS_DIR`, renders
      `subagents 1+` · `background shells 15+`, and the berth's roster ends
      `… shell bm4naf1p running + more (hook cap) last seen 3m ago`. Eighteen were
      running; the page never claims fifteen.
- [x] **Worktree-slug transcripts attribute to the right building** — and did not
      before. Live berth, `-Users-felix-code-agents--claude-worktrees-bv-b3-smoke`:

      builder-probe-row-03 | dead | personal | agents/belvedere | 70m
        cwd agents/.claude/worktrees/bv/b3-smoke/belvedere/lab/b3/city/probe-row

      B2's `buildingOf` stripped `.claude/worktrees/<one segment>`, so the city's own
      two-segment branches (`bv/b3-smoke`, `bv/b1-census`) left a bogus tail and this
      session housed in `agents`, not `agents/belvedere` — see **F1**. Fixed at the
      cause; the City View and the rail inherit it.
- [x] **Zero writes outside `belvedere/glass/` + census dir.**

      $ git status --porcelain | grep -v "^.. belvedere/glass/"
      ?? .claude/          (pre-existing at session start, not this row's)

      Plans/README/ledger edits land in their own commits at the close.
- [x] **Suite and gate green, whole, in one process** — `bun test belvedere/glass`
      **166 pass / 0 fail** (109 before this row), `bunx --offline tsc --noEmit`
      exit 0. `/shelf` costs **46 ms warm** over 723 transcripts and 35 MB of head
      windows (253 ms with a cold page cache); at browsing speed, B3 E1's own
      protocol — 15 requests, 2 s apart — `min=0.037s p50=0.046s p95=0.056s
      max=0.266s`, and three `/` loads fired *inside* one shelf scan came back in
      0.045 s · 0.068 s · 0.035 s. **No worker needed, and B8 F3's law is not
      undone** — the number is here so the next Builder can re-check rather than
      assume.

## Out of scope

- The inbox (B6); fetching usage; historical charts (dessert feeds later);
  deleting or editing transcripts (never).

## Findings

### E1 — the census sees 6 sessions; `ps` sees 38. Every WIP figure in the glass is a floor.

Measured at capture time, side by side. The census's live set, `kill -0` by hand:

```
live f9a617dd pid 21191 .claude          SubagentStop  /Users/felix/code/agents
live a6fb8395 pid 88958 .claude-thg-fgreen Notification  …/universal_robots_sdk/bob
live 8f96de6c pid 98068 .claude          SubagentStop  /Users/felix/code/agents
live 4ee54f86 pid 85162 .claude-thg-fgreen SubagentStop  …/universal_robots_sdk/bob
live 1d461c05 pid 64499 .claude-thg-fgreen SubagentStop  …/universal_robots_sdk/bob
live d16d14ba pid  8842 .claude-thg-fgreen SubagentStop  /Users/felix/code/agents
```

```
$ ps -eo pid,command | grep -cE "[c]laude "
38
```

The gauges match the census **exactly** — that half of the DoD passes. But the census
is not a census of sessions, it is a census of **hooked** sessions, and B1's hooks went
live at `2026-08-27T04:03:16Z` (B4 F2). Every session Felix started before that runs on
with no heartbeat and will never have one: `claude --model fable --effort high -n
architect` ×6, `architect-cornerizer-10`, `architect-lunchbox-01`, `mentat-01`,
`dispatcher-cornerizer-02` … all invisible. **A one-click dispatcher whose load gauge
reads 6 against a machine running 38 is exactly the hidden bill this row was cut to
prevent.**

Built here, inside the fence: `CensusRead.since` (the earliest beat on record) and a
panel that leads with *"Every figure here is a floor, not a total"* and prints the
horizon's age. **The fix proper is the Architect's**, and it is a sensor question, not a
render one — either a process sensor (`ps` for `claude` argv, which is reading, but it
is a *second liveness authority* and P1 F5 warns exactly against those), or the ruling
that the drift is temporary and dies with the pre-hook sessions. This binds the City
View and the rail identically: both count live sessions off the same read.

### E2 — a resume must not carry a summons, so `/hands/fire`'s contract widened

B4's wire contract makes `summons`, `stamp`, `model` and `effort` all required. The
shelf's whole job is standing in sessions that have been dead for weeks, and a resume
that injected a first user turn would wake an agent **with no instruction** and set it
working — self-inflicted DoS, from the row whose thesis is the opposite. So one rule
was added to `parseFire`, and it is the only change to the hands:

> **On a resume, a field the glass does not know is omitted from argv, never guessed.**

`resume !== null` ⇒ `stamp`, `model`, `effort` and `summons` may be empty, and each
empty one drops its flag. A *fresh* fire still requires every one of them (pinned), and
a malformed value is still refused whether resuming or not (pinned). The line ends at
the last flag — which is the shape cmux's own restore binding re-execs (P4 §R):

```
cd '/tmp' && CLAUDE_CONFIG_DIR='/Users/felix/.claude-thg-fgreen' claude '--resume' 'd285127e-…'
```

Consequences the next rows inherit: `Fired.summonsPath` and `Fired.sha` are now
`string | null` (null on a resume — there was no turn to write or to prove; the audit
records `summonsBytes: 0`), and a resume of a session that never had a stamp names its
workspace `resume-<uuid8>` rather than `""`. **Backwards compatible**: every existing
caller sends all four fields and is unaffected. Widening an interface is the Architect's
to bless — filed, not assumed.

Two narrowings inside the spec, both deliberate:

- **The handle is always the uuid, never the stamp.** P4 §R proved `claude --resume
  "digger-agents-04"` legal and the spec offers it "where the stamp is current" — but it
  resolves through claude's own most-recent rule, which is a choice the glass would be
  making blind while holding the exact handle it just read off the filename. D10's
  spirit: ambiguity never arms.
- **A live session gets `jump to panel`, not `resume`.** Resuming something already
  running is not standing in it; `/hands/focus` is. A live session outside a cmux pane
  says so instead of offering a button that cannot work (hooks are venue-blind, P1 F1).

### F1 — for the whole glass: a branch is not one path segment, and `buildingOf` assumed it was

`pages.ts` normalised a worktree cwd with `cwd.replace(/\/\.claude\/worktrees\/[^/]+/, '')`.
The city's branches are `bv/b3-smoke`, `bv/b1-census`, `feat/x` at least as often as
`naming`, so one segment came off and the rest of the branch stayed on as a bogus
directory: `agents/.claude/worktrees/bv/b3-smoke/belvedere/lab/…` normalised to
`agents/b3-smoke/belvedere/lab/…`, which still prefix-matches `agents` and so **housed
in the repo root instead of the sub-building**, silently, with no lint. Caught by a
shelf test against a real slug and confirmed on live data.

Fixed at the cause: nothing in a path says where a branch ends, so every split is
offered and **the register decides** — only it knows what a building is (D65). The live
b3-smoke session now houses in `agents/belvedere`. **The City View and the rail read the
same function**, so both were mis-housing worktree sessions too.

### F2 — for B6/B7 and for anyone reading `bg`: only two payloads carry the roster

Over 1739 live census records, **every one of the 210 non-empty `bg` rosters arrived on
`Stop` (7) or `SubagentStop` (203)** — not one on the 1820 `PreToolUse`/`PostToolUse`
beats that outnumber them 9:1. `beat.sh` stamps `(.background_tasks // [])`, so an
absent field arrives as `[]` and is indistinguishable from an empty roster.

So the naive reading — "the last beat's `bg`" — answers **zero almost always**, because
the last beat is overwhelmingly a tool-use one. `census.ts` now keys the roster off the
latest beat whose event actually carries one (`ROSTER_EVENTS`), keeps its timestamp, and
renders `?` rather than `0` where none was ever observed. Two further honesty bounds
ride with it: the roster is an **observation, not a state** (a background shell's
completion fires no event at all — P1 F4), so the page says *last seen N ago*; and the
hook's `[0:16]` slice makes any full roster a floor.

### F3 — the project-directory slug is lossy and must never be parsed

`~/.claude*/projects/-Users-felix-code-universal-robots-sdk` is what **both**
`universal_robots_sdk` and `universal-robots-sdk` flatten to — `/` and `_` both become
`-`, and the map does not invert. The shelf reads the cwd out of the transcript's own
head window instead (and prefers the census's live cwd where there is one). 697 of 723
transcripts carry a cwd in their first 64 KB; the other 26 render *"not recorded in the
head window"* and offer no resume, because there is nowhere honest to land.

### F4 — for B9: `/shelf` is built to the design laws, and one law it cannot finish alone

Native to §3 as built: **no dropdowns** (every filter is a toggled button group of
links, so there is no client state to lose and the back button walks the filter
history); **usage beside the accounts** (the quota table sits directly above the account
group); **attention first, recency within** (`needs-input` → `working` → `resting` →
`dead`, mtime inside each — a session waiting on Felix tops the shelf however old);
**encapsulation-first** (each berth leads with its stamp and opens on a `<details>`
`[expand]` — the browser's own disclosure, so it survives with no script); **a colour
legend** naming every ring and the mantle fill.

What B9 must still do here: the prose face. `.prose` is declared as
`Inter, ui-sans-serif, system-ui, …` and used on every running-prose block, but **Inter
is not vendored** — that woff2 fetch is B9's named third-party (D54), not this row's, so
the stack degrades to the system sans until B9 lands. Nothing on this page reaches the
network at serve time.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md
and ~/code/agents/belvedere/plans/b5-shelf-gauges.md,
and build the order.
```
