# B6 — the sovereign's inbox

**Status:** LANDED 2026-08-27 · **Depends on:** B4 (apply fires through hands) · **Staffing:**
Builder · opus-high · **Batch 3:** fourth row, strictly serial, straight to master
**Spec blessed:** 2026-08-26, Architect (G1), on keel §7 + D3 write #3 + D63.

## Goal

His word travels without his hands: gestures and notes land as legal inbox
entries; the proper office applies them to the board with his name on the ruling.
The fence holds by wiring, not exception.

## Spec

1. **Gesture UI** on building pages and the rail: a free-text note box, and
   defer/reorder gestures on rendered board rows. Every gesture becomes ONE
   append to **that building's** `ISSUES.md`, D63 grammar:
   `- <YYYY-MM-DD> · Felix (via Belvedere) · <the gesture: "defer 11", "14 before
   13", or the note verbatim>`. Append-only — the glass NEVER rewrites, reorders,
   or deletes existing content (D3 write #3 is the whole license).
2. **The apply button** (per building, visible when its inbox is non-empty):
   `POST /hands/fire` a scoped Architect sitting into cmux —
   summons template, verbatim:

   ```
   You are an Architect at fable-high.
   Wear ~/code/agents/canon/mantles/architect.md,
   then read <building>/README.md (or its master doc) and <building>/ISSUES.md,
   sweep the inbox: rule each entry, true the board, attribute Felix's entries
   to Felix, commit in his git style.
   ```

3. **Missing inbox:** a building with no `ISSUES.md` gets one created from the
   D53 header template ON FIRST GESTURE (adoption-on-first-need is doctrine §3) —
   header from [`canon/work/templates/issues.md`](../../canon/work/templates/issues.md),
   then the entry appended.
4. Hands disabled → notes still append (file write is the glass's own, not a
   socket call); only the apply button disables.

> **Amended 2026-08-27 (Architect, at Felix's ask — "a button inside Belvedere to
> countersign things"):** the rail's pending-countersign cards (B3 renders them
> city-wide) gain a **Countersign** button — a gesture like any other: ONE append
> to that building's ISSUES, `- <YYYY-MM-DD> · Felix (via Belvedere) ·
> countersign <D-id>: ✓`. The card reads its own entry back and renders
> **recorded — awaiting fold** until the sweep stamps the ✓ into the decision
> entry with his name (the fence's own sentence: his word travels as inbox
> entries the Architect applies). Three card states, all derived from files:
> pending → recorded → folded. The glass never pens the D-entry itself (D3;
> editing truth is the forever non-goal). DoD gains: one countersign gesture
> landing lint-green + the card's recorded state shown.

## Acceptance criteria / DoD — evidence pasted here at build time

**Built:** [`glass/inbox.ts`](../glass/inbox.ts) (the whole write), gesture UI in
[`glass/pages.ts`](../glass/pages.ts) (board rows + the ISSUES panel) and
[`glass/rail.ts`](../glass/rail.ts) (every card + the countersign act),
`POST /inbox` mounted in [`glass/server.ts`](../glass/server.ts),
[`glass/inbox.test.ts`](../glass/inbox.test.ts) (49 tests). Suite **219 pass / 0 fail
in one process**, `bunx --offline tsc --noEmit` **exit 0**. Live evidence below was
taken against a real glass on `:4406`, over HTTP, with the payloads **read out of the
rendered HTML** — never hand-written.

- [x] **A note gesture lands as a D63-legal entry in `belvedere/ISSUES.md`; lint green.**
      The note is a real field report (§Findings F1), filed through the running server:

```
$ curl -X POST http://127.0.0.1:4406/inbox -d '{"building":".../belvedere","kind":"note","text":"…"}'
200
$ tail -1 belvedere/ISSUES.md
- 2026-08-27 · Felix (via Belvedere) · README §2 write #3 and this file's own header still
  describe the sovereign-inbox entry as `From Felix (via Belvedere): …`, but B6's blessed spec
  writes D63 grammar — `- <date> · Felix (via Belvedere) · <what>` — and that is what the glass
  now appends. The pre-D63 wording survives in two places; true them or rule the other way.

$ bun doctrine/cli.ts lint belvedere/ISSUES.md
 ok   agents/belvedere  —  0 board(s) · … · queue 0
  … · 1 inbox entries
  0 failure(s) in 0 class(es)
```

- [x] **Append-only: BEFORE is a byte-prefix of AFTER, across ten rapid gestures.**
      Ten **concurrent** POSTs (`Promise.all`), not ten sequential ones — the interleaving
      case is the one worth testing:

```
BEFORE  bytes=705   sha256=742402d45653842037d33c8ffaa540601209a4c9513f12e1520a712c44a10d29
ten concurrent POSTs -> statuses 200,200,200,200,200,200,200,200,200,200
AFTER   bytes=1336  sha256=4b2e797b374e4286c73395abb89c8465aaa172e3ed1f964394da152d8d7a1927
prefix  bytes=705   sha256=742402d45653842037d33c8ffaa540601209a4c9513f12e1520a712c44a10d29   ← identical
BEFORE is a byte-prefix of AFTER: true
parsed entries: 12   lint failures: 0
all ten landed, none interleaved: true
```

      The unit suite pins the per-step chain as well (`inbox.test.ts` §append-only:
      ten sequential gestures, `after.startsWith(previous)` asserted at every step).
      The same file's real `belvedere/ISSUES.md` append is prefix-proven above:
      `head -c 727 ISSUES.md` → `d3fdc765…7419`, byte-identical to the file's own
      pre-gesture sha.

- [x] **A defer gesture on a rendered row lands as the entry.** The payload was
      **extracted from the rendered board** and posted back verbatim:

```
$ curl http://127.0.0.1:4406/b/agents/belvedere/lab/b6/scratch   → 200, 6836 B
   row 11 -> {"building":"…/scratch","kind":"defer","row":"11"}
             {"…","kind":"before","row":"11","other":"13"}   {"…","kind":"before","row":"11","other":"14"}
   row 13 -> …   row 14 -> {"…","kind":"defer","row":"14"}  {"…","kind":"before","row":"14","other":"13"}

POST /inbox {"building":"…/scratch","kind":"defer","row":"11"}                    → 200
   -> "line":"- 2026-08-27 · Felix (via Belvedere) · defer 11",       "minted":true
POST /inbox {"building":"…/scratch","kind":"before","row":"14","other":"13"}      → 200
   -> "line":"- 2026-08-27 · Felix (via Belvedere) · 14 before 13",   "minted":false
```

      Both entries are the spec's own examples, verbatim (§1: `"defer 11"`, `"14 before 13"`).

- [x] **First-gesture adoption: the scratch had no `ISSUES.md`; it got the header + the entry.**
      `"minted":true` above is the mint. The header is the template's **own bytes**:

```
template  bytes=594  sha256=3d811b068630876febc998fd3d872fa121ee00b06b415f9a99070ece756c364f
head -c 594 scratch/ISSUES.md    sha256=3d811b068630876febc998fd3d872fa121ee00b06b415f9a99070ece756c364f

$ bun doctrine/cli.ts lint …/scratch/ISSUES.md
  … · 2 inbox entries
  0 failure(s) in 0 class(es)
```

- [x] **Apply fires the scoped Architect sitting into cmux.** Probe pointed at a scratch
      building on a **throwaway worktree** (`bv/b6-smoke`, minted by `POST /hands/worktree`)
      so any pen the sitting picked up died with the branch. The apply button was rendered,
      its payload taken verbatim, and the **first user turn is byte-identical to the template**:

```
apply buttons rendered: 3   (one per account — a toggled group, never a dropdown)
  as personal · stamp architect-scratch-01 · fable-high · cwd …/bv/b6-smoke/belvedere/lab/b6/scratch

fire -> 200 {"ok":true,"result":{"workspace":"workspace:15","sha":"bf1b1333f2df3e49","bytes":386}}
waited 4.7 s · transcript ~/.claude/projects/-Users-felix-code-agents--claude-worktrees-bv-b6-smoke-…/98ade2de-….jsonl

=== the FIRST USER TURN, verbatim from the transcript ===
You are an Architect at fable-high.
Wear ~/code/agents/canon/mantles/architect.md,
then read ~/code/agents/.claude/worktrees/bv/b6-smoke/belvedere/lab/b6/scratch/README.md (or its master doc) and ~/code/agents/.claude/worktrees/bv/b6-smoke/belvedere/lab/b6/scratch/ISSUES.md,
sweep the inbox: rule each entry, true the board, attribute Felix's entries
to Felix, commit in his git style.

summons  386 B  sha256 bf1b1333f2df3e49497a12985f44d13c9c6b7317e2fb12512daa9abf22e806d1
turn     386 B  sha256 bf1b1333f2df3e49497a12985f44d13c9c6b7317e2fb12512daa9abf22e806d1
identical: true
close workspace:15 -> exit 0 OK workspace:15
```

      **Probe cleaned up:** worktree removed, branch `bv/b6-smoke` deleted, scratch building
      deleted, `cmux workspace list` → `* workspace:2` (Felix's own) and nothing else,
      `git worktree list` back to its two pre-existing entries, `summon/log/HALT` absent.
      The sitting committed nothing (`git log master..bv/b6-smoke` was empty at close).

- [x] **The countersign gesture, and the card's three states — all read off files.**
      Amendment DoD. Run against a genuinely pending decision (`D99`) on the throwaway
      branch, because **the live city has no true pending countersign** (F2): the button's
      payload was taken from the rendered card each time.

```
STATE 1 · pill: pending countersign (yellow)
   … One line into ~/code/…/ISSUES.md — the glass records the countersign, it never pens
     the D-entry (D3).  [countersign D99]
   the button, verbatim: {"building":"…/bv/b6-smoke","kind":"countersign","decision":"D99"}

POST /inbox -> 200  "line":"- 2026-08-27 · Felix (via Belvedere) · countersign D99: ✓"

STATE 2 · pill: recorded — awaiting fold (blue)
   … His word is in the inbox; the ✓ reaches the decision when this building's Architect sweeps.
   countersign button still in the DOM: false

STATE 3 (a ✓ stamped into the decision by hand, standing in for the sweep) · pill: folded — ✓ in the decision (green)
   … The decision already carries its ✓. Nothing is owed here …
   countersign button still in the DOM: false

$ parseIssues(that ISSUES.md).issues.at(-1)
{"date":"2026-08-27","who":"Felix (via Belvedere)","text":"countersign D99: ✓","line":430}
```

      The file's one lint failure (`issue.entry`, `"From Felix:\n\nStill getting: Error: …"`)
      **predates this row** — it is a canon-inbox entry of Felix's own; the glass's entry
      parsed clean.

- [x] **The glass still edits NOTHING.** One repo was touched (`~/code/agents`), and its
      whole tracked diff is two appended lines:

```
$ git diff --stat
 belvedere/ISSUES.md | 2 ++
 1 file changed, 2 insertions(+)

$ git diff
@@ -10,3 +10,5 @@ …
 ---
+
+- 2026-08-27 · Felix (via Belvedere) · README §2 write #3 and this file's own header …
```

      Everything else the probes made was untracked scaffolding, since removed. The audit
      carries **15 `"action":"inbox"` lines**, one per gesture, and **none of them carries a
      `"stamp"` field** — so `nextStamp`'s lineage counter (B3 F4) does not count gestures.

- [x] **Cost.** The gesture UI adds a `<details>` per board row and per rail card; measured
      warm on the live city, 24 buildings, 44 cards:

```
/             n=20 (2 s apart)  min=41ms  p50=50ms  p95=65ms  max=65ms
/b/agents     n=10              min=20ms  p50=22ms  p95=45ms  max=45ms
/b/…/belvedere n=10             min= 7ms  p50= 8ms  p95=10ms  max=10ms
/city         n=10              min=36ms  p50=38ms  p95=40ms  max=40ms
```

      The rail's p95 was 48 ms at B3 and 45 ms at B8; the bar is 500 ms.

## Out of scope

- Auto-applying gestures to boards (never — that is the Architect's pen);
  cross-building bulk gestures; the DESK artifact (parked, GA's call); editing
  or resolving entries (the sweep's job).

## Findings

Nothing escalated: the spec held everywhere it was tested, and every implementation
choice below sat inside the fence. Two of the four findings bind other rows.

**F1 — the fence's own wording for a sovereign-inbox entry is pre-D63, in two places,
and the glass now contradicts it.** README §2 write #3 says the glass appends
`ISSUES, From Felix (via Belvedere): …`, and `belvedere/ISSUES.md`'s header repeats it.
B6's blessed spec writes D63 grammar instead — `- <YYYY-MM-DD> · Felix (via Belvedere)
· <what>` — and that is what landed. The spec is later and blessed, so the code followed
it; the two stale sentences are the Architect's pen, not a Builder's. **Filed to
`belvedere/ISSUES.md` by the glass itself** — it is this row's DoD-1 smoke, and the first
thing the sovereign's inbox ever said was that the doc describing it is out of date. 🙂

**F2 — for the Architect and for canon: `parseDecisions` marks an entry pending wherever
the phrase appears, including in the entry that DEFINES the ritual, and the live rail has
been showing a false countersign since B3.** Canon **D21** is
`(2026-08-03, Architect (02) · ✓ Felix)` — countersigned three weeks ago — and its body is
the decision that *invents* the marker: *"dispatched sessions mark `(proposed — pending
Felix countersign)`"*. `pending: /proposed\s*[—–-]\s*pending Felix countersign/i.test(text)`
runs over the whole entry, body included, so D21 parses `ratified: true, pending: true` and
has sat on the rail as a pending-countersign card ever since. **It is the only one**: at
this row's capture the live rail showed `countersigns: 2`, and both were D21 (one through
a worktree copy). So **the live city has zero true pending countersigns**, and B6's own
amendment could not be proven against real data — the DoD's three states were run on a
synthetic `D99` on a throwaway branch instead.

Handled render-side, not by a second parser (D65): `countersignState` puts **`ratified`
first**, so the card renders `folded — ✓ in the decision`, offers no button, and says which
of the two readings won. That is D10 applied to a countersign — ambiguity never arms — and
it is why the card's header pill became the *state* rather than the queue's word for it
(a card headlining "pending countersign" over a "folded" body is a card arguing with
itself). **The fix proper is canon's**: either the marker is matched only in the
attribution parens, or `ratified` short-circuits `pending` in the parser. Filed as an ask,
never overruled.

**F3 — for B7 and B9: `POST /inbox` is deliberately outside the credential gate, and that
is a spec clause, not an oversight.** `handsRoute` refuses everything with a 503 before it
parses a body; `/inbox` is mounted beside it in `server.ts` and has no such gate, because
spec §4 says notes must still append when the hands are cold. The consequence for anything
that grows here: **a write that reaches a socket belongs in `hands.ts` behind the arming
switch; a write that only touches a file in the city belongs in `inbox.ts` in front of it.**
The four wire primitives (`Outcome`, `fail`, `field`, `json`) are now exported from
`hands.ts` and shared, so the two boundaries answer in one shape. `inbox.test.ts` points
`BELVEDERE_ENV` at a path that does not exist and asserts `handsState().armed === false`
before filing an entry through the route — the cold case is pinned, not assumed.

**F4 — a gesture's shaping rule, for whoever writes the next appender: a bare bullet
appended onto a non-empty tail block reads as that block's evidence.** D63h allows a bare
bullet (no block of its own) but an entry needing evidence becomes a `---`-separated block
— so an inbox whose last block is `- <entry>` + evidence lines takes a new bare bullet
*inside* that block, where a sweeping Architect reads it as more evidence for someone
else's entry. `addition()` therefore opens a `---` when the tail block has anything in it
and appends the bullet directly when it does not (the header template ends with `---`, and
a swept inbox drains to exactly that). The result is byte-for-byte the shape the canon
inbox already has, it is still ONE `appendFileSync`, and it is still strictly append-only.
Pinned four ways in `inbox.test.ts` §the addition.

**Not a finding, worth knowing:** B8 F3's worker law was not tripped — the inbox does no
walk. The one gesture that touches the register is a **mint** (an `ISSUES.md` is an anchor,
so the directory may not have been a building a moment ago), and it calls `bust()`; a
plain append busts nothing, because a nine-second re-walk for a line of prose is a bill
nobody asked for.

**Three rail tests were narrowed, deliberately, and are strictly stronger.** B3's
Felix-card law asserted `/<button/` — *no button at all*. B6's blessed amendment puts a
Countersign button on a pending card and §1 puts a note box on every card, so that
assertion stopped being true while **the invariant it protected did not change**: nothing
on his card may reach `/hands/fire`. The check is now "no fire wiring **and** every button
on this card is a `class="ges"` `/inbox` gesture", which catches the same regression and
one more (a fire button smuggled in without the old payload attributes). The reasoning is
written at the assertion, in `rail.test.ts`.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md
and ~/code/agents/belvedere/plans/b6-sovereign-inbox.md,
and build the order.
```
