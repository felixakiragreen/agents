#!/bin/sh
# Validity check for Q3 — if hooks are synchronous, N events x 0.5s must show up as
# N x 0.5s of session wall time.  Proves the per-event cost is a real session tax.
cat > /dev/null
sleep 0.5
