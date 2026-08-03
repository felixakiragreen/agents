# Decisions

- **D1** (2026-08-02, Felix): **Canon-and-mirrors.** This repo is the single source of
  truth for cross-account Claude config; the three config dirs are deploy targets.
  Symlink-first hypothesis — a spike confirms per target; copy + drift-check is the
  fallback for any target Claude Code won't follow.
- **D2** (2026-08-02, Felix): The role system is named **Mantles**. `canon/mantles/`,
  five charters: Grand Architect, Architect, Dispatcher, Digger, Builder.
- **D3** (2026-08-02, Felix): **Sync set v1** = global CLAUDE.md, `agents/` tiers,
  mantles, `keybindings.json`. `skills/` joins iff 01 chooses skills delivery for
  mantles. `settings.json` explicitly deferred.
- **D4** (2026-08-02, Felix): Composition model designed in **one merged session**
  (tiers + mantles + binding law together). Charters the session can't finish at quality
  become bounded work orders, never rushed drafts.
- **D5** (2026-08-02, Felix): **Non-goals v1:** session/history sync; hexwright & simmy
  retrofit (v2); plugin sync; multi-machine.
- **D6** (2026-08-02, Grand Architect): Bootstrap under hexwright-style conventions
  (LEDGER, DECISIONS, `plans/` briefs with verbatim kickoffs) until 02 canonizes the
  doctrine; 02 may amend this repo's own docs to match.
- **D7** (2026-08-02, Architect): **Tier naming grammar** — `<model>-<effort>`, both
  fragments verbatim from the frontmatter enums (`opus-medium`, never `opus-med`); name
  and definition are mechanically derivable from each other. `-fast` suffix reserved,
  unminted (D9).
- **D8** (2026-08-02, Architect): **Full pre-minted grid** — 4 models × 5 efforts = 20
  tiers in `canon/agents/`. Evidence: agent definitions load at session start, so
  mid-session minting is invisible (verified — in-session dispatch of a fresh tier fails,
  fresh-session dispatch succeeds); unsupported efforts clamp gracefully per docs
  (`haiku-xhigh` dispatch verified green). Retires simmy's "tier named but not defined"
  escalation class. Staffing guidance's single home = the tier descriptions.
- **D9** (2026-08-02, Architect): **Fast mode is a session property, never tier data.**
  `/fast` is session-level and Opus-only (documented); no subagent frontmatter for it
  exists. Boards may annotate "(fast)" as an instruction to the human summoning
  interactively; dispatched agents run without it — fast optimizes a human's wait.
- **D10** (2026-08-02, Architect): **Tier frontmatter contract** = `name`,
  `description`, `model` (bare alias), `effort` (low|medium|high|xhigh|max), body =
  simmy's proven three lines verbatim. **No `tools:` in tiers** — conduct limits are
  charter law, not engine config.
- **D11** (2026-08-02, Architect): **The precedence law** — every charter carries the
  canonical clause: worn by explicit summons only; while worn, the charter overrides the
  global CLAUDE.md where they conflict on workflow (when to ask, when to act);
  personality, code style, and git conventions always apply. The hook 03 must plant is
  in `canon/mantles/README.md` §precedence.
- **D12** (2026-08-02, Architect): **Mantle delivery = read-by-path canonical, skill
  shims as interactive sugar.** Five authored shims in `canon/skills/<mantle>/SKILL.md`
  (authored, not generated — sync stays a dumb mirror) point at the charter path, inject
  `${CLAUDE_EFFORT}` for the two-axis tier guard, and set
  `disable-model-invocation: true`. Evidence: skills discovered per
  `$CLAUDE_CONFIG_DIR/skills/` and live effort substitution both verified empirically.
  **D3 amended: `skills/` joins the sync set.** Skills' own model/effort frontmatter
  deliberately unused — a one-turn override masquerading as a session tier is hidden
  state.
- **D13** (2026-08-02, Architect): **Summons grammar + rider template** canonized in
  `canon/mantles/README.md` — interactive form ("You are a <Mantle> at <tier>. Wear
  <charter path>…"), dispatched form (kickoff verbatim + rider, never edited), rider
  universal core (dispatched framing · files-are-the-deliverable ·
  report-is-logistics-only) vs project slots (agreements ref, bulletin path, worktree
  specifics — 02's turf).
