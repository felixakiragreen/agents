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

- 2026-08-27 · Felix (the deck design sitting) · the deck VISION — case file
  #2, verbatim below: three-pane split (Context/Focus/Action) with
  min/typical/expanded states; ontology City → Building → Agent; swappable
  Focus (Building | one hotswappable Chat | DAG); identity sentence "dataviz
  dashboard first, command center second, agent comms third"; the no-scroll
  proportional-fill law; DAG shows past AND future, time-direction open.

Verbatim:

> Belvedere ⬡ new Vision
>
> Start with summons — Choose any of the things: Mantle, effort, directory,
> theater (customize), increment, etc. See it update the summons. See the
> usage here.
>
> What are the things? City = all projects. Project/Building = all agents for
> that campaign/project/repo (need better name). Summon = new agent.
>
> Goal = minimize scrolling (take note of the available screen space, split it
> proportionally according to priorities given its context, then fill it with
> the highest level information, in as few words as possible, to maximize the
> number of things that can fit inside)
>
> I want a Split View at all times: Context / Focus / Action.
> Main View is split 3 ways: Context = City · Focus = Project/Building (need
> better name) · Action = Summon.
> Each "split view" has: minimal → super compact (~1 word limits + data viz)
> OR none-existent · typical · expanded states.
> At first city is the expanded, minimal project & summons. Just clicking
> anywhere in the summons expands it. Clicking on a project in the city
> expands the project with that one as the focus.
>
> This is a data visualization dashboard more than anything else. Then it's a
> command center with which to plan work and dispatch it. Then it's an
> interface to communicate with agents.
>
> Interaction can: expand/collapse split views · show instant hover tooltips
> (that can expand with more information & actions) · add a drawer that
> appears over everything (this can be pinned).
>
> The city view (Context = Split View) acts sort of like a sidebar. The
> Focus = projects & action: summon split views can be replaced.
> New Focus = chat view. (After summoning, this replaces). There is only one
> chat view. I can "hotswap" any session into the chat view.
> Action = respond, take notes, batons, anything else. (This allows me to
> scroll through the chat & my response separately much more easily)
>
> Final focus view = DAG workflows (need better name of course). (Unsure if I
> want them to go from bottom up or top down — this changes everything how I
> look at it — which way does time flow)
> This shows the entire history / new work of every session we've either had,
> or the architect plans. (Technically it could show both PAST & FUTURE,
> every guild session completed & planned)
> If it's new work / plan: Action = dispatch the work, customize it, choose
> accounts, see usage. If not landed work: Action = not sure yet.

- 2026-08-27 · Felix (pasted into the flow-cut sitting — the delivery mechanism
  is itself the report's kill shot) · the command-deck field report: 17 items +
  the strategic fork (start over vs rework), verbatim below; case file for the
  deck design sitting.

Verbatim:

> It started with just a long list of notes for changes to Belvedere:
> - In compose, updating values (like effort) should update the summons.
> - in compose, Color code the mantles
> - Links to documents (WHERE: agents/LEDGER.md:385) don't take you to that line
> - For a project like belvedere, do I run it inside agents/belvedere or just
>   inside agents? If I start it in agents (like this one) how do I move it?
> - I just summoned An architect (you).
>     - They were NOT made green
>     - They did not have the right session name (architect-agents-03 instead of
>       architect-belvedere-02)
> - I should be able to collapse BOARD, LEDGER, DECISIONS, ISSUES, etc and
>   reorder them
>     - LIVE SESSIONS should be first
> - When I renamed architect-agents-03 to architect-belvedere-02 inside cmux, it
>   still says in Belvedere "architect-agents-03"
> - I need a way to open straight to that session
>     - JUMP TO PANEL (what I expect will do this says: focused
>       01996229-2CB0-48E6-A078-EDDC6E9D1636") and does nothing
> - Did you decide to stick with Markdown?
> - We need to fix the colors (my terminal colors don't match reality -- I
>   hacked them because ANSI doesn't have orange or purple) {this requires
>   reworking presets.tsv to hold 2 colors}
>     - Reality (my felikai color): green / ANSI: green
>     - Reality: yellow / ANSI: yellow
>     - Reality: red / ANSI: red
>     - Reality: purple / ANSI: magenta
>     - Reality: blue / ANSI: cyan
>     - Reality: orange: ANSI: blue
> - Does Belvedere have ANY plans for reading/inputting anything to cmux? Or do
>   I have to interact through cmux for that?
> - We're using British spelling everywhere (American isn't better, it's just
>   less bad -- but the truth is I prefer a mix: color, center, grey || not
>   colour, centre, or gray -- I don't know how to specify this)
> - I'm getting notified that cmux is waiting my input, but I don't see that
>   anywhere in Belvedere.
> - I need to be able to rename sessions & set colors & send messages, etc
>   inside Belvedere. This is my command center, not just an observatory. Is it
>   incorrectly named?
> - What is Rail vs City vs Shelf? I don't have an intuitive sense of this.
> - I need a place to start writing my own prompts / dreams / notes.
> - Usage needs to be LIVE (not cached --it's 391 minutes old)
>
> All of this has started me thinking I need to go back to the drawing board. I
> didn't specify what I needed enough from belvedere. There is too much
> information I don't need, and not enough of what I do need. [...] I want to
> start over, because it feels like we might get closer to what I want faster.
> But at the same time, I think this contains a lot of what we need, just needs
> heavy reworking/rearranging.
>
> I want to say one more important note: there are a TON of tiny details I
> absolutely love. The aesthetic is spot on, the accented cards, gorgeous.
> Blinking dots for agents, perfect.
>
> But... I think I asked for the wrong thing. Because I'm writing this in a note
> right now, and then I'm copy+pasting it into cmux.
>
> I would rather be writing this in Belvedere, and then clicking a button to
> send it to you.
