# glass — the spine

One bun server rendering the city from the truth layer. **Read-everything,
write-narrow**: every page route touches nothing on disk; the four `/hands/*` routes
are the fence's whole write list (README §2) and nothing else in here writes.

```
bun belvedere/glass/server.ts        # → http://127.0.0.1:4400
bun test belvedere/glass             # 271 green in one process (B8 §4)
bunx tsc --noEmit                    # from this directory — the type gate, offline (B8 §5)
```

| Route | What |
|---|---|
| `/` | **the baton rail** — every baton, Felix-gate and pending countersign, one column, buttons |
| `/city` | City View — a card per building: lit windows, board pulse, lint count |
| `/b/<building>` | board · ledger tail + baton · decision queue · ISSUES · live sessions · lint |
| `/shelf` | **every session all three accounts have ever held** — resume the dead, jump to the living; usage ×3 and WIP above them |
| `/summon` | **the composer — fire anything**: building or free path · account · mantle · tier · templates · optional worktree; `POST` composes, the button fires |
| `/doc?p=<path>` | the read-only viewer every rendered link resolves into (D58) |
| `POST /hands/{fire,worktree,focus,halt}` | the four hands; 503 until `~/.config/belvedere/env` is armed |
| `POST /inbox` | **the sovereign's inbox** — one gesture, one D63 line appended to a building's `ISSUES.md`; **no credential gate** |

**The fence's third write** (B6, `inbox.ts`). A gesture — a free-text note, `defer <row>`,
`<row> before <row>`, `countersign <D-id>: ✓` — becomes ONE append: `- <YYYY-MM-DD> ·
Felix (via Belvedere) · <what>`, in **local** date (`toISOString()` is UTC and would file
tonight's note tomorrow). **Append-only is the whole licence**: the bytes before a gesture
are always a prefix of the bytes after, and nothing here rewrites, reorders or deletes.
A building with no inbox gets one minted from
[the D53 header](../../canon/work/templates/issues.md), verbatim, on its first gesture
(adoption-on-first-need, DOCTRINE §3) — the one gesture that busts the register, because an
`ISSUES.md` is an anchor. **A note needs no credential**: the arming switch (D9) gates
one-click *dispatch*, so cold hands must never cost Felix the ability to say something —
only the **apply** button, which is a `/hands/fire` of the scoped Architect sweep, goes cold.

**The countersign has three states and all three are read off files**: `pending` (nothing
filed) → `recorded — awaiting fold` (his entry is in the inbox) → `folded` (the ✓ is in the
decision). The glass never pens the D-entry. **Folded outranks pending** — `parseDecisions`
marks an entry pending wherever the phrase appears, *including in the entry that defines the
ritual*, so canon D21 (`✓ Felix`) has been a false positive on the rail since B3; two
readings disagree, so the card renders safe and names the winner (D10).

**Compose, then fire** (B7, `composer.ts`). The form writes nothing and decides nothing:
every choice is a radio in a toggled button group, so the browser holds the state and the
back button walks it. One **compose** press re-renders with the resolved target, tier,
name-stamp, colour, worktree plan and trust verdict — and only *that* render carries a fire
button, wired to the exact JSON the card is showing. What arms it is the hands' own
`parseFire`, run over the composed body before the page is drawn: one gate, not a second
copy of one. The page POSTs to itself because a summons does not belong in a URL; **it still
writes nothing** — the fence's list is the four hands and the inbox.

**A cold directory is named, never answered** (`trust.ts`). **The unit of trust is the
project root, and it is per account**: each silo's `<config-dir>/.claude.json` names
projects, the repo's *main* worktree root when the target is inside a repo (which is exactly
why a linked worktree inherits), the directory itself when it is not. Its own entry wins;
with no entry a **repository is cold** and a plain directory borrows an ancestor's blanket
trust. Measured at B7: `~/code` is trusted for `personal`, a fire into a plain
`~/code/b7-founding-probe` ran and beat the census ten times, and a fire into a fresh
`git init` in the same `~/code` **stalled — no transcript, no census beat, the process alive
on the dialog**. All 36 live trust entries sit on project roots; all 9 live sessions are warm
under the rule. The composer warns on the button and marks the fire `data-cold`, so a
stalled fire renders as *waiting on the trust prompt*, never as a session that started.

**The name-stamp reads three sources.** `invocations.jsonl` (the rig's), `hands.jsonl` (the
glass's own fires) and — new at B7 — **the live census**, because a stamp a running session
carries came from somewhere neither log records. Proven live: `architect-belvedere` is absent
from both logs and present in the census, so the logs alone would hand that name out twice.
The theater is row 14's: `<dir>/.summon-theaters`' first line, else the directory name, no
parent walk — and the **Grand Architect keeps no theater**, one office, as the rig has it.

**The shelf's three joins, and the one it refuses** (B5): the filename is the session id
and the resume handle; the transcript's own 64 KB head gives the name-stamp and the cwd;
the census says live or dead. The **project-directory slug is never parsed** — `/` and
`_` both flatten to `-`, and the map does not invert. A **resume carries no summons**:
standing in a three-week-dead session must not wake it with an instruction, so every
field the glass does not know is omitted from argv rather than guessed (`hands.ts`
§Fire), and a live session is offered `/hands/focus` instead.

**Why every WIP figure says it is a floor.** The census only knows sessions that have
**heartbeated** — at this row's capture it knew 6 while `ps` counted 38 `claude`
processes, because B1's hooks went live mid-city and pre-hook sessions never beat
([B5 §E1](../plans/b5-shelf-gauges.md#findings)). And the background roster is bounded
twice: `beat.sh` slices it at 16 (`16+`, never `16`), and **only `Stop` and
`SubagentStop` payloads carry it at all** — 210 of 210 non-empty rosters, none on 1820
tool-use beats — so an unobserved roster renders `?`, never `0`, and an observed one is
stamped *last seen N ago* because a shell's completion fires no event (P1 F4).

**Three sources. Content is re-read per request, always; only the register — *which*
directories are buildings — is held warm** (G1's E1 ruling; `register.ts`, **TTL 300 s**,
age printed in every footer beside a **re-walk** button, and busted by the glass's own
fires and worktrees so it is never blind to its own writes). Buildings: canon
[`doctrine/`](../../doctrine) `parse()`/`discover()` — the one parser in the city (D65),
imported, never forked. Liveness: `summon/log/census/census.jsonl` (D6), written by
[`../census/beat.sh`](../census). Identity: the name-stamp from the session transcript,
mantle colour from `summon/presets.tsv`, account from `summon/accounts.tsv`.

**The F5 law, and why `census.ts` is the only tested file:** the census says what a
session *was doing*; `kill -0 pid` says whether it still *exists*. A SIGKILL leaves `Stop`
as the last line forever, so a state rendered from one sensor is a lie waiting to happen.
No pid, or a stale record still claiming work — **unknown, never working**.

Env: `GLASS_CITY` (default `~/code`), `CENSUS_DIR` (B1's own knob), `USAGE_DIR` (the rig's
caches — **rendered, never fetched**), `BELVEDERE_ENV` (the
credential), `GLASS_PORT` (4400) — all resolved **per call** in `paths.ts`, never frozen at
module load: a frozen anchor is hidden state, and it cost eight test failures (B8 §4).
Theme: [`felikai.css`](felikai.css), copied from `~/code/felix/src/felikai.css` — edit the
source and re-copy, never fork here.

**Known cost:** the register walk is **~9.5 s** over 50 795 directories, so it runs on a
worker thread ([`register.worker.ts`](register.worker.ts)) — on the request thread it
stalled 2 of every 20 page loads by 8.5 s (measured, [B3
§E1](../plans/b3-baton-rail.md#findings)). Warm, `/` is **p95 48 ms**; building pages
walk one subtree, 8–40 ms. The TTL policy was ruled 2026-08-27 — 300 s, bust on the
glass's own writes, a button for the rest ([B8](../plans/b8-glass-hardenings.md)); the
walk's own cost rides the canon inbox ([B2 §E1](../plans/b2-glass-spine.md#findings) has
the fold: `readdirSync({withFileTypes})`, 2.5×). The shelf's own scan — 723 transcripts,
35 MB of head windows — is **46 ms warm** and does not need a worker: three `/` loads
fired inside one shelf scan came back in 0.045 s · 0.068 s · 0.035 s (B5 DoD).
