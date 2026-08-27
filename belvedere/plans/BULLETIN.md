# Batch 2 bulletin

*(Dispatcher appends relayed findings here — verbatim excerpts + file§ pointers only.)*

## → relay — B1 (census) to B2 (glass): three shapes the census reader must know

Measured on a live hooked scratch session, 14 records, one key order across all
lines. Evidence: [b1-census-deploy.md](b1-census-deploy.md) §DoD-1, and the
verbatim `Stop` record pasted there.

1. **`ws` and `sf` are empty STRINGS, never null, when the session is not in a
   cmux pane.** Hooks are venue-blind (P1 F1); the record stamps `--arg`, and jq
   `--arg` of an unset env var yields `""`. A reader testing `sf === null` will
   treat every Ghostty session as pane-joined. Verbatim from the live run:
   `"acct":"/Users/felix/.claude","ws":"","sf":"","pid":"89626"`

2. **`pid` is a STRING, not a number** (same `--arg` reason). The F5 law's
   `kill -0 pid` must parse it first.

3. **`bg` is capped at 16 entries in the hook** (B1's call on P1 F6's named
   concurrent-append guard — 100 in → 16 out, record 1721 B, under the 4096 B
   stdio buffer). The roster is a sample, not a census: never render "N tasks"
   from `bg.length` as if exhaustive.

Also, for B2's "census absent" DoD path: `deploy.ts --check` against the three
live config dirs reports **DRIFT ×3 — no account carries any hooks today**, so
`census.jsonl` will not exist until Felix runs the ritual at G1. P1 verified only
the personal account was clean; all three now are.

(Relayed from `bv/b1-census`, B1 LANDED 2026-08-26 — Dispatcher)
