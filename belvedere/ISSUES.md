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

- 2026-08-28 · Felix (via the batch-6 Architect, field report) · **mentat-00: cmux
  says "needs input" (it doesn't), and Belvedere shows it only as `fc21e29a`, never
  by name.** Two faces, both part-diagnosed, labeled hypothesis pending one check.
  (a) The badge: the census's last events for `fc21e29a` are resume cycles ending in
  `Notification idle_prompt` — per the census contract (P1: **`Stop` is the idle
  sensor; `Notification` is a 60 s interactive-only nag**; B14/P5: a real stall
  carries the `permission_prompt` signature), the session is idle at its prompt,
  asking nothing. cmux's "needs input" badge is cmux's own heuristic conflating
  idle-at-prompt with needs-input — the deck's attention model already refuses that
  conflation, and D16 makes cmux truth for *identity*, never attention. Likely
  nothing to build; verdict at next sweep. (b) The name: **`mentat-00` is in no
  lineage log** (the rig's log carries `mentat-agents-01/-02` only), so the glass
  has no stamp and renders the uuid honestly (B5's unstamped class) — but B18's
  live-identity read should still put cmux's own title beside it. **The 10-second
  diagnostic is Felix's: does the deck header say `live identity STALE …`?** If
  stale, it's the socket password/arming; if live and still nameless, B18's ws-join
  missed this session — that's a real bug, cut it next sweep.
