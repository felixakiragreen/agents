# Issues — Belvedere's incident inbox (D53 pattern)

Field reports, render failures (parser-as-lint, [README §1](README.md)), and
sovereign-inbox entries (D63: `- <date> · Felix (via Belvedere) · <what>`) land
here — Felix's hand, a session's at his word, or the deck's third write
([README §2](README.md)). Entry format (D63): `- <YYYY-MM-DD> · <who> · <what>` —
one bullet per entry; an entry needing evidence becomes a `---`-separated block
opening with that line. This building's Architect sweeps at every session: each
entry ruled — distilled, laid as a charge, rejected, or escalated (canon-shaped
entries go to the canon repo's inbox) — then deleted; entries are committed before
the inbox is cleared. A cleared inbox is empty.

- 2026-08-30 · Felix · **The visual pass (G5's ⬡-gate), his verdict:** the v3
  lane and the Chat primary stand, but "there is still QUITE A BIT of work that
  needs to be done, with quite a few bugs" — a punch-list pass. The items below
  are his, verbatim, and are the rework lay's design input.
- 2026-08-30 · Felix · Chat bug: "I type one letter into the Reply box and the
  textfield unfocuses. I have to reselect it to keep typing." *(Architect's
  hypothesis, unreproduced: the poll repaint replacing the composer mid-keystroke —
  C15 F3 / B14 F4's family; B19 F2's mount-race is the sibling.)*
- 2026-08-30 · Felix · Chat bug: "Scrolling to the top of Chat snaps it back
  down to the bottom OR gets it stuck at the top, unable to scroll at all."
  *(Hypothesis: the tail-window paging seam, B16 F2's backwards-pager.)*
- 2026-08-30 · Felix · Chat design ruling: "The scroll view should show the
  entire chat & the minimap jumps to its location in the scrollview (not go
  back in time)" — continuous full-transcript scroll replaces windowed paging
  as the navigation model; the minimap is spatial, never temporal.
- 2026-08-30 · Felix · deck-wide: "Locked tooltips need a better way to
  dismiss."
- 2026-08-30 · Felix · direction: "we need to develop some UI tests. Test
  pieces of it, 1 by 1" — per-surface interaction regression tests (the camera
  + C19's fixture city are the substrate; focus retention and scroll position
  are CDP-assertable — the class C15 F2/F3 proved unit tests cannot see).
- 2026-08-30 · Felix · direction: "I'm ready to gut the v1 functionality —
  Agents Presence; completely remove the cmux nagging shit. Then a bunch of
  changes with the sidebar." *(Referents — which surfaces are "Agents
  Presence", which chrome is "cmux nagging", the sidebar list — to pin with
  him at the G5 blessing; D20/D22's cmux-retreat is the standing frame.)*
- 2026-08-30 · Felix · decoder bug, hovering `G5`: "G5 — unresolved · no board
  in scope carries a charge G5 · looked at: agents — 45 charges." Two halves:
  the honest one — G5 had no board row anywhere (un-laid, prose-only; a row is
  laid this date, which resolves the hover) — and the suspicious one — the
  tooltip names ONLY the canon board (45 charges) as consulted; hovered in a
  belvedere context it should have looked at belvedere's 46 too. Check the
  decoder's scope walk; and consider: a named-but-unlaid id could resolve to
  its planning mention (the campaign note) instead of "unresolved".
