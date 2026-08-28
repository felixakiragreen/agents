# B17 — the composer in Action + live usage

**Status:** **LANDED** 2026-08-27 · **Depends on:** B10 · **Staffing:** Builder · opus-high ·
**Blessed:** the deck keel, ✓ Felix 2026-08-27; this order applies §3 (Action
at rest) + the field report's composer items.

## Goal

The Action pane at rest is the summon composer, whole: every knob live —
mantle, tier, account, directory, theater (customizable), increment — the
summons text updating as knobs move, mantle colors on the pickers, the stamp
derived from the chosen building (never the cwd), and **usage live in
place** — a fetched number, never a 391-minute-old log.

## Inputs — read before building

- [deck-keel.md](deck-keel.md) §3; B13's seam (Action content contribution);
  B18's color map (picker swatches use it).
- v0 `composer.ts` / `trust.ts` / `summon.ts` — the compose/parseFire/trust
  logic ports; the PAGE dies later, the logic lives.
- The field report items 1–2 (live preview, mantle colors), 4–5 (venue +
  stamp: `architect-agents-03` where `architect-belvedere-02` was meant —
  the theater must follow the chosen building/board, with row 14's
  `.summon-theaters` convention as the vocabulary), B7 F3/F4 (slug law, the
  census as third stamp source, the `known` list the rail never passed —
  close it here).
- Canon row 10's usage fetcher: OAuth endpoint, keychain service =
  `sha256(config dir)[:8]` — the proven mechanism the rig uses; the deck
  fetches with the same discipline.

## Spec

1. **The tenant.** Composer registers as Action-at-rest content (minimal =
   one line + fire affordance state; typical = the knob set; expanded = +
   templates + trust verdict + usage detail). Inert-until-composed stands:
   the fire button arms only on a resolved compose (parseFire, D10 — v0's
   law carried).
2. **Live preview.** Every knob change re-renders the summons text and the
   resolved plan (stamp, color, cwd, worktree, trust verdict) client-side
   from the same resolution logic the server fires with — one logic, bundled
   both sides or round-tripped; never two copies drifting (pick the
   mechanism, name it).
3. **The stamp follows the building.** Theater = the chosen
   building/board's name (belvedere work at `~/code/agents` stamps
   `…-belvedere-NN`), honoring `.summon-theaters` where present; the
   increment previews from all three stamp sources (logs + census — B7 F4's
   `known` list finally passed). The cwd stays the venue; it stops naming
   the work.
4. **Usage, live.** One module: per-account OAuth usage fetch (row 10's
   mechanism), cached ≤60 s with age printed, fetch-on-expand; failures
   render stale-with-age, never invent (D10 family). Rendered beside the
   account picker (the standing law: usage wherever accounts are chosen)
   and available to the Works' arm bill (B11 consumes this module).
5. **Mantle colors** on the mantle picker via B18's map; legends where color
   carries meaning.

## Acceptance criteria — the DoD

Every browser fact below is [`lab/b17/probe.ts`](../lab/b17/probe.ts), driven in the
machine's own Chrome over CDP against a real glass on port 4495 — **the real city**,
because the row's whole subject is two real directories, and a fixture could only
prove a fixture's spelling. Eleven checks, **ALL GREEN**, run whole three times.

- [x] **Knob → preview: three knobs, no reload, and the bytes match on a sha.**
  Each chip click moved the **summons text** and the plan, in one document:

      effort  : tier opus-high → opus-low · summons "You are a Builder at opus-high."
                                                 → "You are a Builder at opus-low."
      mantle  : stamp builder-belvedere-78 → digger-belvedere-01 · color #0362b2 → #9e490c
                summons "You are a Digger at opus-low."
      account : personal → thg-fgreen (its own usage chip beside it)
      the page marker survived all three and navigation entries stayed 1

  The byte chain has **four links, not three** — what is in the box, what the card
  claims about it, what the hand wrote, what the session read:

      in the box on screen  : 108 B · sha256 39449981deadf642
      the card's own claim  : 108 B · sha256 39449981deadf642
      the hands' receipt    : fired workspace:82 · builder-belvedere-78 · 108 B · sha 39449981deadf642
      the transcript's turn : 108 B · sha256 39449981deadf642
                              ~/.claude/projects/-Users-felix-code-agents/9a57893a-….jsonl

- [x] **The stamp follows the building; the ordinal reads all three sources.**
  Clicking `agents/belvedere` in the City and typing `~/code/agents` as the venue:

      building agents/belvedere → theater "belvedere" · venue /Users/felix/code/agents
      stamp builder-belvedere-78

  v0 read the venue for both questions and would have stamped after `agents` — the
  field report's own case, closed at the model. The **78** is B7 F4 induced: the
  probe's fixture census carries `builder-belvedere-77` on a transcript **neither
  lineage log has ever seen** (`"builder-belvedere"` in `invocations.jsonl`: **0**;
  in this run's audit: **0**, `CENSUS_DIR` being the temp root), so two logs alone
  would have minted `builder-belvedere-01`. And the ordinal it spends is spent: after
  the fire the composer previews **`builder-belvedere-79`**.

- [x] **Usage live ×3, matching the rig's own `_summon_usage_delta`, 9 of 9 cells.**
  The composer fetches on expand; the rig's own `summon-usage` was asked in the same
  breath — two independent keychain reads, two independent fetches, ~2 s apart:

      rig  (summon-usage) : sess 0% +49 | week 19% +6 | fable 17% +8 |
                            sess 7% +92 | week  2% +4 | fable  4% +2 |
                            sess 40% +15 | week 35% -1 | fable 21% +13
      deck (its own fetch): sess 0% +49 | week 19% +6 | fable 17% +8 |
                            sess 7% +92 | week  2% +4 | fable  4% +2 |
                            sess 40% +15 | week 35% -1 | fable 21% +13
      sources: personal live · thg-fgreen live · thg-doorbell live

  Not one figure came off a cache file. **The 391-minute number is dead and its
  corpse is labelled**: an unfetched account renders `cache` with its age (measured
  at 233 minutes on the first smoke). Age prints on the chip *and* in the block —
  `personal 0% +49 · 0s`, `personal … live · 0s old`.

- [x] **A blocked fetch renders stale-with-age, and never invents.** Induced live
  rather than mocked: a second glass whose `USER` names nobody, so `security` finds
  no credential for any account.

      personal:     cache 11s old · sess  0% · "keychain: no credential for this account (security exited 44)"
      thg-fgreen:   cache 10s old · sess  7% · "keychain: no credential for this account (security exited 44)"
      thg-doorbell: cache 10s old · sess 40% · "keychain: no credential for this account (security exited 44)"

  The figures stand, wearing the refusal; not one of them is a zero. Pinned in the
  suite too, on both sides of the rule: a refusal after a good fetch keeps the good
  figures *and their own age* (`fetchedAt` 1000, not the clock), and a refusal with
  nothing behind it renders `none` with no figures at all.

- [x] **One live fire through the whole path** — haiku·low, `~/code/agents`, from
  the rendered knobs: `fired workspace:82`, and cmux's own answer

      ref workspace:82 · uuid D6AE3853-B67C-4D31-B4F2-F50EB8981F21
      title "builder-belvedere-78" · color #0362B2

  **coloured per the map** (Builder is felikai blue `#0362b2` — B18 F1's table — and
  the socket took it verbatim) and **named per the building**, not the venue.
  Workspace closed at landing (D55); `CENSUS_DIR` was the temp root, so the probe's
  summons file and its audit line died with the temp tree — B8 F1's lesson kept from
  the other side, since `nextStamp` counts that log forever after.

- [x] **Suite green in one process; type gate exit 0.**
  `bun test belvedere/glass` → **486 pass / 0 fail**, 1289 expect() calls, 20 files,
  624 ms. `bunx --offline tsc --noEmit` from `belvedere/glass` → **exit 0**.
  Zero new dependencies; `bun.lock` untouched.

Also measured, not asked for:

- **`POST /deck/compose` p50 8 ms · p95 14 ms** (N=12, live register) — a gesture's
  price, not a clock's. `/deck/state` is byte-for-byte the shape B18 and B20 left it:
  the composer opens no second poll and the usage fetch never rides one.
- **The law of space holds at minimal**: Action's head is the whole of it — card
  `0 px`, knobs `0 px`, summons box `0 px`, `body.scrollHeight 757 ≤ viewport 757`.
- **Zero `<select>` in the whole document**; every choice is a toggled button group.
- B13, B14, B15, B20 and B10's probes re-run whole: **ALL GREEN, five for five.**

## Out of scope

- Sending to sessions (B16); template editing; any rig/`presets.tsv` change
  (the rig is canon's — needs there ride the canon inbox at the gate).

## Findings

**F1 — the composer is the deck's only fire surface, so four predecessor probes had
to change what they measure — and the new check is strictly stronger.** B14, B15,
B20 and B10 each assert `"hands/fire"` appears **zero times in `/deck.js`**. That was
true while the deck could not fire and is false the moment Action holds the composer
(keel §3). The invariant those checks protect never changed — *nothing in these panes
may reach the spawning hand* — so it moved from *"the bundle contains it zero times"*
to *"which **source** contains it"*, which names the one file allowed to instead of
counting a string:

    sources: deck.client.ts 0× · deck-dom.ts 0× · workshop.client.ts 0×
             works.client.ts 0× · composer.client.ts 2×
    /deck.js is 85 544 B and carries it 1× — from the composer and nowhere else

Amended in all four probes with the reasoning at the assertion (B6's precedent for
narrowing a predecessor's check). `deck.client.ts`'s own header lost the literal path
it used to quote, so the grep can answer honestly.

**F2 — a DOM grep for a wire path is unsound against the real corpus, and B14/B15/B20
pass only because their fixture cities never quote it.** Over the real city the
belvedere Workshop renders belvedere's own board, and belvedere's own board writes
`/hands/fire` in prose (B4 F1's wire contract, quoted). This probe measured **4×** in
the City + drawer + Focus DOM with **zero** fire wiring anywhere in it. The question
was never whether the string is on screen; it is whether any of it is **markup**, and
`outerHTML` minus `textContent` is exactly that difference:

    City + drawer + Focus: 0 fire attributes and 0× in MARKUP;
    the 4× on screen are the corpus quoting the path in its own prose

**Anything later that greps rendered DOM for a path must subtract the text**, or it
will fail the day a doctrine file mentions the thing it is guarding.

**F3 — the plan being live is not enough: the summons TEXT has to move too, and that
forced templates to be sticky.** A summons fence names its own mantle and its own tier
(D45), so a page showing `You are a Builder at opus-high.` beside an `opus-low` fire
is a page arguing with itself — and v0's composer did exactly that (the chip filled
the words once and froze them). So a clicked template stays the **source of the body**
and re-speaks at whatever the knobs now say; the six mantle chips are **one template
parameterised by mantle**, so moving the mantle knob moves the words rather than
leaving a Digger speaking as a Builder. **The first keystroke in the box clears the
stickiness** and from there the words are his and nothing rewrites them. `founding`
is unaffected by construction: DOCTRINE §12 is bytes, not a formula, so its body
ignores the knobs and stays byte-identical (pinned). **This binds B16 and B19** —
anything that renders text Felix will edit needs the same rule about when it may
rewrite what he is looking at.

**F4 — the resolution is round-tripped, and that is the named mechanism** (§2 asked
for the choice to be made and named). `POST /deck/compose` resolves the whole draft
server-side, because resolving one means reading the register, three accounts' trust
files, two lineage logs, the live census and `git` — none of which exists in a
browser. Bundling "the same logic" client-side would be a second copy fed by a second
copy of the disk, and two copies drift. The client holds knobs and draws answers; it
derives nothing. It costs **8–14 ms** a move, which is why the choice is affordable.
Two consequences worth carrying: **the bytes the button posts are the bytes the page
was handed**, never a re-derivation assembled from the DOM; and `composePlan` cannot
be tested in `bun test`, because it calls `register()` and the register holds ONE warm
copy keyed on nothing (B15 F4) — a second fixture city in the suite silently decides
`deck.test.ts`'s results. Everything server-shaped therefore rides `lab/b17/probe.ts`,
which is B15 F4's own instruction taken literally.

**F5 — the live fetch is off the poll, and B10's bill got the live figures for free.**
`usage.ts` splits the question in two: `refreshUsage` fetches (three accounts in
parallel — **~1.0 s** for all three, since they are three independent tokens) and
`usageNow` answers from the held copy **without touching the network**. The composer
fetches on expand and at most once a minute; `worksUsage` — which runs on the deck's
three-second poll — reads through `usageNow`, so B10 §5's own note (*"B17 puts a live
read behind this same shape"*) is paid with **no network on the request thread**.
B18 F4's remaining ~266 ms of poll headroom is untouched: `/deck/state` is unchanged.

**F6 — the token law held, including in the suite.** The access token flows
`security` → this process's memory → one `Authorization` header and lives nowhere
else: never in argv (`ps` leaks that), never in a cache, a log, an audit line or a
rendered page. The keychain service is **derived, never stored** —
`Claude Code-credentials-<sha256(realpath(config dir))[0,8]>`, canon row 10's own
string, and the proof that the derivation is right is that all three accounts answered
`live` on the first try. `usage.test.ts` asserts on shapes and on failure paths and
**never on a credential's value** — B8 F1 printed Felix's live socket password into a
test diff once, and the way to not do that again is to not write the assertion.
`refreshUsage` takes its fetcher as an argument for the same reason: a suite that read
his keychain and called Anthropic three times would spend his quota to prove
arithmetic, and would prove nothing about the paths that can lie.

**F7 — the register's `Entry` list is the building picker, and the City is the
picker.** There is no building knob: the composer's building **is** `selection.building`,
the deck's one cross-pane fact (keel §3's ontology). One click in Context sets what the
Workshop opens *and* what the fire is named after, which is one fewer control, one
fewer way to disagree, and the ontology rendered rather than described. The escape
hatch is the theater knob, which is what §1 asked to be customizable anyway.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§5–6,
~/code/agents/belvedere/plans/deck-keel.md,
and ~/code/agents/belvedere/plans/b17-composer-usage.md,
and build it to its DoD.
```
