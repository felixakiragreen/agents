#!/bin/sh
# P1 probe — mint a scratch project dir carrying its own .claude/settings.json.
# $1 = target dir.  $2 = "hooks" (default) or "control" (identical dir, no hooks).
set -e
lab=$(cd "$(dirname "$0")" && pwd)
dir="$1"; mode="${2:-hooks}"
rm -rf "$dir"; mkdir -p "$dir/.claude"
if [ "$mode" = "hooks" ]; then
	sed "s|@LAB@|$lab|g" "$lab/settings.tmpl.json" > "$dir/.claude/settings.json"
else
	printf '{}\n' > "$dir/.claude/settings.json"
fi
printf 'scratch project for belvedere P1 census probe\n' > "$dir/README.md"
printf 'alpha bravo charlie\n' > "$dir/data.txt"
echo "$dir ($mode)"
