# C21 — the gut: the cmux nag

**Status:** LANDED 2026-08-31 · **Depends on:** — (the referent ⬡ paid at the blessing, 2026-08-30) · **Staffing:** Builder · opus-high · **Blessed:** ✓ Felix 2026-08-30 (the rework blessing)

## Mission

Felix's direction, verbatim (the visual pass, 2026-08-30): **"I'm ready to gut the v1 functionality — Agents Presence; completely remove the cmux nagging shit."** The frame is standing law: cmux retreated to viewport candidate (D20/D22) and the Chat is primary — surfaces built for the pane-first world whose job the Chat and the Works now do die whole, tests with them, zero debt (D22 r2's precedent: the v2 engine died the same way).

**The referents, pinned (Felix, the blessing 2026-08-30, screenshot in hand — "it's the CMUX bug: stale NAGGING because cmux says needs input" — then his correction, verbatim: "I do want to see when there is an agent that's working, or has input / blocked / but it was specifically the CMUX part I'm ready to remove"):**

1. **Presence SURVIVES.** The LIVE SESSIONS surface and its signal — an agent working, needing input, blocked — stay visible. Their states come from the census's own sensors only: `working`, `Stop` → idle (P1 F1's real idle sensor, `census.ts:109`), `permission_prompt` → blocked — never from the cmux nag.
2. **The cmux part DIES**: the `nagging` class whole — `Waiting = 'blocked' | 'nagging'` (`deck-model.ts:869`), where `nagging` is the `idle_prompt` `Notification`, the 60-second cmux "waiting for your input" nag (`attention.ts:44`) — killed everywhere it renders or ranks. **`blocked` (`permission_prompt`) is real attention and survives.**
3. **Stale labels die with it.** A needs-input label must never outlive the fact: the 33m/21h NAGGING rows in his screenshot were quiescent last-event labels (`census.ts:126`). After the gut, every rendered state is one the census's sensors currently support — a label with no living evidence renders as what it honestly is (idle / unknown with its age), never as a demand for input.

## Inputs — read before working

- The pinned referent list (the Mission — pinned at the blessing, no amendment needed).
- D20/D22 (the cmux retreat), C16 F4 (`sid` vs `chat` — a headless step has a conversation and no pane; the pattern for what survives), C15 (how a surface dies whole: git rm, tests die with it, zero live references).
- The camera (C17) + the fixture city (C19) — every removal is photographed.

## Spec

1. **Delete whole.** Each named surface: code, styles, tests, fixtures die together; no stubs, no hidden flags, no "kept just in case" (the best code is no code).
2. **Surviving organs untouched.** The City, the Works, the Chat, the queue, the shelf's surviving half, census, gauges — whatever the list does not name is byte-identical except where a dead surface's removal forces a seam cut, and every forced cut is named in findings.
3. **Photograph the before and the after** of every route the gut touches; the after shows no hole (adjacent panes absorb the space per the law of space — no dead rectangles).

## Done when:

- [x] **Every listed referent gone: grep-proof zero references.** The class had six live sites and every one is cut — `Waiting = 'blocked' | 'nagging'` (`deck-model.ts`), the `idle_prompt` arm of `waitingOf` and the two-entry `WAITING_NOTE` (`attention.ts`), the queue item's nag prose, the legend swatch (`deck.client.ts`) and the `.dot.w-nagging` rule (`deck.css`), plus its assertion in `attention.test.ts`. Measured over source, tests and CSS across `glass/ camera/ v3/ lab/ doctrine/`:

  ```
  $ grep -rn "nagging\|NAGGING" --include=*.ts --include=*.css --include=*.txt \
      --include=*.html glass/ camera/ v3/ lab/ doctrine/
  glass/attention.test.ts:41:  // that outlived its fact by hours — the 21-hour NAGGING rows in Felix's own screenshot. The
  glass/deck-model.ts:881:   * **There was a second, and C21 cut it.** `nagging` read cmux's 60-second `idle_prompt`
  glass/attention.ts:44:     * YOU — so the class it named (`nagging`) is gone: code, rank, badge, dot, note and test. A session
  camera/fixtures/seed.ts:117: * render as a demand for input (`NAGGING`, ranked into the queue and badged on the City) and now
  ```

  Four hits, zero of them code: each is a comment recording the removal at the site of it. The bundle is grep-proof by construction — `/deck.js` is built from `deck.client.ts` at server start, and the probe counts `.dot.w-nagging` in the live DOM at **0** (below). The surviving `idle_prompt` reads are the sensor's, not the class's: `census.test.ts:31` pins the beat as **idle** (it always did), and `seed.ts` emits one so the gut has a subject.

  **Before / after, one page, both Read.** The fixture city gained the state it lacked (`fixture-nagged`: `Stop` at −21 h 01 m, `Notification/idle_prompt` 60 s later, live pid), which reproduces Felix's screenshot on demand:

  | | before (`5002e38^`) | after (`5002e38`) |
  |---|---|---|
  | City session line | `builder-beta-05 · NAGGING · 21h`, amber pulsing ring | `builder-beta-05 · IDLE · 21h`, flat blue idle dot |
  | City strip | `5 LIVE · 2 BLOCKED ON YOU` | `5 LIVE · 1 BLOCKED ON YOU` |
  | beta's badges | red waiting `1` + purple gate `1` | purple gate `1` |
  | ⬡-queue | `5 things need you` — card 2 is `BLOCKED ON YOU · builder-beta-05 — waiting for your input · 21h` | `4 things need you` — no such card |
  | drawer count | `5` | `4` |
  | legend | 4 rows, incl. the amber *"waiting for your input — the session said so"* | 3 rows, reflowed |

  Shots: `camera/shots/2026-08-31T03-38-46-916-c21-before-deck.png` · `…03-38-47-510-c21-before-queue.png` · `…03-41-36-029-nag-honesty-city.png` · `…03-41-36-112-nag-honesty-queue.png`. **Presence is byte-identical across the pair** (referent 1): five live lines, `builder-alpha-07 WORKING`, `digger-alpha-02 BLOCKED` with its red ring, its queue card and beta's gate badge all unmoved.

- [x] **`bun v3/gates.ts --glass` ALL GREEN**, no test skipped — the one dead assertion was replaced by the gut's own (`waitingOf` on an `idle_prompt` is null), so the glass suite went 609 → 609:

  ```
  | gate | result | counts | wall | exit |
  |---|---|---|---|---|
  | engine · suite | PASS | 80 pass · 0 fail | 24.3s | 0 |
  | barrage · suite | PASS | 41 pass · 0 fail | 23.5s | 0 |
  | fake-claude · suite | PASS | 60 pass · 0 fail | 10.3s | 0 |
  | console · suite | PASS | 30 pass · 0 fail | 1.7s | 0 |
  | engine · types | PASS | 0 errors | 0.1s | 0 |
  | barrage · types | PASS | 0 errors | 0.1s | 0 |
  | fake-claude · types | PASS | 0 errors | 0.1s | 0 |
  | console · types | PASS | 0 errors | 0.1s | 0 |
  | gates · types | PASS | 0 errors | 0.1s | 0 |
  | glass · suite | PASS | 609 pass · 0 fail | 2.3s | 0 |
  | glass · types | PASS | 0 errors | 0.2s | 0 |
  | barrage | PASS | 1000 runs · 50 cuts · 9/9 mutants | 149.2s | 0 |

  ALL GREEN — 12 gates, wall 211.9s
  ```

  **No predecessor probe was retired**: the nag had none — B23's standing family never covered it, which is why it survived to a screenshot. The whole family re-ran green *with the seventh fixture session in it*, so the seed change broke nobody (`--fast --probes`, tail):

  ```
  | probe · fixture-rail | PASS | 2 shots | 6.9s | 0 |
  | probe · fixture-building | PASS | 2 shots | 7.3s | 0 |
  | probe · fixture-broken | PASS | 2 shots | 6.9s | 0 |
  | probe · fixture-gauges | PASS | 2 shots | 7.2s | 0 |
  | probe · nag-honesty | PASS | 2 shots | 6.7s | 0 |

  ALL GREEN — 25 gates, wall 300.0s (--fast: barrage skipped)
  ```

  `nag-honesty.probe.ts` joins `camera/probes/standing.txt` and was **seen to fail** — the defect reinstated as one ternary arm, the probe caught it in the DOM:

  ```
  $ perl -pi -e "…? 'nagging' as never : null;" glass/attention.ts
  $ bun camera/cli.ts run probes/nag-honesty.probe.ts
  error: 3 nagging ring(s) on the City — the class C21 removed is drawing again
  $ git checkout glass/attention.ts
  ```

- [x] **Zero layout holes.** Two routes consume the cut and no others (measured — `waitingOf`/`needsYou`/`cityRows` have exactly two importers outside their own tests): `/deck`'s City pane + ⬡-queue drawer, and the Chat tenant's state word through `chat.ts:161`. `/`, `/city` and `/shelf` never imported the class and are untouched. Both `/deck` surfaces are photographed above; the queue's four survivors close up with no gap and the legend reflows 4 rows → 3. Page scroll is pinned in the standing probe, not asserted:

  ```
  space      page scroll 0 px · content 900 ≤ viewport 900
  ```

- [x] **Budget 0 real turns** — spent 0. Every measurement rode the fixture city and the camera's disarmed twin; no session was ignited, resumed or messaged.

## Out of scope

- The sidebar rework ("then a bunch of changes with the sidebar" is B24's amendment intake, not this charge); anything the pinned list does not name; the ⬡ prettifying pass (still DEFERRED).

## Findings

**F1 — the ritual G6 gates will re-open the blindness the gut just closed: `PermissionRequest` reaches the census as `needs-input` and reaches the queue as nothing.** `waitingOf` is gated on `s.last.ev !== 'Notification'` (`attention.ts:53`), so it reads exactly one wire shape. The census reads two: `BY_EVENT` maps `PermissionRequest → 'needs-input'` (`census.ts:113`), a line B14 F1 put in deliberately — *"the reader is ready before the sensor is"* — and it is inert only because no account subscribes to that hook today. **The moment Felix runs B22's runbook (`plans/permissionrequest-runbook.md`, G6's own ⬡-gate), a session blocked on approval whose last beat is `PermissionRequest` renders `needs-input` on the City line and produces no queue item, no badge and no ring.** Worse where it matters most: B14 F1 measured the `Notification` inference as *"~6 s late and only in interactive sessions"*, so for a headless step the new event may be the **only** blocked signal, and `waitingOf` would never see it.

Not fixed — the pinned list does not name it and the charge's own out-of-scope clause is *"anything the pinned list does not name"*. It is one line (`if (s.last.ev === 'PermissionRequest') return 'blocked'`) plus its test, and it belongs to whoever lands the ritual: **G6 or B27**. Filed to [ISSUES](../ISSUES.md). Evidence, verbatim, both files at this landing:

```
census.ts:113   PermissionRequest: 'needs-input',
attention.ts:53 if (!isLive(s) || s.last.ev !== 'Notification') return null;
```

**F2 — `Waiting` is now a one-member union, and it re-derives a fact the census already carries.** After the cut, `waitingOf(s) === 'blocked'` ⟺ `last.ev === 'Notification' && why === 'permission_prompt' && isLive(s)`, which is the *same* predicate `sessionState` uses to answer `'needs-input'` — narrower by exactly F1's missing event. So the wire carries the fact twice (`DeckSession.state` and `DeckSession.waiting`) and the deck prints two words for it: the City line renders `s.waiting ?? s.state`, so a blocked session says **BLOCKED** where the shelf says **needs input** for the identical census beat (`shelf.ts:162`) — one concept, two words, which the Standard forbids.

The type was **kept, deliberately**: the charge rules *"`blocked` is real attention and survives"*, and collapsing `Waiting | null` into `state === 'needs-input'` is a wire-shape change to a surviving organ, which is the Architect's call and not a Builder's. Named here so the choice is visible: the honest end-state is one computation, and F1's fix is where it would land.

**F3 — a probe cannot open the Chat on a fixture session, and the refusal is correct.** C19's seeded sids are readable (`fixture-nagged`, `fixture-working`), and B22's UUID sweep made `chat.ts:572` refuse anything that is not one. So the Chat's own state word — the second surface this cut reaches, through `chat.ts:161` — cannot be photographed against the fixture city. Measured:

```
$ (fixture twin) GET /deck/chat?sid=fixture-nagged
200 {"sid":"fixture-nagged","target":null,
     "error":"not a session id: \"fixture-nagged\"", "turns":[], …}
```

It rides the same single `waitingOf` call as the City line, so the cut covers it by construction and the suite pins it (609/0) — but **any later charge wanting a Chat probe against a seeded world must mint uuid sids in `seed.ts` first** (B26, B24 and B27 all draw session surfaces). Filed to [ISSUES](../ISSUES.md); one line in the seeder, not this charge's.

**F4 — the deck's legend draws a class combination the deck never produces.** `['dot s-idle w-blocked', …]` (`deck.client.ts:232`) was the pair-mate of the nagging swatch; a real blocked session is `s-needs-input w-blocked`, because `sessionState` types the same beat `needs-input`. Cosmetically invisible — `.dot.w-blocked` overrides the background either way — but the legend is supposed to be the reader's key to the classes on the page. **Changed and reverted within this charge**: it is not a pinned referent and the Builder's forbidden list names the one-liner explicitly. B27's sweep, one token.

## Kill criteria

A listed referent whose removal would take a surviving organ's dependency with it (a shared module, a census read) → **stop and escalate with the dependency named** — never partial-delete silently, never stub it.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§2–3 and §§5–6 (the fence,
design laws, agreements; the campaign notes),
and execute the charge at ~/code/agents/belvedere/plans/c21-gut-v1.md.
```
