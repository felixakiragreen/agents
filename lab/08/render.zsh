#!/usr/bin/env zsh
# lab/08 — the panel is a pure function of the selection and $COLUMNS, so render it with no
# pty and assert on it byte-exactly: the wrap on the text, the palette on the spans. Each
# span is printed with the text its offsets actually cover, so a wrong offset shows up as
# the wrong text rather than passing quietly.
#   render.zsh <sandbox> <columns> <mantle-key> <model> <effort> <account-key> <keys> [yank]
set -u
source $1/summon.zsh 2>/dev/null
_summon_load || { print -u2 "render: $_summon_error"; exit 1 }
COLUMNS=$2
_summon_mantle_key=$3 _summon_model=$4 _summon_effort=$5 _summon_account_key=$6
_summon_panel $7 "${8:-}" 0
print -r -- $_summon_panel_value
print -r -- '--- spans'
for s in "$_summon_highlight[@]"; do
	start=${${s%% *}#P} end=${${s#* }%% *} style=${s##* }
	print -r -- "$style ⟨${_summon_panel_value[start+1,end]}⟩"
done
