# B22 — hands hygiene

**Status:** LANDED 2026-08-30 — five candidates paid and evidenced; one bar (b17 ×2 green) and the predecessor probes left at the ⬡ budget ceiling, 6 of 6 real turns spent · (re-laid 2026-08-30 at G5 — the hands narrowed to the summon
fallback + shelf, D22 r2/r4; B25's surviving half folds in per its fate
clause; the original lay is git history) · **Depends on:** — · **Staffing:**
Builder · opus-high · **Blessed:** ✓ Felix 2026-08-30 (the rework blessing)

## Goal

Correctness debts on the surviving hands, paid at the cause. Summon-to-
terminal is the fallback viewport (D20) and the shelf resumes anything — what
ignites panes still ignites them right: no false trust refusals, no ref
misdeliveries, no test writes into the live audit, and an ignition that lands in
the workspace Felix keeps for the building (B25's fold — ruled at G5 per the
fate clause: the surviving placement scope is one candidate here, not a row).

## Inputs — read before building

- **Candidate 1 — the trust flip.** B12 E1's class: a trust read that
  short-circuits on an auto-created `false` entry refuses a venue that
  demonstrably works. The read now has ONE home in the city:
  `v3/engine/venue.ts` (C14 F6) — verify the class there (short-circuit on
  `true` only; `false` falls through to later evidence), and pin §5's
  agreement (trust from `~/.claude/.claude.json`, never the legacy file) in
  the same test. `~/code/b7-founding-probe` reads `false` today and works —
  it is the regression fixture; Felix clears the scratch trust entries by
  his hand after this lands.
- **Candidate 2 — the UUID sweep.** P6 F2 ruled city-wide at G2: address by
  UUID wherever one exists; a ref is legal only inside the breath that
  created it. `attemptIgnite`'s post-create addressing still rides refs
  (B18 F7).
- **Candidate 3 — the b17 probe.** Compare per (account, bucket); `shut()`
  in `finally` (B11 F8 + B16's addendum, ruled at G2).
- **Candidate 4 — the audit anchor.** One B19 test path appends
  scratch-building inbox lines to the LIVE `hands.jsonl` — measured at G2
  (240 → 242) and re-confirmed at C19 F6 (two lines during the two-lane
  batch). Pin its `CENSUS_DIR`.
- **Candidate 5 — the runbook, not the run.** B14 F1: `PermissionRequest` is
  a real hook event the census is not subscribed to. Subscribing is a
  Felix-run ritual (D14); this row writes the exact settings diff +
  verification; **Felix runs it at G6** (the rework close — G3 died).
- **Candidate 6 — placement (B25's fold).** The ignition knows the building; the
  census keys by cwd alone. Building-homed placement: the workspace found by
  **name** via B18's socket read, addressed by **uuid** once found, minted
  only when none exists — a minted one named for the building, never
  `workspace:N`. Ambiguity never blocks and never guesses between his
  workspaces: two matches ⇒ mint fresh + audit the ambiguity (D10's
  spirit). **The ignited-for building rides the ignition:** census join sid →
  ignited-for building outranks cwd for Belvedere-ignited sessions; hand-ignited keep
  cwd (`buildingOf` stays the fallback). Retirement: only a workspace
  Belvedere minted AND empty at landing (D55); one Felix touched is his,
  forever. The halves are severable: if the name→uuid join proves unstable
  (B18's read says it is not), placement falls back to mint and attribution
  lands regardless — escalate the join, never fuzzy-match.

## Spec

1. `engine/venue.ts`: the flip fixed with a red-before/green-after regression
   pinning `b7-founding-probe`; an actually-untrusted venue still refuses
   loudly.
2. `attemptIgnite`: every post-create cmux call addresses by uuid (read back
   from the create or `cmux tree`); the audit records the uuid it drove.
3. `lab/b17/probe.ts`: per-(account, bucket); `shut()` in `finally`; green
   against the live rig ×2.
4. The B19 path pinned to scratch `CENSUS_DIR`; the suite asserts a full run
   leaves the live audit byte-identical.
5. `plans/permissionrequest-runbook.md`: diff + gesture + verification,
   written for Felix's hand at G6, touching no live config itself.
6. Placement + attribution per candidate 6, on the summon fallback's path.

## Done when:

- [x] **Trust:** the class is pinned where the read lives, red-before/green-after,
  and an untrusted venue still refuses loudly.

  ```
  $ bun -e 'trustedDirs/trusts against the live personal account'
  configJson: /Users/felix/.claude/.claude.json      trusted count: 9
    entry "/Users/felix/code"                    true
    entry "/Users/felix/code/b7-founding-probe"  false
  probe trusted: true                    # venue.ts: the `false` never vetoes the `true` above it
  $ bun test test/venue.test.ts          # v3/engine
  9 pass · 0 fail · 41 expect() calls
  ```

  The RED is the flipped read carried in the test itself (`flipped()`), so the two
  answers are measured side by side on one record: `trusts → true`,
  `flipped → false`, same file, same cwd. §5's agreement is pinned in the same
  file — an account keeping BOTH `<dir>/.claude.json` and `<dir>.json` is answered
  from the inside one, and `configJson(ACCOUNTS.personal)` is asserted to be
  `/Users/felix/.claude/.claude.json`. **F1** names the second home the charge did
  not know about, fixed in the same commit.

- [x] **UUID:** every post-create call addresses by uuid; the audit carries no refs.

  ```
  PASS  with no matching workspace, the first ignition mints one NAMED FOR THE BUILDING — never `workspace:N`
        receipt: {"workspace":"9E3E4279-D28B-41A3-88D5-7CAF66BCA794","minted":true,"home":"b22-probe-home",…}
        the receipt's every id is a uuid — no ref survived the breath that made it (P6 F2)
  ```

  Live, three ignitions, and the assertion is a grep over the whole receipt for
  `workspace:N`/`surface:N`. The one place a ref can exist is named at its site and
  converted inside the same breath (`mint()` → `uuidOfList`, `land()` →
  `uuidOfRef`), because `cmux workspace create` and `new-surface` print refs and
  **ignore `--id-format both`** — measured. An unknown ref converts to `null` and
  refuses rather than delivering to the focused workspace (`uuidOfList`, pinned).
  **F3** is the class the sweep found next door and cost two runs to see.

- [ ] **Probe ×2 consecutive green** — **NOT MET, at the budget ceiling (⬡).** One
  run, 8 of 11 bars green; three failures diagnosed and all three fixed, unrun. The
  ceiling is 6 real turns and 6 were spent (§the budget, below), so the second run
  is a ⬡-fork this session did not take.

  ```
  PASS  usage is LIVE ×3 accounts and matches the rig's own `_summon_usage_delta` — per (account, bucket), 9 of 9
        keys compared (9, the union of both sides): personal fable, personal sess, personal week,
          thg-doorbell fable, thg-doorbell sess, thg-doorbell week, thg-fgreen fable, thg-fgreen sess, thg-fgreen week
        rig : … | thg-doorbell sess — | …
        deck: … | thg-doorbell sess — | …
        disagreements: none
  ```

  **The per-(account, bucket) comparison is the charge's own item and it is green** —
  and note `thg-doorbell sess —`, the null cell that the positional comparison this
  replaces dropped on the floor (**F2**). `shut()` was already in `finally`; what was
  missing was a proof, and the induced drill is it, at zero quota:

  ```
  $ B17_INDUCE=throw bun lab/b17/probe.ts
  # B17_INDUCE=throw — holding workspace:32 / 89FC3433-3BC4-414F-88AD-1D23050F366F; throwing now
  FAIL  the probe itself threw
        induced mid-run failure — the workspace above must be closed by shut() in `finally`
  # closing 89FC3433-3BC4-414F-88AD-1D23050F366F: OK workspace:32
  $ cmux workspace list | count            # 15 total; no probe leftovers
  $ ls -d /tmp/b17-probe-*                 # No such file or directory
  ```

- [x] **Audit anchor:** two full suite runs, the live audit byte-identical across both.

  ```
  $ wc -c ~/code/agents/summon/log/census/hands.jsonl
  before:      160545 bytes
  run1: 608 pass · 0 fail · Ran 608 tests across 26 files. [2.42s]
  after run 1: 160545 bytes
  run2: 608 pass · 0 fail · Ran 608 tests across 26 files. [2.37s]
  after run 2: 160545 bytes
  HALT: No such file or directory
  ```

  Fixed at the cause and at the door: `desk.test.ts` anchors `CENSUS_DIR`, and
  `interlock()` makes the class unreproducible — under `bun test` a write aimed at
  the live neighbourhood throws and names the knob. **The interlock's own first cut
  missed `haltFlag()` and armed the real HALT from its own test run** (B8 F1,
  reproduced by the hand writing the guard); cleared, and the guard now covers
  `dirname(LIVE_CENSUS)` rather than the census dir alone. **F4.**

- [x] **Runbook on file for G6:** `plans/permissionrequest-runbook.md` — the diff, the
  one command, four verifications, the back-out. It touches no live config, and the
  ritual is one command rather than three hand-edits because `deploy.ts` now
  recognises its own install:

  ```
  $ bun belvedere/census/deploy.ts --check
     hook           ok        probed live — emits an F6 record, exit 0
     personal       DRIFT     ours, 10 events → 11 — re-merge will bring the event set forward
     thg-fgreen     DRIFT     ours, 10 events → 11 — re-merge will bring the event set forward
     thg-doorbell   DRIFT     ours, 10 events → 11 — re-merge will bring the event set forward
  DRIFT — 3 account(s) not at this event set. Fix with deploy.ts (Felix-run).
  ```

  **F5** is why that row used to read `REFUSED` instead.

- [x] **Placement**, every clause — evidence split across two runs of
  `lab/b22/placement.ts` and one live inspection, because the landing bar found a
  bug (F3) and the re-run had to fit the ceiling.

  Full run (mint · ambiguity · housing · retirement):

  ```
  PASS  with no matching workspace, the first ignition mints one NAMED FOR THE BUILDING — never `workspace:N`
        cmux now carries 1 workspace named "b22-probe-home": workspace:37/9E3E4279-…
  PASS  two workspaces wearing one name is an ambiguity: mint fresh, audit it, touch neither of his (D10's spirit)
        the audit says: {"action":"ignite.ambiguous","result":"2 workspaces are named \"b22-probe-home\"
          (9E3E4279-…, A4B33A23-…) — minted fresh rather than guess"}
        tabs untouched: 9E3E4279 1 → 1 · A4B33A23 1 → 1
  PASS  a Belvedere-ignited session at the REPO ROOT houses under the building it was ignited FOR (B25 §2)
        ignited  architect-b22-04 (the audit says agents/belvedere) → housed "agents/belvedere"
        control  mentat-b22-01 (Belvedere never ignited it)       → housed "agents"
  PASS  and all three surfaces read that one field: City, Workshop, and the queue
        City     : agents/belvedere live 1 · waiting badge 1   |   agents live 1 · waiting badge 1
        Workshop : ?b=agents/belvedere → "agents/belvedere" · waiting badge 1
        queue    : 37 item(s) — agents/belvedere 1, agents 1
  PASS  a minted workspace something was added to is left standing — it has been touched, so it is his
        retire(9E3E4279…) → {"ok":false,"error":"… holds 2 surfaces — something was added to it,
          so it is Felix's now and stays standing"}
  PASS  a workspace we minted and nothing was added to retires cleanly, audited (D55)
        retire(D1146655…) → {"ok":true,"result":{"workspace":"D1146655-…","surfaces":1}}
  PASS  a workspace the audit does not record as OUR mint is never closed, whatever its state
        retire(805A9422… "Group 2") → {"ok":false,"error":"… is not in the audit as a workspace
          Belvedere minted — it is Felix's"}
  PASS  every retirement — refusals and closes alike — is in the audit          (3 retire lines)
  ```

  Landing, after F3's fix (`B22_ONLY=land`, one ignition):

  ```
  PASS  a second ignition lands in the workspace already there — uuid-addressed, one more tab, no second mint
        receipt: {"workspace":"E32D77B8-…","minted":false,"home":"b22-probe-home","surface":"B491E26D-…"}
        tabs in E32D77B8-…: 1 → 2
        workspaces named "b22-probe-home": still 1 — the name→uuid join landed it, nothing was minted
  ```

  And **the real case, in Felix's own workspace** — the b17 probe's ignition for
  `agents/belvedere` at the repo root, read off the live socket before it was closed:

  ```
  $ cmux list-pane-surfaces --workspace F9A4AEED-…  # the `belvedere` workspace he keeps
    surface:3    FF2F95BF-…  bun belvedere
    surface:52   FF3F6572-…  ✳ architect-belvedere-09
    surface:62   2D5AC629-…  ✳ architect-belvedere-10
    surface:65   C94DDA21-…  ✳ architect-belvedere-11
  * surface:70   782647C0-…  ◑ architect-belvedere-12  [selected]
    surface:101  07CB653A-…  builder-belvedere-78          ← the ignition, as a tab, beside his own
  $ cmux close-surface --workspace F9A4AEED-… --surface 07CB653A-…   # D55
    OK surface:102 workspace:2                                        # 15 workspaces, as before
  ```

  The field report's own case, closed: it joined the workspace he keeps instead of
  minting a sixteenth beside it, and the tab wears the stamp while the workspace
  wears the building.

- [x] **`bun v3/gates.ts --glass` ALL GREEN.** Predecessor probes: **not run** — see
  the budget note. Every workspace this bar minted is closed by it (verified above:
  15 workspaces before and after, no `b17-`/`b22-` leftovers, no temp trees).

  ```
  | gate | result | counts | wall | exit |
  |---|---|---|---|---|
  | engine · suite | PASS | 80 pass · 0 fail | 24.6s | 0 |
  | barrage · suite | PASS | 41 pass · 0 fail | 23.9s | 0 |
  | fake-claude · suite | PASS | 60 pass · 0 fail | 10.3s | 0 |
  | console · suite | PASS | 30 pass · 0 fail | 1.6s | 0 |
  | engine · types | PASS | 0 errors | 0.1s | 0 |
  | barrage · types | PASS | 0 errors | 0.1s | 0 |
  | fake-claude · types | PASS | 0 errors | 0.1s | 0 |
  | console · types | PASS | 0 errors | 0.1s | 0 |
  | gates · types | PASS | 0 errors | 0.1s | 0 |
  | glass · suite | PASS | 608 pass · 0 fail | 2.3s | 0 |
  | glass · types | PASS | 0 errors | 0.2s | 0 |
  | barrage | PASS | 1000 runs · 50 cuts · 9/9 mutants | 149.9s | 0 |

  ALL GREEN — 12 gates, wall 213.2s
  ```

### The budget (D21) — spent, to the turn

**6 of 6 real turns. The ceiling is reached and was not exceeded.**

| run | ignitions that reached a first user turn |
|---|---|
| `lab/b22/placement.ts`, run 1 | 2 — the mint and the ambiguity mint (the landing died before it typed anything) |
| `lab/b22/placement.ts`, run 2 | 2 — same two (the landing died again, at F3's second face) |
| `lab/b22/placement.ts B22_ONLY=land` | 1 — the landing |
| `lab/b17/probe.ts` | 1 |
| `B17_INDUCE=throw`, and every socket experiment | **0** — a workspace with no `--command` spawns no session |

Everything else was measured against workspaces created with no command, which cost
nothing: the `rename-tab` diagnosis, the `read-screen` diagnosis, the priming loop,
and the induced-failure drill. **The two ⬡-forks the ceiling leaves open** — the
b17 probe's second consecutive green run, and a full `lab/b22/placement.ts` run
after F3's fix (both are re-runs of code already fixed, ~4 turns together).

## Out of scope

- Running the PermissionRequest deploy (Felix's, at G6); clearing the trust
  entries (Felix's, after this lands); rehoming existing sessions
  retroactively; per-step workspace fields; any widening of the hands' write
  surface.

## Findings

**F1 — the trust flip's home was not where the charge said, and the charge's own
named home never had it.** Candidate 1 sends the fix to `v3/engine/venue.ts` on C14
F6's word that the read has ONE home in the city. `venue.ts` has been correct all
along — `trustedDirs()` keeps only `hasTrustDialogAccepted === true` entries and
`trusts()` ancestor-matches over that list, so a `false` is invisible rather than
vetoing. The flip is alive in the **second** home, `glass/trust.ts`, which the
composer's warm/cold badge reads:

```
const own = t.roots.get(project.path);
if (own === true)  return { warm: true,  root: project.path, project };
if (own === false) return { warm: false, refused: project.path, project };   // ← the flip
```

Measured against the live personal account: `~/code` is `true`,
`~/code/b7-founding-probe` is `false`, and B7 F1 measured that ignition reaching its
first user turn and beating the census ten times — so `glass/trust.ts` would render
a venue cold that demonstrably works. Fixed there to the same law
(**only `true` decides; `false` is a note, never a veto**), and `false` survives as
the *reason* a target nothing warm covers is cold. `composer.test.ts`'s existing
refusal cases were untouched by the change and stayed green, because all of them are
**repositories** — a repo consults nothing above its own root either way. C14 F6's
sentence is true of the engine and was read as true of the city; the render-side copy
predates it by a chapter.

**F2 — the b17 probe's usage check was a match by POSITION across accounts, and one
live account already breaks it.** It flattened both sides into nine ordered strings
and compared the joins, so what it asserted was *"the rig prints accounts and buckets
in the deck's order"*. Two ways that lies, and one is live:

```
$ summon-usage
usage    0  sess 5%+9      week 57%+10    fable 56%+11
         1  sess 1%+87     week 23%+25    fable 35%+13
         2  sess —         week 71%+5     fable 68%+8      ← thg-doorbell, no session window open
```

The regex demanded `\d+%`, so `sess —` was skipped: eight cells against the deck's
nine, and the check fails for a reason that is not disagreement. The other way is
worse and silent — nothing pinned either side's ordering, so a reorder would pair a
figure with the wrong silo and still pass. Now both sides are read into
`account bucket → value` maps and compared key by key over the **union** of the keys,
so a key on one side and not the other is named. Green, and it prints the `—` it used
to drop. **The ruling generalizes past the probe:** any comparison of two lists that
both describe the same set should compare on the key, and any check that hard-codes a
count is asserting a fact about Felix's desktop rather than about the code.

**F3 — a surface handle is resolved INSIDE one workspace, and every surface-addressed
call must name it. B18 F1's law, re-found from the other end, and it cost two runs to
see.** B18 measured this for `focus-panel` and wrote it down; the landing path's five
new calls (`rename-tab`, `send`, `send-key`, `read-screen`, `close-surface`) inherited
the whole class, and only `close-surface` had been written with `--workspace`. The
first placement run said so in cmux's own words, against a uuid that plainly existed:

```
rename-tab failed: cmux rename-tab exited 1: Error: not_found: Workspace not found
```

```
$ cmux rename-tab --surface $SU b22-tab                    → Error: not_found: Workspace not found
$ cmux rename-tab --workspace $WU --surface $SU b22-tab    → OK action=rename tab=tab:85 workspace=workspace:36
```

With `--workspace` omitted cmux resolves the handle in the caller's workspace, then
the selected one — so the failure mode is **not** a refusal but a hit on the wrong
workspace, and a `send` written that way types a launch line into whatever Felix is
looking at. **It is the same shape as P6 F2's ref problem wearing a different id:** a
uuid is unambiguous only once the scope that resolves it is named.

**And the second face of it: `read-screen` on a surface in a workspace nobody has
selected fails outright**, forever, not slowly —

```
$ cmux read-screen --workspace $WU --surface $SU --lines 40    (fresh surface, unselected workspace)
Error: internal_error: Failed to read terminal text          ×6 over 3 s
```

— so the obvious readiness probe ("wait until the shell prints something") never
returns and the ignition times out at its own limit. The terminal has no text to read
until something touches it, and **one `send-key Enter` is enough**: harmless at a
shell prompt, and the read answers on the very next call, first try, measured. That
priming loop is what `shellReady()` does, and the launch line is now read back off
the screen **before** Enter is pressed — characters typed at a shell that was not
listening are lost silently, and an ignition reporting success over a lost line would
be a receipt for a session that does not exist.

**F4 — the interlock written to stop test writes into the live census armed the real
HALT from its own test run.** B8 F1's exact incident, reproduced by the hand writing
the guard against it, in the first cut:

```
$ cat ~/code/agents/summon/log/HALT
2026-08-31T02:32:08.410Z b22-anchor
```

The guard tested `path.startsWith(LIVE_CENSUS)` — and `haltFlag()` is
`dirname(censusDir())/HALT`, a **sibling** of the census directory, not a child. The
neighbourhood is `~/code/agents/summon/log/`; the census is one directory inside it.
Cleared, and the guard now keys on `dirname(LIVE_CENSUS)`. **The lesson is the
containment test itself:** a guard written around "the directory the thing lives in"
misses every anchor derived by walking UP from it, and `paths.ts` derives two that
way (`haltFlag`, and `cityRoot`'s neighbours).

Also measured while this was in flight, and it is why the row exists: the live
`hands.jsonl` grew **156 590 B → 159 176 B → 160 545 B during this batch's own first
hours**, from suite runs in the parallel lanes. `nextStamp` counts that log (B3 F4),
so every one of those lines spent a real name-stamp ordinal.

**F5 — amending `census/hooks.json` locked `deploy.ts` out of every account that
already carried the census, and the only way through was hand-editing three live
config files.** `inspect()` classified any hooks block that did not byte-match the
fragment as `foreign` and refused the **whole run** (correctly, for somebody else's
hooks) — so adding one event to the fragment turned the ritual from one command into
exactly the gesture D14's guard exists to prevent. It now recognises its own install:
a hooks block whose every `command` is this `beat.sh` and nothing else is an
`upgrade`. An upgrade **never backs up** — `settings.json.pre-census` holds the file
as it was before the census existed (all three dated `Aug 27 00:02`), and copying an
already-hooked file over it would replace the only original with a lie about what it
was.

**F6 — two of the b17 probe's assertions had been stale since C22's rename, and the
probe had not been run since.** It greps the client bundle for the string `hands/fire`
to prove the D10 law that one file and only one may reach the ignition wire; C22
renamed the route to `hands/ignite`, so the grep counted **zero everywhere** — the
assertion passed its "every other source is 0" half and failed its "the composer has
at least one" half, which is a check that had quietly stopped protecting anything.
Live counts after the fix: `composer.client.ts` 2, and `deck.client.ts`,
`deck-dom.ts`, `workshop.client.ts`, `works.client.ts` all 0. **A probe that is not
run is a probe that is not true**, and a rename sweep should re-run the probes that
grep for what it renamed.

**F7 — a successful ignition swaps the Chat in before its receipt can be read, so the
b17 probe's receipt poll is a race it now loses.** `composer.client.ts` says the
receipt and calls `swap.to('chat')` in the same breath (C16 §1, *"summoning swaps in
the Chat"*), so the composer's card is gone by the next 200 ms poll:

```
FAIL  the probe itself threw
      timed out waiting for the ignition's receipt
      page says: {"pulse":"25","fault":"no","action":"draftThe Chat's reply box opens with a target."}
```

The `action` pane holding the Chat's draft box **is** the proof the ignition
succeeded — the swap only happens on success — so the probe timed out on a session
that had already started, and then left it running, because its cleanup reads the ids
out of the receipt it never got. (Closed by hand; the desktop is as it was.) The
probe now reads the ignition out of **its own audit line**, which is durable, is what
the DoD cites anyway, and cannot be raced. Unrun after the fix — the ceiling.

**F8 — `--id-format both` is accepted and ignored by `workspace create` and
`new-surface`.** The documented global flag makes every *listing* carry uuids; the two
commands that MAKE things print a ref and only a ref:

```
$ cmux workspace create --name b22-scratch --cwd /tmp --focus false --id-format both
OK workspace:30
```

So "address by uuid, always" cannot mean "never touch a ref" — it means **a ref may
not outlive the breath that created it**. Both mint and land read the uuid back with
the very next call and nothing downstream sees the ref. This is the documented
exception the charge's kill criteria reserved, and it is structural rather than a
choice.


## Kill criteria

A UUID call site where no uuid can exist (pre-create) is named and kept as
the documented exception. The placement join per candidate 6's severability
clause. Nothing else — every fix is diagnosed and bounded.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§2–3 and §§5–6 (the fence,
agreements; the campaign notes) and
~/code/agents/belvedere/plans/c14-engine-seams.md (findings — F6 is
candidate 1's ground),
and build ~/code/agents/belvedere/plans/b22-hands-hygiene.md to its
`Done when:`.
```
