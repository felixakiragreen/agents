# cmux feedback draft — needsInput latches on the idle nag and never decays

*(Felix's to send — `cmux feedback --body … ` or the app. Drafted at the batch-6 sitting, 2026-08-28, from measured state; numbers from a live `~/.cmuxterm/claude-hook-sessions.json`.)*

Two related issues with the Claude Code wrapper's `agentLifecycle`:

1. **Every `Notification` hook event latches `needsInput`, including the idle nag.** Claude Code's `Notification` payload carries a `notification_type` distinguishing `permission_prompt` ("Claude needs your permission" — a real block) from `idle_prompt` ("Claude is waiting for your input" — a 60 s idle reminder that fires after every completed turn in an interactive session). Both bodies appear in my hook-sessions file as `needsInput`. A finished, idle session therefore shows "needs input" forever — the latch only clears on a later hook event, and an idle session at its prompt never fires one. Ask: map `idle_prompt` to `idle` (or a distinct "waiting" state); reserve `needsInput` for `permission_prompt`/elicitation.

2. **`needsInput` never decays on process death.** Of 21 sessions currently latched `needsInput` in my file, 17 have dead pids. The record already stores `pid` + `pidStartMicroseconds`, and the hibernation path already revalidates exact process generation — the same check on badge render (or a periodic sweep) would retire these.

Net effect today: a sidebar full of "needs input" where almost none is real, which trains me to ignore the one that is.
