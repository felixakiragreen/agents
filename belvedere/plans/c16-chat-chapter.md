# C16 — the Chat chapter

**Status:** OPEN — cut 2026-08-30 at C15's reviewed landing · **Depends on:**
C15 (the Works on v3 and the run-log read it built); C17 (the camera — every
visual bar ships its evidence) · **Staffing:** Builder · opus-high ·
**Blessed:** D20 + D22 r4 (the Chat is the primary viewport — read anything,
send turns; summon-to-terminal the measured fallback); his ignition is the arm
(D11)

## Mission

The Chat becomes the primary viewport over the engine's world (D20's
my_checklist pattern). Today B16's Chat reads pane-born sessions and sends
through P6's cmux transport; a headless engine-born session — the venue D22
made primary — has no pane, so today it can be read only through the console
and spoken to not at all from the deck. When this lands: the Chat opens **any**
session the census or a v3 run log names, headless ones included; a paused
‹needs-⬡ question› renders as a conversation and the reply lands the step
through the engine's own seam; nothing is claimed delivered until the
transcript says so (B16's law, kept); and the Chat's rich rendering —
markdown, code fences, tables, tool rows — is agent-verified through the
camera before Felix's pass ever convenes.

## Inputs — read before working

- [B16 (the Chat)](b16-chat.md), findings included — the view, the draft law,
  the verification read (no new turn · more than one · different bytes — never
  retried), the compose-time refusals, D10 as structure (cold hands render no
  send control). All of it survives; this charge widens the targets.
- D20 + D22 (README §7) — the substrate split: engine venue headless, the Chat
  primary, summon-to-terminal the fallback. Naked `claude -p` without the
  engine is not approved unattended (D22) — every headless send in this charge
  travels the engine's seam, never a bare spawn.
- The engine's read/drive seam, and the reference reader:
  `v3/console/runs.ts` (`locate()`, `venueFrom` — log first, sidecar second,
  C14's shape) and the console's `read`/`send`/`return` verbs
  (`v3/console/cli.ts`) — the proven mechanics this charge lifts into the
  glass through imports. **`v3/**` is read-only** — imports only; a genuinely
  missing export is a stop-and-escalate naming it (D65's one-parser law).
- C14's compat law: a pre-C14 run names no config dir — readable forever,
  drivable never; the Chat renders that refusal in kind (F8's `drivable()`),
  never a stall.
- [C17](c17-camera.md) + [C19](c19-fixture-city.md), findings included — the
  loop, `Probe.remember` (C17 F5), one twin many shoots (C17 F6), a probe
  declares its own world (C19 F5). C15 F2/F3 (the `data-at` reservation, the
  repaint-signature law) — both bit the last tenant that touched this DOM.
- **Chat-content fixtures are this charge's own design question** (C19's
  out-of-scope, by name). The recommended answer, verified before built: a
  **fake engine run's own transcript** — layer-0 runs write transcripts in the
  sandbox their log names, so the Chat's normal discovery reads them with zero
  new knobs; a scenario scripted with markdown, fences, and a table is a
  deterministic rich-rendering fixture. Mind C5 F4: the fake's transcript is
  grammar §2's minimum (no `attachment` rows) — where a bar needs shapes the
  fake cannot write, a committed real capture (C4's) is the fixture, never an
  account-dir shim.
- P6's transport law stands for pane targets — untouched. The misdelivery law
  (UUID always) and B16 F3 (never wait on a probe's words or name) bind any
  new probe here.

## Spec

1. **Read anything.** The Chat's target set widens to sessions without panes:
   an engine run's step (sid + config dir off the run log) and a shelf
   transcript are both openable in the same view, tail-windowed and paging as
   today. Discovery imports the console's reader; the Chat never re-implements
   it. A session the log cannot venue (pre-C14, lost sidecar) opens read-only
   with the refusal named on the pane.
2. **Send turns to headless sessions, through the engine.** For an
   engine-run step: a reply into a paused ‹needs-⬡ question› travels the
   engine's send seam (the console's mechanism — headless resume, same
   session), landing or refusing exactly as the console does; the step's
   pause/landing state re-reads from the run log after. For a live TUI pane:
   P6's transport, unchanged. The Chat picks the road by what the target is,
   and says which road it took. Both roads: credential-gated (cold hands →
   no control drawn, the reason in its place), previewed bytes, verified
   after delivery against the transcript — B16's three failure verdicts kept,
   never retried.
3. **The engine's pauses are conversations.** A run's ‹needs-⬡ question›
   surfaces in the Chat as the step's question with the reply box armed (warm
   hands only); ‹blocked›/‹dead› render read-only with the cause. The
   attention queue's needs-you item for a paused step opens this view (the
   existing hotswap seam).
4. **Rich rendering, agent-verified.** Markdown, fences (zero decoded spans
   inside them — B16's law), tables, tool rows, the streamed tail of an
   in-flight headless turn (poll-driven as today). One probe, several shoots:
   the rich fixture rendered, the paused-question conversation, the
   cold-hands Chat on a headless target. Every visual bar ships the PNG, Read
   and described.
5. **The fallback stays measured.** Summon-to-terminal (the composer, B4's
   hands) is untouched; nothing in this charge removes or gates it (D22 r4
   names it the fallback, not a casualty).

Implementation choices inside this spec are the Builder's; anything touching a
contract — a v3 export change, a new engine verb, transport semantics beyond
the two roads above — escalates.

## Done when:

- [ ] The Chat opens a **headless engine-born session** from its run's node in
  the Works and from the needs-you queue — transcript rendered, the road named
  — camera shot, Read, described.
- [ ] A committed test: the Chat's read on a fake run's transcript ≡ the
  console `read`'s verdict source (same log, same turns) — the deck
  re-implements no reader.
- [ ] **The round trip on real bytes, once:** a real engine run pauses
  ‹needs-⬡ question›; the reply typed in the rendered Chat lands the step
  (run log re-read says `landed`), the delivered turn byte-identical
  page-side and in the transcript on disk. **Budget: ≤$2 / ≤15 subject
  turns, either ceiling a ⬡-fork (D21) — this bar is the spend.**
- [ ] The same arc on the fake at budget 0 (answer-then-land, C14's scenario)
  drives pause → reply → landed in a committed test.
- [ ] A pre-C14 run's session opens read-only with the refusal named in kind —
  asserted or shot.
- [ ] Cold hands: the headless reply box is not drawn, the reason stands in
  its place (the honest-disabled law) — probe-asserted like B16's, plus the
  503 on the wire.
- [ ] Rich rendering shot and Read: markdown + fence + table + tool rows from
  a deterministic fixture (the fake-transcript answer above, or a committed
  real capture — say which shipped); zero decoded spans inside fences.
- [ ] `bun v3/gates.ts --fast --glass` — ALL GREEN, block pasted; camera gate
  0 if probes added; zero new dependencies.
- [ ] Live TUI sends unchanged: B16's existing suite green untouched (its
  tests are the regression).

## Out of scope

- Arming/driving a run beyond a reply into an existing pause — igniting,
  re-blessing, HALT-into-engine (G5's rework lay; B26/B27).
- Streaming transport (websockets, SSE) — the poll is the law until a charge
  measures it insufficient.
- The shelf's account seeding; any account-dir shim (the fixture answer is
  named above).
- Removing or gating summon-to-terminal; any organ change beyond the Chat and
  its entry points.
- Any `v3/**` write; `camera/**` beyond this charge's own probes.

## Findings

*(append here — evidence-grade: every claim carries the command and output that
proved it; probes ship with a control)*

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§2–3 and §§5–6 (the fence, the
arming law, agreements; the migration campaign note),
~/code/agents/belvedere/plans/b16-chat.md and
~/code/agents/belvedere/plans/c15-deck-v3-lane.md (findings included),
and execute the charge at ~/code/agents/belvedere/plans/c16-chat-chapter.md.
```
