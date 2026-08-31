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




---

- 2026-08-31 · Builder (B26) · **an OPEN drawer cannot be clicked: the scrim paints over the whole
  app, and every queue control is behind it.**

`.deck .app` is `position: relative; z-index: 1` (`deck.css:50`) — a stacking context — so the
drawer's `z-index: 30` is scoped inside it, while `#scrim` is a root-level sibling at `z-index: 20`
(`deck.ts:250`, `deck.css:230`). The scrim therefore paints above the app, drawer included. Chrome's
own hit test says so: a click on a queue item's `[expand]` retried for ten seconds against
`<div id="scrim" class="scrim"></div> intercepts pointer events`. Every control the ⬡-queue draws is
affected — the note box, `file it`, `bless D<n>`, `jump to pane`, `chat`, and B26's `compose`/`copy`.
Pinning the drawer draws no scrim and works, which is why two probes now work around it in a comment
(C16's `chat-engine.probe.ts:42`, B26's `baton.probe.ts`). Not taken: outside B26's fence, and it is
one line — either drop `z-index: 1` from `.app`, or move `#scrim` inside `#app` below the drawer.

---

- 2026-08-31 · Builder (B26) · **a ledger entry that mentions `Next:` in its own body mis-splits, and
  the tail's baton is then read off the wrong half.**

`spacex-dashboard-c2`'s tail body contains *"two entries' `Next —` batons retyped `Next:`"*, and the
parser's Next splitter fires on that inner mention: the parsed `next` begins mid-sentence
(`` "`, and `unrecorded.` written where a clause never existed. …" ``) and carries the real Next
clause inside it. `manny`'s tail has the same shape. Consequence for any surface reading a baton: the
clause's text, its name and — where the mis-split changes which words are in scope — its holder are
read off bytes the writer did not intend as the Next clause. Both parse `felix` today, so nothing is
mis-armed. `doctrine/` is the Standards Office's and the parser never fattens render-side
(README §1), so this is filed, not fixed.
