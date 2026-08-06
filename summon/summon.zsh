# summon — Ctrl-G ignition for Claude sessions.
#
# Source from .zshrc:   source ~/code/agents/summon/summon.zsh
#
#   ^G <preset> <account>       launch a mantled session          (3 keys)
#   ^G <preset> y <account>     …and yank its summons first       (4 keys)
#   ^G <model> <effort> <acct>  launch bare — no name, no colour  (4 keys)
#   ^G ^G                       repeat the last invocation        (2 keys)
#   ^G .                        eject an editable command, no launch
#   ^G <esc, or anything unbound>   abort
#
# Clipboard law: `y` is the only clipboard write this rig ever makes — Felix's clipboard
# usually carries the previous agent's kickoff, and clobbering it costs more than the
# paste it saves. A positional prompt can carry `/color <colour>` OR a summons, never
# both: the colour parser eats the whole first message (README — E1).
#
# presets.tsv and accounts.tsv are re-read on every invocation — edit them freely.
# Every invocation, aborts included, appends one JSONL line; `summon-stats` reports it.

zmodload zsh/datetime || print -u2 'summon: zsh/datetime missing — timestamps dead'

typeset -g SUMMON_HOME=${${(%):-%x}:A:h}
[[ -d $SUMMON_HOME/log ]] || mkdir -p $SUMMON_HOME/log

typeset -gA _summon_preset _summon_account				# key → tab-joined row
typeset -ga _summon_preset_keys _summon_account_keys	# menu order, as filed
typeset -g  _summon_error										# why _summon_load refused

# the bare path's ordered key maps — display order and lookup from one source
typeset -ga _summon_models=(f:fable o:opus s:sonnet h:haiku)
typeset -ga _summon_efforts=(l:low m:medium h:high x:xhigh M:max)

# the current description (account-independent) and what it assembles into
typeset -g _summon_mantle _summon_model _summon_effort _summon_color _summon_summons
typeset -g _summon_cmd
typeset -g _summon_last _summon_last_account			# log/last, and the account behind it
typeset -g _summon_found										# _summon_identify's answer

# --- data ------------------------------------------------------------------------

_summon_load() {
	local key rest
	_summon_error=''
	_summon_preset=() _summon_preset_keys=() _summon_account=() _summon_account_keys=()
	[[ -r $SUMMON_HOME/presets.tsv && -r $SUMMON_HOME/accounts.tsv ]] || {
		_summon_error='presets.tsv / accounts.tsv unreadable'
		return 1
	}
	while IFS=$'\t' read -r key rest; do
		[[ -z $key || $key == '#'* ]] && continue
		_summon_preset[$key]=$rest
		_summon_preset_keys+=($key)
	done < $SUMMON_HOME/presets.tsv
	while IFS=$'\t' read -r key rest; do
		[[ -z $key || $key == '#'* ]] && continue
		_summon_account[$key]=$rest
		_summon_account_keys+=($key)
	done < $SUMMON_HOME/accounts.tsv
	(( $#_summon_preset > 0 && $#_summon_account > 0 )) || {
		_summon_error='presets.tsv / accounts.tsv empty'
		return 1
	}
	# the state machine owns the model keys and the eject key — a preset may not shadow one
	local -a reserved=(${_summon_models%%:*} .)
	for key in $_summon_preset_keys; do
		(( $reserved[(Ie)$key] )) || continue
		_summon_error="presets.tsv claims reserved key '$key' (reserved: $reserved)"
		return 1
	done
	return 0
}

# --- description → command -------------------------------------------------------

# <preset-key> → mantle, model, effort, colour, and the derived summons
_summon_describe() {
	local -a p=(${(ps:\t:)_summon_preset[$1]})
	local title="${(C)${p[1]//-/ }}" article=a
	[[ $title[1] == [AEIOU] ]] && article=an
	[[ $p[1] == grand-architect ]] && article=the		# canon: "the Grand Architect"
	_summon_mantle=$p[1] _summon_model=$p[2] _summon_effort=$p[3] _summon_color=$p[4]
	_summon_summons="You are $article $title at $p[2]-$p[3]. Wear ~/code/agents/canon/mantles/$p[1].md."
}

# <model> <effort> → the bare description: no mantle, no colour, no summons
_summon_describe_bare() {
	_summon_mantle='' _summon_color='' _summon_summons=''
	_summon_model=$1 _summon_effort=$2
}

_summon_forget() {
	_summon_mantle='' _summon_model='' _summon_effort='' _summon_color=''
	_summon_summons='' _summon_cmd='' _summon_found=''
}

# <account-key> → the command line for the current description
_summon_assemble() {
	_summon_cmd="CLAUDE_CONFIG_DIR=${${(ps:\t:)_summon_account[$1]}[1]}"
	_summon_cmd+=" claude --model $_summon_model --effort $_summon_effort"
	[[ -n $_summon_mantle ]] && _summon_cmd+=" -n $_summon_mantle \"/color $_summon_color\""
	return 0
}

# <account-key> <resolved-command> → $_summon_found = the preset that produces it, with the
# description set to match. Everything empty when no preset does — a bare command, or
# presets.tsv moved since; the caller logs nulls and carries on.
_summon_identify() {
	local key
	for key in $_summon_preset_keys; do
		_summon_describe $key
		_summon_assemble $1
		[[ $_summon_cmd == "$2" ]] && { _summon_found=$key; return 0 }
	done
	_summon_forget
	return 1
}

# log/last → $_summon_last (verbatim) + $_summon_last_account ('' when accounts.tsv moved)
_summon_recall() {
	local dir key
	_summon_last='' _summon_last_account=''
	[[ -r $SUMMON_HOME/log/last ]] || return 1
	read -r _summon_last < $SUMMON_HOME/log/last
	dir=${${${(z)_summon_last}[1]}#CLAUDE_CONFIG_DIR=}
	for key in $_summon_account_keys; do
		[[ ${${(ps:\t:)_summon_account[$key]}[1]} == $dir ]] && { _summon_last_account=$key; break }
	done
	[[ -n $_summon_last ]]
}

# --- clipboard + telemetry -------------------------------------------------------

# the one clipboard write, and only on `y` — post-decision, so the fork costs nothing
_summon_yank() {
	[[ -n $_summon_summons ]] || return 1
	print -rn -- $_summon_summons | pbcopy
}

_summon_json() { [[ -n $1 ]] && _summon_json_value="\"$1\"" || _summon_json_value=null }

# <mode> <keys> <account-key> — the rest is the current state; empty fields log null
_summon_log() {
	local ts esc=${_summon_cmd//\\/\\\\}
	esc=${esc//\"/\\\"}
	strftime -s ts '%Y-%m-%dT%H:%M:%S%z' $EPOCHSECONDS
	local rec="{\"ts\":\"$ts\",\"mode\":\"$1\",\"keys\":$2"
	_summon_json "$_summon_mantle"											# -n is the mantle slug
	rec+=",\"n\":$_summon_json_value,\"mantle\":$_summon_json_value"
	_summon_json "${${(ps:\t:)${_summon_account[$3]:-}}[2]}"
	rec+=",\"account\":$_summon_json_value"
	_summon_json "$_summon_model"		; rec+=",\"model\":$_summon_json_value"
	_summon_json "$_summon_effort"	; rec+=",\"effort\":$_summon_json_value"
	_summon_json "$_summon_color"		; rec+=",\"color\":$_summon_json_value"
	_summon_json "$esc"					; rec+=",\"cmd\":$_summon_json_value}"
	print -r -- "$rec" >> $SUMMON_HOME/log/invocations.jsonl
}

# --- the widget ------------------------------------------------------------------

_summon_widget() {
	[[ -n $BUFFER ]] && zle push-input			# never clobber a line in progress
	_summon_forget
	_summon_load || {
		zle -M "summon: $_summon_error"
		_summon_log abort 1 ''								# a keystroke that went nowhere still counts
		return 1
	}
	_summon_recall

	# menus are built from builtins only — a fork here is input delay Felix would feel
	local key press pair label head hint menu='summon · keys: 1'$'\n'
	local -a p
	local lastlabel=${${(ps:\t:)${_summon_account[$_summon_last_account]:-}}[2]:-—}
	for key in $_summon_preset_keys; do
		p=(${(ps:\t:)_summon_preset[$key]})
		menu+="   $key $p[1] $p[2]-$p[3]"
	done
	menu+=$'\n'"   bare:"
	for pair in $_summon_models; do menu+=" ${pair%%:*} ${pair#*:}"; done
	menu+=$'\n'"   ^G repeat ($lastlabel) · . eject · esc abort"
	zle -M "$menu"
	zle -R
	read -k 1 press

	case $press in
		$'\a')			# ^G — repeat last, the 2-key floor
			[[ -n $_summon_last ]] || {
				zle -M 'summon: nothing to repeat yet'
				_summon_log abort 2 ''
				return 1
			}
			_summon_identify "$_summon_last_account" "$_summon_last"	# nulls when it was bare
			_summon_cmd=$_summon_last
			_summon_log repeat 2 "$_summon_last_account"
			BUFFER=$_summon_cmd
			zle accept-line
			return 0
			;;
		'.')				# eject — an editable command, launched by Felix's own ⏎
			if [[ -n $_summon_last ]]; then
				_summon_identify "$_summon_last_account" "$_summon_last"
				_summon_cmd=$_summon_last
				_summon_log eject 2 "$_summon_last_account"
			else
				_summon_describe $_summon_preset_keys[1]
				_summon_assemble $_summon_account_keys[1]
				_summon_log eject 2 $_summon_account_keys[1]
			fi
			BUFFER=$_summon_cmd
			CURSOR=$#BUFFER
			zle -M ''
			return 0
			;;
	esac

	# --- key 2: a preset, or a model key onto the bare path
	local mode=pick model=''
	for pair in $_summon_models; do
		[[ ${pair%%:*} == $press ]] && { mode=bare; model=${pair#*:}; break }
	done
	local -i keys=2
	if [[ $mode == bare ]]; then
		keys=3
		menu="summon · $model · keys: 2"$'\n'
		for pair in $_summon_efforts; do menu+="   ${pair%%:*} ${pair#*:}"; done
		menu+=$'\n'"   esc abort"
		zle -M "$menu"
		zle -R
		read -k 1 press
		for pair in $_summon_efforts; do
			[[ ${pair%%:*} == $press ]] && { _summon_describe_bare $model ${pair#*:}; break }
		done
		[[ -n $_summon_effort ]] || { zle -M 'summon: aborted'; _summon_log abort 3 ''; return 1 }
		head="$model-$_summon_effort"
	else
		[[ -n ${_summon_preset[$press]:-} ]] || {
			zle -M 'summon: aborted'
			_summon_log abort 2 ''
			return 1
		}
		_summon_describe $press
		head="$_summon_mantle $_summon_model-$_summon_effort"
		hint=' · y yank summons'
	fi

	# --- last key: the account — this one fires
	menu="summon · $head · keys: $keys"$'\n'
	for key in $_summon_account_keys; do
		label=${${(ps:\t:)_summon_account[$key]}[2]}
		menu+="   $key $label"
	done
	menu+=$'\n'"   ⏎ last: $lastlabel$hint · esc abort"
	zle -M "$menu"
	zle -R
	read -k 1 press

	if [[ $press == y && $mode == pick ]]; then		# opt-in clipboard, mantle path only
		_summon_yank
		(( keys++ ))
		zle -M "$menu"$'\n'"   summons yanked · keys: $keys"
		zle -R
		read -k 1 press
	fi
	(( keys++ ))
	[[ $press == $'\r' || $press == $'\n' ]] && press=$_summon_last_account
	[[ -n $press && -n ${_summon_account[$press]:-} ]] || {
		zle -M 'summon: aborted'
		_summon_log abort $keys ''
		return 1
	}

	_summon_assemble $press
	_summon_log $mode $keys $press
	print -r -- $_summon_cmd > $SUMMON_HOME/log/last
	BUFFER=$_summon_cmd
	zle accept-line
}

zle -N _summon_widget
bindkey '^G' _summon_widget

# --- the reporter ----------------------------------------------------------------

# <line> <field> → $_summon_field_value, empty for JSON null. Reads what _summon_log
# writes and nothing else: values are null, a bare number, or a string whose only escape
# is \" — so a string ends at the next `","` key boundary, or at `"}` on the last field.
_summon_field() {
	local rest=${1#*\"$2\":}
	case $rest in
		null*)	_summon_field_value='' ;;
		\"*)		rest=${rest#\"}
					_summon_field_value=${rest%%\",\"*}
					[[ $_summon_field_value == "$rest" ]] && _summon_field_value=${rest%\"\}}
					;;
		*)			_summon_field_value=${rest%%,*} ;;
	esac
}

# summon-stats — what the rig is actually used for; presets.tsv is only the hypothesis.
summon-stats() {
	local f=$SUMMON_HOME/log/invocations.jsonl line key mode account mantle cmd pair
	local -A modes pairs
	local -i n=0 keys=0 typed=0 k=0 seen=0
	[[ -r $f ]] || { print -u2 "summon-stats: no log at $f"; return 1 }
	while IFS= read -r line; do
		_summon_field "$line" keys		; k=${_summon_field_value:-0}
		_summon_field "$line" cmd		; cmd=${_summon_field_value//\\\"/\"}	# as typed, not as logged
		_summon_field "$line" mode		; mode=$_summon_field_value
		_summon_field "$line" account	; account=${_summon_field_value:-—}
		_summon_field "$line" mantle	; mantle=${_summon_field_value:-$mode}	# bare + aborts have none
		(( n++, keys += k, typed += ${#cmd} ))
		# count outside the math context — these keys hold spaces, which math would parse
		seen=${modes[$mode]:-0}		; modes[$mode]=$(( seen + 1 ))
		pair="$mantle · $account"	; seen=${pairs[$pair]:-0}	; pairs[$pair]=$(( seen + 1 ))
	done < $f
	print -r -- "summon-stats · $n invocations · $f"
	print -rn -- '  modes '
	for key in ${(ko)modes}; do print -rn -- " $key $modes[$key]"; done
	print -r -- $'\n  mantle × account'
	for key in ${(ko)pairs}; do printf '    %-34s %d\n' "$key" $pairs[$key]; done
	printf '  keys  %d spent vs %d chars of command typed (%.1f× leverage)\n' \
		$keys $typed $(( keys ? 1.0*typed/keys : 0 ))
}
