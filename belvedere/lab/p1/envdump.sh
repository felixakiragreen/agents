#!/bin/sh
# P1 probe — one-shot full env of a hook process (proves the CMUX join by exhaustion).
env | sort > "${P1_OUT:-/tmp/p1-census.jsonl}.hookenv"
