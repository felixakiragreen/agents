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

- 2026-08-29 · Builder (C2) · `grep.test.ts`'s 1 ms clock test is load-flaky — one failure in
  ~6 whole-suite runs, zero in 40 isolated runs (20 at C2's tree, 20 at HEAD `9d0ee05`)

`(fail) one query, three groups > the clock is a bound like any other: it fires, and the
group says so`. The test sets `GREP_TIMEOUT_MS=1` and asserts **every** group timed out; on a
loaded machine a small group can finish inside the millisecond, so the assertion is a race, not
a bound. Not C2's — C2 touched one copy string in `grep.ts` and added `prose: []` to the
fixture, neither of which is in the timing path. The fix is the test's: assert that a group
which did not finish says `timedOut`, rather than that all three did.

---

- 2026-08-29 · Builder (C2) · `doctrine`'s `MANTLES` still carries `Dispatcher`, so the deck's
  composer offers a dead mantle as a choice for a new session

`doctrine/src/grammar.ts`:10. The rig retired the preset (C25) and the deck's colour map
answers grey for it (`colors.test.ts`, C2), but `MANTLES` is what `composer.ts`:115 and
`deck-composer.ts`:98 draw their chips from. The list cannot simply drop it — it is also the
parser's grammar for historical ledger entries that name a Dispatcher — so this is a canon
question: a *parseable* mantle and an *offerable* mantle may need to be two lists.
