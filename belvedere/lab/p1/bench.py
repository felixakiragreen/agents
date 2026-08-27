#!/usr/bin/env python3
"""P1 Q3 — per-event heartbeat cost.  Claude Code blocks on the hook process, so the
cost to a session is exactly the wall time of spawning it and letting it finish.
Replays a real captured payload (the fattest one) N times per candidate."""
import json, os, statistics, subprocess, sys, time

payload = open(sys.argv[1], 'rb').read()
N = int(sys.argv[2]) if len(sys.argv) > 2 else 20
env = dict(os.environ, CENSUS_DIR='/private/tmp/claude-502/-Users-felix-code-agents/aa67709f-a7d4-4024-b3a3-1bd2ceddac23/scratchpad/bench')
os.makedirs(env['CENSUS_DIR'], exist_ok=True)
lab = os.path.dirname(os.path.abspath(__file__))

print(f'payload {len(payload)} bytes · N={N}\n')
print(f'{"candidate":<14}{"min":>9}{"median":>9}{"p95":>9}{"max":>9}   (ms)')
for name in ('noop.sh', 'beat.sh', 'capture.sh'):
	for _ in range(3):  # warm the page cache
		subprocess.run([f'{lab}/{name}'], input=payload, env=env, capture_output=True)
	ts = []
	for _ in range(N):
		t = time.perf_counter()
		subprocess.run([f'{lab}/{name}'], input=payload, env=env, capture_output=True)
		ts.append((time.perf_counter() - t) * 1000)
	ts.sort()
	print(f'{name:<14}{ts[0]:>9.2f}{statistics.median(ts):>9.2f}{ts[int(N*0.95)-1]:>9.2f}{ts[-1]:>9.2f}')
