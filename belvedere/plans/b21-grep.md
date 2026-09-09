# B21 — the Grep

**Status:** **LANDED 2026-08-28** — one keystroke, one query, one click, and the Chat is open at that turn. Nothing escalated; DoD evidenced below · **Depends on:** B15; B16; B19 · **Staffing:** Builder · opus-high · **Blessed:** the deck keel as amended 2026-08-27 (the mid-batch-5 block), on Felix's field note (ISSUES this date, ruled same sitting).

## Goal

"What was that session where I was talking about 'bob summons'?" — one keystroke, one query, one click, and the Chat is open at that turn. Everything the city writes is greppable — transcripts across all three accounts, the register's doctrine docs, `plans/`, the desk — fast, bounded, grouped, and **every hit instantly jumpable**.

## Inputs — read before building

- [deck-keel.md](deck-keel.md) §3's amended block (the commission).
- B5's shelf join (the transcript corpus ×3 accounts — discovery exists; reuse, never re-derive), B15's line-anchored doc viewer, B16's hotswap (the session jump target), B19's desk editor.
- B13's drawer (results live there — the overlay genre, pinnable).
- The limits law (directives §3.1): every search bounded — time, hits, file size.

## Spec

1. **The corpus, by kind:** *Sessions* — transcript JSONL ×3 account dirs (B5's discovery); *Docs* — the register's doctrine files + `plans/` city-wide (the walk knows them); *Desk* — `desk/`. Census/audit telemetry excluded (noise, and gitignored truth-less by law).
2. **The mechanism.** Shell out to `rg` (fixed argv, `--json`, case-smart) when on PATH; fall back to bounded `grep -rn` with the degradation named in the UI (slower, honest). Bounds hard-coded: per-kind hit cap (~50), overall timeout (~3 s), max file size skip — a capped result set SAYS it was capped (no silent truncation, B-row law). No index until measurement demands one (premature optimization law; `rg` over this corpus is fast).
3. **Entry + results.** A header search box, focusable by keystroke (`/` and Cmd+K both — pre-chewed); results render in the **drawer**, grouped Sessions / Docs / Desk, each hit: encapsulated source (session name per D16 identity · doc path · note title), the matching line with the term marked, age, and **the jump**.
4. **The jumps.** A session hit → **Chat hotswaps** to that session scrolled to the matching turn (map the matched JSONL line to its turn; B16's windowing accepts a target anchor). A doc hit → the Workshop viewer at the line (B15). A desk hit → the desk editor at the note (B19). Dead sessions jump too — the Chat renders stillness honestly; resume stays a deliberate act.
5. **Transcript honesty.** Raw JSONL search matches escaped content — plain words and phrases match verbatim; strings crossing JSON escapes (quotes, newlines) may not. The limitation is NAMED in the order and in a help tooltip, not discovered by Felix ("phrase with quotes? try the words"). A miss class this creates is a finding, not a patch.
6. **Decoded results.** Hit lines pass through B20's decoder — a result mentioning `B18` decodes like everything else.

## Acceptance criteria — the DoD

Every line below is a `PASS` from [`lab/b21/probe.ts`](../lab/b21/probe.ts), driven in a real headless Chrome at 1600×900 against the **real corpus** — the three accounts' transcript trees and the real register — with the census, the audit log, the HALT flag, the flows and the desk all pointed at a temp root, and the hands cold. **16 of 16, ALL GREEN.**

- [x] **The commissioning query, live:** typed into the rendered box and submitted by the rendered Enter —

      15 hits for “bob summons” · 280 ms · rg · case-insensitive (the term is all lower case)
      11 session hits across 3 accounts (thg-doorbell · thg-fgreen · personal)
      groups: sessions 11 · docs 4 · desk 0 — the one drawer says "results"

  and the click lands on the turn the matching line belongs to, proven against the coordinate rather than against the DOM's own opinion of it:

      Focus is the chat pane on "mentat-01" (the hit named "mentat-01", thg-doorbell · e3d25027:131)
      the matching line begins at byte 450896
      the marked turn is [data-key="392696"] and the next turn opens at EOF
        — so the anchor lies inside the marked turn and no other
      timestamped 2026-08-26T01:32:13.318Z, 5 turns in the window, the marked one scrolled into the box

  and the words he searched for are on screen (F4 — the first four hits landed in records the Chat encapsulates to one line, which is the same class §5 already names):

      hit #4 — "architect-bob-07", thg-fgreen · f01da77f:113 — opens marked and reads:
      "you 14h Dispatch is cooking. Another thing, everything needs to be greppable.
       (ex: what was that session where I was talking about \"bob summons\"?) grappable and f…"

  The jump also says it *is* a jump — `"jumped to your search hit"` with one `[↓ latest]` control, because the aimed window and the live tail are two places in the file and the deck will not stitch them into one conversation.
- [x] **A doc hit jumps to the line-anchored viewer; a desk hit opens the note.**

      agents/belvedere/plans/b21-grep.md:9 · line 9 marked, 1 line marked in the whole document
      the hit said agents/belvedere/plans/b21-grep.md:9
      the line reads "\"What was that session where I was talking about 'bob summons'?\" — one"

      Focus is the desk pane holding desk/2026-08-28-01.md — 75 B, byte-identical to the file
      the desk wrote (written through the glass's own POST /desk/save, into the temp desk)

- [x] **Bounds proven**, each of the three induced live:

      an over-cap query ("the"):
        sessions: 734 files · 23 ms · capped at 50 — there are more · 2 files skipped for size
        docs:     308 files ·  8 ms · capped at 50 — there are more
        desk:       1 file  ·  5 ms

      the rg-absent fallback AND the clock, one arm (the glass relaunched with GREP_RG naming
      nothing on PATH — BSD grep over 1.7 GB is ~8.3 s, so it outlives the 3 s budget by
      construction, F5):
        the whole query took 3214.6 ms against a 3000 ms budget · engine "grep"
        sessions timedOut=true with 0 honest hits and NO error — a timeout is a bound, not a failure
        docs 4 · desk 0 — the small corpora finished inside it

      and the degradation is on the PAGE, not just in the payload:
        "ripgrep is not on this glass's PATH — searching with grep instead: slower over the
         transcripts, and a session hit's turn anchor is computed by re-reading the file…"
        sessions: 734 files · 3010 ms · the clock ran out before this group finished

- [x] **Warm query p95 under a second over the real corpus**, and the thread is never held:

      N=20, 200 ms apart, five terms rotating over 736 transcripts + 308 doctrine documents + the desk
      min 41.4 ms · p50 82.3 ms · p95 131.9 ms · max 131.9 ms          (bar: 1000 ms)

      three /deck/state polls fired INSIDE the 3214.6 ms fallback search came back in
      85.8 ms · 42.2 ms · 42.1 ms — the engine is a spawn, so Bun's one thread is yielded
      (B8 F3's law is about synchronous work; B18 F4's posture, third venue)

- [x] **Case-smart, asserted**, on a term minted at run time so it exists in exactly one place in the world (F1):

      "grepcase4z2k8tmarker" → 1 hit,  case-insensitive (the term is all lower case)
      "GREPCASE4Z2K8TMARKER" → 0 hits, case-sensitive   (the term carries a capital)
      "GrepCase4z2k8tMarker" → 1 hit

  and the term is marked in every line that carries it:

      marks: ["bob summons"] on 15 of 15 rows · 0 elements outside a result list answer a .hit selector
      93 rows carry 161 hoverable code words between them — the mark is drawn AROUND B20's own
      seam, so a result mentioning B18 decodes like everything else (spec §6)

- [x] **Zero new deps; suite green in one process; type gate exit 0.**

      bun test belvedere/glass  →  606 pass · 0 fail · 1637 expect() calls · 24 files, ONE process
      bunx --offline tsc --noEmit  →  exit 0
      package.json / bun.lock: unchanged across every commit in this row
      grep.client.ts contains "hands/fire" 0× · /deck.js 1× (composer.client.ts, B17 F1's check)
      the law of space, with a full results drawer: body 757 px − viewport 757 px = 0 px

**The chain's probes, re-run whole against this row's client — ALL GREEN, eight for eight:** B13 · B14 · B15 · B20 · B10 · B11 · B16 · B19. The ninth, `lab/b17/probe.ts`, was **not** re-run: its two failures are already filed at its own landing commit (B11 F8) and it leaves a live workspace open when it throws (B16's addendum) — re-running it costs a session against the batch's ≤2 rule to re-measure something already recorded.

## Out of scope

- An index, embeddings, fuzzy search (measured need first); searching census/audit telemetry; editing from results; v0 pages.

## Findings

**F1 — a probe that searches the REAL corpus finds itself, and a fixed marker in its own source is in the corpus before it ever runs.** This probe's case-smart arm needs a term that exists in exactly one place; it was written as the literal `GrepCaseMarker`, and the upper-case control answered **three hits** against a note that has never contained it — the transcripts of the session *writing the probe* carry the literal, and they are in the corpus by design. Fixed at the cause: the marker is minted at run time (`GrepCase${random}Marker`), so what the corpus holds is the expression and what the note holds is the value. **This binds B12 and every later probe whose corpus is the city itself** — it is B16 F3's family (a probe cannot be waited on by its own words) one grammar along: *a probe cannot be measured by a string it wrote down.*

**F2 — a legend sample carrying the row's own class is a fifth result.** The colour legend the design law asks for drew its keys as `.hit .hit-sessions` — the same classes a result row wears — so `#host-drawer .hit` answered twelve rows where eleven existed, and the account count came back as **four, one of them the empty string**. Harmless on screen, and a lie to anything that counts: a click handler keyed on the row would have fired on a legend key too. The keys are their own class now (`hit-key`), and the probe asserts `0 elements outside a result list answer a .hit selector`. **For anyone drawing a legend of a clickable vocabulary: the sample must not be able to answer the selector the click is bound to.**

**F3 — a keydown's target is not always an Element, and `document` has no `closest`.** The `/` shortcut is only a shortcut where he is not already typing, so the handler asks `e.target.closest('input, textarea, …')`. With nothing focused the target can be the document itself, and the property access throws **inside the listener** — which takes the shortcut out with no error anybody sees and no other symptom. Measured by this row's own probe dispatching on `document` (`/` and ⌘K both returned focus id `""`). Fixed with an `instanceof Element` narrowing. **Binds anything that adds a document-level key handler to the deck.**

**F4 — the turn a raw-JSONL hit belongs to is the right turn, and it may not SHOW the term.** §5 names the escaping half of transcript honesty; this is its second face and it is the render, not the match. A hit's byte offset can fall in a record the Chat deliberately encapsulates to one line — a tool call's input is clipped to its head (spec §2) — so the anchor lands correctly and the words are not on screen. Measured on the commissioning query: **four of the first five session hits** landed in tool-call records, the fifth rendered the phrase whole. Named, not patched: widening the Chat to render a tool call's full input would undo B16's own encapsulation law, and the pane cmux owns is one click away. The probe reports both counts rather than asserting the first hit happens to be a spoken turn.

**F5 — the `grep` fallback is not "slower", it is over budget by construction, and that is what made it the honest slow arm.** Measured over the same 736 transcripts (1.7 GB): **ripgrep 0.18 s, BSD grep 8.3 s — 40×**. Against the 3 s wall clock the sessions group therefore *always* times out on the fallback, which is why the degradation banner and the per-group timeout notice both had to exist rather than one standing in for the other. It is also the cheapest genuine slow arm in the building: the worker-law measurement (three polls served in 85/42/42 ms inside a 3.2 s search) rides it, so one induced failure paid for three DoD lines. **If `rg` ever leaves this machine the Grep still answers over docs and the desk and says out loud that it could not finish the transcripts.**

**F6 — `--max-columns` is ignored under `rg --json`, so the line bound has to be the reader's.** The machine interface emits `lines.text` whole however long the line is, and a transcript record is one line that can be megabytes — so a flag cannot bound it. The reader streams the engine's stdout, drops any line past `lineBytes` and resyncs past it, stops at the per-kind cap and **kills the process there**, and carries an overall output budget besides. Two consequences worth keeping: a line that is not valid UTF-8 arrives as `lines.bytes` and is skipped rather than rendered as mojibake, and the exit code is only read when nothing else stopped the process first — a killed engine exits non-zero and that is not an error.

**F7 — subagent transcripts are outside the session corpus, deliberately and by name.** A subagent's conversation lives at `<projects>/<slug>/<sid>/subagents/agent-*.jsonl`, one directory deeper than a session, and it is **not a session the Chat can open** — `locate` resolves `<sid>.jsonl` and nothing else, so a hit in one would be a result that jumps nowhere. The corpus is `shelf.ts`'s own `transcriptsOf` (exported for this row rather than re-derived, B5's discovery), whose uuid filename filter is what keeps every session hit jumpable. The blindness is real — a subagent's words are not searchable today — and the fix is a jump target, not a wider glob.

**F8 — the anchored window is a third case, not a nullable `before`.** `windowOf` reads *backwards* and `turnsOf` kept the last forty turns of what it read; a target near the head of a busy window would have been sliced away silently, which is the failure where the jump *looks* like it worked. So `chatView` takes `Where = tail | before | around`, `turnsOf` centres its slice on the target when it has one, and the resolved turn key comes back on the wire as `ChatView.anchor` — **null where the target fell outside the window, and the client says the hit is out of view rather than marking the nearest turn**. Three named cases rather than a number and a flag, for B16 F1's own reason: a parameter meaning either question is the ambiguity class this building spends its time refusing.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§5–6,
~/code/agents/belvedere/plans/deck-keel.md,
and ~/code/agents/belvedere/plans/b21-grep.md,
and build it to its DoD.
```
