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

- 2026-08-28 · Felix (via the G2 Architect, deck field report) · **"I need a clearer
  differentiation between repos & campaigns. I need to be able to rearrange this
  structure to best suit my flow. For example in the city view there are two header
  sections named `~/code/agents`, one with `agents` and the other with
  `agents/belvedere`."** He went looking for the Works flow in `agents` when it
  lives in `agents/belvedere` — the two-buildings-one-repo shape (D2 subproject)
  is invisible at the City. Two halves: **(1) the duplicate headers are a deck
  bug** — hypothesis from one code read, unreproduced: `drawCity`
  (`glass/deck.client.ts:276`) folds neighborhoods by **adjacency** over the
  attention-sorted building list, and the sort does not cluster same-label
  buildings, so any building sorting between `agents/belvedere` and `agents`
  splits `~/code/agents` into two sections with one name. The old `/city`
  (`glass/pages.ts groupOf`, B9) grouped first and stayed whole; B14's rewrite
  lost the invariant its own comment states ("a neighborhood is exactly as loud
  as its loudest building"). Fix shape: cluster by label first, order clusters by
  their loudest building. **(2) repo-vs-campaign differentiation + rearrangeable
  structure are design input for the rework chapter** — pairs with the filed
  register question (canon inbox 2026-08-26, B2 F2) and the B15 reorder
  precedent (per-viewer order, persisted). His verdict stands: "growing pains,
  we're on the right track."

---

- 2026-08-28 · G2 Architect (live evidence, Felix's own arm) · **One click on "arm
  this flow" landed ~15 identical `armed` lines in one second — tenant listeners
  accumulate across swaps.** Evidence: `flow-close.run.jsonl` opens with 15
  `armed` events 60–110 ms apart (ts 1787934800.023–.973) from one human click;
  the engine still paused exactly once at the verdict card (the restate-dedup law
  held) and identical arms are no-ops to the delta reader, so this flow was
  unharmed. Mechanism (code-confirmed, unreproduced): every tenant's `mount()`
  calls `addEventListener` on the SHELL's persistent Focus/Action hosts and no
  tenant's `unmount()` removes them (`works.client.ts` `wire`/`wireAction` — only
  the ResizeObserver is disconnected; `chat.client.ts:419–434`;
  `desk.client.ts:350–357`), while the shell's `focusOn` empties `textContent` —
  children die, host listeners survive. N swaps into a tenant → N handlers → one
  gesture → N POSTs. **B19 F1's sibling**: the repaint memo was the state half of
  the lease law ("mount() is not a fresh start", B19 F2); this is the listener
  half. Blast radius by endpoint: arm — harmless (identical re-arms are legal by
  design); pass — safe (`passGate` refuses "already passed"; requests serial);
  **the Chat's send is the sharp edge** — N handlers would deliver the same words
  N times, each individually verified rather than refused as a twin; the desk's
  routes would stamp N receipts. Fix shape: one `AbortController` per mount, its
  `signal` on every host listener, aborted at `unmount` — or the shell's own
  bind-once delegation. Until it lands, a swapped-around deck can multiply any
  button; the state-layer guards are what held this one.
