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

- 2026-08-31 · B23 (Builder) · `register.worker.ts` reads `$GLASS_CITY` out of its own env, and a
  Bun worker never sees a `process.env` its parent set at RUNTIME — so a process that points the
  glass at a fixture city after start-up has its held register silently replaced, on the first TTL
  expiry or `bust()`, by a walk of the real `~/code`.

Measured, two lines, `bun lab/b23/stale.ts` (its own §the worker):

```
the worker  a value put in process.env at runtime reaches a Bun worker as: ABSENT
```

and the consequence, before the lab script was re-written to re-exec with the knob in the SPAWN
env: after one `bust()` the fixture building had **vanished** from the register (`-1 rows`) because
the worker had walked `~/code` instead. With the knob in the spawn env the same script reads
`after bust  3 rows · nb2 on the register`.

**It cannot reach Felix's deck** — the server is launched with its env, and `--fixture` twins get
`GLASS_CITY` in `Bun.spawn`'s `env` (`camera/twin.ts`), which a worker does inherit. It reaches
**tests and lab scripts**, silently: a suite that sets the knob and then trips the TTL is asserting
against the real city. B8 F1's family (an env knob that does not reach where you think), one thread
along. Not fixed here — B23's §4 face did not reproduce and this is outside its cause; the honest
fix is one line (hand the worker its city root at construction rather than letting it re-read the
environment), and it is a change to the worker's interface.
