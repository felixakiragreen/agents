# C24 — the parser

**Status:** OPEN — laid 2026-08-29 · **Depends on:** C23 · **Staffing:** Builder · opus-high

## Mission

`doctrine/` learns the standard's tokens and teaches the city's boards to molt into
them: grammar, migrate rules, lint hardening, tests. After this charge, the one
parser in the city reads the blessed tongue and writes nothing else.

## Inputs — read before working

- `canon/work/STANDARD.md` (post-C23 home; §2 ids · §6 typed absence · §7 punctuation
  and namespace · §9 graveyard).
- [canon/work/DOCTRINE.md](../canon/work/DOCTRINE.md) §4/§7/§8 — post-C23, the
  normative grammar this parser implements.
- `doctrine/src/` — the token block is `grammar.ts:13–26`; migrate and lint carry the
  old tokens' behavior.
- [plans/16-doctrine-linter.md](16-doctrine-linter.md) §Findings (F1 — the round-trip
  law's canonical reading) · [plans/19-doctrine-hardening.md](19-doctrine-hardening.md)
  (the live-corpus test, the guard).
- D63 (molt clause) · D71 · D18 (ids stable, never reused, nothing renumbers).

## The spec — blessed D71 ⬡✓ 2026-08-29; this map applies it

1. **grammar.ts:** mint `⬡-gate` (Depends-on and Staffing token; `Felix-gate` stays a
   historical alias — parsed forever, never emitted by migrate). `DEFERRED` joins the
   annotation genre (`PARKED` historical alias). `unstaffed` leaves the legal set —
   see 3. C‹n› id grammar: `C\d+` beside bare historical ids; ids are strings, never
   renumbered (D18). `⬡✓` beside `✓ Felix` — both parse, neither migrates (the
   historical-marks migration is DEFERRED by the standard §7). Baton instruments
   accept `ignite <charge-ids>` beside historical `fire <row-ids>`. The ledger head's
   parens accept charge ids (`(C23)`).
2. **migrate.ts** — form-only, the round-trip law per 16-F1's reading: `Felix-gate:` →
   `⬡-gate:` in both columns; `PARKED` → `DEFERRED` wherever it annotates;
   `unstaffed` → `—` where the Status cell carries DEFERRED, surfaced as a residue
   everywhere else — never guessed. Nothing else moves: no `✓ Felix` rewrite, no id
   renumbering, no prose.
3. **lint.ts:** an unstaffed charge is not permitted, ever — a Staffing cell that is
   empty, `unstaffed`, or `—` without DEFERRED in its Status is a **hard failure**
   ("charges are always staffed"). `⬡-gate` staffing renders his card per D63a's law,
   new token, same meaning.
4. **Tests:** fixtures per token, both directions; migrate round-trips green; prove
   the change bites — a new-token fixture fed to the pre-C24 tool goes red in the
   predicted places (the 13-F1/14 guard pattern).
5. **Namespace note:** `C` joins canon's reserved letters (standard §7). The
   prefix-table lint arm is C26's, not this charge's.

## Done when:

- `cd doctrine && bun test` green, new fixtures included.
- `doctrine lint ~/code/agents` → 0 — the batch note's named interim red (C28's
  ⬡-gate cell) clears here.
- `doctrine migrate` dry-run across the register prints the city's respell counts per
  building — no writes — pasted as evidence; the counts hand C25 its sizing.
- The round-trip law asserted: declared-changes + identical-otherwise + the byte
  assertion.

## Out of scope

Writing any building (C25). The vocabulary/lexicon arm (C26). Glass renderers (C27).
The `✓ Felix` → `⬡✓` history migration (DEFERRED — the standard §7).

## Findings

*(append here)*

---

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then execute the charge at ~/code/agents/plans/c24-parser.md —
the parser learns the standard.
```
