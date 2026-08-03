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
