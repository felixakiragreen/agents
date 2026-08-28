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

---

- 2026-08-28 · Felix (via the G2 Architect, deck field report) · **"The 'Act'
  wasn't updating after I clicked arm, I couldn't find the 'Pass this card' so I
  just started clicking around, I left and came back and then it properly
  updated the panel."** Two defects in one incident. **(1) The stall is a real
  repaint bug, unreproduced — two candidate mechanisms, neither confirmed:** the
  works region's paint signature does include the snapshot's works payload
  (`works.client.ts draw()`), so a stale panel means the payload itself stopped
  moving — either the Works' `needs` clause (`focusState === 'minimal' ? null :
  selection.building`) dropped `?b=` while his Focus pane sat minimal under an
  expanded Action (the 1·3·6 law shrinks its neighbors), so the poll stopped
  carrying works entirely, or a snapshot/memo seam held the old payload. Repro
  recipe: expand Action, arm, watch 10 s without touching anything. His
  workaround (swap away and back) forces the remount repaint — B19 F1's
  `forget(host)` working as built. **(2) "Pass this card" is findable only by
  clicking the verdict node** — `drawAction` shows the flow summary + arm card
  at no selection, and a node's actions (the pass button included) only when
  that node is picked; the arm card's own hint covers the reverse direction
  ("click away from this node to reach the arm") and nothing says "click the
  node to open its actions." Fix shapes: the arm receipt names the next gesture;
  a node awaiting his pass also surfaces it at flow level.

---

- 2026-08-28 · Felix (via the G2 Architect, deck field report) · **"I can see
  the usage for accounts, but I couldn't see a way to actually select it."**
  At the Works' arm card the bill renders ×3 accounts but the account is not a
  knob: each step's account is DECLARED in the flow file, so today the path is
  edit-the-flow → re-arm — nothing on the page says so, and §3's law ("account
  usage visible wherever accounts are chosen") taught him the opposite
  expectation: usage shown ⇒ choosable. Design ask for the rework chapter:
  either an account knob at arm time (canon's own arbitrage law — any account
  can host any session — argues for choosing at fire, and the amend/re-arm
  machinery already carries the state change), or the bill wears a "declared
  in the flow file" label naming the amend path. The composer keeps its knob
  either way.
