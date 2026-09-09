# B19 — the desk (D17)

**Status:** LANDED 2026-08-28 · **Depends on:** B16 · **Staffing:** Builder · opus-high · **Blessed:** the deck keel, ✓ Felix 2026-08-27; this order applies §8 (D17) and D18 write class 3.

## Goal

The place Felix writes. One drawer city-wide — `~/code/agents/desk/` — where notes, dreams, and prompt drafts persist from the Action pane, and **sending routes**: a field report lands in that building's ISSUES, a message goes to a session, a draft summons loads the composer. The 17-item note that commissioned this chapter would have been written here.

## Inputs — read before building

- [deck-keel.md](deck-keel.md) §8; D17 + D18 (README §7) — the glass writes files **only under `desk/`**; ISSUES appends ride B6's existing wire; session sends ride B16's; commits are never the glass's (files on disk; sittings and Felix commit — the fence gains no git hand).
- B16's `desk/drafts/` (already minted); B6's gesture grammar (D63 — a routed field report is `- <date> · Felix (via Belvedere) · <what>` with the block form for long texts, exactly as the Architect filed the commissioning notes).
- The parked founding-ritual law: dream-into-new-repo routing stays out — the desk saves the dream FILE; founding a building remains Felix's ritual.

## Spec

1. **The store.** `~/code/agents/desk/` — flat until it needs structure (anti-sprawl): `desk/<slug>.md` per note, frontmatter-free, first line is the title; `desk/drafts/` (B16's) holds per-target chat drafts. The deck lists, opens, edits, saves; every save is a plain file write under `desk/` and nowhere else (path-confined like the font route — no path from a URL).
2. **The writing surface (Action tenant).** Reachable from anywhere in one gesture (the keel's "a place to start writing"): new note, or continue the last. Minimal = one line + [expand]; expanded = the full editor. Autosave; the B8 drill bar applies (a server death loses nothing).
3. **Send routes**, each explicit and previewed before it fires:
   - **→ building's ISSUES**: composes the D63 entry (block form when long), shows the exact bytes to be appended (the countersign law: verbatim before sign-off), one click appends via B6's wire, the note file gains a routed-stamp line (where it went, when).
   - **→ session**: hands the note text to the Chat's draft for that target (B16 sends; the desk never grows its own transport).
   - **→ composer**: loads the note as the summons body in B17's composer.
4. **Nothing else.** No tags, no search, no folders until use proves the need — the parked list exists for a reason.

## Acceptance criteria — the DoD

The browser half is [`lab/b19/probe.ts`](../lab/b19/probe.ts) — real headless Chrome over the DevTools protocol, B13 F1's instrument, **zero dependencies fetched**, against a **copy** of the `lab/b3/city` fixture and a temp desk (the ISSUES route *mints* an inbox in the building it files into, and a DoD run does not get to write one into a tracked fixture — B8 F1's law). **14 of 14 PASS, three consecutive runs.**

- [x] **Write → autosave → reload → intact; kill the glass mid-edit → relaunch → intact.** Typed into the rendered box, autosaved, and `desk/2026-08-28-01.md` is **188 B byte-identical to the box**, listed in the drawer as `"the copy-paste kill shot"` (the `#` is a heading, not part of the name). Then the drill: 241 B typed, `glass.kill()`, a **fresh process**, `location.reload()` — and the box holds all 241 B, the same note remembered open.

      PASS  typed in the rendered box → autosaved → on disk under desk/, first line the title
      PASS  the glass was killed mid-edit and relaunched — nothing was lost (the drill, B8)

- [x] **Route → ISSUES: a legal D63 block in a scratch-adopted inbox, 0 lint, previewed ≡ appended, and the note carries its routed-stamp.** `probe-fork` carries a ledger and no `ISSUES.md`, so it is the scratch-adopted building: on the register, adopting its inbox on this gesture. The preview is a **read** — the file did not exist when the render showed 290 B of append and one button.

      PASS  → inbox is PREVIEWED before it fires: the exact bytes, and the mint named
            the render shows 290 B of append and one button; …/probe-fork/ISSUES.md does not exist yet
      PASS  the PREVIEWED bytes are the APPENDED bytes — one sha, both sides
            sha256 c199b9c9701776dd… · 290 B · the tail of …/ISSUES.md is the render, byte for byte
      PASS  it lands as a legal D63h block in a scratch-ADOPTED inbox — 0 lint from the one parser
            parseIssues: 1 entry, 0 failures · "the copy-paste kill shot" · the body's own '---' is
            indented, so it cannot cut the block
      PASS  and the note carries its routed-stamp: where it went, when (spec §3)
            routed 2026-08-28 09:26 → …/probe-fork/ISSUES.md — in the file, in a trailer the editor
            takes back off

- [x] **Route → session: the note arrives in the Chat draft for the chosen target.** Written through **B16's own wire** (`POST /chat/draft`), the Chat swapped in by the shell, and the box shows it. Fired again with the box non-empty, it refuses and draws **no button at all**.

      PASS  → session resolves a target from the deck's own selection — no picker of its own
      PASS  → session: the note arrives in the Chat's draft for the chosen target, and the Chat swaps in
            desk/drafts/dddddddd….md written through POST /chat/draft; Focus is the chat pane
            (expanded) on builder-b19-probe
      PASS  and it will not overwrite a draft he is halfway through — refused, with NO button (D10)
            that target already holds a 241 B draft — send or clear it in the Chat first; the desk
            will not overwrite his words

- [x] **Route → composer: the note body becomes the composed summons, previewed live.** Waited on the *answer*, not on the words: `/deck/compose` re-resolved the whole plan against the note.

      PASS  → composer: the note body IS the composed summons, previewed live (B17's round trip)
            the composer's box holds 241 B of the note (receipts excluded) and /deck/compose answered
            against it — card tone "blocked" (a fixture with no mantle chosen has no tier, so the
            plan is honestly unarmed)

- [x] **Confinement: a crafted save outside `desk/` refused loudly.** Over the wire in the probe, and pinned in the suite over nine spellings (`../../canon/CLAUDE`, `a/b`, `.`, `..`, `Note`, `note.md`, `""`, `/etc/passwd`, `../ISSUES`), each asserting that **nothing was written**.

      PASS  a crafted save that walks out of desk/ is refused LOUDLY, and writes nothing
            POST /desk/save ‹../../canon/CLAUDE› → 409 a note is named in lower-case letters,
            digits and dashes (1–64) — got "../../canon/CLAUDE"

- [x] **`git status` shows only `desk/` additions after the DoD run — the glass committed nothing.** The probes write into temp desks, so the run itself moves nothing. Then the **live path** was run once against the **real** `~/code/agents/desk` through the glass's own write route — and that is the whole delta:

      $ git status --porcelain          # before
      ?? .claude/                       # pre-existing at session start
      $ curl -s -X POST localhost:4499/desk/save -d '{"slug":"","text":"b19 DoD — …"}'
      {"ok":true,"result":{"slug":"2026-08-28-01","title":"b19 DoD — the desk writes here, and only here","bytes":207,…}}
      $ git status --porcelain          # after
      ?? .claude/
      ?? desk/

  A live `POST /desk/preview` against belvedere's **own real** `ISSUES.md` composed the block form correctly (258 B, `sha e3a5f37120d8fee1`, no mint — it exists) and left the file **untouched** (`git status --porcelain belvedere/ISSUES.md` → 0 changes): a preview is a read. Probe note removed afterwards; `desk/.gitignore` is what commits.

- [x] **Suite green one process; type gate exit 0.**

      $ bun test belvedere/glass
       585 pass · 0 fail · 1568 expect() calls · 23 files
      $ cd belvedere/glass && bunx --offline tsc --noEmit ; echo $?
      0

- [x] **The chain's own probes, re-run whole against this row's client** — the repaint fix (F1) touches every tenant, so all seven ran: B13 · B14 · B15 · B20 · B10 · B11 · B16 → **ALL GREEN, seven for seven.**

- [x] **The poll is untouched.** The desk answers gestures, never the clock, so `/deck/state` is byte-for-byte the shape B16 left it: **p50 56 ms · p95 60 ms** (N=12, live register, armed). The desk's own routes: `/desk/notes` **p50 0.5 ms**, `POST /desk/save` **p50 0.5 ms** (N=12 each).

- [x] **Nothing here can fire.** `desk.client.ts` contains the spawning hand's path **0×**; the bundle still carries the one occurrence (`composer.client.ts`, the file allowed to — B17 F1), and the DOM check subtracts the text: `outerHTML 0× · textContent 0× · markup 0×`.

- [x] **The law of space holds with the desk in Focus** — `body 757 px − viewport 757 px = 0 px`, the editor owning its own overflow (B13 F4 kept).

## Out of scope

- Founding rituals, dream routing into new repos; search/tags/structure; any write outside `desk/` beyond the two existing wires; committing.

*(All four held. No search, no tags, no folders, no delete gesture beyond "an emptied note is removed"; the desk runs no `git`; the only files it writes are `desk/<slug>.md`, and the two existing wires it calls are B6's `filed()` and B16's `writeDraft()`.)*

## Findings

**F1 — the repaint memo outlived the host it described, and a tenant swapped away and back drew NOTHING.** `paint(key, host, signature, …)` kept `key → signature` in a module map, while `focusOn()` empties both hosts on every tenant swap. So a tenant returned to with its content unchanged found its own memo standing, skipped the draw, and left the pane blank — **no error, no lint, and only on the return trip**. Measured in Chrome, not reasoned: the desk handed a note to the Chat's draft, the shell swapped the Chat in, the draft box appeared in Action and Focus rendered **nothing at all** (`#host-focus .ct-head .big` → `null`, pane state `expanded`, tenant `chat`). B13/B14/B15/B16/B20/B10/B11's probes never caught it because every swap in them changes something the signature covers. Fixed at the cause rather than at the symptom: **the memo now records its host**, and `forget(host)` in `deck-dom.ts` retracts every claim about a host wherever one is cleared — called by `focusOn` on both. *A memo is a claim about a host's contents; emptying the host falsifies it.* **This binds B21 and B12** and anything else that swaps a tenant.

**F2 — a tenant's mount-time async restore can clobber a gesture made before it lands.** The desk's `mount()` ends with `refresh().then(() => openNote(want))`, and a module that outlives its mount re-runs that on every swap-in. A route clicked in the ~200 ms before the re-read landed had its plan wiped by `openNote`'s own `plan = null` — the preview vanished on its way to being read, and the next click found no button (`TypeError: … reading 'click'`, in the probe). Fixed by not re-opening what is already open (`if (want && open?.slug !== want)`), which removes the common case entirely. **The general rule for anyone writing a tenant: `mount()` is not a fresh start** — the module's state survives `unmount`, so a restore that assumes an empty tenant will race the user.

**F3 — the evidence indent is load-bearing, not cosmetic.** D63h's block form puts a report's body under its own entry line, and the one parser's `blocks()` splits an inbox on `^---\s*$`. Felix writes markdown and rules in it are ordinary, so an un-indented `---` inside a routed note would cut the block in half and strand the evidence in a block with **no entry line** — the one thing `parseIssues` actually lints (`issue.entry`). Two spaces of list continuation make that unrepresentable: `^---[ \t]*$` no longer matches, the markdown renders as one item, and the probe asserts the landed inbox contains `  ---` with **0 lint**. The alternative — refusing a note that contains a rule — would have been the glass telling him how to write.

**F4 — the desk rides gestures, not the poll, and it is the first tenant to declare neither seam member.** B15's `needs` and B16's `asks` exist because the *server* knows something the tenant wants; nothing on the server changes a note, so a snapshot carrying his own writing back at him every three seconds would only fight the pane he types in (B14 F4's own reasoning, one step further). `/desk/*` answers gestures like `/deck/doc`, `/deck/chat` and `/deck/decode` — and `/deck/state` is byte-for-byte the shape B16 left it, measured at p50 56 ms with the desk shipped. **The rule that generalizes: a tenant asks the poll only for what the world writes, never for what Felix writes.**

**F5 — receipts are not body, and the trailer needs no marker of the glass's invention.** *"The note file gains a routed-stamp line"* (spec §3) collides with *"frontmatter-free, first line is the title"* (§1): a receipt inside the body would be re-routed as evidence on the next filing, and a sentinel comment would put the glass's syntax inside a file he writes by hand. The trailer is therefore **the final `---` block, and only when every non-blank line in it is a receipt** — so a note ending in a rule of his own prose keeps all of it, and `stampNote` asserts its own line matches the grammar before writing one (*refusing to write a receipt the desk cannot read back*). Only the **inbox** route stamps: it is public, irreversible and somebody else's to sweep, while a note handed to a draft box or the composer has been *copied* — repeatably, and undone by clearing the box.

**F6 — `desk/.gitignore` settles B16 F4: notes commit, chat drafts do not.** D17 says the desk is *"gitted, versioned"* and a note plainly is; `drafts/<session-id>.md` is a half-typed reply with a lifetime of minutes, named after a uuid nobody will read again. B16 declined to settle it with a `.gitignore` written on its way past and handed it here; this is the answer, with the reasoning in the file. **The glass still commits nothing** (D18 class 3) — the ignore rule is a Builder's commit, not a glass write.

**F7 — the preview needed a hash, for the same reason the arm did.** The bytes an append composes depend on the inbox's *tail* (D63h's `---` decision), so an inbox that gained an entry while Felix was reading the preview would append **different bytes than the ones he signed off on**. `POST /desk/file` carries the `sha` the page was showing and refuses by name — *"the inbox moved while you were reading it — you signed off on X, the append is now Y; read it again"* — which is **B11 F3's arm law one door along**, and what makes the DoD's "previewed ≡ appended" a structural claim rather than a lucky one.

**F8 — a header comment that names the guard defeats the grep it describes.** The first draft of `desk.client.ts` opened with *"nothing here fires a session — `hands/fire` is not spelled in this file, which is the check"*, and the probe duly reported `desk.client.ts 1×`. B17 F1's check is *which source contains the string*, so **the prose that explains it must not contain it either**. Rewritten; caught by the probe on its first run, which is the check working exactly as intended.

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/belvedere/README.md §§5–6,
~/code/agents/belvedere/plans/deck-keel.md,
and ~/code/agents/belvedere/plans/b19-desk.md,
and build it to its DoD.
```
