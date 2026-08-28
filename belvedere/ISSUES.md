# Issues — Belvedere's incident inbox (D53 pattern)

Field reports, render failures (parser-as-lint, [README §1](README.md)), and
sovereign-inbox entries (D63: `- <date> · Felix (via Belvedere) · <what>`) land
here — Felix's hand, a session's at his word, or the glass's third write
([README §2](README.md)). Entry format (D63): `- <YYYY-MM-DD> · <who> · <what>` —
one bullet per entry; an entry needing evidence becomes a `---`-separated block
opening with that line. This building's Architect sweeps at every sitting: each
entry ruled — folded, cut as a row, rejected, or escalated (canon-shaped entries
go to the canon repo's inbox) — then deleted; entries are committed before they
are drained. A swept inbox is empty.

---

- 2026-08-28 · Felix (via the G2 Architect, deck field report) · **"[jump to pane]
  works, but it put the new session in the wrong workspace (a brand new one), so
  I moved it to my existing 'belvedere' workspace. Workspace management will need
  to be figured out."** The engine's fire minted `workspace:115` for the
  recording sitting — by design today: P2's recipe (new-workspace per fire) is
  probe-era law and every hand inherited it. His expectation — a fire for a
  building lands in that building's workspace — is the deck-era design. Ask for
  the rework chapter: workspace placement policy — a flow/step `workspace` field,
  or building-homed placement (fires for `agents/belvedere` land in the workspace
  he keeps for it, minting only when none exists). Pairs with D16 (cmux is truth
  for identity), B18's socket read (the join exists to find "his belvedere
  workspace" by name), and P6 F2 (address by UUID once found). Also in scope:
  who retires a fire's minted workspace when its panel is moved out by hand —
  D55 covers probes at landing, not his rearrangements.

---

- 2026-08-28 · Felix (via the G2 Architect, deck field report) · **"[hotswap to
  the Chat — B16] is greyed out, disabled, I assume it's because it hasn't been
  built yet?"** — the assumption is wrong in an instructive way: the Chat IS
  built (B16, LANDED 2026-08-28). The control is not a disabled button but a
  placeholder — `el('span', 'slot', 'hotswap to the Chat — B16')`
  (`works.client.ts` drawNodeActions), drawn by B10 before B16 existed. B16's
  order named three hotswap entry points (City · Workshop · needs-you queue);
  the Works was not among them, so the slot was never wired when the Chat
  landed. Two fixes, both cheap: wire it — the fired node carries the sid, the
  seam members exist (`swap.to('chat')` is B10 F8's own addition; the `?s=`
  query is B16 F1's) — and the honest-disabled law: anything rendered inert
  says WHY on hover (B16's cold send does it right: "the hands are cold"); a
  slot that names a landed row reads as broken, not pending.
