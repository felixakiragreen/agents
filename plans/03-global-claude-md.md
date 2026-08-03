# 03 — The Global CLAUDE.md

**Mantle · Tier:** Architect · fable-max · **Gate:** 01 + 02 LANDED, 02's D-entries
countersigned · **Status:** **LANDED** 2026-08-03 → `canon/CLAUDE.md`

## Mission

Rewrite the global CLAUDE.md as `canon/CLAUDE.md` — the file every session in every
repo on every account loads first. **The bar: every line pays rent in every context.**
A byte here taxes all work everywhere, forever; this is the most expensive real estate
in the system.

## Inputs

1. `GENESIS.md`; 01's outputs (`canon/mantles/README.md` — precedence law, summons
   grammar); 02's outputs (`canon/work/DOCTRINE.md`).
2. The incumbent: `~/.claude/CLAUDE.md` (byte-identical ×3, dated 2026-07-09) — the
   Coding Directives (five numbered sections), Git Development Guidelines, Agent
   Personality Guidelines.

## Questions to settle

1. **Line-by-line audit of the incumbent.** The Coding Directives are the constitution
   — expect them to survive largely intact, but interrogate each line against the bar.
   Git guidelines: keep, tighten. Personality: keep — it's Felix's standing preference,
   not a mantle's.
2. **Plant the precedence hook** ratified in 01. The known collision: *"Don't start
   writing code without asking"* vs a Builder executing a blessed order autonomously.
   The global file must say, in one or two lines, that an explicitly declared mantle
   charter overrides conflicting global directives — personality and style always apply.
3. **Mantle awareness.** One tight paragraph: the canon repo exists
   (`~/code/agents`), sessions may be summoned under a mantle, where charters live.
   Enough for any session on any account to find the law — no duplication of it.
4. **Files-carry-truth law.** Agent memory, history, and `projects/` are siloed per
   account (GENESIS §1) — decide whether the global file carries the one-line
   consequence ("durable truth goes in repos") or leaves it to doctrine.
5. **What moves OUT.** Anything in the incumbent that is really mantle- or
   doctrine-content moves to 01/02's files; the global file points, never duplicates.
6. **Deployment: none in this session.** 04's build deploys `canon/CLAUDE.md` to all
   three accounts (symlink, D14) immediately after — land the file in the repo only.

## Out of scope

- Charter/doctrine content (point at it). Sync mechanism (04). Per-project CLAUDE.mds.

## Deliverables

- `canon/CLAUDE.md` ratified in the repo (deployment: 04's build, per D14).
- `DECISIONS.md` appended (what changed vs incumbent, what moved where);
  `GENESIS.md` board updated; `LEDGER.md` appended.

## Dispatched mode (batch 2)

This brief runs dispatched (rider: `plans/RIDER.md`). New D-entries land marked
**"(proposed — pending Felix countersign)"**; the tending session escalates them to
Felix before 04's build dispatches. End-of-session protocol unchanged.

## Findings (2026-08-03)

The file is the deliverable — `canon/CLAUDE.md`, 70 lines: the 59-line incumbent
byte-intact plus one appended 11-line section. Evidence for "byte-intact":
`diff ~/.claude/CLAUDE.md canon/CLAUDE.md` emits a single hunk — the append after the
incumbent's last line (no-trailing-newline convention preserved). Incumbent verified
byte-identical ×3 before work (md5 `7c9e776eb9bdc6c82955144e9e792a46` in all three
config dirs). Brief questions 1–6, all settled, none escalated:

1. **Audit verdict: the incumbent survives byte-intact — zero edits.** Coding
   Directives: interrogated line-by-line; every principle is either universal working
   law (§1 drives this very campaign) or the constitution for code, which is what most
   sessions on all accounts do — and it is Felix's taste, above this session's
   delegation to rewrite. Git guidelines: audited for the brief's "tighten" — already
   at fixed point; every candidate rewording lost clarity or voice for ≤1 word saved.
   Personality: kept per brief. Byte-churn on a constitution is negative value — it
   noises the countersign diff and erodes trust that mirrors match the canon.
2. **Precedence hook planted, mirrored to D11 exactly** — not the README's abbreviated
   hook text: restored D11's full triple ("personality, code style, and git
   conventions") and its workflow gloss ("when to ask, when to act"), so the global
   file and every charter state the SAME law in the same words at both ends of the
   handshake. The known collision (global "don't start writing code without asking" vs
   a Builder's blessed order) resolves: the personality line stays, the hook disarms it
   in mantled sessions only.
3. **Mantle awareness: one paragraph, pointers only.** Canon repo path, what it holds
   (mantles · tiers · doctrine), charter directory, explicit-summons-only. Deliberately
   NOT duplicated from canon: the five mantle names, the summons grammar, staffing
   guidance, tier list — a summons always carries its charter path (grammar law), so
   names here would be rot-prone copies answering no question.
4. **Files-carry-truth: carried in the global file, fused with the account physics.**
   Ruling: the three-account silo is the one fact a session cannot discover from inside
   (nothing in a session reveals other accounts exist), and the global file is the only
   channel reaching repos that don't run the doctrine. Opens with the canon motto's
   operative clause ("Files carry the truth") so the global file and the charters
   resonate.
5. **Nothing moves out.** The incumbent (2026-07-09) predates the canon and contains
   zero mantle- or doctrine-content — the audit found no line whose home is 01/02's
   files. Movement was all inward (the new section).
6. **Deployment untouched, per brief.** All three mirrors still serve the incumbent
   (md5s unchanged); 04's build replaces them with symlinks (D14). Until countersign +
   04B, canon and mirrors intentionally differ by exactly the appended section.

**Defended non-additions** (creep candidates rejected): branch-`master`-never-main —
project physics, not global law (THG work repos may use `main`; the genesis ritual
plants it per-project, doctrine §12); the full charter motto blockquote (names all five
mantles — duplication, see 3); a doctrine-path pointer (project CLAUDE.mds carry it —
`canon/work/templates/claude-md.md` line 17); the config-dir/alias table (GENESIS §1
content; no session acts on it); "suggest a break at clean boundaries" (charter/doctrine
law, mantled sessions only).

## Kickoff (verbatim)

```
You are an Architect at fable-max. Wear ~/code/agents/canon/mantles/architect.md, then
read GENESIS.md and plans/03-global-claude-md.md, and execute the brief.
```
