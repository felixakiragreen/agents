# Issues — Belvedere's incident inbox (D53 pattern)

Field reports, render failures (parser-as-lint, [README §1](README.md)), and
sovereign-inbox entries (D63: `- <date> · Felix (via Belvedere) · <what>`) land
here — Felix's hand, a session's at his word, or the deck's third write
([README §2](README.md)). Entry format (D63): `- <YYYY-MM-DD> · <who> · <what>` —
one bullet per entry; an entry needing evidence becomes a `---`-separated block
opening with that line. This building's Architect sweeps at every session: each
entry ruled — distilled, laid as a charge, rejected, or escalated (canon-shaped
entries go to the canon repo's inbox) — then deleted; entries are committed before
the inbox is cleared. A cleared inbox is empty.

---

- 2026-08-29 · Grand Architect (GA-15) · **The flow doctrine landed (D73 + D74 ⬡✓) —
  the engine's ask list, batched.** Canon ruled charge 20; the grammar Builder work is
  canon's C32; what follows is Belvedere's, its Architect lays its own charges:
  (1) **`budget`** — a Flow field: max engine ignitions per arm; at the ceiling the
  engine pauses and one re-arm extends (D73's law; schema + arm-view bill + engine
  check). (2) **`continues`** — a step mode: resume the predecessor step's session
  instead of igniting fresh (B5's resume-by-stamp is the hand; the law's wording is
  D73's — continue when the next act consumes this act's judgment). (3) **Per-building
  flow home** — flow files live with their building's `plans/` when the reader grows
  legs; interim stands (`belvedere/flows/` naming the building — `agents-flow-1.flow.json`
  does this today, the first foreign-building flow; its arm is Felix's). (4) **Post-C32
  adoption** — the written baton holder retires `classifyBaton`'s inference and the
  rail's `shapeOf` splitter; `holds:` retires `SPEC_PATTERNS`' interim classifier;
  E-ids land as fields. Retire render-side heuristics as the parser types each field
  (D65 — one parser). (5) **The coda gap** — the engine composes fence-only summonses;
  DOCTRINE §10 says ignition = kickoff + the project coda (`plans/CODA.md` where one
  exists): append it at fire. (6) Standing reminders, already yours: B12 E1
  (trust false-refusal on plain directories), B17's probe reds.
- 2026-08-29 · Grand Architect (GA-15) · **arm → bless (⬡ ruled — "Bless bless") +
  two trust facts.** (1) The Guild's word for the one-click flow authorization is
  **bless** (STANDARD §1 + §9 row 33; D73 respelled): sovereign-facing copy — the
  Works' button above all — must read **Bless**; run-state event names (`armed`,
  `armedAt`), the arming switch, and D10's own title are tool vocabulary — your
  Architect's call whether they follow. (2) The trust split-brain, measured:
  personal's legacy `~/.claude.json` is not what `readTrust` reads
  (`~/.claude/.claude.json`) — correct behavior, but a human measuring trust by the
  legacy file gets wrong answers (canon charge 20 F6's dated correction holds the
  evidence). (3) A trust refusal at blessing time is a ⬡-card candidate — his word:
  "you can just ask me to do that" — one session opened by his hand warms the cell;
  card it, never guess.

---

- 2026-08-29 · grand-architect-18 · agents-flow-1's first ignition fired stale
  kickoffs — canon-side repaired; four engine-side asks for this desk, one gating.

  **What happened.** ⬡ blessed agents-flow-1 in the Works; the engine fired the
  charge docs' fenced kickoffs verbatim, and every fence predated C33's door (laid
  hours earlier the same day) — the sessions opened without GUILD.md, and c32's
  kickoff pointed into the register C34 purged. ⬡ stopped the run. Canon-side is
  repaired on the agents master (479347f): seven fences re-cut to the door grammar,
  c32 re-pointed, `plans/CODA.md` re-instantiated (worktree + bulletin sentences
  returned — the batch is parallel), the bulletin re-opened, the charge template's
  kickoff slot fixed, C31 grown a fourth item (the doctrine kickoff lint arm). The
  flow file needed no change — kickoff = doc + fence pointer, and every doc holds
  exactly one fence.

  **The asks, gating first:**
  1. **The coda gap — gates the re-bless.** DOCTRINE §5/§10: ignition = kickoff +
     the project coda, nothing else. The engine has no coda concept — evidence:
     `grep -rn -i coda belvedere/glass/` → 0 hits; `glass/engine.ts:503` fires
     `step.kickoff.text` alone. Fix: after resolving a step's kickoff, append the
     charge's building's `plans/CODA.md` quote block verbatim. Flow-1's sessions
     need it — the coda now carries the bulletin protocol, the worktree relay law,
     and the D-entry marking this parallel batch runs on.
  2. **Pre-flight kickoff validation.** The engine fired stale fences with no
     grammar check. Before igniting, validate the kickoff's opening lines against
     the summons grammar (summons line → door line → wear line; canon law in
     `canon/mantles/README.md` §Summons grammar) — or run `doctrine lint`'s kickoff
     arm once agents C31 lands it — and refuse loudly on drift (guard/'s
     deny-don't-retry shape). A stale fence should be a stopped step, never a
     mis-briefed session.
  3. **Venue staleness at re-bless — say the semantics.** The stopped run left its
     c29 worktree standing at the arm-time commit, still carrying the pre-repair
     fence — a re-fire reading docs from that checkout would have repeated the
     incident. I fast-forwarded it to the agents master (clean, no divergent
     commits). Write down which checkout the engine resolves `kickoff.doc` against,
     and whether a re-blessed flow reuses or re-mints venues — refresh-on-refire is
     the safe default.
  4. **Sweep this building's own fences.** Belvedere's OPEN charge docs may carry
     the same pre-door kickoffs — any fence laid before 2026-08-29 evening is
     suspect; the agents repair (479347f) is the pattern to copy.

  Evidence: the stopped run in the Works (⬡, 2026-08-29 evening); pre-repair fences
  at agents 7a1da16, repair at 479347f; `belvedere/flows/agents-flow-1.flow.json`;
  `glass/engine.ts:503`.
