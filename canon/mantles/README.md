# Mantles — the composition law, operationally

> *The Grand Architect keeps the canon, Architects think, the dispatch tends, Diggers dig, Builders build — a hive building a city; files carry the truth.*

Every session is **tier × mantle × context** (MAP §2) — together, **the Guild** (the global CLAUDE.md, THE AGENTS CANON). This file is its operational law: how tiers are named, how a mantle is worn, how sessions are summoned, and which law wins when laws collide.

## The roster

- **Offices** — singular standing institutions, one holder at a time, a succession: **[Grand Architect](grand-architect.md)** (standards and canon), **[Mentat](mentat.md)** (the Summoner's thinking partner) — each charter titled as an office. Reserved: Imperial and Royal Architect (MAP §10, the horizon), Hand of the King / Quartermaster, Steward.
- **Mantles** — plural role charters, many wearers at once: **[Architect](architect.md)**, **[Builder](builder.md)**, **[Digger](digger.md)**, **[Fixer](fixer.md)** (the null mantle — see below). Every seat carries a charter file; the Fixer's was minted at 028.
- **The Dispatcher is dead** — tombstone in [dispatcher.md](dispatcher.md); the flow engine (canon board charge 020) is the successor; **the dispatch** survives as the system noun. Until the engine lands, the batch note names its tender (doctrine §10).

## The tier grid (`canon/agents/`)

A tier is the engine — model × effort, pure preset, zero role content. The **namespace** is the full cross product — **4 models (fable, opus, sonnet, haiku) × 5 efforts (low, medium, high, xhigh, max) = 20 names** — and `doctrine`'s `TIERS` keeps all twenty, so every board that ever named one still parses. The **inventory** is smaller: `canon/agents/` holds the tiers the city uses and nothing else.

- **Naming law:** `<model>-<effort>`, both fragments verbatim from the frontmatter enums. It's `opus-medium`, never `opus-med` — the name is mechanically derivable from the definition and back. `-fast` is reserved as a suffix but unminted (see fast mode).
- **Minted at the lay (042):** a tier file exists because a board's Staffing cell or the rig's log names it. A tier a new charge needs is minted by the Architect **at the lay, before the batch ignites** — never mid-session: definitions load at **session start**, so a tier minted mid-session is invisible to the session that needs it (verified 2026-08-02: in-session dispatch of a freshly written tier fails "not found"; a fresh session dispatches it fine). Mint before ignition and simmy's escalation class "tier named but not defined" stays retired.
- **The prune (042, 2026-09-01):** eight unused cells retired — `fable-low`, `fable-medium`, `sonnet-low`, `sonnet-max`, `haiku-medium`, `haiku-xhigh`, `haiku-max`, `haiku-high`; a ninth, `haiku-low`, at G3 (2026-09-02 — probe mentions only, zero fires; the rule, not the roster's shape, decides). Eleven stand. Git holds every one; re-mint by name when a Staffing cell calls for it.
- **Effort is a request:** the harness clamps to the model's highest supported level at or below the request (documented fallback; a Haiku dispatch at xhigh verified working 2026-08-02). The name states the request, the engine gives its best.
- **Staffing guidance lives in the tier descriptions — the single home.** Charters and boards point; they never duplicate. The rule of thumb the descriptions encode: **Fable where a wrong conclusion is expensive; Opus where a wrong step is cheap; Sonnet for the mechanical; Haiku for drudgework.**
- **Fast mode is unused (Felix's ruling):** `/fast` exists — session-level, Opus-only, documented — but the ruling is patience over premium: no board annotates it, no summons invokes it. The `-fast` suffix stays reserved and unminted.
- Tiers never carry `tools:` restrictions — conduct limits are charter law (mantles), not engine configuration.
- **Never escalate tier to compensate for incomplete orders** — a failed batch wants better orders, not a smarter engine (snappy, load 328).

## Wearing a mantle

To **wear** a charter is to read it fully and follow it for the rest of the session. Wearing happens by explicit summons only — a session never self-promotes into a mantle, and never switches mantles without a new summons (normally a new session).

**Tier guard:** the summons names the session's tier. The model half is always self-checkable — a session knows its model; on contradiction, stop and tell Felix before any work. The effort half is invisible from inside a plain session — trust the summons. When a mantle is worn via its skill shim (`/architect` …), the shim injects the live effort (`${CLAUDE_EFFORT}` substitution, verified 2026-08-02), and the guard covers both axes.

## The null mantle — the Fixer

Session-sized work — fix a bug, add a feature — needs no summons: **a session with no mantle IS a Fixer** — the default worker under the global CLAUDE.md, staffed by tier alone. The boundary test is succession and coordination: work that must outlive its session or coordinate several sessions gets a board and mantles; work that fits one session with Felix in the room gets neither. Tiers are universal — "how much brain" is a question every task has; mantles exist only where more than one session must share responsibility. A Fixer that discovers it's holding campaign-sized work says so and stops — Felix summons an Architect. The charter is [fixer.md](fixer.md), minted at 028: it binds when Felix points at it; a bare session is a Fixer under the global file alone.

## Summons grammar

Interactive (canonical):

```
You are a <Mantle> at <tier>.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/<mantle>.md,
then read <context docs> and <execute the charge doc | run the board | review the batch>.
```

The door comes first and every summons carries it: the charter outranks it, and reading the charter first is reading a role with no world around it.

Dispatched (canonical):

```
Agent(type=<tier>, prompt=<the charge doc's kickoff, verbatim> + <the project coda>)
```

The kickoff's first line is the interactive summons in path form. An unmantled cheap-tier kickoff carries no path read at all: it carries the stanza inline, copied from GUILD.md's closing section. Nobody edits a kickoff beyond appending the coda (doctrine §5).

## The coda — the canon core

The **coda** (the standard §4) is the fixed closing passage of every ignition's kickoff. Canon core below; ⟨slots⟩ are filled by project doctrine (002's turf). The instantiated coda is a project doctrine doc — `plans/CODA.md`, written once per project, appended verbatim to every ignition.

> You are running as a dispatched agent. Follow ⟨working agreements ref⟩. Read ⟨bulletin path⟩ before each major method section; append the moment you discover something that changes another agent's plans — verbatim finding + evidence pointer. If you work in a worktree, read the main bulletin by its absolute path, but append to your own worktree's copy (create it if absent), each entry headed `→ relay`, left uncommitted — the tender relays flagged entries verbatim; everything else of yours rides your branch. Third-party code — fetch, vendor, install beyond existing deps, or execute from the network — only where your charge doc names it; otherwise STOP and escalate (DOCTRINE §5, pre-authorization). Before your last commit: reconcile your charge's Status in the surface you can write — a landing that marks no row is invisible — and run `doctrine lint ‹root›`: it reads no new failure of yours, or you fix the form before you file. Your findings file and commits are the deliverable. Your final report is logistics only: status (LANDED / KILLED / BLOCKED), a one-line outcome, and pointers to findings + commits.

Universal core (never varies): the dispatched framing · files-are-the-deliverable · status reconciliation (D78's sitting — 029's invisible landing is the birthplace) · the lint line (stigmergon G14, 2026-09-07: four Builders in one batch, nine form failures in four classes; the coda mended there first, D40's trial-here pattern) · report-is-logistics-only · third-party pre-authorization (DOCTRINE §5, pre-authorization). Project slots: agreements ref, bulletin path (projects with no bulletin drop that sentence), worktree specifics.

## The precedence law

Every charter carries it in its shared summons paragraph (word-identical core, two wrap families — the lint is word-level): worn by explicit summons only; while worn, the charter overrides the global CLAUDE.md where they conflict on workflow — when to ask, when to act; personality, code style, and git conventions always apply. The global CLAUDE.md carries the mirror clause.

The collision it resolves: the global *"don't start writing code without asking"* vs a Builder executing a blessed charge autonomously — the charge doc IS the ask; both rules are correct in their own sessions.

## Delivery

**Read-by-path, canonical** — works on every account, interactive and dispatched: `wear ~/code/agents/canon/mantles/<mantle>.md`. Interactive sugar is the summon rig (`summon/`): presets fire the full summons, account-routed and name-stamped. There are no skill shims — purged 2026-08-29, unused: the rig won.

## The vocabulary

The Guild speaks one standard — `canon/work/STANDARD.md` (⬡✓): one concept, one word; the graveyard names every dead word's successor. The working law lives in the doctrine (`canon/work/DOCTRINE.md`): the board §4, the charge doc §5, findings §6, the bulletin §9, batches §10.

## The charter template

Every charter, in order (the 028 pattern): mission paragraph · **Staffing** · **The summons** (the shared paragraph, carried verbatim — a lint surface) · the role's own law sections · Side-quests (where the grant is not the genre default) · Escalation triggers / the contract's edges · End of session · **Forbidden — the single-glance list** (minimal, every seat carrying its reason) · Summons (interactive with the door + dispatched). **No epigraph** — the door owns identity.

The shared summons paragraph is one core and two sanctioned variants: the core ("worn by explicit summons only … always apply.") is carried word-for-word by all five charters that have one; the three mantles with charge docs append "The charge doc binds inside the charter and the door."; the Builder alone appends the precedence-bites sentences — its reason to exist. The Fixer carries none — **The license** stands in its place. Wrapping is not normalized between the two families, so the lint is word-level, not byte-level.

A charter that can't be finished at this quality becomes a bounded charge (DOCTRINE §5, the charge doc), never a rushed draft.
