#!/usr/bin/env zsh
# lab/08 — the usage arithmetic and the response parser, with no pty and no clock luck:
# every reset time is expressed as an offset from now, so each case has one right answer.
#   usage.zsh <sandbox>
set -u
source $1/summon.zsh 2>/dev/null
LAB=${0:A:h}

# <name> <used> <seconds until reset> <window> — negative seconds mean the reset is past
delta() {
	local name=$1
	local -i used=$2 until=$3 window=$4
	_summon_usage_delta $used $(( EPOCHSECONDS + until )) $window
	printf 'DELTA %-28s used=%-3d → %+d\n' $name $used $_summon_usage_delta_value
}

print -r -- '--- pacing delta at the edges'
delta 'reset imminent'        42 1      18000		# elapsed ≈ 100 → the whole window is spent
delta 'reset just passed'     42 -60    18000		# elapsed clamps to 100, never beyond
delta 'used ahead of clock'   90 9000   18000		# elapsed 50 → burning faster than the clock
delta 'used nothing'          0  9000   18000		# elapsed 50 → all of it is headroom
delta 'reset a window away'   10 36000  18000		# elapsed clamps to 0, never negative
delta 'dead level'            50 9000   18000		# elapsed 50 → exactly on pace
delta 'half rounds up'        42 10350  18000		# elapsed 42.5 → +0.5 away from zero
delta 'half rounds down'      42 10530  18000		# elapsed 41.5 → −0.5 away from zero
delta 'week window'           61 314496 604800	# the brief's worked example → −13
delta 'session window'        42 4860   18000		# the brief's worked example → +31

print -r -- '--- ISO-8601 → epoch (cross-checked against python in run)'
for iso in 2026-08-07T22:00:00.470292+00:00 2026-08-13T18:00:00.470313+00:00 \
	2026-08-07T22:10:00.284679+00:00 2026-08-12T10:00:00.284700+00:00 2026-01-01T00:00:00.000000+00:00; do
	_summon_usage_epoch $iso
	print -r -- "EPOCH $iso $_summon_usage_epoch_value"
done
_summon_usage_epoch 'not-a-timestamp' && print -r -- 'EPOCH BAD accepted junk' \
	|| print -r -- 'EPOCH junk refused, value 0'

print -r -- '--- the response parser, against real payload shapes'
for mode in full nofable garbage; do
	_summon_usage_parse "$(<$LAB/fixtures/usage-$mode.json)"
	print -r -- "PARSE $mode → ${#_summon_usage_parsed} bucket(s): ${(j:, :)_summon_usage_parsed}"
done
