# The deck keel — Belvedere's second commission

**Status:** keel cut 2026-08-27 (Felix + Architect, the deck design sitting — the sitting the kitten fired) · **BLESSED 2026-08-27, Felix's word ("Bless!" ×4, "Make it so"): the §11 fence trio, the §9 stack, the §6 node actions, and the names — the Workshop and the Works** · Commission = the two case files in [ISSUES](../ISSUES.md), Felix's words verbatim: the 17-item **field report** (the copy-paste kill shot) and the **deck vision** (three panes, the chat, the DAG). This keel folds both; where it and v0's page design conflict, this keel wins. **The organs stand** — census, hands, doctrine parse, audit, usage plumbing, the aesthetic ("tiny details I absolutely love") survive by decree; the *pages* are clay.

> **The striking law (Felix, this sitting — his third utterance of it, now structural):** *"I want to emphasize AGAIN every law CAN be struck."* The founding rework mandate and D7 generalized: no v0 convention, no glass law, no inherited format holds a veto over the design — a law that fights the workflow is struck, visibly, with his word on it. Channel discipline is the one thing that survives every strike: canon laws fall via the Standards Office; building laws fall at this desk, countersigned.

## 1. The identity

Felix's sentence, verbatim — the priority order every design call resolves against:

> This is a data visualization dashboard more than anything else. Then it's a command center with which to plan work and dispatch it. Then it's an interface to communicate with agents.

v0 built an observatory with a finger. The deck adds the missing organ — **the voice** — without surrendering the first identity: dataviz density first, command second, comms third.

## 2. The law of space

Felix's goal, verbatim, now law:

> Minimize scrolling: take note of the available screen space, split it proportionally according to priorities given its context, then fill it with the highest level information, in as few words as possible, to maximize the number of things that can fit inside.

Every pane has three states — **minimal** (~1-word limits + data viz, or absent) · **typical** · **expanded** — and the split reapportions as states change. Encapsulation-first (§3 design laws) escalates here: at minimal, a thing is one word and a mark. The page body never scrolls; panes manage their own overflow.

## 3. The ontology and the panes

**City → Building → Agent.** Three panes, always: **Context · Focus · Action.**

- **Context = the City** (sidebar-like): every building, grouped by neighborhood, live dots, attention badges (§4). Expanded at rest.
- **Focus** is a slot, one of: **the Workshop** (one building: its agents, board, tail — named at blessing) · **the Chat** (§5) · **the Works** (the DAG, §6 — named at blessing). Clicking a building in the City focuses its Workshop; summoning swaps in the Chat; the DAG is entered from a Workshop or the City.
- **Action follows Focus:** at rest, the **Summon composer** (every knob — mantle, tier, account, directory, theater, increment — live-updating summons preview, usage visible in place); against the Chat, **respond + notes** (§5); against the Works, **dispatch** (§6).
- **Interactions:** click-to-expand panes (clicking anywhere in the minimal composer expands it) · instant hover tooltips that can expand with more info and actions · one **drawer** over everything, pinnable (§4).

At rest: City expanded, Workshop minimal, Summon minimal.

**Panes are a replaceable surface (Felix, this sitting):** the deck aligns to his workflow today and is built so it can align to any — the three-pane shell is the stable frame; focus and action views are swappable modules behind one small seam (a `FocusView` interface in the shell order: render, states, actions). Workshop, Chat, and the Works are the first three tenants, not the last; replacing a pane is a module, never a rebuild.

> **Amended 2026-08-27, mid-batch-5 (Felix, the dispatch cooking — ISSUES this date, ruled same sitting):** two organs join the deck. **The Grep (B21):** everything is greppable — transcripts ×3 accounts, the register's docs, plans, the desk — fast, bounded, and every hit **instantly jumpable**: a session hit hotswaps the Chat to that turn, a doc hit opens the viewer at the line, a desk hit opens the editor. "What was that session where I was talking about 'bob summons'?" is one keystroke and one click. **The decoder (B20):** no code word without its meaning one hover away — every rendered reference (row ids, D-ids, §refs, FC/GA ids) resolves on hover to its object via the one parser (D65): encapsulation, status, jump. **Tooltips nest** — a tooltip's content passes through the same detector — depth-capped (everything has a limit). Resolution is context-scoped: building-local first, canon fallback; the unresolvable says so honestly (D10's family — never guess).

## 4. Attention (ruled in-session)

*"I'm getting notified cmux is waiting my input, but I don't see that anywhere in Belvedere"* dies twice:

- **Ambient:** buildings with waiting sessions, live Felix-gates, or pending countersigns pulse to the top of the City with badges — attention outranks recency (the standing sort law, extended). Visible at rest, always.
- **Triage:** the drawer's default content is the ranked **needs-you queue** — sessions blocked on input, gates, countersigns, escalations — each item answerable in place. Pin it and it's the morning coffee view.

Sources: the census (`Stop` + `PermissionRequest` waiting-state), gate rows, the decision queue. One ranking, one vocabulary, everywhere.

## 5. The Chat (the voice)

**One chat view in the whole deck.** Any session — live, idle, dead — **hotswaps** into it; the view is session-agnostic. Focus renders the transcript (read off the transcript file, newest at bottom, tail-windowed — reads are free and fence-legal); Action holds Felix's draft + notes — **the transcript and the reply scroll independently**, which retires the note-app copy-paste forever.

Physics, honestly: **delivery is gated on P6, the transport probe.** P2 T4 proved naive paste into a live Claude TUI splits at the first blank line and auto-submits — the send path must be measured, not assumed. Three arms: delivery into a live pane (the T4 hazard), delivery to an idle/dead session (resume-with-a-turn), delivery mid-turn (the queued-message path). Until P6 lands, the Chat ships **read + jump** — transcript view with a jump-to-pane button — which is already a win; send arms when the physics does.

## 6. The Works (the DAG)

**Time flows down — the now-line** (D14): the past at top, landed and dimmed; a **NOW line** where live sessions blink; the plan below — OPEN rows, declared flows, gates as Felix-cards. Scroll up = history, down = future; the resting view centers on NOW. One drawing shows **every Guild session, completed and planned** — the board, the ledger's arc, and the flow chapter's DAG become one renderer. It agrees with every other surface Felix reads: chat, ledger, scrollback.

Node actions (✓ Felix at blessing — "great actions"): a **plan** node → dispatch / customize / account / usage (the flow chapter's arm rides here); an **in-flight** node → hotswap to Chat / jump to pane; a **landed** node → the landing record + a follow-up fire.

The flow chapter is unchanged in substance and re-seated in venue: **B10's DAG is this focus view**, not a standalone page; B11's arm and B12's reactive gate run inside it. D11 stands whole — the drawn plan is the authorization.

## 7. Live identity (ruled in-session)

**cmux is truth** (D16): the deck reads live names and colors off the socket (the census gains a socket-read source beside the hooks); **rename and recolor in Belvedere write through to cmux**; a rename made inside cmux shows up in the deck. The rig's stamp is the **birth name** only; `session_id` stays the join key under everything. This kills the whole drift class the field report caught (wrong stamp shown after rename, not-green, dead jump-to-panel — each still gets its Digger repro, but the *model* stops manufacturing them). The color map (Felix's felikai↔ANSI table, field report) lives glass-side against cmux's accepted color vocabulary.

## 8. The desk (ruled in-session)

**One drawer, city-wide: `~/code/agents/desk/`** (D17) — gitted, versioned, account-independent. Notes, dreams, prompt drafts persist there from the Action pane; **sending routes**: a field report → that building's ISSUES (existing write), a message → a session (P6), a draft summons → the composer. Dream-into-new-repo routing stays with the founding ritual (parked — the glass never writes founding docs). The parked **sovereign's-DESK** genre — its gate was "when inbox volume proves the genre" — is hereby proven (a 17-item pasted note is the volume) and lands here. *Note for the blessing: `desk/` is a new root directory in the canon repo — Felix's countersign on D17 is the authorization; the D2 fence otherwise stands.*

## 9. Stack ruling (client-state strike ✓ Felix in-session: "this is an app")

The deck is an **app, not pages** — expansion states, hotswap, the drawer, live tooltips require client state; the v0 no-client-state law is **struck by Felix's own word**, the striking law's first formal casualty. Stack: **vanilla TS + SVG, no framework** (✓ Felix at blessing) — the simplicity directives, the felikai theme untouched, nothing in three panes + one chat needs React; revisit only if vanilla demonstrably fights. **His blessing note, recorded as design input for the prettifying pass:** once it all functions, he wants LOTS of SVG styling — hexagonal decorative elements, hexagonal buttons — the ⬡ of his own vision header; SVG-native is doubly ratified, the prettifying pass rides the parked list until the deck works. The spelling law joins §3's design laws: **color, center, grey** (Felix's triple, his name on it). Usage is **live** — the deck fetches the OAuth endpoint itself (the rig's proven fetcher pattern), never a stale log.

## 10. What dies, what survives

- **Dies:** the rooms. `/` (rail), `/city`, `/shelf`, `/b/…` as separate pages — and with them the "what is Rail vs City vs Shelf" confusion. The rail's content redistributes (§4); the shelf dissolves into Workshop session lists + Chat hotswap; building pages become the Workshop focus.
- **Survives:** every organ (census, hands, parse, audit, spawn/worktree/ focus/HALT), the shelf's *data* joins, the accented cards, the blinking dots, felikai. **The v0 glass keeps serving until the deck replaces it** — no dark window mid-rework; pages retire one focus view at a time.

## 11. Fence amendments (proposed — D-entries minted at blessing)

Three new write classes, each D3-desk-ruled, none broader than named:

1. **message-to-session** — deliver Felix's text to a session as a real turn (P6's mechanism); audited like fires (sha of the delivered bytes); D10 binds — an ambiguous target never sends.
2. **rename / recolor write-through** — socket writes to cmux display state; audited.
3. **desk writes** — the glass writes files **only under `desk/`**, plus the already-legal ISSUES appends on send.

The fence's exhaustive-list law stands; these are the whole delta.

## 12. The probes

- **P6 — the message transport** (new, gates Chat send): the three arms in §5, kill criteria on silent corruption or auto-submit (a truncated message that *looks* delivered is the disqualifying failure — T4's lesson).
- **P5 — permission physics** (standing, unchanged): still the flow chapter's probe #1; deck-independent; unfreezes at this keel's blessing.
- Live usage, socket-read census, transcript-scale rendering: **rows, not probes** — the mechanisms are proven or trivially measurable in-order.

## 13. Sequencing — what the blessing unlocks

1. **Felix blesses this keel** (red pen welcome; D13–D17 already carry his in-session word; the §9 stack ruling and §11 fence trio ride the blessing; names picked: Workshop/Floor, Works/Line).
2. **The re-cut sitting** (this Architect, same day if he wills it): cut **deck batch 1** — the shell (three panes + states + drawer), City + attention, the Workshop, Chat-read + hotswap, composer-in-Action, the identity/socket-census row, the desk, P6; **re-sequence the flow rows** (P5 fires immediately; B10 re-scoped into the Works view; B11/B12 behind it; G2 stands).
3. The engine chapter and the deck converge on the same drawing: the Works, armed.

## Non-goals

A chat client per session (there is ONE chat view) · rebuilding cmux (jump exists; cmux is the terminal) · a frontend framework on day one · editing truth (forever-class, README §2) · the Steward (unparked by Felix's word only) · auto-arbitrage of accounts.
