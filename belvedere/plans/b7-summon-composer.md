# B7 — the summon composer

**Status:** LANDED 2026-08-27 · **Depends on:** B4 (hands) · **Staffing:** Builder · opus-high ·
**Batch 3 (amended 2026-08-27):** fifth row, strictly serial after B6, straight to
master
**Spec blessed:** 2026-08-27, Architect, at Felix's ask ("fire-anything" — the
dream's phrase; the rail fires batons, the shelf fires resumes, this fires the
blank page).

## Goal

The rig's panel, in the glass: compose and fire ANY session — new work, new
buildings, ad-hoc sittings — without a terminal in the loop.

## Spec

1. **`/summon` page**: building/cwd (register dropdown + free-path field),
   account (from `summon/accounts.tsv` — explicit choice, no auto-arbitrage in
   v0; the usage strip is beside it, the bill visible), mantle (from
   `summon/presets.tsv` → color + charter path), tier (model × effort), summons
   textarea.
2. **Templates dropdown** filling the textarea with the canon grammar, slots
   ready: one per mantle (`You are a <Mantle> at <tier>.\nWear
   ~/code/agents/canon/mantles/<mantle>.md,\nthen read <context> and <verb>.`),
   plus **founding Architect** (doctrine §12's fenced summons) and the scoped
   inbox-sweep sitting (B6's template). Hardcoded strings, not parsed from canon.
3. **Name-stamp** auto: `<mantle>-<theater>-<NN>` — theater per row-14 semantics
   (target dir's `.summon-theaters` first line, else the dir name); ordinal =
   max existing for that mantle-theater across `hands.jsonl` + live census + 1,
   editable before fire. Collisions are cosmetic (identity is `sid` — P1 F2).
4. **Optional worktree**: repo + branch fields → composes `/hands/worktree` →
   `/hands/fire` with cwd = the worktree path (same composition B3 carries).
5. Fire → `POST /hands/fire` (workspace color set natively, summons as argv —
   B4's recipe). Hands disabled → composer renders read-only with the banner.

> **Amended 2026-08-27 (Architect, at the B3 E1/E2 ruling sitting — B3 F2 /
> inbox):** a fire whose target cwd has no **trusted ancestor** (`~/.claude.json`
> project entries; worktrees inherit their repo's trust) stalls silently at
> Claude Code's folder-trust dialog — launched, no transcript, no census beat.
> The composer reads the trust roots and **warns on the fire button** when the
> target is cold ("untrusted directory — the session will wait on Claude's trust
> prompt; jump in to answer it"), never answers the dialog itself, and renders
> such a fire honestly (a stalled fire is a stalled fire, not a success — the
> focus hand is the jump-in). DoD gains: one cold-dir fire showing the warning
> and the honest state.

> **Amended 2026-08-27 (Felix's design laws, README §3):** **no dropdowns** — the
> account picker is a toggled button group with usage beside each choice (the
> bill visible), the register picker a wrapping group of building chips plus the
> free-path field, templates a chip row. Labels encapsulation-first with [expand]
> where the full text is long.

## Acceptance criteria / DoD — evidence pasted here at build time

Every fire below was composed by **posting the page's own form and reading the fire
body back out of the rendered HTML** — the same bytes the button carries — then
handing that JSON to `POST /hands/fire`. Nothing was hand-assembled.

- [x] **A composed fire lands: right account, stamped, colored, summons byte-exact
      as first turn (transcript quoted); probe cleaned up.**

      The rendered card's body:
      `{"account":"personal","stamp":"builder-belvedere-02","cwd":"/Users/felix/code/agents/belvedere","model":"haiku","effort":"low","color":"Aqua","summons":"You are a Builder at haiku-low.\nWear ~/code/agents/canon/mantles/builder.md,\nthen read nothing and stop — this is B7's composer probe. Do not act."}`

      `POST /hands/fire` → `{"workspace":"workspace:16","sha":"d99b1fc2276db7f1","bytes":148}`.
      Transcript `~/.claude/projects/-Users-felix-code-agents-belvedere/5c73b3c0-….jsonl`
      (**personal**, its own `CLAUDE_CONFIG_DIR` tree) — `agent-name builder-belvedere-02`,
      `cwd /Users/felix/code/agents/belvedere`, first user turn **148 B**, and

      ```
      sha256(rendered page's summons) = d99b1fc2276db7f13d6ac685f8338da50dfb3455e6947537eb19a10f2c5a67d6
      sha256(first user turn)         = d99b1fc2276db7f13d6ac685f8338da50dfb3455e6947537eb19a10f2c5a67d6
      ```

      **Coloured**, read back off the socket: `cmux workspace list --json` →
      `"custom_title":"builder-belvedere-02","custom_color":"#0E6B8C"` — cmux's
      `Aqua`, which is `presets.tsv`'s `cyan` for Builder through `colourOf()` (B3 F1).
      `workspace:16` closed; venue back to Felix's one workspace.

- [x] **The founding template fired at a scratch dir starts a session whose first
      turn IS the founding summons for that path.**

      Scratch dir `~/code/b7-founding-probe`, template chip `founding Architect` — which
      set mantle *Architect*, tier *fable-max* and the text together. Fired
      `{"workspace":"workspace:18","sha":"845e793254e903b0","bytes":185}`; transcript
      `-Users-felix-code-b7-founding-probe/9b4d932c-….jsonl`, `cwd
      /Users/felix/code/b7-founding-probe`, first user turn **185 B**,
      `sha256 845e793254e903b003f07ca3f261f1a668ca863f7d6c4bf3787bdd91a5b286a4` on
      **both** sides, and the text is DOCTRINE §12's fence verbatim, slot intact:

      ```
      You are an Architect at fable-max.
      Wear ~/code/agents/canon/mantles/architect.md,
      then read ~/code/agents/canon/work/DOCTRINE.md
      and <dream.md | Felix's telling>, and found the project.
      ```

      Ten census beats on that sid. Workspace closed; the scratch dir was empty and
      is deleted.

- [x] **A worktree-composed fire lands with cwd inside the created worktree**
      *(in `agents`, not a scratch repo — see **F2**: a fresh `git init` is cold on
      every account, so a scratch repo cannot reach a first user turn at all).*

      Composed at `agents/belvedere` with branch `bv/b7-wt`. The card, before anything
      was cut: `cwd agents/.claude/worktrees/bv/b7-wt — cut first from agents on branch
      bv/b7-wt` · `trust warm — agents is trusted for personal`. Then
      `POST /hands/worktree {"repo":"/Users/felix/code/agents","branch":"bv/b7-wt"}` →
      `{"path":"/Users/felix/code/agents/.claude/worktrees/bv/b7-wt"}`, and the fire with
      that path as `cwd` → `{"workspace":"workspace:23","sha":"3c8351b7ef0a7df8","bytes":138}`.
      Transcript `-Users-felix-code-agents--claude-worktrees-bv-b7-wt/2e125ead-….jsonl`,
      `agent-name builder-belvedere-04`, **`cwd /Users/felix/code/agents/.claude/worktrees/bv/b7-wt`**,
      first turn `sha256 3c8351b7ef0a7df8…` — the hand's own sha. Worktree removed and
      branch deleted: `git worktree list` is back to `master` plus the pre-existing
      `agent-a55279e2…` checkout.

- [x] **Stamp ordinal: two consecutive composed fires increment; an existing rig
      stamp in the census is not double-assigned.**

      Two consecutive composes at `agents/belvedere`, both fired:
      `builder-belvedere-02` (`workspace:16`) then **`builder-belvedere-03`**
      (`workspace:17`) — both live in `cmux workspace list` at once, both closed after.

      The census half, on **live data with no synthetic input**: `architect-belvedere`
      appears **0 times in `invocations.jsonl` and 0 times in `hands.jsonl`**
      (`grep -c` both), so the two logs alone would mint `architect-belvedere-01` — and
      the live census carries `architect-belvedere-01` right now. The composer minted
      **`architect-belvedere-02`**. Measured across every stamped lineage in the live
      census, that is the one the third source moves; the other sixteen agree with the
      logs, which is the correct answer for them.

- [x] **Disabled mode honest; zero writes outside the legal set (git status proof).**

      A second glass on `BELVEDERE_ENV=/nonexistent/belvedere/env`: `/summon` renders
      *"The composer is read-only — `/hands/*` answers 503 until the credential is
      armed. Everything here still composes: the plan, the stamp and the trust verdict
      are all reads. — no credential at /nonexistent/belvedere/env"*, the composed card
      still resolved a full plan (stamp `builder-belvedere-05`), and its fire button is
      **in the DOM and `disabled`** — B4 E2's "not this glass, yet", distinct from D10's
      "not this card". `POST /hands/fire` on that glass → **HTTP 503**
      `hands disabled — no credential at /nonexistent/belvedere/env`.

      After every probe: `git status --porcelain` is `?? .claude/` — the same untracked
      directory the session started with, and nothing else. Everything the fires wrote
      (four summons files, the audit lines) sits under `summon/log/`, which
      `git check-ignore -v` resolves to `.gitignore:1:summon/log/`.

- [x] **Amendment: one cold-dir fire showing the warning and the honest state.**

      `~/code/b7-scratch-repo` — a fresh `git init` inside the trusted `~/code`. The card:
      `trust cold — project b7-scratch-repo`, and on the fire button
      *"**untrusted directory** — the session will wait on Claude's trust prompt; jump
      in to answer it. `b7-scratch-repo` is a repository **personal** has never trusted,
      and a repository never borrows an ancestor's trust. Trust is per account and lives
      on the project root; the glass reads `/Users/felix/.claude/.claude.json` and never
      answers that dialog."*

      Fired anyway (the warning warns; it does not refuse):
      `{"workspace":"workspace:22",…}` — and **25 s later: no transcript directory, `0`
      census beats for the stamp, and the `claude` process still alive holding the
      dialog.** That is why the button carries `data-cold="1"` and the page's script
      renders such a fire as *"opened workspace:22 · WAITING on Claude's trust prompt —
      jump in and answer it; nothing has been read"* rather than as a fire that landed.
      Workspace closed, repo deleted.

**Gates:** `bun test belvedere/glass` → **271 pass / 0 fail in one process** (was 219;
52 new, none weakened). `bunx --offline tsc --noEmit` from `belvedere/glass` → **exit 0**.
`/summon` warm, 12 requests spaced 1 s: `n=12 min=0.006s p50=0.007s p95=0.013s max=0.017s`.

## Out of scope

- Auto-arbitrage account picking; a guided "new building" flow (parked — the
  founding ritual's Felix-steps stay his); editing presets/accounts (rig ground);
  queueing/scheduling fires (the flow horizon, parked).

## Findings

**F1 — Claude Code's unit of trust is the PROJECT ROOT, it is per account, and a
repository never borrows an ancestor's trust.** B3 F2 established that a cold tree
stalls and that worktrees inherit; both hold, but the rule underneath is narrower than
"nearest trusted ancestor", and the naive reading produces a **false warm** — exactly
the silent-success the amendment exists to prevent. Measured four ways:

1. **Per account.** Each silo keeps its own `<config-dir>/.claude.json`. B3 F2 read
   `~/.claude.json`, which is the file a session with **no** `CLAUDE_CONFIG_DIR` uses;
   the rig always sets one, so the operative file is `~/.claude/.claude.json` (9 entries,
   including a blanket `/Users/felix/code`), `~/.claude-thg-fgreen/.claude.json` (13, one
   of them an explicit `false`) and `~/.claude-thg-doorbell/.claude.json` (12). The same
   directory is warm on one account and cold on another.
2. **Every entry sits on a project root.** All **36** entries across the three accounts
   resolve to themselves under `git rev-parse --path-format=absolute --git-common-dir`
   → `dirname`; not one is a subdirectory of the project it names.
3. **A plain directory inherits; a repository does not.** `~/code` is trusted for
   `personal`. A fire into `~/code/b7-founding-probe` (a bare `mkdir`) reached its first
   user turn and beat the census **10** times. A fire into `~/code/b7-scratch-repo` — a
   fresh `git init` in that same `~/code` — produced **no transcript directory and 0
   census beats** with the `claude` process still alive on the dialog, and so did a
   worktree cut under it. Two stalls, one difference: `.git`.
4. **Cross-checked against the live city.** All **9** live sessions carrying a cwd are
   warm under the rule — and a running session is warm by construction, so a single
   "cold" would have falsified it.

So: `trustOf` resolves the target to its project (the repo's **main** worktree root via
`--git-common-dir`, which is *why* a linked worktree inherits — else the directory
itself), and then: its own entry wins; with no entry a **repository is cold** and a
plain directory asks its ancestors. Both spellings of every root are indexed, because
Claude records the cwd it was handed and `git` answers with symlinks resolved
(`/tmp` IS `/private/tmp`).

**This binds anything that fires**: B9's sweep, the flow chapter's DAG, and any future
row that composes a fire into a directory the city has not run in before.

**F2 — the order's "scratch repo" is unfireable by construction, and that is F1
arriving as a consequence.** A fresh `git init` is a repository no account has ever
trusted, so a worktree-composed fire into a scratch repo can never reach a first user
turn without Felix answering the dialog by hand — which the glass may not do. The
worktree DoD was met in `agents` instead (B3's own precedent: a throwaway branch,
removed after), and the two scratch-repo stalls became F1's evidence. **Any future
order that says "fire at a scratch repo" is ordering a stall.**

**F3 — the glass's stamp slug and the rig's theater law disagree on `_` and capitals,
and the glass is the narrower one on purpose.** Row 14 allows a theater of
`A-Za-z0-9._-`; `hands.ts`'s `STAMP` is `^[a-z][a-z0-9-]{0,63}$`. So
`universal_robots_sdk` composes as `builder-universal-robots-sdk-NN` here and as
`builder-universal_robots_sdk-NN` from the rig — **two lineages for one theater**, and
the counter forks. Nothing is papered over: the stamp is always on show and editable,
and an edit back to the rig's spelling is refused **loudly** by `parseFire` (400,
naming the rule) rather than fired as something else. The fix is a contract change at
B4's parse boundary — the Architect's, not this row's.

**F4 — the live census is a load-bearing third source for the ordinal, and the rail
still counts only two.** `nextStamp` gained an optional `known` list; the composer
passes every stamp the census carries. On live data: `architect-belvedere` appears
**0 times in `invocations.jsonl` and 0 times in `hands.jsonl`**, yet the census carries
`architect-belvedere-01` — so the two logs alone would hand that name out a second
time, and the composer mints `02`. **The rail and B6's apply button pass no `known`
list** (the default is `[]`), so they would still double-assign it; `railPage` already
calls `readCensus()`, so the fix is threading one array through `cards()`. Parked —
B3's ground, not this row's.

**F5 — `nextStamp` now keeps the Grand Architect's exception, and refuses the rig's
third shape.** `summon.zsh:_summon_name_stamp` gives the GA no theater ("there is one
office"); the glass matched it — measured live, the composer mints `grand-architect-11`
at `agents/belvedere`, not `grand-architect-belvedere-01`. The rig's third shape (a
mantle-less launch, `<theater>-NN`) is deliberately **not** offered: a fire the glass
cannot name is a fire it will not arm, and adding it would have quietly un-blocked rail
cards whose mantle the parser could not read. `theaterOf` also reads
`.summon-theaters` now — first non-blank line, no parent walk, and a line the rig would
refuse falls back to the directory name rather than composing a bad launch.

**F6 — the probes' residue, named rather than scrubbed.** Four summons files and the
audit lines for six fires sit in the gitignored `summon/log/census/` (an append-only
audit is not a Builder's to rewrite — B8 F1), and Claude wrote a
`"hasTrustDialogAccepted": false` entry for `~/code/b7-founding-probe` into
`~/.claude/.claude.json` when the probe ran. The directory is deleted; the entry is
inert, and it is Felix's config, so it stays. Note for anyone re-measuring F1: those
two probe paths now carry opinions.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md
and ~/code/agents/belvedere/plans/b7-summon-composer.md,
and build the order.
```
