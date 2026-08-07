#!/usr/bin/env zsh
# lab/08 — deterministic usage caches, written relative to now so the pacing deltas are
# fixed numbers rather than whatever the wall clock says. The values reproduce the brief's
# worked examples: session 42% used at 73% elapsed → +31; week 61% at 48% → −13.
#   usage-seed.zsh <sandbox> [mixed|fresh]
# mixed (the default) leaves account 0 with no cache at all, 1 fresh with all three buckets,
# and 2 stale and missing the fable bucket — every render arm in one panel. fresh gives all
# three current caches, so opening the panel spawns no background fetch and the pty arm has
# nothing racing its paint.
set -u
zmodload zsh/datetime

SANDBOX=$1
MODE=${2:-mixed}
DIR=$SANDBOX/log/usage
mkdir -p $DIR

# <file> <fetched-age> <bucket:used:elapsed-pct ...>
seed() {
	local file=$1 out='' bucket used elapsed spec first=1
	local -i age=$2 window resets
	shift 2
	out="{\"fetched_at\":$(( EPOCHSECONDS - age )),\"windows\":{"
	for spec in "$@"; do
		bucket=${spec%%:*} used=${${spec#*:}%%:*} elapsed=${spec##*:}
		window=18000
		[[ $bucket == sess ]] || window=604800
		(( resets = EPOCHSECONDS + window * (100 - elapsed) / 100 ))
		(( first )) || out+=','
		out+="\"$bucket\":{\"used_pct\":$used,\"resets_at\":$resets,\"window_secs\":$window}"
		first=0
	done
	print -r -- "$out}}" > $file
}

rm -f $DIR/.claude.json $DIR/.claude-thg-fgreen.json $DIR/.claude-thg-doorbell.json
seed $DIR/.claude-thg-fgreen.json    0   sess:42:73  week:61:48  fable:12:67
if [[ $MODE == fresh ]]; then
	seed $DIR/.claude.json             0   sess:17:30  week:4:60   fable:8:60
	seed $DIR/.claude-thg-doorbell.json 0  sess:78:65  week:45:47
else
	seed $DIR/.claude-thg-doorbell.json 900 sess:78:65  week:45:47
	# account 0 (personal) is deliberately left with no cache file
fi
