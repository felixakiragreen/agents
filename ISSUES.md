# Issues — the incident inbox (D49)

Field reports and canon-fold candidates land here — Felix's hand, or a session's at
his word. Entry format (D63): `- <YYYY-MM-DD> · <who> · <what>` — one bullet per
entry; an entry needing evidence becomes a `---`-separated block opening with that
line. The Grand Architect sweeps at every summons: each entry is ruled fold or
no-fold, then deleted — the D-entry records a fold, the sweep's ledger line records a
rejection, and git keeps the bytes (entries are committed before they are drained).
A swept inbox is empty.

---

- 2026-08-26 · 18d Architect (bob) · **`doctrine lint` rejects `unrecorded` in a tier
  slot**, so D63's typed absence cannot be written where a board row's Staffing has no
  recorded tier. theseus T15 is the live case: mantle citable (`Architect`), tier
  recorded nowhere, so `Architect · unrecorded` is the honest cell — and it lints
  `board.tier — unknown tier`. It is bob's only remaining failure. Row-16 follow-up:
  either `unrecorded` joins the tier/mantle vocabulary, or D63 says the typed absence
  stops at the decision's decider and boards must carry a real tier.

```
$ doctrine lint ~/code/universal_robots_sdk/bob
     1  board.tier
  ~/code/universal_robots_sdk/bob/docs/campaigns/theseus/README.md:107: T15: "unrecorded"
```

---

- 2026-08-26 · 18d Architect (bob) · **§4's Depends-on has no form for a cross-building
  dependency.** lunchbox O2 really did depend on theseus T12a merging — two campaigns,
  two boards, two buildings in the register. The two legal forms are a row id *on this
  board* and `Felix-gate: <text>`, and it is neither. Migration parked it in a note
  under the board, which keeps the fact and loses it from the graph. Live wherever one
  campaign gates another (bob has three; cap-mega more). Options for the Grand
  Architect: a qualified id (`theseus:T12a`), a gate row per crossing (D44 read
  literally), or a ruling that cross-building sequencing is batch-note territory and
  the column stays strictly local.

---

- 2026-08-26 · 18a Architect (agents) · **the `unrecorded` gap is wider than 18d's
  entry** — it hits the ledger head's *mantle* slot too, and it is the whole of this
  repo's residual lint. 18a wrote 25 `unrecorded` tiers into `LEDGER.md`, 1 into
  `MAP.md` row 0's Staffing, and 1 `unrecorded` **mantle** (2026-08-07, the
  unsummoned forensic session — D26's null mantle, which by law has no mantle). All
  27 lint as `unknown tier` / `unknown mantle`. `doctrine/` contains zero occurrences
  of the string: D63's amendment was countersigned *after* row 16 built, so the tool
  never learned it. Row 18's own DoD ("0 failures … every `unrecorded` counted per
  building") cannot be satisfied by any building that needs one. Note for the ruling:
  D26 makes the null mantle lawful, so `unrecorded` in a mantle slot is not a missing
  record but a recorded absence — the two may want different tokens.

```
$ cd doctrine && grep -rn unrecorded . --include=*.ts --include=*.md ; echo "hits: $?"
hits: 1

$ ./cli.ts lint ~/code/agents | tail -8
=== FAILURE CLASSES
    25  ledger.tier
     3  kickoff.summons
     1  board.tier
     1  ledger.mantle
```

---

- 2026-08-26 · 18a Architect (agents) · **the kickoff detector promotes any fenced
  block opening `You are ` to a summons**, and `plans/log-tradition.md` holds three
  that are not: the Personal Log tradition's letter templates, addressed to a *window*
  by its identity ("You are the founding ⟨title as the window knew it⟩ of ⟨project⟩ —
  the window that ⟨founding act⟩ on ⟨date⟩"), plus one worked example. They carry no
  mantle and no tier by design — a log letter is not a dispatch. 18a refused to
  reshape them: mangling a documented tradition to satisfy a detector is the tail
  wagging the dog. Same class as the two detector fixes row 16 already made (`fire the
  Grand Architect`; the findings doc promoted to a board) — the fix belongs in row
  16's suite. Suggested discriminator: a summons fence names a mantle from the
  vocabulary; a fence whose first line names none is not a kickoff candidate. These
  three are this repo's last non-`unrecorded` failures.

```
$ ./cli.ts lint ~/code/agents --verbose | grep -A3 kickoff.summons
      [3×] kickoff.summons — first line is not "You are a <Mantle> at <tier>." (D45)
           ~/code/agents/plans/log-tradition.md:35: You are the founding ⟨title as the window knew it⟩ of ⟨project⟩ — the window that
           ~/code/agents/plans/log-tradition.md:52: You are ⟨who this window was⟩ of ⟨project⟩ — the window that ⟨act⟩ on ⟨date⟩.
           ~/code/agents/plans/log-tradition.md:79: You are the founding Grand Architect of hexwright — the window that laid its keel,
```

---

- 2026-08-26 · 18c Architect (whiteboardy) · **`doctrine migrate` emits a malformed
  ledger head and the round-trip law does not catch it — a doc goes from 0 failures to
  2.** `ledger.pre-doctrine-head` splits `## <date> · <rest>` on `·` and takes segment 1
  whole as the mantle, so a source head whose tier rides a parenthetical
  (`Builder (opus-medium)`) is re-emitted with the tier still inside the mantle segment
  and the row id bolted on as a second parenthetical. `ledger.tier-slot` cannot repair
  it: it runs earlier in `RULES` and, run later, its `trailingParen` finds the row id,
  not the tier. Correct emission is `**<date> · <Mantle> · <tier> (<row>)**`. Round-trip
  reports `ok` because `mantle`/`tier` are both in the rule's declared `changes`, so the
  assertion licenses the damage. whiteboardy carries 13 of these heads and 18c refused
  `--write` on that basis. The milder half of the same bug is visible in row 16's own
  §DoD-4 diff: a source head with no parenthesised tier re-emits with **no tier slot at
  all** (`**2026-08-01 · Builder (WO-001)** — Kernel v0`), published there as proven
  form-only. It did no harm in the field — 18b filled hexwright's 9 tiers by hand from
  cited evidence and landed at 0 failures — but the converter's output was wrong both
  times. Row-16 follow-up; the fixture below is the whole test.

```
$ printf '# Ledger\n\n---\n\n## 2026-08-19 · Builder (opus-medium) · SH3 — the bundle-push pipeline\n\nStuff. Decided: nothing. Next: fire 20.\n' > LEDGER.md

$ doctrine lint .                 →  0 failure(s) in 0 class(es)
$ doctrine migrate . --write
-## 2026-08-19 · Builder (opus-medium) · SH3 — the bundle-push pipeline
+**2026-08-19 · Builder (opus-medium) (SH3)** — the bundle-push pipeline
   round-trip ok — 1 edit(s), meaning-bearing fields unchanged
$ doctrine lint .                 →  2 failure(s) in 2 class(es)
     1  ledger.mantle    "Builder (opus-medium)"
     1  ledger.tier      the head carries no tier slot (D63f)
```

---

- 2026-08-26 · 18c Architect (whiteboardy) · **no migrate rule recognises an unbolded
  pre-doctrine ledger head**, which is 96 of whiteboardy's 104 ledger blocks and the
  bulk of row 18c. The house form is a bare head line plus labelled body lines —
  `2026-08-15 · Digger · fable-high (dispatched, row 01)` / `Changed: …` / `Decided: …` /
  `Next: …`. Nothing is wrong with it that a rule cannot move: bold the head, hoist the
  row id out of the overloaded parenthetical, and the `—` separator replaces the
  `Changed:` label the grammar already implies. This is not a per-repo special case —
  `ledger.pre-doctrine-head` was itself written from one repo's dialect (hexwright's
  `## ` form) and is general in shape; this is the second dialect, not an exception.
  What must stay a human's is the parenthetical's non-row-id remainder (`dispatched`,
  `gate 10 — misfire, no review possible`, `E1 — app skeleton`), which D63f sends to the
  body and `migrate.ts`'s own header already declares out of the converter's reach.
  Three heads wrap across lines — row 16's parked note ("the day one does") has its day.
  Row-16 follow-up; whiteboardy is the corpus that proves the rule, which is why 18c did
  not hand-migrate it.

```
$ doctrine lint ~/code/whiteboardy | grep ledger.head
    97  ledger.head
$ doctrine migrate ~/code/whiteboardy
Dry run: 13 edit(s) across 1 file(s).      # the 13 `## ` heads only — and see the entry above
```

---

- 2026-08-26 · 18c Architect (whiteboardy) · **Depends-on resolves against one
  DOCUMENT's row ids, not the building's** — which narrows 18d's cross-building
  question to something much smaller and, I think, purely a tool scope bug.
  `parseBoards` builds `knownIds` per markdown file, so a master board that depends on
  its own sub-board's rows fails, and so does every sub-board row that depends on the
  gate that blessed it. These are not cross-building references: one building, one
  register entry, ids unique across it. whiteboardy is the extreme case — a master board
  plus six sub-boards, all `docs/*.md`, sanctioned by D45 — and **28 of its 45 residual
  `board.depends` failures are exactly this**, 23 plain ids and 5 en-dash ranges
  (`E1–E9`, `SH1–SH4`, `T1–T6`, `C1–C4`, `X1–X7`). D63e says "row ids"; it does not say
  "on this board", and the linter's own message asserts a scope the doctrine text never
  set. The register already computes the building, so the fix looks like one line —
  resolve against the union of the building's board docs. Ranges are a separate, smaller
  question (expand `E1–E9`, or spell it `E1, E2, …`). 18c left all 28 untouched rather
  than guess, since the two candidate spellings differ.

```
$ doctrine lint ~/code/whiteboardy | grep board.depends
    45  board.depends
   # bucketed: 23 cross-document ids · 5 cross-document ranges · 6 ids on no board
   #           · 5 same-doc id + prose tail · 6 prose needing a ruling
```

---
