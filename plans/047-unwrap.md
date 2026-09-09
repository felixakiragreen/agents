# 047 — the unwrap

**Status:** OPEN — laid 2026-09-08 · **Depends on:** — · **Staffing:** Builder · opus-high · **Blessed:** Felix, 2026-09-08, in the room (D88 ⬡✓): the rule, the run over agents, the global file's line already live.

## Mission

D88 is law: prose flows, one paragraph one line, the reader's width decides. The corpus follows by the converter (D81): `doctrine migrate` gains the **unwrap** rule — a paragraph's hard-wrapped lines join into one — and runs it over this building whole, history and voice included. Every later `migrate` run in any building carries the rule, so a building adopts D88 with one command at its next Architect session. This doc is written under the law it lays; the docs laid before it today are not, and this charge unwraps them.

**Birthplace:** his word in the inbox, 2026-09-08 — *"is it possible to tell agents not to split everything up onto new lines? Let page width & auto wrapping handle that for me automatically? It makes resizing much easier and nicer."* Priced at the desk: one Builder session, then one command per building. Ancestors: D81 (a form change lands with its converter rule and the corpus respelled), 040 (the id respell — run the converter twice and diff, 040-F7; a fixed point is the bar), formula 26 (history is respelled, never rewritten — a respell is not an edit).

## Inputs — read before working

- `canon/CLAUDE.md` §5 item 7 (the law, live); `DECISIONS.md` D88 (the fence: fixtures and lab excluded; hard breaks kept); DOCTRINE §1 (the corpus is current), §3 (`lab/`, `fixtures/`, `templates/` — the register law's non-corpus; templates ARE unwrapped here, they are copied), §8 (the molt clause — form migrates freely, meaning byte-preserved).
- `doctrine/src/migrate.ts` — `RULES`, the two-class run (structure and field rules, then the clause pass), `roundTrip`, `diff`, `write`; `doctrine/src/respell.ts` (the document fence — which files a rule may touch); `doctrine/cli.ts` (`migrate`'s flags); `plans/040-id-respell.md` F2 · F6 · F7 · F8 (the four rulings every respell inherits).
- The city's markdown as the census: this building's `plans/`, `canon/`, `LOG.md`, `LEDGER.md`, `belvedere/` — every construct the rule must leave alone appears somewhere here (fenced kickoffs, tables, blockquoted codas, nested lists, `---` separators, the Shelf's bullets, `~~struck~~` runs, reference links).

## Spec

**The rule.** Inside a paragraph — consecutive non-blank lines that are not inside a fence, not table rows, not headings, not `---`, not HTML — lines join with one space. A list item's continuation lines join to the item's line, their indentation dropped; a nested item starts its own line. A blockquote's continuation lines join with the inner `> ` dropped, the quote's first marker kept. A hard break — two trailing spaces, or a trailing backslash — stays a line break. Fenced code, tables, headings, thematic breaks, HTML blocks and comments, reference-link definitions and front matter are untouched byte for byte. CommonMark renders a soft line break as a space, so the render is identical: the rule is form only.

**Two invariants, asserted in the suite:** (1) the round-trip law — `parse(migrate(x)) ≡ parse(x)` for every parsed field, as every rule already obeys; (2) **the word law** — outside fences, the migrated text with all whitespace runs collapsed to one space equals the original under the same collapse: only whitespace moved, no word did. Fences are compared byte for byte. And **the fixed point** (040-F7): the second run writes nothing, on every file, proven by running twice and diffing.

**The fence.** Every tracked `.md` of the building, `belvedere/` included (a retired building's books are still this building's bytes, and the run is free); `doctrine/fixtures/**` excluded — they are the suite's contracts, and their bytes are the tests' — and `lab/**` excluded — disposable (§3). `.ts`, `.json`, `.tsv`, `.zsh` and every other kind untouched. The same fence binds every building's future run.

**`--summary`.** `migrate` gains a flag that prints, per file, the count of edits by rule and the round-trip verdict, and no diff — the pre-chewed answer to the trap the office named at the lay: an unwrap diff is the whole corpus, and a Builder that reads it spends the batch's tokens on whitespace. The dry run is still the default; `--write` is still required to touch a byte.

**Blame.** The respell commit's sha goes into `.git-blame-ignore-revs` at the repo root, and `git config --local blame.ignoreRevsFile .git-blame-ignore-revs` is set here (a repo-local config write; nothing outside the repo). The README's `migrate` section names both.

**The run.** `doctrine migrate --summary ~/code/agents` (the table read, the verdicts all `ok`), then `--write`, then the second run (nothing written), then `bun test` and `doctrine lint ~/code/agents` on the unwrapped tree. Commit the run as one commit — the respell is one act (D81).

## Done when:

- [ ] `bun test` green from `doctrine/` with the unwrap fixtures: one before/after pair per construct above (paragraph · list continuation · nested list · blockquote · hard break · fence · table · heading · `---` · reference link), the word law and the round-trip law asserted over each, idempotence asserted over the whole set. Output pasted.
- [ ] `doctrine migrate --summary ~/code/agents` pasted before the write; the second run after the write pasted, writing nothing.
- [ ] `bun test` green and `doctrine lint ~/code/agents` unchanged (19 `board.cell-cap`, belvedere's) on the unwrapped tree — pasted.
- [ ] `doctrine lint --vocab ~/code/agents` before and after — identical counts, pasted (the vocabulary arm reads the same words in the same places).
- [ ] The longest line in `canon/work/DOCTRINE.md` after the run, in characters, pasted — a number the reader can feel.
- [ ] `.git-blame-ignore-revs` present and configured; `git blame -L 1,5 canon/work/STANDARD.md` shows pre-respell authorship — pasted.
- [ ] `doctrine migrate ~/code/stigmergon` dry run pasted as the control: the table of what the rule *would* do there (nothing written — that building adopts at its own desk).

## Out of scope

- Writing anything but whitespace — a word moved, dropped or added is a rejection.
- Any other building's files; `doctrine/fixtures/**`; `lab/**`; non-markdown files.
- The global file's line — live already (D88); canon text of any kind.
- A column limit of any size — the law is no limit.

## Findings

*(append here — evidence-grade: every claim carries the command and output that proved it; probes ship with a control)*

---

**Kickoff (verbatim):**

```
You are a Builder at opus-high.
Enter by the door — read ~/code/agents/canon/GUILD.md,
wear ~/code/agents/canon/mantles/builder.md,
then read ~/code/agents/MAP.md §7 and ~/code/agents/doctrine/README.md, and build ~/code/agents/plans/047-unwrap.md to its bar.
```
