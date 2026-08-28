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

- 2026-08-28 · Felix (via the G2 Architect, deck field report) · **"[jump to pane]
  works, but it put the new session in the wrong workspace (a brand new one), so
  I moved it to my existing 'belvedere' workspace. Workspace management will need
  to be figured out."** The engine's fire minted `workspace:115` for the
  recording sitting — by design today: P2's recipe (new-workspace per fire) is
  probe-era law and every hand inherited it. His expectation — a fire for a
  building lands in that building's workspace — is the deck-era design. Ask for
  the rework chapter: workspace placement policy — a flow/step `workspace` field,
  or building-homed placement (fires for `agents/belvedere` land in the workspace
  he keeps for it, minting only when none exists). Pairs with D16 (cmux is truth
  for identity), B18's socket read (the join exists to find "his belvedere
  workspace" by name), and P6 F2 (address by UUID once found). Also in scope:
  who retires a fire's minted workspace when its panel is moved out by hand —
  D55 covers probes at landing, not his rearrangements.

---

- 2026-08-28 · Felix (via the G2 Architect, deck field report) · **"[hotswap to
  the Chat — B16] is greyed out, disabled, I assume it's because it hasn't been
  built yet?"** — the assumption is wrong in an instructive way: the Chat IS
  built (B16, LANDED 2026-08-28). The control is not a disabled button but a
  placeholder — `el('span', 'slot', 'hotswap to the Chat — B16')`
  (`works.client.ts` drawNodeActions), drawn by B10 before B16 existed. B16's
  order named three hotswap entry points (City · Workshop · needs-you queue);
  the Works was not among them, so the slot was never wired when the Chat
  landed. Two fixes, both cheap: wire it — the fired node carries the sid, the
  seam members exist (`swap.to('chat')` is B10 F8's own addition; the `?s=`
  query is B16 F1's) — and the honest-disabled law: anything rendered inert
  says WHY on hover (B16's cold send does it right: "the hands are cold"); a
  slot that names a landed row reads as broken, not pending.

---

- 2026-08-28 · Felix (via the G2 Architect, deck field report) · **"Sometimes
  selecting the verdict card works (changes the Act panel), but right now it's
  not selecting it."** This is candidate 6's third face, and its clearest
  signature: `wire(focus)`'s node click is a TOGGLE (`picked = picked === id ?
  null : id`), so with N leaked handlers stacked on the host one click toggles
  N times — **odd N selects, even N cancels itself to a visible no-op**.
  "Sometimes works" is literally the parity of his tenant-swap count since page
  load. Unreproduced, but the mechanism is the one already cut forward
  (candidate 6, `88fa7c6`) and this face argues its priority: it breaks
  READING, not just writing — the state-layer guards that made the POSTs safe
  cannot help a pure client toggle. Workaround until the fix lands: a hard
  reload resets every tenant to one handler. Fix unchanged: one
  `AbortController` per mount, aborted at unmount.

---

- 2026-08-28 · Felix (via the G2 Architect, deck field report) · **"That agent
  is complete, I went into it, read it, and it gave me a baton. But I can't see
  that anywhere or act on it anywhere in belvedere."** The baton IS on file
  (the recording sitting's ledger entry — holder Felix, the batch-6 cut
  summons fenced) and IS rendered — but only in the Workshop's ledger-tail
  panel (holder pill + text, `workshop.client.ts:256`) and on the v0 rail at
  `/`, which still serves every city baton as cards. **The deck's attention
  model does not include batons**: `attention.ts` has no baton bucket, so a
  Felix-holder baton — needs-you class by definition (D15) — raises no City
  badge and no queue item, and the deck-era sovereign never sees the one
  thing the whole doctrine says to hand him. Ask for the rework chapter:
  batons join the queue (Felix-holder ⇒ a queue item whose affordance is
  "open in the composer", copy-is-reading, D10 intact; session-holder ⇒ the
  rail's Dispatch semantics, D10's collision rules inherited); the Works'
  landed terminal node could also surface "this landing handed a baton."

---

- 2026-08-28 · Felix (via the G2 Architect, deck field report) · **"We
  instantiated `architect-belvedere-04` from `agents/belvedere` — the Works.
  But the agent shows up in `agents`, a completely different place."**
  Mechanism figured out, not yet fixed: **the census houses a session by its
  cwd and nothing else** (B5 F1's `buildingOf`), and the flow declared its
  venue as `~/code/agents` — the repo root — so the session lands in the
  `agents` building even though the flow file names `building:
  agents/belvedere`, the run log records the fire, and the stamp itself says
  belvedere. "The building the work is FOR" and "the directory the session
  sits IN" are two facts, and the join only knows the second — true for every
  D2 subproject whose sessions work at the repo root. Fix shapes: short-term,
  a belvedere flow step declares venue `~/code/agents/belvedere` where the
  work allows (git edits parent paths fine from a subdir); real fix, the
  fired-for building rides the fire — census join reads sid → flow building
  (outranks cwd for engine-fired sessions; hand-fired keep cwd). Same class
  as the workspace-placement entry: **the fire knows things the census
  forgets.** Pairs with the repo-vs-campaign design input.

---

- 2026-08-28 · Felix (via the G2 Architect, deck field report) · **"Scrolling
  is broken in the Chat — it won't let me scroll down, it keeps snapping to
  the top instantly. I left and tried a different one, now it's snapping to
  the bottom."** Unified hypothesis, code-anchored, unreproduced: **the
  transcript box's scroll position is not state the repaint preserves.** The
  only restore is the stick branch (`chat.client.ts:395` — `stick && !aim ⇒
  scrollTop = scrollHeight`); a poll repaint that rebuilds the box otherwise
  lands at `scrollTop 0`, which is inside `nearTop`, which triggers
  `loadEarlier` (`:423`) — and a prepend has no scroll compensation, so the
  view keeps showing older content: the ladder climbs to the top until the
  pages run out. That is face one (snap to top, "instantly" on every poll /
  prepend). Face two is the same law from the other side: `stick` held true
  (module state, surviving swaps — B19 F2's family) snaps every repaint to
  the bottom against his upward scroll. `loadEarlier` is properly guarded
  (`loading`), so the listener leak does not multiply loads — this one is
  the repaint law, not candidate 6. Fix shapes: scroll position joins the
  state a repaint preserves (B15 F5's receipt law applied to geometry);
  prepends compensate by anchor delta; `stick`/`aim` reset on target swap.
  Repro recipe: open a long transcript, scroll to the middle, wait one poll.
