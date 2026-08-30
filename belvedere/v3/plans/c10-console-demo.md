# C10 — the console demo

**Status:** OPEN — laid 2026-08-30 · **Depends on:** C13 · **Staffing:** Builder ·
opus-medium (the cornerstone's own proposal — a thin surface over a proven
library) · **Branch:** none — serial sole lane, straight to `master`, explicit
paths · *Schedule: ignites after C9 lands — step 0 edits the engine C9
measures; the batch note carries it.*

## Goal

Campaign bar 6's instrument: **the thinnest possible surface over the engine's
own exports** — list live v3 sessions, read one live, send a turn, summon it to
a terminal, return it headless. `belvedere/v3/console/`, bun, library-first;
**not the deck** — no glass code, no HTTP, no UI polish: the piece Felix's hand
tests at G4, and every verb also drivable by script (the automation law,
cornerstone §6). Plus **step 0**: the fallback's pause vocabulary — C13 F3's
deferred two lines, built. Built to last, full directives. **Budget: ≤$3 and
≤30 subject turns** (dollars lead, C8 F9) — the scripted rehearsal's spend;
either ceiling is a ⬡-fork (D21).

## Inputs — read before working

- **Step 0's ruling (C13 F3, deferred to this lay):** `verdictFromTranscript`
  names `needs_input` and `blocked` from disk instead of collapsing both to
  ‹no report› — mirror the *stream* path's cause words exactly (`sense.ts` is
  the authority; one vocabulary, two sources). After it, transcript ≡ stream
  holds for every reporting state; C13's F3 table language gains a dated
  correction note, and the C13 fixtures already on disk are the red/green
  corpus (`real-c8-q5-question.jsonl` reads ‹no report› today — it must read
  the question).
- **The verbs' machinery all exists — compose, don't rebuild:** list = C8 F8
  (the run log locates every session) + C4 F9's liveness; read = the stream
  file / transcript + cursor (C11/C13); send = the engine's `rule()` on a
  paused step (answer / land / kill / re-ignite); summon = C8 F7's method
  (tmux `-L`, trust-warm venue — all three accounts trust `~/code/agents`,
  C8 F2); return = resume by the engine, the cursor counting the pane's rows
  (proven, C8 F7).
- **C8 F4 binds the surface:** `auto` is not a restrictive posture — wherever
  the console shows or picks a posture it must not dress `auto` as cautious;
  one honest line in `--help` suffices at this altitude.
- C12 F1 / C13 F5 — the archive and the account dirs are hidden trees; any
  walk passes dot flags.
- The fence: v3/** only; the deck (`glass/`) is never touched; the harness
  note (C6 F9's `!` protocol) for config-dir reads.

## The spec

- **`v3/console/` — one entry, five verbs**, each a thin call into engine
  exports (the library is the product; the console is a hand-hold, like
  `engine/cli.ts`):
  - `list` — every v3 run under a given telemetry root: run · step · session
    id · account · state · causes; live/dead marked (pid + run log).
  - `read <run> <step>` — the turn stream rendered human-readable (event type,
    text, report, causes), `--follow` tailing the live stream file.
  - `send <run> <step> <text|land|kill>` — a ruling into a paused step: an
    answer resumes the subject with the text; land/kill rule it. Refuses in
    kind on a step that is not paused (D10 — ambiguity never authorizes).
  - `summon <run> <step>` — materializes the session in a real terminal
    (prints the exact command; `--tmux` attaches via a private socket) and
    marks the step summoned.
  - `return <run> <step>` — resumes it headless by the engine; the cursor
    absorbs the hand turns.
- **Scriptable = testable:** every verb takes plain argv and exits nonzero on
  refusal; no prompts, no TTY requirement except `summon`'s attach.
- Fake-subject tests cover every verb's logic (budget 0 there); the **real
  rehearsal** is one scripted pass — a 3-step real flow (one step pausing
  ‹needs-⬡ question›): `list` shows it, `read` renders it, `send` answers it,
  `summon`/`return` round-trips it, terminal state reached. That script is the
  G4 rehearsal Felix's hand will re-run.

## Done when

1. **Step 0 evidenced:** `real-c8-q5-question.jsonl` re-derives to
   ‹needs-⬡ question› carrying the question's own words (red under the C13
   reader, pasted; green under this one); `blocked` likewise; every
   non-reporting scenario unchanged; C13's F3 language corrected with a dated
   note.
2. **Five verbs on fake subjects** — tests green, refusals in kind pasted.
3. **The real rehearsal, one script, one pass** — all five verbs against a
   real 3-step flow, output pasted; session ids filed; subjects dead at
   landing.
4. **Gates:** engine + barrage + fake-claude + console `bun test` green, type
   gates exit 0, `bun barrage/run.ts --runs 1000 --crashes 50` exit 0 —
   pasted.
5. **Budget ≤$3 / ≤30 turns held**, spend pasted.

## Out of scope

The deck, glass, HTTP, the Chat, the Sidebar (post-verdict, D19) · auth ·
colors/polish · new engine features beyond step 0 · retention · G4's visual
pass itself (his hand, at the gate). **Creep is a bug.**

## Findings

*(append here)*

---

```
You are a Builder at opus-medium.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/v3/README.md
and execute the charge ~/code/agents/belvedere/v3/plans/c10-console-demo.md.
```
