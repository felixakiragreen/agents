# The vocabulary control — one line that must catch, one that must not

The control set (DOCTRINE §6.2) for `doctrine lint --vocab`. Cases are authored, never
re-derived from the patterns (manny's M13, item 4) — if the arm and this file disagree, one of
them is wrong and the test says which.

## 1. The board

| ID | Work | Depends on | Staffing | Status |
|---|---|---|---|---|
| C1 | the keel sitting | — | Builder · opus-high | OPEN |
| C2 | the great re-cut | C1 | Builder · opus-high | **LANDED** 2026-08-29 — the batch was parked, then fired |
| C3 | the deck, respelled | C1 | ⬡-gate | OPEN — DEFERRED |

C1 is live, so its Work cell speaks the standard or fails: `keel` fires. C2 is finished, so the
whole row is history and its three dead words are fenced. Every row's Depends-on, Staffing and
Status cells are the parser's columns and are fenced by construction.

## 2. Prose that drifts

The register keeps the DoD; its colour is grey, not gray.

## 3. Prose that does not

A tick spares a mention: `unstaffed` is the dead word, and "the Dispatcher is dead" is a quote.

> The old brief said to park it until the helm cleared.

```
You are a Dispatcher at sonnet-medium. Fire row 3 after the harvest.
```

## Findings

The rider was parked at the keel sitting; the Dispatcher fired the wave.
