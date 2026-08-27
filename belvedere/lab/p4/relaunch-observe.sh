#!/bin/bash
# P4: relaunch cmux and poll the restore, timing every transition. Usage: relaunch-observe.sh <seconds>
set -u
LAB="$(cd "$(dirname "$0")" && pwd)"
DUR=${1:-40}
T=$HOME/.claude/projects/-Users-felix-code-agents
S1=aa67709f-a7d4-4024-b3a3-1bd2ceddac23
S2=5b9f1786-7387-4855-8481-b6aded8a2246
SOCK=$HOME/.local/state/cmux/cmux.sock

t0=$(python3 -c 'import time;print(time.time())')
echo "T0 = $t0  ($(date +%H:%M:%S)) — firing: open -a cmux"
open -a cmux
prev=""
end=$(python3 -c "print($t0+$DUR)")
while :; do
  now=$(python3 -c 'import time;print(time.time())')
  python3 -c "import sys;sys.exit(0 if $now<$end else 1)" || break
  dt=$(python3 -c "print(f'{$now-$t0:6.2f}')")
  app=$(pgrep -f 'cmux.app/Contents/MacOS/cmux' | head -1); app=${app:-none}
  sock=$([ -S "$SOCK" ] && echo yes || echo no)
  d2=$(pgrep -f 'digger-agents-02' | head -1); d2=${d2:-none}
  d3=$(pgrep -f 'digger-agents-03' | head -1); d3=${d3:-none}
  b1=$(stat -f%z "$T/$S1.jsonl"); b2=$(stat -f%z "$T/$S2.jsonl")
  line="app=$app sock=$sock d02=$d2 d03=$d3 s1=$b1 s2=$b2"
  [ "$line" != "$prev" ] && { echo "[+${dt}s] $line"; prev="$line"; }
  sleep 0.4
done
echo "--- final ---"
echo "socket: $([ -S "$SOCK" ] && echo present || echo absent)"
pgrep -fl 'digger-agents-0[23]' || echo "(no digger-agents-02/03 processes)"
