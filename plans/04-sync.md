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

*(spike appends here, evidence-grade)*

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
