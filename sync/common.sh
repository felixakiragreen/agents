#!/usr/bin/env bash
# Shared facts for deploy and check: the sync set and the one mechanism (symlinks).
# Sourced, never run.

set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CANON="$REPO/canon"

# The sync set — each name is both the canon source and the dest name.
# Mantles are read by path, never deployed. Skills purged 2026-08-29 (C34).
TARGETS=(CLAUDE.md agents)

# The three accounts (GENESIS §1). Test seam: space-separated override, so deploy and
# check can be exercised against scratch dirs, or one account at a time.
if [ -n "${CANON_CONFIG_DIRS:-}" ]; then
	read -r -a CONFIG_DIRS <<< "$CANON_CONFIG_DIRS"
else
	CONFIG_DIRS=("$HOME/.claude" "$HOME/.claude-thg-fgreen" "$HOME/.claude-thg-doorbell")
fi

die() {
	echo "${0##*/}: $*" >&2
	exit 1
}

row() {
	printf '   %-10s %-9s %s\n' "$1" "$2" "$3"
}

# Refuse to touch a config dir unless canon itself is sound.
preflight() {
	local t
	for t in "${TARGETS[@]}"; do
		[ -e "$CANON/$t" ] || die "canon is missing $t — wrong repo, or a bad clone"
	done
}

# F7: whole-dir symlinks mean anything dropped into an account's agents/
# lands in canon as an untracked file. Make the leak visible.
untracked_canon() {
	git -C "$REPO" status --porcelain --untracked-files=all -- canon/ | sed -n 's/^?? //p'
}

# The only four states the mechanism has. `linked` implies the link resolves, because
# preflight proved every canon source exists.
dest_state() {
	local path="$1" want="$2"
	if [ -L "$path" ]; then
		[ "$(readlink "$path")" = "$want" ] && echo linked || echo wrong
	elif [ -e "$path" ]; then
		echo real
	else
		echo absent
	fi
}
