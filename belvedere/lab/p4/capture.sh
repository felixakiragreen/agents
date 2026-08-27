#!/bin/bash
# P4 restore-semantics state capture. Usage: capture.sh <label>
# Writes a snapshot of everything that can be observed from OUTSIDE cmux.
set -u
LAB="$(cd "$(dirname "$0")" && pwd)"
OUT="$LAB/snapshots/$1"
mkdir -p "$OUT"
S1=aa67709f-a7d4-4024-b3a3-1bd2ceddac23   # digger-agents-02
S2=5b9f1786-7387-4855-8481-b6aded8a2246   # digger-agents-03
TDIR="$HOME/.claude/projects/-Users-felix-code-agents"

{
  echo "label=$1"
  echo "wall=$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)  epoch=$(python3 -c 'import time;print(time.time())')"
  echo "--- cmux app process ---"
  pgrep -fl 'cmux.app/Contents/MacOS/cmux' || echo "(cmux app NOT running)"
  echo "--- socket ---"
  ls -l "$HOME/.local/state/cmux/cmux.sock" 2>&1
  echo "--- socket reachable from here (outside cmux) ---"
  cmux workspace list 2>&1
  echo "cmux_exit=$?"
  echo "--- claude processes for the two bound sessions ---"
  pgrep -fl 'digger-agents-0[23]' || echo "(neither digger-agents-02 nor -03 is running)"
  echo "--- all claude session processes (count) ---"
  echo "count=$(pgrep -f '^/Users/felix/.local/bin/claude|^claude ' | wc -l | tr -d ' ')"
  echo "--- transcripts ---"
  for s in $S1 $S2; do
    f="$TDIR/$s.jsonl"
    echo "$s bytes=$(stat -f%z "$f") lines=$(wc -l < "$f" | tr -d ' ') mtime=$(stat -f%Sm -t %Y-%m-%dT%H:%M:%S "$f")"
  done
} > "$OUT/state.txt" 2>&1

cp "$HOME/Library/Application Support/cmux/session-com.cmuxterm.app.json" "$OUT/session.json" 2>/dev/null
for s in $S1 $S2; do tail -3 "$TDIR/$s.jsonl" > "$OUT/$s.tail.jsonl" 2>/dev/null; done
echo "captured -> $OUT"
cat "$OUT/state.txt"
