# The Agents Canon — The Map

> *The Grand Architect keeps the canon, Architects think, Dispatchers tend, Diggers dig,
> Builders build — a hive building a city; files carry the truth.*

This repo is the operating system for how Felix works with Claude — **the Guild** (D37):
the canon of **mantles** (roles), **capability tiers**, **work doctrine**, and the
**global CLAUDE.md** — held here once, deployed as mirrors into every Claude account's
config dir.

## 1. Why

Felix runs three Claude Code accounts to beat session limits (~$450/mo of capability):

| Config dir | Summon | Plan |
|---|---|---|
| `~/.claude` | `claude` | Claude Max |
| `~/.claude-thg-fgreen` | `a-thg-0` | Team Premium |
| `~/.claude-thg-doorbell` | `a-thg-1` | Team Premium |

The aliases set `CLAUDE_CONFIG_DIR`. Consequence: `projects/`, history, and agent memory
are **siloed per account** — nothing crosses. The global CLAUDE.md and keybindings are
byte-identical across all three today only by hand-sync and discipline.

Meanwhile the conventions that actually run Felix's projects were pioneered per-project
and live scattered: hexwright invented Grand Architect / Area Architect / Builder
(`~/code/hexwright/CLAUDE.md`); simmy invented Dispatcher / Spikes, capability tiers, and
the board-brief-findings-bulletin pattern (`~/code/universal_robots_sdk/cap-mega/simmy/`,
tiers in `cap-mega/.claude/agents/`). Proven, but trapped in their birthplaces.

This repo canonizes all of it. One source of truth, deployed everywhere, versioned in
git. Three hives, one city: the accounts are hives — each session a bee, its memory mere
comb (D27) — and the repos are the city they raise, where truth lives in stone. The
lineage is on the record (D38): *Children of Time*, *Dune*, *Foundation* — canon is the
Understandings, inherited at summons, never taught.

## 2. The composition law

Every session is **tier × mantle × context**:

- **Tier** — the engine: model × effort. Pure preset, zero role content.
  Lives in `canon/agents/`, deployed to each account's `agents/` for dispatch.
  Proven format: simmy's `cap-mega/.claude/agents/*.md`.
- **Mantle** — the charter: mission, powers, forbidden list, deliverables. Pure content,
  zero engine. Lives in `canon/mantles/`. Grade bar: simmy's `DISPATCHER.md`.
- **Context** — the project's own docs (its CLAUDE.md, board, briefs, orders).

Summoning:
- **Dispatched:** `Agent(type=<tier>, prompt=<mantle kickoff> + <brief> + rider)`.
- **Interactive:** open a session at the right model/effort, speak the summons
  (*"You are an Architect… read X and execute"*).

The exact grammar, the tier matrix, and the five charters landed in session 01 —
operational law in `canon/mantles/README.md`.

## 3. The mantles

| Mantle | Mission |
|---|---|
| **Grand Architect** | Keeps this canon: cross-project law, the mantle/tier/doctrine system itself. Rare summon. |
| **Architect** | Owns one project's board: reviews landed work, trues state, ratifies decisions, cuts batches, writes briefs and work orders. |
| **Dispatcher** | Logistics only, never content: turns a board into running agents, tends, relays verbatim, escalates. |
| **Digger** | Exploration: answers a brief's questions. Findings are durable; code is disposable. Kills fast, and a documented kill is a win. |
| **Builder** | Construction against a blessed spec with a measurable DoD. Output is merged code and green tests. |
| **Mentat** | Thinks beside the sovereign — the cross-project thinking partner: explores, pushes back, maps the branches. Changes minds, not files; one office, interactive only (D62). |

## 4. Deployment map

| Canon | → Mirror | Notes |
|---|---|---|
| `canon/CLAUDE.md` | `~/.claude*/CLAUDE.md` | the global file — landed 2026-08-03 (03); **live ×3 since 2026-08-03** (Felix's deploy = D24's countersign; `check` re-verified green 3×3 2026-08-06) |
| `canon/agents/*.md` | `~/.claude*/agents/` | capability tiers — **live ×3 since 2026-08-03** (D14 symlinks) |
| `canon/mantles/*.md` | read by path | canonical delivery (D12) — summons name the charter path |
| `canon/skills/<mantle>/SKILL.md` | `~/.claude*/skills/` | interactive sugar: `/architect` … — **live ×3 since 2026-08-03** |
| `canon/work/` | not deployed | doctrine + templates, referenced by projects — landed 2026-08-03 (02) |

Mechanism: **symlink, confirmed** (04's spike — F2, F7, F8, F10): one inode of truth, one
rule for every target, no copy-mode branch. `keybindings.json` left the sync set (D15;
F11/F12: unobservable without a human in the loop — byte-identical ×3 today, hand-copy if
ever wanted). Tooling landed 2026-08-03 (04 build): **`sync/deploy`** (bootstrap + adopt,
idempotent, backs up a displaced original once) and **`sync/check`** (the drift alarm —
run it when something feels off; green + still broken ⇒ auth, not sync). `deploy` is
**Felix-run**: displacing a live config file trips the agent permission guard by design.

## 5. The campaign board

| ID | Work | Depends on | Staffing | Status |
|---|---|---|---|---|
| 0 | Genesis — lay the keel | Felix-gate: blessing | Grand Architect · unrecorded | **LANDED** 2026-08-02 (staffed `fable` — the tier grid was minted by 01) |
| 01 | [Composition model](plans/01-composition-model.md) | 0 | Architect · fable-max | **LANDED** 2026-08-02 |
| 02 | [Work doctrine](plans/02-work-doctrine.md) | 0 | Architect · fable-max | **LANDED** 2026-08-03 → `canon/work/` — soft interlock with 01 |
| 03 | [Global CLAUDE.md](plans/03-global-claude-md.md) | 01; 02; Felix-gate: 02's D-entries countersigned | Architect · fable-max | **LANDED** 2026-08-03 |
| 04 | [Sync](plans/04-sync.md) | 01; 02; 03 | Digger · opus-high (→ Builder · opus-high for Stage B) | **LANDED** 2026-08-03 — deploy + check green 3×3, canary ×3, smoke ✓ ×3 (Max `/login` PENDING **struck 2026-08-08**, 10-F6(a): 10-E2 measured `~/.claude` live and authenticated — OAuth usage HTTP 200, `claude_max` profile fetched same day — and row 08's rig smoke ran ×3 on 2026-08-06) |
| 05 | [Saturation harvest — snappy batch-1 → canon](plans/05-saturation-harvest.md) | — | Grand Architect · fable-max | **LANDED** 2026-08-05 — D28–D30 entered amended, rejections upheld, D31 (hive-city voice) cut; D28–D31 ✓ Felix same day |
| 06 | [hexwright retrofit](plans/06-hexwright-retrofit.md) | Felix-gate: D32 ✓ 2026-08-06 | Architect · fable-high | **LANDED** 2026-08-06 → [findings](plans/06-hexwright-retrofit.md); hexwright D9 ✓ Felix (via D32); board minted, dream renamed |
| 07 | [simmy retrofit](plans/07-simmy-retrofit.md) | Felix-gate: D32 ✓ 2026-08-06 | Architect · fable-high | **LANDED** 2026-08-06 → [findings](plans/07-simmy-retrofit.md); simmy D16 ✓ Felix; B14 clear to resume |
| 08 | [summon rig](plans/08-summon-rig.md) | Felix-gate: D34 ✓ 2026-08-06 | Builder · opus-high | **LANDED** 2026-08-06 → `summon/` + [DoD evidence](plans/08-summon-rig.md) (33 assertions green, `lab/08/run`); dotfiles source line ✓ 2026-08-06; smoke ×3 ✓ Felix 2026-08-06 (the per-account routing proof the shim couldn't give). F3 PARKED (Felix): deferred into the future slash-summons work |
| 09 | [summon rig v1.1](plans/09-summon-rig-v11.md) | 08; Felix-gate: D36 (dispatch countersigns) | Builder · opus-high | **LANDED** 2026-08-06 → [DoD evidence](plans/09-summon-rig-v11.md) (76 assertions green, `lab/08/run`); 2-key refire, cascade+override, `[n]one` bare, palette, 60-col wrap. Palette trap fired — escapes die in `zle -M`, so the colours ride `region_highlight` (F1/F2). D36 ✓ Felix (by dispatch); visual pass ✓ Felix 2026-08-06 — rig in daily use, refinements to accrue over live weeks; smoke ×3 ✓ Felix 2026-08-06 |
| 10 | [summon rig v1.2 — the usage panel](plans/10-summon-rig-v12-usage.md) | 09; Felix-gate: D41 ✓ 2026-08-07 | Builder · opus-high | **LANDED** 2026-08-07 → [DoD evidence](plans/10-summon-rig-v12-usage.md) (134 assertions green, `lab/08/run`). E2 settled: the usage source is the OAuth endpoint, keychain service derived as `sha256(config dir)[:8]` — the `.claude.json` cache was measured hours stale and once inverted the arbitrage, so the rig fetches. Felix's gate: probe (b), granted 2026-08-07. Fetcher proven on all three live accounts (F8). Felix's first look amended D41's palette law in-session — staleness greys the furniture, never the figures (F9). **Full panel visual pass PENDING Felix**. Ruled 2026-08-08 (Architect): F1 accepted — latency clause is now a budget, per-keystroke ≤ 5 ms; F6(a) struck (row 04 amended); F10's spawn options ruled option (i), operative in row 11's spec |
| 11 | [summon rig v1.3 — the live table](plans/11-summon-rig-v13-live-refresh.md) | 10; **Felix-gate: blessing** | Builder · opus-high | **OPEN — cut 2026-08-08 (Architect), blessing PENDING Felix.** Fixes what row 10's visual pass exposed — the panel repaints only on a keystroke, so an in-flight fetch is invisible if Felix just looks. Two mechanisms: a `precmd` warm-keeper (the panel opens already-current) and an await-mode tick (`read -k -t` verified in a zle widget). The cut ruled the 10-F10 spawn fork: one detached `summon-fetch` worker shape at both spawn sites, panel-open spawn retained (idle terminals draw no prompts), 10-F1 inherited as a ≤ 5 ms budget. **Deferred by Felix 2026-08-08** — the blessing gate stands unmet; nothing dispatches until his word. 13 LANDED 2026-08-22, so the rebase is real: at unshelving this row inherits the name-stamp in every asserted panel/command, and 13's narrowed F4/F5 arms (13-F1's guard, first ruled here, **moved to row 14** 2026-08-24 — 14 touches the harness now, 11 is deferred indefinitely) |
| 12 | [the dispatch guard](plans/12-dispatch-guard.md) | — | Builder · opus-high | **LANDED** 2026-08-08 → `guard/` + [DoD evidence](plans/12-dispatch-guard.md) (four live arms green, `lab/12/run`). The deny→retry loop closes with no human in it. **The hole, proven:** workflow-script `agent(…, {model, effort})` calls never fire `PreToolUse` (F2) — README names it, arm 4 watches it. F6 ruled 2026-08-08 (Architect): no text-matcher — deterministic or nothing; the hole stays named + watched, D47 binds workflow authors procedurally. Adoption anywhere is still its own row |
| 13 | [summon rig — the name-stamp](plans/13-summon-rig-name-stamp.md) | — | Builder · opus-high | **LANDED 2026-08-22 — cut 2026-08-08** on Felix's call (quartermaster §5). The rig stamps `--name <mantle>-<theater>-<account>` at fire (`claude --name` verified against `--help`, ~2.1.x); bare launches drop the mantle segment, eject keeps the stamp editable. The roster stops being anonymous doors. **Amended 2026-08-22 (Architect, Felix's numbering ask — ISSUES 04152cf):** scheme is `<mantle>-<theater>-<NN>` — account segment out (arbitrage, not identity), GA drops theater too (one office — redundancy, not information; Felix), auto-derived lineage ordinal in, superseding the no-suffix pre-ruling; counter from `invocations.jsonl` (record gains a `name` field), one pass at panel open, `+`/`-` bump seeds and corrects lineages (no restart — GA continues at 09). **Dispatched 2026-08-22** → **LANDED 2026-08-22** (Builder · opus-high) → [DoD evidence](plans/13-summon-rig-name-stamp.md) (170 assertions green ×3, `lab/08/run`; `-n/--name` re-verified against live `--help`). The rig is live on the next new shell — `summon/` is sourced from dotfiles, not deployed. **Smoke ✓ Felix 2026-08-22** (fired, bumped a lineage to his hand-count, name confirmed in title + roster). F1: the harness arrived 3 assertions red — `presets.tsv` gained `D digger` on 08-09 and nothing swept `lab/08`; fixed here, and the guard against a repeat is named-not-built. F4/F5: two row-10 guarantees deliberately narrowed (v1.1 byte-identity now covers every panel *row*; refire fidelity is identity-but-for-the-ordinal). F7 parked: the 32-key runaway guard caps one panel's seed at ~28 ordinals |
| 14 | [summon rig — the theater cycle](plans/14-summon-rig-theater-cycle.md) | 13 | Builder · opus-high | **LANDED 2026-08-24 — cut 2026-08-24 (Architect)** on Felix's ask (campaigns are not always directories — bob hosts bob, lunchbox, pods; deep-firing fragments the project silo, eject blinds the counter). `.summon-theaters` at the fire dir (first line default, no file → `${PWD:t}`), reserved `t` cycles, sticky per directory on fire only; counter and GA exception untouched. Inherits 13-F1's guard: `lab/08/run` derives its `presets.tsv` fixtures. Forks ruled by Felix 2026-08-24: `t` key ✓, sticky ✓. **Dispatched 2026-08-24** → **LANDED 2026-08-24** (Builder · opus-high) → [DoD evidence](plans/14-summon-rig-theater-cycle.md) (200 assertions green ×4, `lab/08/run`; was 170 — none weakened, two strengthened). Sticky map is `log/theaters` (F2), not `log/state` — different shape, different lifetime. **13-F1's guard landed and proved both ways:** one row appended to the live `presets.tsv` leaves the new harness green with its counts following, and turns the pre-14 harness red in exactly the three predicted places. F1: a theater becomes argv, so a line that is not a plain name refuses the panel out loud — 13-F9's hazard arriving from a data file; spec extension, one `if` to revert. F5 parked: the 32-key runaway guard caps one panel's cycle at ~28 positions, and no cap is placed on the list itself. **Ruled 2026-08-24 (Architect): F1 and F2 accepted** — the loud refusal is directives §3 (a silently skipped campaign line lies to the cycle), and `log/theaters` is the narrower, truer state (only listing directories enter); suite re-run green by the Architect's own hand. **Smoke PENDING Felix** — the rig is live on the next new shell (`summon/` is sourced from dotfiles, not deployed). Serial with 11 (shared files — 11 deferred, so dispatchable) |
| 15 | [Belvedere — the sovereign's glass](belvedere/README.md) (subproject; keel: [plans/belvedere.md](plans/belvedere.md)) | Felix-gate: venue D2 ✓ Felix via keel §11 | Architect · fable-max (founding) | **IN FLIGHT** — founded 2026-08-26; the campaign runs on its own board, this row is the pointer |
| 16 | [v3 · the doctrine linter](plans/16-doctrine-linter.md) — P3's parsers harden into canon `doctrine/`: `lint` · `parse --json` · `migrate` | — | Builder · opus-high | **LANDED** 2026-08-26 → `doctrine/` + [DoD evidence](plans/16-doctrine-linter.md) (21 tests green, `cd doctrine && bun test`; corpus 28/29 board docs · 376 rows · 8/9 ledger tails · **0 per-repo special cases**; round-trip green on 5 real buildings; hexwright dry-run form-only — every edit a single `## ` heading line, nothing written outside this repo). The register is a **rule now, not a list**: a building is a dir carrying LEDGER/DECISIONS/ISSUES or a staffing master doc, orphan boards promote their own dir, and a worktree checkout is skipped unless its branch put a board where the mainline has none (12,734 skipped, counted out loud). The amended grammar is stricter than P3's probe on purpose: 718 failures vs 339, because D63e resolves Depends-on against real row ids (232 hits — row 18's largest item) and D63f wants a tier slot (93 heads lack one). `--live` narrows to 340. **F1, flagged for the Architect:** the round-trip law needed a reading — bare equality is impossible when migrate exists to fill fields — implemented as declared-changes + identical-otherwise + a byte assertion. **F2:** hexwright's decisions carry no decider field, so `migrate` leaves `decision.attribution` standing rather than invent one; the suite asserts that residue. Rows 17 and 18 are unblocked. **Ruled 2026-08-26 (GA-10): F1 accepted as the law's canonical reading** (D52 lane — declared-changes + identical-otherwise + byte assertion is the molt clause made mechanical); **F2 accepted** — the refusal to invent a decider is D63 working; generalized as the `unrecorded` typed absence, D63 amended (✓ Felix 2026-08-26) |
| 17 | [v3 · the storage experiment](plans/17-storage-experiment.md) — does structured-source truth beat schema-markdown for the three consumers? | 16 · Felix-gate: Belvedere v0 evidence — paid 2026-08-28 (batch-5 close: v0 §8 DoD 7/7, 14 rows zero kills, 651 tests green, the flow chapter ran a real batch; called paid by Felix's summons of this date) | Digger · fable-high | **LANDED** 2026-08-28 → [findings + verdict](plans/17-storage-experiment.md) — **RETAIN, confirmed with numbers** (D65's ruling survives its trial): Felix's hand M-net (in-place prose diff economy ~14×; S wins state flips + loud refusals; M's 2 worst damage classes confirmed silent, S's 1 unsighted), cold start inconclusive at affordable n (S ≤ M tokens 4/4 pairings, 24/24 first-try-conforming writes both arms; M4's reads struck — the countersign close moved the corpus mid-rep, §6.7), the glass S decisively (7/9 case-file asks are fields vs render-side heuristics; live holder-inversion repro). The line, per-artifact: prose artifacts stay schema-markdown, field artifacts are data (flows-as-data stands), missing fields enter the D63 grammar — never a storage flip. 18 not re-scoped; row-19/-20 inputs named in the verdict; stale-lead wart (rows 13/14 lead OPEN, landings in annotation) parked for the wave + a row-19 lint rule. Harness: `lab/17/` — twin (fidelity control green both ways), C1 replays, C2 battery ×8 graded, S-arm validator |
| 18 | [v3 · the great re-cut](plans/18-great-recut.md) — full-corpus migration via `doctrine migrate`, history included | 16 | Dispatcher · sonnet-medium (tends an 8-row wave of scoped Architects) | IN FLIGHT — cut 2026-08-26 (GA-10); **wave 1 closed: 8/8 rows reported** (18g's stranded branch merged 2026-08-28, GA-11), city lint 718 → 310, every residual an escalated tool/vocabulary gap, none a doc defect; supersedes D32's history scope for form (D63); DoD (`doctrine lint ~/code` → 0 across the register) blocked on D68/D69 + row 19; continuation wave — whiteboardy re-fire (18c's re-run contract), snappy separator repair (**sanctioned 2026-08-28, GA-11: form-only under the molt clause**; the ~38 re-framed entries take standard residue rulings), spacex decision heads — cut when 19 lands; re-scoped by 17 only if 17 wins |
| 19 | [v3 · doctrine v1.1 — the wave's residue](plans/19-doctrine-hardening.md): 15 evidenced tool defects fold into `doctrine/`, fixtures kept | 17 · Felix-gate: vocabulary countersign — paid 2026-08-28 (D63 2nd amendment + D69 ✓) | Builder · opus-high | **LANDED 2026-08-28** — 18 items + the seam export, amended at kickoff (16–18, row 17's harvest); suite 41 green / 22 fail pre-fix, agents lints 0, walk 8.8→4.0 s, guard live; 1 escalation (bob's 3 inline ledger heads → continuation wave) → [findings](plans/19-doctrine-hardening.md) |
| 20 | [the continuous flow — the keel sitting](plans/20-continuous-flow.md): flow doctrine, the Dispatcher mantle's fate, the D64 grammar asks (kind/recommendation/branch/holder/holds), cross-building Depends-on | 17 · Felix-gate: his call to sit | Grand Architect · fable-max | OPEN — mandate recorded 2026-08-28 (GA-11); Felix's commission verbatim in the stub |
| 21 | [the working vocabulary — the census, then the standard](plans/21-vocabulary.md): full-city term census (concepts-driven, orthography included) → Felix chooses → the standard; subsumes bless-vs-countersign; §13 on the block | Felix-gate: his call to sit — paid 2026-08-28 | Grand Architect · fable-max | IN FLIGHT 2026-08-28 — census-first redirect (Felix, at the sitting's open); part 1 closed same day on his word (arbitrage): 28/38 readers fired under the 20-slot ceiling, 11 landed + early collision harvest filed, B16–B25 queued; continuation summons in the work doc §Continuation — the sitting resumes on another hive |
| 22 | [summon rig — the argv summons](plans/22-summon-argv.md): the summons composes into the prompt slot, colour goes venue-native (P2 §S3/§T4: paste splits at the first blank line — the 359-fire gap) | Felix-gate: blessing | Builder · opus-high | OPEN — cut 2026-08-28 (GA-11); three forks await his blessing in the stub |

Statuses per the doctrine (`canon/work/DOCTRINE.md` §4): OPEN → IN FLIGHT → LANDED /
KILLED. Any account can host any session — the repo carries the truth; account choice is
quota arbitrage.

**Batch 2 (cut 2026-08-03): 02 → 03 → 04 build — sequential, dispatched.** A Dispatcher
tends the chain; each design landing pauses for Felix's countersign of its proposed
D-entries before the next row dispatches. Rider: `plans/RIDER.md`.

**v2 (cut 2026-08-06, D32): 06 + 07 — the retrofits.** Interactive, Felix-tended,
parallel-safe (disjoint repos), no Dispatcher and no bulletin — nothing dispatches.
Ordering rider (Felix): **07 lands before B14's resumption** — simmy's in-flight verify
row lost its session to token limits and resumes from another account onto retrofitted
docs; 06 runs anytime.

**08 (cut 2026-08-06, D34 ✓ · D35 riders same day): summon rig** — single Builder row,
independent of 06/B14, **LANDED** same day onto the amended brief. `summon/` is live in
the repo but inert until Felix adds the one dotfiles source line; the three-account smoke
is his (✓ 2026-08-06; dotfiles line ✓). F3 — a file-based agent definition sets the session
colour flag-only, freeing the positional prompt for the summons — **PARKED by Felix
2026-08-06**: deferred until the slash-summons work (`/grand-architect` …), where it
folds in; a canon question (mantles-by-path vs colour-carrying agent definitions) for
the Grand Architect when that row is cut. Parked is tracked, not lost.

**12 (cut 2026-08-08, at the D46–D49 sitting): the dispatch guard** — single Builder
row, independent: a repo-committed PreToolUse hook that denies engine overrides on
Agent calls (D47's mechanical arm; venue tooling per 05's rejection terms). Kickoff
in the order.

**v1.3 chain (cut 2026-08-08, Architect): 11 → 13 — strictly serial, Felix-tended.**
Serial by physics, not logic: both rows edit `summon/summon.zsh` and the `lab/08`
fixtures. No Dispatcher — the chain's gates are Felix's own (bless 11 at the top;
a visual pass / smoke at each landing) and he tends the rig work directly, as rows
08–10. Kickoffs verbatim in each work doc. *Re-cut same day: Felix deferred 11, so
the chain inverts — 13 is dispatchable now, 11 rebases on it whenever he unshelves
it. The serial law stands either way: never both in flight.* **13 LANDED 2026-08-22 —
the chain is idle and 11 is the only row left on it; whoever unshelves it rebases onto
the stamped `_summon_resolve`, the `name` field in `invocations.jsonl`, and a `lab/08`
whose renders now cd into a named theater.** Behind the chain,
unordered against it: guard adoption in cap-mega (that board's own Architect) and
the queued harvest sweep (Grand Architect).

**v3 (cut 2026-08-26, D65): the molt — the AI-native format campaign.** Priority from
the Sovereign — ahead of the parked and queued standards work. The schema is the
standard; serialization is per-consumer (D65). 16 gates everything; 17 additionally
waits on Belvedere v0's evidence (Felix-gate); 18 follows 16 and is re-scoped by 17
only if 17 wins. Row 16 is dispatchable now — kickoff in its order.

**GA-11 sitting (2026-08-28): the wave's residue routed.** 18g's stranded landing
merged (branch `worktree-agent-a55279e2283f84743`); the inbox swept — 29 entries
ruled and drained, dispositions in the ledger. D68–D70 proposed: the typed-absence
vocabulary (`unstaffed` · `bare session` · `unrecorded`'s full slot list), `PARKED`
as an OPEN annotation, the pinned TS type gate. Rows cut: 19 (doctrine v1.1,
Felix-gated on the D68/D69 countersign), 20 + 21 (GA sittings, each fires on his
summons), 22 (rig argv, Felix-blessed). Row 17 briefed, gate paid — **the one
fire-now row**. Register-housing ruling relayed to Belvedere: off-register is the
register's truth; a campus rendering is D10 freedom; cwd-ascent rejected.
**Ruled at the sitting's close (Felix):** D68 folded into D63 as its **second
amendment** — `unstaffed` minted, `unrecorded` legal in any required slot,
`bare session` struck (one-cell corpus, harvest bar unmet); **D69 ✓** ("bless" —
PARKED is the board token for his "deferred"); **D70 withdrawn** (an unpinned
`bunx tsc` was already D54's named sin; Belvedere's B8 stands as project physics).
Standing preference, his word: **register minimalism** — an extension of recorded
intent amends its ancestor entry, never a new number; codify at the purge if it
survives. Felix fired 17 the same hour; 19's gate is paid and it holds behind
17's landing.

**Parked (2026-08-28, Felix): the register purge** — at ~D100 the constitution is
consolidated and rewritten, his words: "A constitution with too many amendments at
some points needs rewriting. (We're not there yet, but I'll want to do once we hit
100)" — a Grand Architect sitting, cut at his call; pointer: the GA-11 ledger entry.

**Parked:** the peer-messaging experiment (SendMessage taps between live sessions —
gate-delivery pokes, cross-account bulletin pokes; pointers-not-payloads,
message-never-summons; the plane is OS-user-scoped and crosses all three accounts,
ephemeral, no audit trail) — Felix 2026-08-08: future harvest; capability map,
probe spec, and the Quartermaster deliberation in `plans/quartermaster.md`. The
bulletin stands untouched.

## 6. Non-goals (v1, defended)

- Syncing sessions/history/agent-memory between accounts (D5; D27 — the silo law:
  memory is a per-account cache, durable truth promotes to repos).
- ~~Retrofitting hexwright and simmy onto the new canon — **v2**, after v1 lands. Resist
  the urge mid-campaign.~~ *(struck 2026-08-06: v1 landed, Felix called v2 — rows 06/07,
  D32. The remaining non-goals stand for v2 unchanged.)*
- `settings.json` sync — revisit when a real need appears.
- Plugin sync. Multi-machine (clone-and-deploy makes it nearly free later; not designed now).

## 7. Doctrine

This repo runs the work doctrine it canonizes — `canon/work/DOCTRINE.md` (02, D16–D23) —
and is example #1 of it. Local physics:

- Master doc = this file; the board = §5; work docs in `plans/`; rider = `plans/RIDER.md`.
  No bulletin — batches here are sequential.
- `doctrine/` is the reference reader for the doctrine itself (row 16): `doctrine lint`
  is the drift alarm for the format the way `sync/check` is for the mirrors. Run it before
  claiming a board or a ledger is true.
- `ISSUES.md` is the incident inbox (D49) — swept by the Grand Architect at every
  summons.
- Canon changes require Felix's sign-off; dispatched sessions mark D-entries
  "(proposed — pending Felix countersign)".
- Briefs 0–04 predate the templates and are grandfathered; new work docs instantiate
  `canon/work/templates/`.

## 8. Definition of done — canon v1

1. `canon/` complete: CLAUDE.md · `agents/` (20 tiers) · `mantles/` (5 + README) ·
   `skills/` (5 shims) · `work/` (doctrine + templates). ✓
2. `sync/deploy` + `sync/check` landed; `check` green across all three accounts. ✓
3. All three accounts serve canon live; smoke-summon passes per account. ✓ ×3
   *(the `~/.claude` PENDING struck 2026-08-08 — 10-F6(a): account measured live and
   authenticated, rig smoke ×3 ✓ 2026-08-06 at row 08).*
4. This repo conforms to its own doctrine (02). ✓
5. Board all LANDED; LEDGER and DECISIONS current. ✓

**Canon v1 CLOSED 2026-08-03** — evidence in the 04 Stage B checklist. The one PENDING
at closure — Max `/login` + its smoke — was struck 2026-08-08 (10-F6(a), item 3 above). Next campaign when Felix calls it: **v2 — the retrofits**
(hexwright, simmy onto the canon), cut fresh by a Grand Architect. — **Called and cut
2026-08-06** (rows 06/07, D32).

## 9. Definition of done — canon v2

1. Both parents' live surfaces speak canon: mantles by path, canonical tier names,
   doctrine vocabulary, boards true (hexwright's minted; simmy's re-staffed).
2. The pre-canon tier shadow dead: `.claude/agents/` gone on all three live cap-mega
   branches; `DISPATCHER.md` retired to a tombstone; `spikes/RIDER.md` instantiated.
3. History unedited — closed WOs, spike briefs, bulletins, ledgers, D-entries conform
   as-is, and the dream's bytes survive its rename (`initial.md` → `dream.md`, D33):
   they are the canon's ancestors, not its debtors.
4. Each parent's own D-entry + ledger records its retrofit, Felix-countersigned.
5. Canon untouched by the retrofit sessions — gaps escalated to the Grand Architect
   (the harvest queue), never patched locally.

Closed when 06 + 07 are LANDED with countersigns recorded.

**Canon v2 CLOSED 2026-08-06** — 06 (hexwright D9 ✓ Felix, carried by D32) and 07
(simmy D16 ✓ Felix) both LANDED; evidence in each row's findings. Hexwright's one
PENDING is its own: Felix's Phase-1 acceptance ruling, on hexwright's board.

## 10. The horizon — the Architect line (D39)

Felix's vision, recorded 2026-08-06. **Reserved, not cut** — nothing here is
dispatchable.

- **Royal Architect** — one per domain, overseeing all of it: every campaign, coding
  and not. The domains Felix named: **THG work** (MegaCap and its campaigns — simmy,
  snappy, manny — the side builds like the SpaceX dashboard, and the dozens of
  non-coding projects) and **personal work** (hexwright, the Guild, the Green Order, …).
- **Imperial Architect** — there will only ever be one. Oversees all domains: work
  balanced with life, true alignment, ascendancy, self-actualization — their dream,
  and ours.

**The gate:** a Royal Architect cannot be born until it has a place to live — the
substrate that connects Felix's knowledge and work seamlessly across every platform. It
does not exist yet. Building it is its own campaign, keeled by a Grand Architect when
Felix calls it. Until then the names are **reserved and unminted** (D39, D7's
precedent): no charter, no summons, no preset may claim them. Each Architect of the
line keeps a Personal Log (D40) — the Grand Architect's is `LOG.md`, here.
