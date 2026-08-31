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

- 2026-08-31 · Builder (C21) · `PermissionRequest` reaches the census as
  `needs-input` and the ⬡-queue as nothing — the ritual G6 gates re-opens the
  waiting blindness the gut just closed.

`waitingOf` is gated on `s.last.ev !== 'Notification'` (`glass/attention.ts:53`),
so it reads one wire shape; `BY_EVENT` maps `PermissionRequest → 'needs-input'`
(`glass/census.ts:113`), B14 F1's deliberate ready-before-the-sensor line, inert
only because no account subscribes to that hook today. When Felix runs B22's
runbook (`plans/permissionrequest-runbook.md`), a session blocked on approval
whose last beat is `PermissionRequest` will render `needs-input` on the City line
and produce **no queue item, no badge, no ring** — and B14 F1 measured the
`Notification` inference as ~6 s late and interactive-only, so for a headless step
the new event may be the only blocked signal. One line plus its test; C21's fence
did not name it. Full record: [C21 F1](plans/c21-gut-v1.md).

---

- 2026-08-31 · Builder (C21) · the fixture city's session ids are not uuids, so no
  probe can open the Chat on a seeded session.

C19's seeder writes readable sids (`fixture-nagged`, `fixture-working`) and B22's
UUID sweep made `glass/chat.ts:572` refuse anything that is not a uuid — measured
against a fixture twin: `GET /deck/chat?sid=fixture-nagged` → `200 {"target":null,
"error":"not a session id: \"fixture-nagged\"" …}`. Every later charge drawing a
session surface (B26, B24, B27) inherits it. One line in
`camera/fixtures/seed.ts`. Full record: [C21 F3](plans/c21-gut-v1.md).

---

- 2026-08-31 · Builder (C21) · the deck's legend draws a dot class the deck never
  produces: `['dot s-idle w-blocked', …]` (`glass/deck.client.ts:232`) — a real
  blocked session is `s-needs-input w-blocked`, since `sessionState` types the
  same beat `needs-input`. Invisible (`.w-blocked` overrides the background) but
  the legend is the reader's key to the page's classes. Changed and reverted
  inside C21 — not a pinned referent. One token, B27's sweep. [C21 F4](plans/c21-gut-v1.md).
