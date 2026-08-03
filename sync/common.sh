#!/usr/bin/env bash
# Shared facts for deploy and check: the sync set (D15) and the one mechanism (D14).
# Sourced, never run.

set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CANON="$REPO/canon"

# The sync set, final per D15 — each name is both the canon source and the dest name.
# Mantles are read by path (D12), never deployed.
TARGETS=(CLAUDE.md agents skills)

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
	local t skill name
	for t in "${TARGETS[@]}"; do
		[ -e "$CANON/$t" ] || die "canon is missing $t — wrong repo, or a bad clone"
	done
	# F6: a skill whose dirname differs from its frontmatter name is ignored in silence.
	for skill in "$CANON"/skills/*/; do
		name="$(basename "$skill")"
		[ -f "$skill/SKILL.md" ] || die "skill $name has no SKILL.md"
		[ "$(sed -n 's/^name:[[:space:]]*//p' "$skill/SKILL.md" | head -1)" = "$name" ] \
			|| die "skill $name: frontmatter name != dirname — Claude Code would ignore it silently (F6)"
	done
}

# F7: whole-dir symlinks mean anything dropped into an account's agents/ or skills/
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
