#!/usr/bin/env zsh
# lab/008 — the panel is a pure function of the selection and $COLUMNS, so render it with no
# pty and assert on it byte-exactly: the wrap on the text, the palette on the spans. Each
# span is printed with the text its offsets actually cover, so a wrong offset shows up as
# the wrong text rather than passing quietly.
#   render.zsh <sandbox> <columns> <mantle-key> <model> <effort> <account-key> <keys> [yank]
#               [bump] [t presses]
# The name-stamp's lineage ordinal comes from the sandbox's own log, counted once here as the
# panel counts it at open; $PWD decides the stamp — the directory's own name, or the building
# register's list for it cycled <t presses> times — so callers cd to the building they mean.
set -u
source $1/summon.zsh 2>/dev/null
_summon_load || { print -u2 "render: $_summon_error"; exit 1 }
# the v1.1 baseline this harness also renders predates the counter, hence the guards
(( ${+functions[_summon_ordinal_scan]} )) && _summon_ordinal_scan
if (( ${+functions[_summon_stamps_load]} )); then
	_summon_stamp_sticky_load
	_summon_stamps_load || { print -u2 "render: $_summon_error"; exit 1 }
	presses=${10:-0}
	while (( presses-- > 0 )); do _summon_stamp_cycle; done
fi
_summon_bump=${9:-0}
COLUMNS=$2
_summon_mantle_key=$3 _summon_model=$4 _summon_effort=$5 _summon_account_key=$6
_summon_panel $7 "${8:-}" 0
print -r -- $_summon_panel_value
print -r -- '--- spans'
for s in "$_summon_highlight[@]"; do
	start=${${s%% *}#P} end=${${s#* }%% *} style=${s##* }
	print -r -- "$style ⟨${_summon_panel_value[start+1,end]}⟩"
done
print -r -- '--- cmd'						# what that very panel would fire, byte for byte
print -r -- $_summon_cmd
