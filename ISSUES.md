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
