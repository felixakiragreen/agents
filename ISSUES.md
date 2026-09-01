# Issues — the incident inbox

Field reports and distillation candidates land here — Felix's hand, or a session's at
his word. Entry format: `- <YYYY-MM-DD> · <who> · <what>` — one bullet per
entry; an entry needing evidence becomes a `---`-separated block opening with that
line. The Grand Architect sweeps at every summons: each entry is ruled distill or
reject, then deleted — the D-entry records a distillation, the sweep's ledger line
records a rejection, and git keeps the bytes (entries are committed before the inbox
is cleared). A cleared inbox is empty.

- 2026-09-01 · Builder (040) · **§7's qualified id cannot be written in the ledger head's id slot.** `isId` is `/^[A-Za-z0-9][A-Za-z0-9-]*$/` and rejects `:`, so a head reading `**<date> · <mantle> · <tier> (belvedere:C7)**` drops the id out of the row slot and into the body — a lint failure and a lost field. Two live heads (`LEDGER.md` 2086, 2151) therefore keep a bare foreign `C7`/`C13` after 040's respell. Every building that tends another's charge meets this; the fix is one character in `isId` plus a decision on whether a qualified id is legal in the row slot at all (D80 says an id abroad IS qualified). Evidence: 040-F4.
