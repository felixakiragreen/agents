# P6 — the message transport

**Status:** **LANDED** 2026-08-27 · **Depends on:** — · **Staffing:** Digger · opus-high ·
**Parallel-safe with:** lane B (disjoint files: `lab/p6/` + spawned probes)

The Chat's send path ([deck-keel.md](deck-keel.md) §5). P2 T4 proved the naive
paths corrupt: `cmux send` rewrites literal `\n`/`\t`/`\r`, and paste into a
live Claude TUI splits at the first blank line and auto-submits — **a
truncated message that looks delivered is the disqualifying failure.** Felix's
own hand pastes multi-line messages into live sessions daily and they arrive
as ONE turn — so a safe mechanism exists; find it, prove it byte-exact.

## Questions

1. **Q1 — live-pane delivery.** Find the mechanism that lands a multi-line
   message (blank lines included) in a live, idle Claude TUI as exactly one
   user turn, byte-exact. Candidates, in order: (a) **bracketed paste** — wrap
   the payload in `ESC[200~ … ESC[201~` via `set-buffer`+`paste-buffer` or
   direct pty write (this is what a human paste sends; T4's split may have
   been the *absence* of the wrapper); (b) any cmux socket text-delivery API
   beyond `send` (enumerate the schema — P2 §A has the method); (c) others
   you find. Proof per mechanism: sha256 of the sent bytes ≡ the transcript's
   received user-turn bytes, N=3, including one payload with blank lines, one
   with literal tabs, one with `$(echo pwned)` unexpanded.
2. **Q2 — delivery mid-turn.** The same mechanism against a session that is
   actively working: does the message queue and land as the next user turn
   (the harness queues mid-turn input — measured from outside, not assumed)?
   Does it ever interrupt or corrupt the in-flight turn?
3. **Q3 — delivery to a dead session.** Resume-with-a-turn:
   `claude --resume <id> "<msg>"` shape (P2 Q3 proved resume +2 argv tokens;
   this adds the prompt). Byte-exact first-new-turn proof; silo intact; the
   B5 E2 law (omitted-never-guessed) extended, not violated — resume WITH a
   message is a deliberate send, not an injected guess.
4. **Q4 — the failure faces.** For the winning mechanism: what does each
   failure look like from the glass side (dead pane, wrong surface id,
   mid-compact, TUI in a dialog — B7 F1's trust dialog included)? Every
   failure must be *detectable* (the send verifies via transcript read after
   delivery — spec the verification read).

## Inputs — read before working

- [deck-keel.md](deck-keel.md) §5 + §11 (the write class this probe arms).
- [p2-spawn-recipe.md](p2-spawn-recipe.md) §§T1–T4 — the transport law as
  known; do not re-derive the `send` corruption.
- P1 (census events — your delivery verification reads beats + transcripts).
- README §§2, 5 — fence and venue agreements.

## Method

Probe sessions are ~~haiku-low~~ **sonnet-low** *(amended by Felix's relay on P5 F1:
haiku cannot hold `auto` and stalls at its first tool call)*, fired through
`/hands/fire` into `~/code/agents` (trusted), ≤2 concurrent, workspaces closed at landing (D55). Bracketed paste
first — it is the human-hand mechanism and the likeliest winner. Every arm
ships with a control (a payload the mechanism is KNOWN to corrupt, proving the
probe can see corruption).

## Kill criteria

- No mechanism achieves byte-exact single-turn delivery with blank lines →
  the Chat ships read+jump permanently and the keel §5 fallback becomes the
  law; document and stop — that is a win, not a failure.
- A mechanism that works but cannot make failure *detectable* (Q4) is
  disqualified — silent maybe-delivery is worse than no delivery.
- One session; Q2/Q3 not fitting at quality become named remainders.

## Deliverables

Findings (evidence-grade, controls named); **the transport law** as its own
subsection — mechanism, exact wrapper bytes, verification read, failure
faces — consumed verbatim by B16's send and D18's write class 1; `lab/p6/`;
workspaces closed.

## Findings

**LANDED 2026-08-27 — no kill fired.** Byte-exact single-turn delivery is real, into
live · mid-turn · dead sessions alike, and every failure the dig could construct is
detectable *before* the send. The mechanism is **not** bracketed paste: that arm was
measured and failed. Probe tier sonnet·low throughout (Felix's relayed correction on
P5 F1 — haiku cannot hold `auto`); all probe workspaces closed, the venue is as it was
found (`cmux workspace list` → `workspace:24 belvedere`, `workspace:2 mentat`).

Lab: [`lab/p6/`](../lab/p6/) — `lib.ts` (the transports + both sensors), `wire.ts` +
`sink.py` (the raw-wire control instrument), `keys.ts`, `q1.ts`…`q4.ts`, `arm.ts`,
`fixtures/`.

---

### T — the transport law *(consumed verbatim by B16's send and D18's write class 1)*

**The mechanism: the segmented paste.** For a message `m` and a target workspace UUID
`w`, in order:

```
for each line L of m.split('\n'), with index i:
   if i > 0:            cmux send-key    --workspace <w> -- alt+enter
   if L is empty:       continue
   lead  = L.match(/^\s*/)            trail = rest of L after lead, matched /\s*$/
   core  = L with lead and trail removed
   if lead:             cmux send       --workspace <w> -- "<lead>"
   if core:             cmux set-buffer --name <n> -- "<core>"
                        cmux paste-buffer --name <n> --workspace <w>
   if trail:            cmux send       --workspace <w> -- "<trail>"
finally:                cmux send-key    --workspace <w> -- enter
```

Every clause is load-bearing and each is measured below: `paste-buffer` rewrites LF to
CR (T2) so newlines may never travel as text; `set-buffer` **trims its own edges** (T3)
so indentation may never sit at a buffer edge; `send` does not trim and cannot mangle a
whitespace run (T3); `alt+enter` is the only newline key the TUI honours (T4).

**No wrapper bytes.** The brief's leading candidate — `ESC[200~ … ESC[201~` — is
**refused**: the markers arrive on the wire intact and land in the message as the literal
text `[200~` / `[201~`, with every newline as CR (T5). Bracketed paste is not the
human-hand mechanism *through this API*; it is a control that corrupts.

**The verification read** (mandatory, not optional):

1. Before sending, resolve and record `n = (count of string user turns in the
   transcript)` and the target's **workspace UUID**, never a `workspace:N` ref (T7).
2. Send. Poll the transcript until it holds `n+1` string user turns — **≈1.0 s** when
   the session was idle, **≈4.0 s** when the message queued behind a live turn
   (Q2-3/Q3), so the poll needs a several-second budget, not a single read.
3. `sha256(newest user turn) === sha256(the drafted bytes)` ⇒ delivered. Anything else —
   mismatch, no new turn, or **more than one** new turn — is a failed delivery and says
   so on the card. It is never retried automatically: the message may have half-landed.

**Refuse at compose, never at send** (the D10 family — an ambiguous target never sends):

- a message containing a literal **TAB** (0x09) — the TUI swallows every one (T6);
- a message whose first line starts with **`/`** — it executes as a slash command and
  **no user turn is created at all** (T8);
- a target whose workspace UUID is not in `cmux workspace list`, or which the census has
  never seen a beat for (T7, Q4-F3/F4);
- a target whose input box is not empty — the transport appends, it never replaces, and
  there is no key that clears the box safely (Q4-F5).

**Cost.** One `cmux` CLI round trip is **153 ms** (N=10) and the transport spends at most
`4n−1` of them for an `n`-line message. Measured end to end: a 1-line message **289 ms**;
the 14-line, 304-byte `f-code.txt` **6 312 – 7 577 ms** (four runs). A hundred-line
message is therefore a ~40 s send — nameable, not built on: the fix if it ever matters is
one persistent socket connection instead of N process spawns.

---

### T1–T8 — the measurements

**T1. The join key is the workspace UUID, and `/hands/fire` does not return one.** The
hand returns `workspace:50`; the census stamps `ws` as a UUID. The first version of this
probe joined by `cwd` instead and immediately latched onto the *dispatching session*
(`sid 6ed4c8be…`, same building) rather than the probe. `workspaceUuid()` in
[`lib.ts`](../lab/p6/lib.ts) is the fix:

```
$ cmux workspace list --id-format both
  workspace:50 B01C9D0F-C040-40C0-8043-9DE256384376  p6-live-01
```

**T2. `paste-buffer` rewrites every LF (0x0a) to CR (0x0d) on the wire — and P2 T3 could
not see it.** T3's `cat > file` sink ran in canonical mode, where the tty's own ICRNL
turns the CR back into LF before `cat` ever reads it; the byte-exact verdict there is an
artifact of the sink. Measured against a raw-mode sink that rewrites nothing
([`sink.py`](../lab/p6/sink.py)):

```
$ bun belvedere/lab/p6/wire.ts a-blanks.txt
sent    119 B  "P6-A blank lines.\n\nParagraph two follows one blank line.\n…"
arrived 119 B
P6-A blank lines.<CR><CR>Paragraph two follows one blank line.<CR><CR><CR>…
```

`cmux send` does the same (`wire.ts a-blanks.txt --send` → identical CRs). **No cmux API
puts a raw 0x0a on the wire as text**, which is why the newline must travel as a key.

**T3. `set-buffer` TRIMS the buffer's own leading and trailing whitespace; `send` does
not.** This is the silent one — it costs every indent in a code block:

```
$ bun belvedere/lab/p6/wire.ts e-edges.txt          # buffer = "    leading and trailing   "
sent    27 B   arrived 20 B   "leading and trailing"

$ bun belvedere/lab/p6/wire.ts e-edges.txt --send
sent    27 B   arrived 27 B   "    leading and trailing   "
```

Hence the split: whitespace runs ride `send`, the rest rides the buffer. `send` is safe
for a whitespace run **because a whitespace run cannot contain the two-character `\n`
`\t` `\r` sequences `send` rewrites** (P2 T2) — that is the whole reason it is allowed
here and nowhere else.

**T4. Only `alt+enter` inserts a newline in the Claude TUI. `ctrl+j` — a real 0x0a — is
silently DROPPED.** Key encodings measured at the raw sink
([`keys.ts`](../lab/p6/keys.ts)):

```
[enter]<CR 0x0d> [ctrl+j]<LF 0x0a> [shift+enter]<ESC><CR> [alt+enter]<ESC><CR>
[ctrl+enter]<ESC>[27;5;13~ [meta+enter]REFUSED: Unknown key
```

and against the live TUI, `ctrl+j` between segments produced
`❯ Last line…P6-A blank lines.Paragraph two follows one blank line.…` — **every line
concatenated, no newline inserted, no error**. `alt+enter` (and `shift+enter`, the same
`ESC CR` on the wire) inserts the newline.

**T5. Bracketed paste is REFUSED by the TUI — the markers become message text.** cmux
transmits them faithfully (`wire.ts a-blanks.txt --wrap` → `<ESC>[200~ … <ESC>[201~`,
131 B in, 131 B out, DECSET 2004 announced by the sink), and cmux never adds them itself.
What the model received, verbatim from the transcript:

```
"[200~P6-A blank lines.\r\rParagraph two follows one blank line.\r\r\r…\r…[201~"
```

Marker text kept, ESC stripped, every newline a CR. The wrapper's *only* real effect is
that the CRs stopped auto-submitting — and even that is not reliable (a later run of the
same arm submitted at the first CR: `"[200~P6-A blank lines.\r\r…"` as one truncated
turn). **Nondeterministic partial delivery is the disqualifying failure the brief names**,
so the arm is dead on both counts.

**T6. A literal TAB never reaches the model — the TUI swallows it, not the transport.**
The wire carries every 0x09:

```
$ bun belvedere/lab/p6/wire.ts b-tabs.txt
arrived 74 B: P6-B tabs: col1<TAB>col2<TAB>col3<CR><TAB>leading tab<CR>…
```

and the transcript does not:

```
sent 74 B with 5 tabs · got 69 B with 0
GOT >>>"P6-B tabs: col1col2col3\nleading tab\ntrailing tab\n  two spaces thentab"
```

(Note the two *spaces* survived — this is a tab-specific loss, not a whitespace one.)
There is no key that inserts a tab either: `send-key tab` is the same 0x09. **A message
carrying a tab is refused at compose, naming P6** — Felix's own directives are tabs at
width 3, so this will fire on real content; offering "expand tabs to N spaces" as an
*explicit* choice is B16's call, but silently rewriting his bytes is not.

**T7. A `workspace:N` ref that does not resolve is NOT an error — it silently falls back
to the FOCUSED workspace. A UUID fails loudly.** This is the misdelivery class, measured:

```
$ cmux read-screen --workspace workspace:9999            → (the focused workspace's screen)
$ cmux read-screen --workspace 00000000-0000-4000-8000-000000000000
                                                        → Error: not_found: Workspace not found
$ cmux read-screen --workspace 9999                      → Error: Workspace index not found
$ cmux read-screen --workspace workspace:0               → (the focused workspace's screen)
```

A **closed** workspace's own ref does fail loudly (`Q4-F1`: `paste-buffer`, `send-key`
and `read-screen` all → `not_found: Workspace not found`; only `set-buffer`, which has no
target, returns OK). **So the law is: address by UUID, always.** `/hands/fire` returns a
ref, so B16 (and `hands.ts`'s `Fired`) must resolve and carry the UUID.

*Disclosed side effect of this measurement:* the Q4-F2 arm sent `paste-buffer`+`send-key
enter` at `workspace:9999` and cmux delivered them to the focused workspace — the live
`dispatcher-agents-04` pane (`OK surface:27 workspace:24`). One stray character and one
Enter reached that session's input box. Nothing destructive; recorded because an
undisclosed write into a live session is exactly the thing this probe exists to prevent.

**T8. A message whose first line begins with `/` executes as a slash command and creates
NO user turn.** Delivered `/status and then some words`, pressed Enter:

```
user turns added: 0
--- screen ---   (the /status panel, rendered locally; Esc to cancel)
```

The verification read catches it (the turn count never moves), but the honest handling is
refusal at compose. `!` (bash mode) and `#` (memory) are the same family by construction
and were not separately measured — named remainder.

---

### Q1 — live-pane delivery *(7 arms, all as designed)*

`bun belvedere/lab/p6/q1.ts` against a live sonnet·low probe fired through
`POST /hands/fire` (`p6-live-01`, `workspace:50`, account `personal`,
`cwd ~/code/agents`). Every arm is `sha256(sent) === sha256(the transcript's next string
user turn)` **and** exactly one turn added:

| arm | bytes | sha256 sent ≡ received |
|---|---|---|
| Q1-0 the summons as turn 1 (P2 §S re-proven) | 205 | `654903369144c6bc…` |
| Q1-A blank lines (one and two) | 119 | `a5df8e39d2532381…` |
| Q1-C `$(echo pwned)` unexpanded, `` `whoami` ``, `${HOME}`, literal `\n \t \r`, quotes, backslashes, `— · ⚡ ◐ é ⬡` | 136 | `9a4844d273c90749…` |
| Q1-D 2/4/8-space indents, a blank line, trailing spaces | 129 | `6d10be9824144d42…` |
| Q1-F a fenced ` ```ts ` block, indented body, trailing comment | 304 | `81bf85ca28700f06…` |

Verbatim, the hardest one:

```
PASS  Q1-F a fenced code block, 304 B
      sent 81bf85ca28700f06e5c88184309b9919e3ef2fb48035cb1b5d6b8634a7ea6768 (304 B)
      got  81bf85ca28700f06e5c88184309b9919e3ef2fb48035cb1b5d6b8634a7ea6768 (304 B) · 1 turn
```

**The two controls, both fired, both seen** (the brief's requirement that a probe prove it
can see corruption):

```
PASS  Q1-CTRL-1 bracketed wrapper corrupts
      1 turn(s), none the message · markers as text: true · CR for LF: true
      received: ["[200~P6-A blank lines.\r\rParagraph two follows one blank line.\r\r\rParagraph three follows two."]

PASS  Q1-CTRL-2 naked paste auto-submits and strands the rest (P2 T4 reproduced on demand)
      received: ["Last line, no trailing newline.[201~"]   ← one turn, the wrong one
      box after: ❯ P6-A blank lines. / Paragraph two follows… / Last line, no trailing newline.
```

CTRL-2 is T4 exactly: **one message became one submitted turn plus a stranded remainder in
the box** — a truncated message that looks delivered.

### Q2 — delivery mid-turn *(PASS, and the timing is proven, not assumed)*

`bun belvedere/lab/p6/q2.ts`. Two false starts are part of the finding: **a probe cannot
be talked into a long turn.** Told to `sleep 90`, sonnet backgrounded it and stopped in
3.0 s; told to write 600 numbers, it obeyed its own summons and answered `ACK` in 3.0 s.
The work has to BE the summons. Third run, probe `p6-busy-02` fired with
`Write the integers from 1 to 800…`:

```
census sequence: UserPromptSubmit@0.0s → UserPromptSubmit@13.3s → Stop@15.7s → Stop@18.2s → SubagentStop@19.9s

Q2-0 mid-turn proven (the delivery's UserPromptSubmit precedes the work turn's Stop): PASS (+13.3s vs +15.7s)
Q2-1 exactly two user turns, the second byte-exact: PASS — 138B/e03d9ff8f98e 304B/81bf85ca2870
Q2-3 turn visible in the transcript 4014 ms after Enter
```

and the in-flight turn was **not** interrupted — it ran to completion, `stop_reason:
end_turn`, 802 lines ending `\n796\n797\n798\n799\n800`, before the queued message was
answered. **The harness queues mid-turn input and answers it next, in order.** The only
delta the glass sees is latency: the turn appears in the transcript in ~4 s instead of
~1 s, so the verification read must wait for the *current* turn to end.

### Q3 — delivery to a dead session *(PASS ×5)*

`bun belvedere/lab/p6/q3.ts workspace:50` — closed the live probe (`kill -0 97740`
refused: the pid is gone), then resumed through the same hand with the message in argv
and `stamp`/`model`/`effort` left empty per B5 E2:

```
Q3-1 the message is the newest user turn, byte-exact: PASS
     sent 81bf85ca28700f06…e6768 (304 B)   got 81bf85ca28700f06…e6768 (304 B)
Q3-2 the prior conversation came with it: PASS — first turn is "You are a transport probe. Obey exactly:…"
Q3-3 the silo held: PASS — /Users/felix/.claude
Q3-4 session id REUSED  — d8704b91-0388-4462-9c73-909dbc407410 → same
Q3-5 transcript SAME FILE
```

Confirmed by hand afterwards: 27 user turns before, **28** after, the newest at
`2026-08-28T01:56:16.552Z` carrying `sha 81bf85ca2870`. **A resumed session keeps its
session id and appends to its own transcript** — so the census join key and the
verification read survive a resume unchanged, and a resume-with-a-message needs no new
identity plumbing. B5 E2 is extended, not violated: the glass omits what it does not
know, and it *does* know the message.

### Q4 — the failure faces *(five, each detectable before the send)*

`bun belvedere/lab/p6/q4.ts`. No arm pressed Enter at a target it should not have chosen.

| face | what the glass sees | the precheck |
|---|---|---|
| **F1** workspace closed under us | `Error: not_found: Workspace not found` on `paste-buffer`, `send-key` **and** `read-screen` (but `set-buffer` returns OK — it has no target) | the send fails loudly on its first targeted call |
| **F2** a ref that does not resolve | **nothing** — it lands on the focused workspace (T7) | address by UUID; a UUID 404s |
| **F3** the target is a shell, not a session | text sits in zsh's line editor (`➜ echo p6-would-have-run-as-a-command`) — **one Enter would execute it**; `census beats ever naming this workspace: 0` | the census: no beat has ever named that workspace |
| **F4** the TUI is holding the trust dialog | `census beats: 0` (P5 F3's trust-stall signature), and the screen before and after delivery is **byte-identical** — the dialog swallows every keystroke, and **Enter would answer it** (`❯ No, exit / Yes, I trust this folder / Enter to confirm`) | the census again: zero beats + no transcript + live pid ⇒ never send |
| **F5** the box is not empty | `❯ HALF A DRAFT FELIX WAS TYPING` → `❯ HALF A DRAFT FELIX WAS TYPINGand the glass appends to it` | `read-screen` the box first; the transport **appends**, and there is no key that clears it safely |

F4 was measured against a real cold repo (`git init` at `~/code/p6-cold-repo`, fired
`p6-cold-01`, 45 s, zero beats), delivery attempted, **Enter never pressed**; workspace
closed and the scratch repo removed (`gone`).

**Mid-compact is a named remainder** — not induced. It is covered by construction: the
verification read is the same, and a `PreCompact` beat in the census is the flag that a
delivery's latency is about to be a compaction's, not a turn's.

---

### F — findings for the rows behind this one

**F1 — the naive reading of P2 T3 is wrong, and it is wrong in the direction that hides
the bug.** "`set-buffer` + `paste-buffer` is byte-exact" is true only through a
canonical-mode sink. Through a raw one it rewrites LF→CR **and** trims its own edges. Any
row that trusts P2 T3 for a multi-line or indented payload ships a silent corruption.
**A transport claim needs a sink that rewrites nothing** — that is what `sink.py` is for,
and it is 30 lines with no dependency.

**F2 — the misdelivery class is real and it is one typo wide (T7).** `workspace:9999`
delivered to whatever Felix was looking at, and the CLI returned `OK`. Every hand that
takes a cmux target should take a **UUID**; `hands.ts` currently hands back
`workspace:N` from `attemptFire` and `Fired` carries no UUID field. This binds B16, B18's
rename/recolor write-through (same target class), and `/hands/focus`.

**F3 — the Chat's send needs a compose-time refusal list, not just a verification read.**
Tabs (T6) and a leading `/` (T8) both fail *silently at the model* — the message either
loses bytes or never becomes a turn. Both are decidable from the drafted text alone,
before a single cmux call. The verification read is the backstop, not the gate.

**F4 — the transport is 153 ms per cmux round trip and `4n−1` calls deep.** For the Chat's
usual traffic (a few lines) that is a third of a second. For pasting a whole summons into
a live session it is tens of seconds, during which the box is visibly filling. B16 should
show the send as in-progress rather than modal, and the one available speed-up — a single
persistent socket connection in place of N process spawns — is **named, not built**.

**F5 — for the census and the deck: a resumed session keeps its id and its transcript
file** (Q3-4/Q3-5). The shelf, the Chat's transcript view and the verification read all
key off `sid`, and none of them need a re-join after a resume.

**F6 — a probe cannot be instructed into a long turn** (Q2). Sonnet backgrounds a `sleep`
and an obedient probe answers its standing rule instead of the new instruction. Anyone
who needs a session that is *busy* must make the work the **summons**, and must prove the
overlap from the census (`UserPromptSubmit` before the previous `Stop`), never from a
wall clock.

---

**Kickoff (verbatim):**

```
You are a Digger at opus-high.
Wear ~/code/agents/canon/mantles/digger.md,
then read ~/code/agents/belvedere/README.md §§5–6,
~/code/agents/belvedere/plans/deck-keel.md §5,
and ~/code/agents/belvedere/plans/p6-message-transport.md,
and execute the brief.
```

**F7 — B15 F7's commit collision fired again, symmetrically, and is disclosed not
hidden.** `git add -A belvedere` from *this* lane swept lane B's in-flight modules into
two P6 commits (`4880abe` carries B18's `glass/colors.ts`, `identity.ts`, `hands.ts`;
`8e015fd` carries `glass/deck-dom.ts`, `deck.client.ts`). Nothing lost, history not
rewritten under two live sessions; scoped `git add <path>` from that point on. Filed to
[ISSUES](../ISSUES.md) — it confirms B15's fold candidate rather than adding one: a
two-lane batch note owes a **commit** rule, not just a file rule.
