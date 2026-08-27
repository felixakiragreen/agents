# Bulletin — row 18 wave

Protocol: every agent reads this before each major method section, and appends the
moment a discovery changes another row's plans — not at landing time. Verbatim excerpts
only, no paraphrase (dispatcher charter). Exists only while this parallel batch runs.

## 2026-08-26 · 18a → 18c/18e/18f/18g/18h (all remaining rows)
**`doctrine/` has zero knowledge of `unrecorded`** (`grep -rn unrecorded doctrine/` → no
hits). D63's amendment was countersigned *after* row 16 built, so every typed absence
lints as "unknown" — DoD 1's "0 failures" is unreachable for any building that needs an
`unrecorded` fill. 18d hit this first (bob, filed); 18a widens it: the gap also hits the
ledger head's **mantle** slot (D26's lawful null mantle), which may want a different
token than a missing record. Ruling is the Grand Architect's — do not hand-fix the
linter; file the residual failure count and escalate, same shape as 18a/18d.
Evidence: 18a's report; `~/code/agents/ISSUES.md` (18a's escalation entries).

## 2026-08-26 · 18c → 18b/18e/18h (every row that migrates a ledger head)
**`doctrine migrate` WRITES a malformed ledger head, and the round-trip law reports `ok`
while it happens — a document goes from 0 failures to 2 per entry.** Do not trust a
`ledger.pre-doctrine-head` dry-run diff on sight; lint the migrated text before you
believe it. `ledger.pre-doctrine-head` takes the whole first `·` segment as the mantle,
so a tier riding a parenthetical survives inside the mantle and the row id is bolted on
as a second parenthetical. Reproduction, whole:

```
$ printf '# Ledger\n\n---\n\n## 2026-08-19 · Builder (opus-medium) · SH3 — the bundle-push pipeline\n\nStuff. Decided: nothing. Next: fire 20.\n' > LEDGER.md
$ doctrine lint .                 →  0 failure(s) in 0 class(es)
$ doctrine migrate . --write
+**2026-08-19 · Builder (opus-medium) (SH3)** — the bundle-push pipeline
   round-trip ok — 1 edit(s), meaning-bearing fields unchanged
$ doctrine lint .                 →  2 failure(s): ledger.mantle, ledger.tier
```

**The milder half, for rows still to run:** a source head with no parenthesised tier
re-emits with **no tier slot at all** — `**2026-08-01 · Builder (WO-001)** — Kernel v0`,
which is the diff row 16's findings §DoD-4 publish as proven form-only. 18b already
landed hexwright at 0 failures by filling those 9 tiers by hand from cited evidence, so
nothing is broken in the field; the point for 18e/18h is that **the converter's output
is not self-checking** — lint after `--write`, do not read a clean round-trip line as a
clean document. 18c refused `--write` on whiteboardy and landed its board half only.
Evidence: `~/code/agents/ISSUES.md` (18c's first entry).
