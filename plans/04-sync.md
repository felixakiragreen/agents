# 04 — Sync: Canon → Mirrors

**Two stages.** Spike: Digger · opus-high — **parallel-safe now** (no gate). Build:
Builder, staffing set by the Architect when blessing — gated on 01–03 LANDED.
**Status:** OPEN

## Mission

Make the three config dirs live mirrors of `canon/`, then make drift impossible to miss.
Symlink-first hypothesis (D1): if Claude Code follows symlinks, there is no sync problem
— one inode of truth; the tool only bootstraps and verifies. Copy + drift-check is the
per-target fallback. **Do not build a sync engine** — this is a bootstrap script and a
diff, not a product.

## Stage A — Digger spike: does Claude Code follow symlinks?

**Question, per target:** symlinked `CLAUDE.md` (file), `agents/` (dir; also one
symlinked file inside a real dir), `keybindings.json`, `skills/` (dir — only if 01 chose
skills delivery).

**Method sketch:** scratch config dir + `CLAUDE_CONFIG_DIR=<scratch> claude -p` probes —
e.g. plant a canary line in the symlinked CLAUDE.md ("if asked, the codeword is …") and
ask for it; list agents; press a rebound key. Evidence-grade findings: every verdict
carries the command and output that proved it.

**Also answer (cheap, while in there):**
1. Does Claude Code ever REWRITE these files in place (as it does `settings.json`)? A
   rewrite through a symlink would dirty the canon repo silently — if so, that target
   goes copy-mode regardless.
2. Symlink the whole file/dir vs symlinking parent structures — pick the least-magic
   layout that works.

**Kill criteria:** a target not followed, or rewritten in place → that target is
copy-mode. A kill here is a routing decision, not a failure. Findings append under
`## Findings` below.

## Stage B — Builder: `sync/deploy` + `sync/check`

Requirements (fewest that work):

1. `deploy` — idempotent; per-target mechanism from the spike's verdict table; backs up
   any displaced original once (`*.pre-canon`); creates `agents/` dirs where missing;
   prints a table of what it did.
2. `check` — diffs canon against all three dirs (symlink targets verified, copies
   byte-compared); exit nonzero + loud diff on drift. This is the command Felix runs
   when something feels off.
3. Zero dependencies beyond the shell. Simplest language that works; bash is the
   default answer.
4. New-machine bootstrap = clone + `deploy`. Nothing else.

**DoD:** deploy run on all three accounts; a canary edit in `canon/` is visible in every
account (symlink) or flagged by `check` until redeployed (copy); `check` green; a fresh
`CLAUDE_CONFIG_DIR` smoke-summon in each account loads the canon CLAUDE.md; LEDGER +
board updated; D-entry recording the per-target mechanism table.

## Out of scope

- settings.json, plugins, sessions (D3/D5). Watchers, daemons, git hooks, auto-deploy —
  YAGNI until drift actually bites.

## Findings

**Stage A · Digger · opus-high · 2026-08-02 · Claude Code 2.1.220 · macOS 24.6.0**
`$SPIKE` = session scratchpad; `$D` = a live config dir. Every verdict below carries the
command and the output that produced it.

### Verdict table (provisional — see U1/U2)

| Target | Mechanism | Confidence |
|---|---|---|
| `CLAUDE.md` | **symlink** (single file) | project-scope **proven** (F2); user-scope inferred (U1) |
| `agents/` | **symlink** (whole dir) | **proven at user scope, in a live config dir** (F8) |
| `skills/` | **symlink** (whole dir) | **proven at user scope, in a live config dir** (F8) |
| `keybindings.json` | **unproven** | not tested (U2) — no project-scope equivalent exists |

No target has been disqualified. Nothing here justifies copy-mode for anything.

### F1 — Auth is per-config-dir; the brief's "scratch config dir" method is unavailable

The method sketch in Stage A assumes a throwaway `CLAUDE_CONFIG_DIR`. It cannot log in:

```
$ cd $SPIKE/work
$ CLAUDE_CONFIG_DIR=$SPIKE/cfg-symlink claude -p --model claude-haiku-4-5-20251001 "Reply with exactly: OK"
Not logged in · Please run /login
```

The token is not in the config dir's `.claude.json` (keys present: `hasCompletedOnboarding`,
`oauthAccount{accountUuid,emailAddress,organizationUuid,…}` — no token/key field), and only
one keychain item exists for all three accounts:

```
$ security find-generic-password -s "Claude Code-credentials"
    "acct"<blob>="felix"     "svce"<blob>="Claude Code-credentials"
$ security find-generic-password -s "Claude Code"                       # → no result
```

So per-account separation is *not* achieved by distinct keychain services, and a fresh dir
with no `.claude.json` reads as logged out. Cloning auth into a scratch dir, and writing
spike files into a live dir, were both refused by the permission classifier — hence U1.
**Consequence for Stage B:** a new-machine bootstrap is `clone + deploy + /login per
account`; `deploy` cannot provision auth and must not try.

### F2 — Symlinks are followed for CLAUDE.md, `agents/`, and `skills/` (project scope, controlled)

Three project dirs, identical content, differing only in mechanism. `proj-control` is
real files and validates the probe; `proj-symlink` symlinks each *member*; `proj-dirlink`
symlinks each *whole directory*. Canon holds a canary codeword, an agent
`spike-tier-zebra`, and a skill `spike-skill-quokka`.

```
$ ( cd $SPIKE/<dir> && claude -p --model sonnet \
    '1) CODEWORD: state the codeword from your context, or NONE.
     2) AGENT_ZEBRA: is an agent type named spike-tier-zebra available to you? YES or NO.
     3) SKILL_QUOKKA: is a skill named spike-skill-quokka available to you? YES or NO.' )
```

| dir | mechanism | CODEWORD | AGENT_ZEBRA | SKILL_QUOKKA |
|---|---|---|---|---|
| `proj-control` | real files (control) | `PANGOLIN-7742` | YES | YES |
| `proj-symlink` | symlinked files inside real dirs | `PANGOLIN-7742` | YES | YES |
| `proj-dirlink` | whole dirs symlinked | `PANGOLIN-7742` | YES | YES |

Both symlink layouts are indistinguishable from real files. The control matters: the first
`SKILL_QUOKKA` run returned NO in *both* arms, which was a broken probe, not a symlink
failure — see F6.

### F3 — Claude Code does not rewrite CLAUDE.md or keybindings.json in place

Brief question 1 — the one that could have forced copy-mode. It does not.

```
$ stat -f '%N mtime=%Sm' -t '%F %T' $D/{CLAUDE.md,keybindings.json,settings.json,history.jsonl}
```

| file | `~/.claude` | `~/.claude-thg-fgreen` | `~/.claude-thg-doorbell` |
|---|---|---|---|
| `CLAUDE.md` | 2026-07-09 20:49 | 2026-07-09 20:49 | 2026-07-09 20:49 |
| `keybindings.json` | 2026-03-25 11:12 | 2026-03-25 11:12 | 2026-03-25 11:12 |
| `settings.json` | 2026-07-03 18:25 | **2026-08-02 17:35** | **2026-08-02 22:20** |
| `history.jsonl` | 2026-07-06 08:23 | **2026-08-02 20:54** | **2026-08-02 22:21** |

`settings.json` was rewritten minutes before this spike ran, and `history.jsonl` is live —
so these dirs are under heavy daily use, yet `CLAUDE.md` is untouched for ~4 weeks and
`keybindings.json` for ~4 months. The tool reads them and never writes them.
This is also direct confirmation of the premise behind D3's `settings.json` deferral.

Corroborating: after five probe runs, canon files were unmodified and every planted
symlink was still a symlink (nothing was clobbered by a write-through-then-replace):

```
$ stat -f '%N inode=%i mtime=%Sm size=%z' -t '%F %T' $SPIKE/canon/CLAUDE.md
$SPIKE/canon/CLAUDE.md  inode=2897201443  mtime=2026-08-02 22:17:43  size=83   # = creation time
$ for f in proj-symlink/CLAUDE.md proj-dirlink/{CLAUDE.md,.claude/agents,.claude/skills}; do [ -L … ]
SYMLINK OK ×4
```

**Caveat, not disproven:** this shows the *agent loop* never writes them. It does not prove
no interactive surface does — a future in-app keybinding editor or `/config` writer would
edit `keybindings.json` through the symlink and silently dirty the canon repo. `check`
comparing against git is the cheap guard; no action needed now.

### F4 — `agents/` and `skills/` do not exist in any config dir today

```
$ for d in ~/.claude ~/.claude-thg-fgreen ~/.claude-thg-doorbell; do … done
~/.claude:              agents=no skills=no
~/.claude-thg-fgreen:   agents=no skills=no
~/.claude-thg-doorbell: agents=no skills=no
```

`deploy` creates them from nothing — no displaced originals to back up, no merge problem.
The `*.pre-canon` backup path in Stage B requirement 1 is therefore only ever exercised by
`CLAUDE.md` and `keybindings.json`.

### F5 — CLAUDE.md and keybindings.json are already byte-identical ×3

```
$ md5 -q ~/.claude{,-thg-fgreen,-thg-doorbell}/CLAUDE.md | sort -u | wc -l        → 1
$ md5 -q ~/.claude{,-thg-fgreen,-thg-doorbell}/keybindings.json | sort -u | wc -l → 1
```

Confirms GENESIS §4's md5 note and extends it to `CLAUDE.md`. First `deploy` is a
no-op-equivalent for content: nothing is at risk of being lost, only relinked.

### F6 — A skill's directory name must equal its frontmatter `name`

Methodology trap, and a live constraint on Stage B if 01 chooses skills delivery for
mantles. Directory `spike-skill/` holding `name: spike-skill-quokka` was silently ignored
in both the control and the symlink arm (`SKILL_QUOKKA: NO`). Renaming the directory to
`spike-skill-quokka/`, changing nothing else, flipped both arms to YES.

Silent rejection, no warning. If mantles ship as skills, `deploy` should assert
dirname == frontmatter name, or a misnamed mantle vanishes without a word.

### F7 — Layout recommendation: symlink the whole directory, not each member

Both work (F2). Whole-dir wins on least-magic and least-maintenance: one link per target,
and a new file added to `canon/agents/` appears in all three accounts with **no redeploy**.
Per-member symlinking requires `deploy` to reconcile additions and deletions — i.e. exactly
the sync engine the brief forbids.

The tradeoff to accept knowingly: a whole-dir symlink makes account-local additions
impossible — anything dropped into `$D/agents/` lands in the canon repo as an untracked
file. Under D1 (canon is the single source of truth) that is the desired behaviour, and
`check` reporting untracked files in `canon/` turns the leak into a visible signal rather
than a surprise. Recommend `deploy` symlink whole dirs and `check` flag untracked canon files.

### F8 — `agents/` and `skills/` symlinks proven at **user scope**, in a live config dir

Felix approved a bounded live test. Run in `~/.claude-thg-doorbell` (see F9 for why not
fgreen), both layouts, probed via `claude -p` with `CLAUDE_CONFIG_DIR` inherited:

```
$ mkdir -p $D/agents $D/skills                                    # F4: nothing displaced
$ ln -sfn $SPIKE/canon/agents/spike-tier-zebra.md $D/agents/spike-tier-zebra.md
$ ln -sfn $SPIKE/canon/skills/spike-skill-quokka  $D/skills/spike-skill-quokka
$ ( cd $SPIKE/work && claude -p --model sonnet '…AGENT_ZEBRA…SKILL_QUOKKA…' )
1) AGENT_ZEBRA: YES
2) SKILL_QUOKKA: YES

$ rm -f $D/agents/spike-tier-zebra.md $D/skills/spike-skill-quokka && rmdir $D/agents $D/skills
$ ln -sfn $SPIKE/canon/agents $D/agents                           # whole dir symlinked
$ ln -sfn $SPIKE/canon/skills $D/skills
$ ( cd $SPIKE/work && claude -p --model sonnet '…' )
1) AGENT_ZEBRA: YES
2) SKILL_QUOKKA: YES
```

Both accounts were restored and verified clean afterwards:

```
fgreen:   agents=absent skills=absent CLAUDE.md md5=7c9e776e… keybindings md5=7a5ad5fd…
doorbell: agents=absent skills=absent CLAUDE.md=regular md5=7c9e776e… keybindings md5=7a5ad5fd…
```

`agents/` and `skills/` are settled: **whole-dir symlink, user scope, proven.** F2 remains
the evidence for `CLAUDE.md`, at project scope only — see U1.

### F9 — `~/.claude-thg-fgreen` does not authenticate from a non-interactive subprocess

Discovered while trying to run F8 in the idle account, and it is not a spike artefact:

```
$ CLAUDE_CONFIG_DIR=~/.claude-thg-fgreen claude -p --model sonnet '…'
Not logged in · Please run /login
```

The same command against `~/.claude-thg-doorbell` authenticates fine. There is one
keychain item for all three accounts (F1), no `.credentials.json` in any config dir, and
no token in the environment — the child shell carries only `CLAUDE_CONFIG_DIR`,
`CLAUDE_CODE_SESSION_ID`, `CLAUDECODE` and friends. The most likely reading is that the
single `Claude Code-credentials` item currently holds doorbell's token, and fgreen has no
usable credential from a fresh process.

**Not proven:** whether an *interactive* `a-thg-0` session still works (it may unlock
keychain differently, or prompt). fgreen's `history.jsonl` was live at 20:54 today, so it
was working recently. **Worth Felix checking** — if `a-thg-0` is silently logged out, the
three-account quota strategy is down a third and this spike found it by accident. It also
matters to Stage B's DoD, which requires a smoke-summon **per account**: that step cannot
pass on fgreen until its auth is sorted.

### Open — blocked, needs Felix to run two commands

The permission classifier permits *additive* writes to a live config dir but refuses to
**displace an existing file** there. That leaves exactly two tests unrun. Both are scripted,
with backups taken and a restore trap, at
`$SPIKE/displacement-test.sh` — run it and paste the output.

- **U1 — user-scope `CLAUDE.md`.** F2 proves the loader follows symlinks at project scope;
  the config-dir file itself was never swapped. Same loader, so the inference is strong —
  but this spike trades in proof. T1 in the script symlinks the config-dir `CLAUDE.md` to a
  canon copy carrying the codeword `MARMOSET-3310` and asks for it back.
- **U2 — `keybindings.json`.** No verdict at all: no project-scope equivalent, and a keypress
  cannot be driven through `claude -p`. T2 symlinks a deliberately **malformed**
  `keybindings.json` and greps debug output — a surfaced parse error proves the file was read
  through the link. If T2 comes back silent it is *inconclusive, not negative*, and the
  fallback is Felix pressing one rebound key in a live session. Until then
  `keybindings.json` must not be assumed symlink-safe just because its neighbours are.

**Stage B is not blocked for `agents/` and `skills/`** (proven) **or `CLAUDE.md`** (strong
inference, cheap to confirm). Only `keybindings.json` needs its verdict before `deploy` can
pick a mechanism for it — and copy-mode for that one file is a perfectly cheap fallback.

> **Cross-finding (Architect 01, 2026-08-02, folded at review):** user-scope *discovery*
> per `$CLAUDE_CONFIG_DIR/skills/` is proven with a real dir — session 01 planted
> `~/.claude-thg-doorbell/skills/mantle-probe/` and a fresh `claude -p` inheriting that
> config dir invoked it: output `SKILL-OK effort=xhigh` (simultaneously proving
> `${CLAUDE_EFFORT}` substitution, see D12). U1 therefore narrows to: does the
> *user-scope* loader follow a **symlinked** `skills/` / `agents/` / `CLAUDE.md`? The
> bounded fgreen test is still needed for that — and note 01 chose skills delivery
> (D12), so the `skills/` target is live and F6's dirname==name assert belongs in
> Stage B's `deploy`. Canon's five shim dirs already conform.

## Kickoff — Stage A (verbatim)

```
You are a Digger. Read GENESIS.md, then plans/04-sync.md, and run Stage A only.
Append evidence-grade findings under ## Findings; do not build Stage B.
```

## Kickoff — Stage B (verbatim, only after the Architect blesses the spike's verdict)

```
You are a Builder. Read GENESIS.md, then plans/04-sync.md including the spike
findings, and build Stage B to its DoD.
```
