# Mantles — the composition law, operationally

> *The Grand Architect keeps the canon, Architects think, Dispatchers tend, Diggers dig,
> Builders build — a hive building a city; files carry the truth.*

Every session is **tier × mantle × context** (GENESIS §2) — together, **the Guild**
(D37). This file is its operational law: how tiers are named, how a mantle is worn, how
sessions are summoned, and which law wins when laws collide.

## The tier grid (`canon/agents/`)

A tier is the engine — model × effort, pure preset, zero role content. The grid is the
full cross product, pre-minted: **4 models (fable, opus, sonnet, haiku) × 5 efforts
(low, medium, high, xhigh, max) = 20 tiers.**

- **Naming law:** `<model>-<effort>`, both fragments verbatim from the frontmatter
  enums. It's `opus-medium`, never `opus-med` — the name is mechanically derivable from
  the definition and back. `-fast` is reserved as a suffix but unminted (see fast mode).
- **Why the full grid:** definitions load at **session start** — a tier minted
  mid-session is invisible to the session that needs it (verified 2026-08-02: in-session
  dispatch of a freshly written tier fails "not found"; a fresh session dispatches it
  fine). Pre-minting everything retires simmy's escalation class "tier named but not
  defined" for good.
- **Effort is a request:** the harness clamps to the model's highest supported level at
  or below the request (documented fallback; `haiku-xhigh` dispatch verified working
  2026-08-02). The name states the request, the engine gives its best.
- **Staffing guidance lives in the tier descriptions — the single home.** Charters and
  boards point; they never duplicate. The rule of thumb the descriptions encode:
  **Fable where a wrong conclusion is expensive; Opus where a wrong step is cheap;
  Sonnet for the mechanical; Haiku for drudgework.**
- **Fast mode is unused (D9, Felix's ruling):** `/fast` exists — session-level,
  Opus-only, documented — but the ruling is patience over premium: no board annotates
  it, no summons invokes it. The `-fast` suffix stays reserved and unminted.
- Tiers never carry `tools:` restrictions — conduct limits are charter law (mantles),
  not engine configuration.

## Wearing a mantle

To **wear** a charter is to read it fully and follow it for the rest of the session.
Wearing happens by explicit summons only — a session never self-promotes into a mantle,
and never switches mantles without a new summons (normally a new session).

**Tier guard:** the summons names the session's tier. The model half is always
self-checkable — a session knows its model; on contradiction, stop and tell Felix before
any work. The effort half is invisible from inside a plain session — trust the summons.
When a mantle is worn via its skill shim (`/architect` …), the shim injects the live
effort (`${CLAUDE_EFFORT}` substitution, verified 2026-08-02), and the guard covers both
axes.

## The null mantle

Session-sized work — fix a bug, add a feature — wears no mantle: a bare session under
the global CLAUDE.md is the default worker, staffed by tier alone. The boundary test is
succession and coordination: work that must outlive its session or coordinate several
sessions gets a board and mantles; work that fits one session with Felix in the room
gets neither. Tiers are universal — "how much brain" is a question every task has;
mantles exist only where more than one session must share responsibility. A bare
session that discovers it's holding campaign-sized work says so and stops — Felix
summons an Architect.

## Summons grammar

Interactive (canonical):

```
You are a <Mantle> at <tier>. Wear ~/code/agents/canon/mantles/<mantle>.md, then read
<context docs> and <execute the brief | build the order | run the board | review the batch>.
```

Once skill shims are deployed (04), `/<mantle>` replaces the "Wear <path>" clause for
interactive sessions; the rest of the summons is unchanged.

Dispatched (canonical):

```
Agent(type=<tier>, prompt=<the brief/order kickoff, verbatim> + <the project rider>)
```

The kickoff's first line is the interactive summons in path form — subagents don't get
skills. Nobody edits a kickoff beyond appending the rider (Dispatcher charter §2).

## The rider template

Canon core; ⟨slots⟩ are filled by project doctrine (02's turf). The instantiated rider
is part of a project's doctrine docs, written once per project, appended verbatim to
every dispatch.

> You are running as a dispatched agent. Follow ⟨working agreements ref⟩. Read
> ⟨bulletin path⟩ before each major method section; append the moment you discover
> something that changes another agent's plans — verbatim finding + evidence pointer.
> If you work in a worktree, read the main bulletin by its absolute path, but append
> to your own worktree's copy (create it if absent), each entry headed `→ relay`, left
> uncommitted — the Dispatcher relays flagged entries verbatim; everything else of
> yours rides your branch. Your findings file and commits are the deliverable. Your final report is
> logistics only: status (LANDED / KILLED / BLOCKED), a one-line outcome, and pointers
> to findings + commits.

Universal core (never varies): the dispatched framing · files-are-the-deliverable ·
report-is-logistics-only. Project slots: agreements ref, bulletin path (projects with no
bulletin drop that sentence), worktree specifics.

## The precedence law

Canonical clause, carried verbatim by every charter:

> **Precedence:** worn by explicit summons only. While worn, this charter overrides the
> global CLAUDE.md where they conflict on workflow — when to ask, when to act;
> personality, code style, and git conventions always apply.

The collision it resolves: the global *"don't start writing code without asking"* vs a
Builder executing a blessed order autonomously — the order IS the ask; both rules are
correct in their own sessions.

**Hook for 03** — the global CLAUDE.md must plant this line (verbatim or tighter):

> A session explicitly summoned under a mantle (`~/code/agents/canon/mantles/`) follows
> its charter where it conflicts with these directives on workflow; personality and
> style always apply.

## Delivery

- **Canonical: read-by-path.** Works today, on every account, interactive and
  dispatched: `Wear ~/code/agents/canon/mantles/<mantle>.md`.
- **Interactive sugar: skill shims** (`canon/skills/<mantle>/SKILL.md`, five authored
  files — not generated; sync stays a dumb mirror). Each shim points at the charter
  path and injects `${CLAUDE_EFFORT}` for the full tier guard, and sets
  `disable-model-invocation: true` — a mantle is worn by Felix's word, never by a
  model's own initiative. Evidence for the mechanism: skills ARE discovered per
  `$CLAUDE_CONFIG_DIR/skills/` and effort substitution works (both verified empirically
  2026-08-02, this repo's ledger). Deployment is 04's (D3 amended: `skills/` joins the
  sync set).
- A skill's own `model:`/`effort:` frontmatter is deliberately NOT used: the override
  lasts one turn (documented), and a one-turn tier masquerading as a session tier is
  hidden state — the guard verifies instead.

## Doctrine vocabulary

Board · brief · work order · findings · bulletin · batch report · decision queue ·
statuses (OPEN / IN FLIGHT / LANDED / KILLED / BLOCKED / PENDING) · the working verbs —
canonized in the work doctrine (`canon/work/DOCTRINE.md`, landed 2026-08-03): the board
§4, work docs §5, findings §6, the bulletin §9, batches §10, glossary §13.

## The charter template

Every charter, in order: motto blockquote · mission paragraph · **Staffing** ·
**Tier guard** · **Precedence** (canonical clause) · Owns (where applicable) · the
mantle's procedure sections · Escalation triggers · Deliverables / End of session ·
**Forbidden — the single-glance list** · Summons (interactive + dispatched). A charter
that can't be finished at this quality becomes a bounded work order (D4), never a
rushed draft.
