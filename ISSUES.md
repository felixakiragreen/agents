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
