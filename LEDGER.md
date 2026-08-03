# Ledger

Append per session: date · mantle · changed · decided · next.

---

**2026-08-02 · Grand Architect** — Laid the keel: GENESIS.md (composition law, five
mantles, deployment map, campaign board), CLAUDE.md, DECISIONS.md, LEDGER.md, briefs
01–04. Recon: agents repo was bare; global CLAUDE.md and keybindings.json byte-identical
across all three accounts (hand-synced); simmy tiers found real in
`cap-mega/.claude/agents/` — format harvested into brief 01. Decided: D1–D6. Next:
summon 01 (Architect · fable-max); 04's spike is parallel-safe in any spare account.

---

**2026-08-02 · Architect (01)** — Landed the composition model: `canon/agents/` (full
pre-minted 20-tier grid), `canon/mantles/` (five charters to the DISPATCHER.md grade
bar + README with summons grammar, rider template, precedence law, charter template),
`canon/skills/` (five shims — path canonical, skills sugar). Empirical findings: agent
definitions load at session start (mid-session mint invisible); `haiku-xhigh`
dispatches green (effort clamps per docs); skills ARE discovered from
`$CLAUDE_CONFIG_DIR/skills/`; `${CLAUDE_EFFORT}` substitutes live — so skill-worn
mantles guard both tier axes. Decided: D7–D13 (D3 amended: skills join the sync set).
Mid-session, 04's Stage A spike landed in parallel (816f2ac) — reviewed at
end-of-session: findings evidence-grade, board trued (spike LANDED, U1/U2 escalated to
Felix), 01's skill-probe cross-finding folded into its findings (narrows U1 to
symlink-following only); canon's five shim dirs conform to F6 (dirname == name).
Countersigned in-session: D7–D13 ✓ Felix; D9 amended — fast mode unused, patience over
premium; "(fast)" struck from the README bullet and the Builder charter. Next: Felix
answers U1/U2 (04 spike); summon 02 (Architect · fable-max), kickoff verbatim in
`plans/02-work-doctrine.md`.

---

**2026-08-02 · Digger (04 Stage A)** — Ran the symlink spike; findings appended to
`plans/04-sync.md` (F1–F9), Stage B untouched per brief. Symlink-first survives: no
target disqualified. Proven at **user scope in a live config dir** — `agents/` and
`skills/` followed as whole-dir symlinks and as symlinked members (F8). Proven at project
scope with a real-file control — `CLAUDE.md`, `agents/`, `skills/` (F2). Brief question 1
answered clean: nothing rewrites `CLAUDE.md` or `keybindings.json` in place — `settings.json`
was rewritten mid-spike while those two sat untouched for weeks/months (F3). Question 2:
recommend whole-dir symlinks — one link per target, new canon files appear with no
redeploy; per-member linking would force `deploy` to reconcile adds/deletes, i.e. the
sync engine the brief forbids (F7). Also: `agents/`/`skills/` exist in no config dir, so
first deploy displaces nothing (F4); a skill whose dirname ≠ frontmatter `name` is
silently ignored, no warning — `deploy` must assert it (F6); the brief's scratch-config-dir
method is dead, auth is per-config-dir and `deploy` can never provision it, so new-machine
bootstrap is clone + deploy + `/login` ×3 (F1). Unplanned catch: **`~/.claude-thg-fgreen`
would not authenticate from a fresh subprocess** — "Not logged in", while doorbell works;
it was genuinely logged out. Felix re-logged in mid-session and it now authenticates
**concurrently** with doorbell — logins do not evict each other, so the three-account
strategy is structurally sound. Same retest caught `~/.claude` (Max) sitting on an expired
OAuth session since ~Jul 6, and the gotcha that `CLAUDE_CONFIG_DIR=~/.claude` ≠ unset (its
`.claude.json` lives outside the dir) — Stage B's per-account smoke-summon must unset the
var for the default account or it fails for reasons unrelated to sync (F9). Decided: nothing — Digger proposes, Architect ratifies;
the per-target mechanism table is the Architect's D-entry to cut. Two tests unrun: the
permission classifier allows additive writes to a live config dir but refuses to displace
an existing file, so user-scope `CLAUDE.md` (U1) and `keybindings.json` (U2) need Felix to
run `$SPIKE/displacement-test.sh` (backups taken, restore trap, md5-verified). Both live
dirs left verified clean. Next: Felix runs the displacement script and pastes output;
Architect folds the result and cuts the mechanism D-entry; Stage B gated on 01–03.
