# The stigmergon forge — sitting notes (founding, 2026-08-31)

Working draft of the dream forge — distills into `dream.md` + the cornerstone;
notes, not law. The dream draft: [stigmergon-dream-draft.md](stigmergon-dream-draft.md).

## Locked at the sitting (Felix's word)

- **Name: stigmergon — set. Venue: `~/code/stigmergon` — his hand, inited
  2026-08-31, empty repo, branch master.**
- Same dream as Belvedere (the boiling point stands — the terminals don't
  scale); the method inverts: ground-up, one step nailed, then the next.
  **Nothing ships un-designed** — every surface gets its own design sitting
  before its Builder touches it (the tooltip is the type specimen: deferred to
  its own sitting, not killed). His word: slowing down intentionally — hold
  him to it.
- **The cmux divorce — confirmed in three parts**: (a) never touches — no
  socket, no pane awareness, no renames; (b) still sees — the census hooks are
  venue-blind, every live session lists as a session, no venue semantics;
  (c) the ambition — stigmergon **replaces cmux as the daily room**: headless
  sessions + the Chat, summon-to-terminal the escape hatch.
- **The hybrid city** (F1): discovered existence, sovereign arrangement — a
  deleted repo vanishes, a new one appears; his names, order, grouping, colors
  persist over it. The balance law gets a **dedicated design sitting** (phase
  1's first). Agents' homes: computed by cwd, his moves win.
- **Tree model** (F2, corrected at his word): tree in the file; flat is only
  the render projection. Sibling reorder was always the easy part — **the
  whiteboardy pain was crossing parents** (outdent, move, re-indent);
  **edge-pop ruled**: option+↑/↓ at first/last child pops the node out of its
  parent, killing the dance. Full move grammar (incl. whether pop-IN exists)
  tabled at the sidebar spec sitting. `index`/`indent` are not fields.
- **The command spine** (F3): **blessed as cornerstone law** — every
  structural gesture a named command in one registry; keys, mouse, probes, and
  agents are all bindings over it; ⌘? renders the registry itself.
  whiteboardy's command architecture is the exemplar read at the cornerstone.
- **Phase 1** (F4): the shell (three panes + overlay layer, Focus/Act as
  placeholders) + the spine + the harness (camera/gates/fixture salvage) + the
  sidebar as first tenant. Acceptance per phase: **his visual pass +
  comprehensive green tests**. Several charges, each spec sat with him first.
- **Persistence** (F5): one schema-versioned JSON tree, server writes with
  **receipts asserted** (B24's law), **no undo**, delete confirms naming the
  subtree. **Seed from `desk/city-arrangement.json`** (one-time importer) —
  confirmed twice. Home: desk/ vs stigmergon — rides the desk ruling (open).
- **Cut** (F6): `type`, `board`. **In: stable ids** — a name is a label,
  never an address.
- **Customizability — the horizon set (Q3):** layout **yes** (panes resize
  and remember — the SpaceX-dashboard feel); flows as his data **yes**;
  summon presets **yes**; macros **deferred by design** — discovered through
  need, never anticipation (his word). **The sovereign's pen: stigmergon may
  edit boards at his hand** — park, reorder, edit, no Architect intermediary;
  he accepts this opens issues and wants them explored, not dodged. Owed: its
  own design sitting (collision with live sessions, attribution, lint-on-write)
  — and the structural consequence: **the doctrine parser must learn to
  write** (serialize, round-trip clean) — one parser in the city becomes one
  writer in the city.
- **Performance (Q4):** targets, not gates — except **<16 ms interaction,
  the one bar**. Perf tests exist from day one; foundation laid with
  performance in mind; chase faster, flex when honest.
- **Alive (Q4):** data-breathing — **the hive visible as a collective**: a
  dozen agents humming, seen in one view, never one chat at a time. His seed
  images, verbatim-ish: a small block stacking per 1k tokens a session
  generates; or matrix-fall where blocks are tokens and the files being
  appended stand at the bottom. Out of v1 scope, in the dream's horizon.
  **Standing consequence from day one: instrument everything** — the view
  lights up from real history, not mockups.
- **No multi-select. No mouse reorder** (drag-drop stays dead). Hover: no v1
  behavior; arrives later through its own design sitting.
- **Scroll (Q5):** the no-scroll law softens — panes stay proportional, but
  **Context may scroll** when the expanded tree outgrows it.
- **Fonts (Q5):** felikai yes; IosevkaFelix yes; **prose font is an open
  exploration — Inter is the fallback** (tokens must keep it swappable). No
  dropdowns. **Legends: deferred.**

## Post-mortem seeds (→ the cornerstone's non-goals)

- One-shotted from the end goal: three foundations in six days (v0 pages →
  deck panes → v3 substrate), each poured before the last had set; the dream
  froze half-refined.
- The ground-up part (v3) survived; the taste-checked-after part (the UI)
  died. **Stigmergon = v3's method applied to pixels.**
- cmux: his primary interface today, and the thing he wants zero connection
  to — organizing 30+ terminals is the symptom, not the cure.
- Census/fence: organs the sovereign never understood — every concept carries
  a his-language name and a one-sentence waggle, or it doesn't ship. (Proven
  twice in one sitting: "encapsulation-first" and "the fence" both needed
  waggles — and encapsulation-first was distilled from his own deck-era law.)
- Too slow: reflection latency. Files → pixels near-instant; perf tests from
  day one.
- Pure glass was useless (v1); thin controls insufficient (v2). The
  derived/managed balance is foundational; customizability is foundational.
- The wound list on record: the scrim (B26 F6, days undetected), the
  composer's eaten keystroke (B23), the lying repaint (B24), the nameless
  cards (B9 F1 — a data-model gap found at render time), the tooltip.

## The salvage (→ cornerstone inputs)

- v3 engine · console · fake claude · barrage; the camera + gates + fixture
  city; the census (venue-blind hooks).
- Known gaps riding: baton `holder ∈ {dispatch, none}` render (C36 F4);
  census `waitingOf` misses `PermissionRequest` (C21 F1).
- New requirement on the salvaged parser: a **serializer** (the sovereign's
  pen writes boards through it; lint-on-write; never a hand-rolled second
  writer).
- Seed data: `desk/city-arrangement.json` — his live arrangement.
- Exemplar reads at the cornerstone: whiteboardy's command architecture (his
  cite, positive); whiteboardy's cross-parent move pain (the counter-example
  that ruled edge-pop); the SpaceX dashboard's pane resizing (his cite,
  positive).
- **The belvedere purge** (his word this sitting): the corpse leaves the
  agents repo AFTER the salvage is extracted — laid on the agents board's
  deferred list; git is the archive (D78).

## Open — this sitting

1. **The desk's fate**: stays in agents (rec) vs moves. The corpse ≠ the
   drawer.
2. **Encapsulation-first** — carry as law? (waggled in the reply)
3. **The fence + glass-shatters** — carry as standing bars? (waggled)
4. **The dream draft** — review, edit, call it ready; lands frozen at his
   word as `~/code/stigmergon/dream.md`.
