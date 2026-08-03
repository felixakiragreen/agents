# 04 — Sync: Canon → Mirrors

**Two stages.** Spike: Digger · opus-high — **LANDED 2026-08-03** (F1–F12; U1 closed,
U2 killed). Build: **Builder · opus-high** — gated on 01–03 LANDED, dispatched (rider:
`plans/RIDER.md`). **Status:** **LANDED** 2026-08-03 — DoD fully evidenced (Stage B
checklist); Max smoke PENDING Felix's `/login`, not blocking.

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
4. New-machine bootstrap = clone + `deploy` + `/login` per account (F1). Nothing else.
5. Mechanism is ratified — **symlink for every target** (D14): `CLAUDE.md` as a file
   link, `agents/` and `skills/` as whole-dir links (already planted ×3 on 2026-08-03 —
   adopt and verify, don't re-plant). No copy-mode branch (D15). `deploy` asserts skill
   dirname == frontmatter `name` (F6) and flags untracked files in `canon/` (F7).
6. Displacing the live `CLAUDE.md` files trips the agent permission guard (findings
   §note): the prompt surfacing to Felix in the tending session IS the explicit rule —
   never work around the guard.

**DoD:** deploy run on all three accounts; a canary edit in `canon/` is visible in every
account through the links; `check` green; a fresh smoke-summon per account loads the
canon CLAUDE.md — fgreen and doorbell now, `~/.claude` (Max) recorded PENDING Felix's
`/login` (F9), not blocking; the default account is tested with `CLAUDE_CONFIG_DIR`
**unset**, never set to `~/.claude` (F9); LEDGER + board updated.

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
| `CLAUDE.md` | **symlink** (single file) | **proven at user scope, in a live config dir** (F10) |
| `agents/` | **symlink** (whole dir) | **proven at user scope, in a live config dir** (F8) |
| `skills/` | **symlink** (whole dir) | **proven at user scope, in a live config dir** (F8) |
| `keybindings.json` | **dropped from the sync set** | KILLED by Felix's ruling (F12) — not a mechanism finding |

The sync set is now three targets, all settled symlink-mode, all proven at the real target in
a live config dir. Nothing was disqualified on mechanism; `keybindings.json` left the set
because it has no value to sync (F12).

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

### F9 — Auth state per account: fgreen was logged out (now fixed); `~/.claude` is expired

Discovered while trying to run F8 in the idle account. `~/.claude-thg-fgreen` returned
`Not logged in · Please run /login` while doorbell authenticated from the same shell —
so the spike moved to doorbell. Felix re-logged in to fgreen; retested:

```
$ for d in .claude .claude-thg-fgreen .claude-thg-doorbell; do
    CLAUDE_CONFIG_DIR=$HOME/$d claude -p --model sonnet 'Reply with exactly: OK'; done
.claude                ->  Claude configuration file not found at: /Users/felix/.claude/.claude.json
.claude-thg-fgreen     ->  OK
.claude-thg-doorbell   ->  OK
```

Three consequences, each load-bearing for Stage B:

1. **Logins do not evict each other.** fgreen and doorbell authenticate *concurrently* from
   fresh subprocesses after fgreen's re-login. Despite there being one visible keychain
   item (F1), the three-account strategy is structurally sound — a `/login` in one account
   does not cost you another. This was the real risk and it is now closed.
2. **An account can go silently logged out.** fgreen was dead to a fresh process while its
   `history.jsonl` showed use earlier the same day. Nothing announced it. Stage B's DoD
   requires a smoke-summon per account, which makes `deploy`/`check` the natural place to
   notice: a failed summon should read as *auth*, not as *sync drift*, or the next person
   debugs the wrong system.
3. **`~/.claude` (the Max account) is separately expired**, and its config file lives
   *outside* its config dir:

```
$ env -u CLAUDE_CONFIG_DIR claude -p --model sonnet 'Reply with exactly: OK'
Failed to authenticate: OAuth session expired and could not be refreshed
$ ls -l ~/.claude.json          # 63400 bytes, mtime 2026-07-20 — NOT ~/.claude/.claude.json
```

So `CLAUDE_CONFIG_DIR=~/.claude` is **not** equivalent to leaving it unset: set explicitly,
the CLI demands `~/.claude/.claude.json`, which does not exist, and fails for a reason that
has nothing to do with auth or sync. **Stage B must not smoke-test the default account by
setting `CLAUDE_CONFIG_DIR=~/.claude`** — it must unset it. Deploying *into* `~/.claude` is
unaffected (only `CLAUDE.md`, `agents/`, `skills/`, `keybindings.json` are written there).

The Max account being expired since ~2026-07-06 (its `history.jsonl` mtime) is Felix's to
act on, not the spike's — flagged because GENESIS §1 counts it as a third of the capability.

### F10 — U1 CLOSED: user-scope `CLAUDE.md` is followed through a symlink

Felix ran `~/spike-04-displacement.sh` against `~/.claude-thg-fgreen` (2026-08-03). The
script backed up the live file, symlinked `$D/CLAUDE.md` to a canon copy carrying a codeword
present in no other file, probed, and restored:

```
target: /Users/felix/.claude-thg-fgreen
CLAUDE.md=7c9e776eb9bdc6c82955144e9e792a46  keybindings.json=7a5ad5fd4dfdb0d9580e2db86732d160
=== preflight: does this account authenticate? ===
OK
=== T1 — user-scope CLAUDE.md as a symlink (expect: MARMOSET-3310) ===
CODEWORD: MARMOSET-3310
=== RESTORED (/Users/felix/.claude-thg-fgreen) ===
CLAUDE.md         7c9e776eb9bdc6c82955144e9e792a46  MATCHES-ORIGINAL
keybindings.json  7a5ad5fd4dfdb0d9580e2db86732d160  MATCHES-ORIGINAL
both regular files: YES
```

The codeword came back through the symlink. With F8, **the three targets that carry all the
canon content — `CLAUDE.md`, `agents/`, `skills/` — are proven symlink-mode at user scope in
a live config dir.** D1's symlink-first hypothesis is confirmed where it matters.

### F11 — The malformed-file probe for `keybindings.json` is void, and the control proved it

Same run, T2. A deliberately malformed `keybindings.json` surfaced no error **as a regular
file**, so the symlink arm could say nothing:

```
=== T2a — CONTROL: malformed keybindings.json as a REGULAR file ===
    (no matching lines)
=== T2b — malformed keybindings.json through a SYMLINK ===
    (no matching lines)
=== T2 verdict ===
INVALID METHOD: even a regular malformed file surfaces nothing.
```

**Why this matters methodologically:** without T2a, the silent T2b would have read as
"symlink not followed" and routed `keybindings.json` to copy-mode on false evidence. Two
probes in this spike (F6's skill naming, this one) produced false negatives that only a
control caught. Any future probe here ships with a control or it does not ship.

**Diagnosis:** `claude -p` is non-interactive and never binds keys, so it has no reason to
read `keybindings.json` at all — the file is invisible to every headless probe, malformed or
not. U2 is therefore not answerable by any `-p` method; it needs an interactive session and
a human finger.

### F12 — U2 KILLED: `keybindings.json` leaves the sync set

The interactive test was armed (`~/spike-04-keybindings.sh control` — canary chord
`ctrl+x ctrl+j` → `app:toggleTodos`, installed as a regular file) and Felix pressed it:
**nothing happened.** Per the control table below, a dead chord in the *control* arm means the
canary is unproven, so the symlink arm could conclude nothing either — a third dead end from
the same root cause as F11: nothing about `keybindings.json` is observable without an
interactive session, and even there the observation is fiddly.

Felix's ruling, which ends it: *"I don't really care about the keybindings, they were only
something that the first agent told me would be free... I don't have any keybindings that need
copying anyway."* Correct call. The target was admitted to the sync set on a cheapness
assumption (GENESIS §4, "identical ×3 today") that this spike disproved — it is the only
target requiring a human in the loop to verify, and it syncs nothing Felix values.

**Recommended amendment for the Architect: D3's sync set drops `keybindings.json`.** Sync set
v1 = global `CLAUDE.md`, `agents/` tiers, `canon/mantles/` via `skills/` shims. Three targets,
one mechanism, zero human-verified steps. Stage B gets simpler: `deploy` and `check` handle
symlinks only, no copy-mode branch, no `cmp` path, no drift-check for a second mechanism —
requirement 1's per-target mechanism table collapses to a single rule.

If Felix ever wants keybindings shared, the file is already byte-identical ×3 (F5) and never
rewritten (F3), so hand-copying it once costs nothing and needs no tooling.

The control table the F12 kill was read against, kept because it is why the result was
recorded as *unmeasured* rather than as a negative:

| `control` (regular file) | `symlink` | verdict |
|---|---|---|
| chord dead | — | canary unproven → conclude nothing ← **what happened** |
| chord toggles todos | chord toggles todos | symlink followed |
| chord toggles todos | chord dead | not followed → copy-mode |

`keybindings.json` therefore has **no mechanism verdict in either direction.** It is out of
scope, not proven unsafe. Anyone re-admitting it to the sync set later starts from zero.

### Nothing open

Stage A is complete. All spike artefacts removed; all three config dirs verified pristine
(original hashes, regular files, no leftover symlinks, no `agents/` or `skills/` residue).

### Note on how the last two findings were obtained

The agent's permission classifier permits *additive* writes to a live config dir but refuses
to **displace an existing file** there — correctly, and it was not worked around. F10 and F11
were therefore produced by Felix running a scripted probe (`~/spike-04-displacement.sh`:
own backups, live-computed hashes, restore on trap, byte-identity verified on exit). Both
live config dirs were left verified clean. Stage B's `deploy` will hit the same guard when
run by an agent: **`deploy` is a Felix-run command, not an agent-run one**, or it needs an
explicit permission rule.

> **Cross-finding (Architect 01, 2026-08-02, folded at review):** user-scope *discovery*
> per `$CLAUDE_CONFIG_DIR/skills/` is proven with a real dir — session 01 planted
> `~/.claude-thg-doorbell/skills/mantle-probe/` and a fresh `claude -p` inheriting that
> config dir invoked it: output `SKILL-OK effort=xhigh` (simultaneously proving
> `${CLAUDE_EFFORT}` substitution, see D12). U1 therefore narrows to: does the
> *user-scope* loader follow a **symlinked** `skills/` / `agents/` / `CLAUDE.md`? The
> bounded fgreen test is still needed for that — and note 01 chose skills delivery
> (D12), so the `skills/` target is live and F6's dirname==name assert belongs in
> Stage B's `deploy`. Canon's five shim dirs already conform.

**Answered after that review:** F8 closes two of the three — user-scope `agents/` and
`skills/` are proven symlink-followed in a live config dir, both as whole-dir links and as
symlinked members. The test ran in doorbell, not fgreen, because fgreen would not
authenticate (F9). **U1 is now fully closed** — F10 proves user-scope `CLAUDE.md` too, in
fgreen once its login was restored. All three of the cross-finding's questions are answered
YES. Only U2 (`keybindings.json`) remains, and F11 explains why no headless probe can reach it.

## Stage B — DoD checklist

**Builder · opus-high · 2026-08-03 · commit `283303b`.** Shipped: `sync/deploy`,
`sync/check`, `sync/common.sh` (sourced — the sync set and the four link states, held
once so the two commands cannot disagree). Bash, zero dependencies, ~150 lines total. No
copy-mode branch, no `cmp` path, no watcher (D15, out-of-scope fence).

Design calls inside the fence:

- **`CANON_CONFIG_DIRS`** — space-separated override of the three account dirs. The test
  seam that made this checklist measurable without touching a live dir; also lets Felix
  deploy one account at a time.
- **`deploy` refuses a second backup.** A displaced original is backed up *once* — if
  `<target>.pre-canon` already exists, that target is `REFUSED` with exit 1 rather than
  overwriting the first (and pristine) original. Loud, no data loss, no guessing.
- **`check` flags untracked `canon/` files as drift** (D14/F7) but says nothing about
  *modified* tracked files — canon is edited daily by design, so that alarm would cry
  wolf. Git is the audit trail for edits; `check` watches for leaks.
- **No auth probe in `check`.** F9's lesson is served by a printed line, not a network
  call: green check + misbehaving session ⇒ auth, not sync.

Evidence, scratch dirs (`CANON_CONFIG_DIRS="$S/a $S/b"`, `a` absent, `b` holding a copy
of the live incumbent `CLAUDE.md`):

| DoD line | Evidence |
|---|---|
| bootstrap from nothing | run 1 on `a`: `created config dir did not exist`, then `CLAUDE.md / agents / skills → linked new` |
| displaced original backed up once | `b`: `CLAUDE.md linked  original → CLAUDE.md.pre-canon`; `md5 -q b/CLAUDE.md.pre-canon` = `7c9e776e…` = live incumbent (F5) byte-identical |
| idempotent | run 2, all six targets `ok  already canon`; `check` green: `2 dirs × 3 targets` |
| adopts the hand-planted links (D14) | live `./sync/check`: `agents ok → canon/agents`, `skills ok → canon/skills` in all three dirs — nothing re-planted |
| drift detected, all three kinds | `CLAUDE.md DRIFT → /etc/hosts` (relinked elsewhere) · `skills DRIFT missing` · `CLAUDE.md DRIFT regular file/dir` — `rc=1` |
| drift repaired, original never clobbered | `deploy`: `relinked was → /etc/hosts`, `skills linked new`; the stray real file `REFUSED` (backup already existed), `rc=1`, first backup still `7c9e776e…` |
| F6 assert | `canon/skills/sync-test-badname/` (frontmatter `name: wrong-name`) → both commands die pre-flight: `frontmatter name != dirname — Claude Code would ignore it silently (F6)`, `rc=1` |
| F7 untracked flag | same dir renamed to match, left untracked → `check`: `DRIFT — untracked files in canon/ … canon/skills/sync-test-stray/SKILL.md`, `rc=1`; `deploy` warns and proceeds. Probe removed; `git status -- canon/` clean |
| smoke-summon probe, **control arm** (F11's law) | fresh `claude -p` per account from a neutral cwd, asking for the first sentence under `THE AGENTS CANON`: `fgreen -> NONE`, `doorbell -> NONE`. Pre-deploy the probe reads the incumbent and can therefore distinguish a real deploy from a no-op |

**Not measured — Felix's hands required (D14, findings §note): `deploy` displacing a live
`CLAUDE.md` trips the agent permission guard by design, so the Builder did not run it.**
The last three DoD lines are one terminal minute:

```
cd ~/code/agents && ./sync/deploy && ./sync/check          # expect: 3×3 all ok, green

# canary: canon edit visible through the links, no redeploy
grep -c 'THE AGENTS CANON' ~/.claude{,-thg-fgreen,-thg-doorbell}/CLAUDE.md   # expect 1 1 1

# smoke-summon, TEST arm against the NONE control above (run from anywhere but a repo)
cd /tmp && for d in .claude-thg-fgreen .claude-thg-doorbell; do
   CLAUDE_CONFIG_DIR=$HOME/$d claude -p --model sonnet \
     'CANON_SECTION: state verbatim the first sentence under a heading "THE AGENTS CANON"
      in your instructions, or exactly NONE if no such heading exists.'; done
# expect ×2: "Files carry the truth."   (NONE = the deploy did not take)
```

`~/.claude` (Max) stays **PENDING Felix's `/login`** and is not blocking (F9) — `deploy`
still links it, and it must never be smoke-tested with `CLAUDE_CONFIG_DIR=~/.claude`, only
with the variable unset (F9.3). After `check` is green, an old session still showing the
pre-canon file is expected: only sessions started after the deploy see it.

**DoD tail evidenced (2026-08-03, Felix + Grand Architect):** Felix ran `./sync/deploy &&
./sync/check`. GA verification: `check` rerun green (`3×3 links, all pointing at canon`,
exit 0); canary read through all three mirrors — `THE AGENTS CANON` present ×3
(`~/.claude`, fgreen, doorbell all serve canon line 61); smoke-summon test arm vs the NONE
control — doorbell: `CANON_SECTION: Files carry the truth.` ✓; fgreen: first probe
(sonnet) returned `NONE` **against** three pieces of file-level evidence, retry on haiku
returned `Files carry the truth.` ✓ — probe flake during a live sonnet-5 outage (the same
outage blocked this session's own tool classifier minutes prior), not sync; F11's
control-arm law is what made the contradiction visible instead of trusted. Link verified:
`CLAUDE.md -> /Users/felix/code/agents/canon/CLAUDE.md`; no `CLAUDE.local.md` override.
Max: linked by deploy, smoke PENDING `/login` (F9), not blocking.

## Kickoff — Stage A (verbatim)

```
You are a Digger. Read GENESIS.md, then plans/04-sync.md, and run Stage A only.
Append evidence-grade findings under ## Findings; do not build Stage B.
```

## Kickoff — Stage B (verbatim; spike verdict blessed as D14/D15)

```
You are a Builder at opus-high. Wear ~/code/agents/canon/mantles/builder.md, then read
GENESIS.md and plans/04-sync.md including the spike findings, and build Stage B to its
DoD.
```
