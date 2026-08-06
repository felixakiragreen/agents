# summon — Ctrl-G ignition for Claude sessions.
#
# Source from .zshrc:   source ~/code/agents/summon/summon.zsh
#
# Ctrl-G opens the panel; every key selects; **Enter, and only Enter, fires**.
#
#   ^G <preset> ⏎                    mantled session on the last-used account  (3 keys)
#   ^G <preset> <account> ⏎          …on a named account                       (4 keys)
#   ^G <preset> y <account> ⏎        …and yank its summons first               (5 keys)
#   ^G <model> <effort> [<acct>] ⏎   bare — no name, no colour, no prompt     (4–5 keys)
#   ^G ^G ⏎                          repeat the last invocation                (3 keys)
#   ^G .                             eject an editable command, no launch
#   ^G <esc>                         abort
#
# Key namespaces are staged, so overloaded letters stay unambiguous: `h` is haiku at the
# first choice, high after a model key. Selections are forward-only — a fat-finger is
# Esc and redo.
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
typeset -ga _summon_preset_keys _summon_account_keys	# panel order, as filed
typeset -g  _summon_error										# why _summon_load refused

# the staged key namespaces — panel order and lookup from one source
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
	# the panel owns these at the first choice — a preset may not shadow one
	local -a reserved=(${_summon_models%%:*} y . {0..9} $_summon_account_keys)
	reserved=(${(u)reserved})
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
		_summon_log abort 1 ''							# a keystroke that went nowhere still counts
		return 1
	}
	_summon_recall

	# what the last invocation was, for the repeat row — resolved once, not per render
	local lastdesc=${_summon_last:-—}
	local lastlabel=${${(ps:\t:)${_summon_account[$_summon_last_account]:-}}[2]:-—}
	if [[ -n $_summon_last ]] && _summon_identify "$_summon_last_account" "$_summon_last"; then
		lastdesc="$_summon_mantle $_summon_model-$_summon_effort @ $lastlabel"
	fi
	_summon_forget

	local press pair key panel row fired=''
	local preset='' model='' effort='' account='' armed='' yanked=''
	local -a p
	local -i keys=1
	while (( keys < 32 )); do						# a picker cannot run away
		# the panel: every live hotkey, the current selections, the running counter —
		# builtins only, because a fork here is input delay Felix would feel
		panel="summon · keys: $keys"
		panel+=$'\n'"Ctrl-G   repeat  → ${armed:+ARMED · }$lastdesc"

		row=''
		for key in $_summon_preset_keys; do
			p=(${(ps:\t:)_summon_preset[$key]})
			row+="  [$key] $p[1] $p[2]-$p[3]"
		done
		panel+=$'\n'"mantle  $row"
		[[ -n $preset ]] && panel+="   → $_summon_mantle ✓"

		row=''
		for pair in $_summon_models; do row+="  [${pair%%:*}] ${pair#*:}"; done
		panel+=$'\n'"model   $row"
		[[ -n $model ]] && panel+="   → $model ✓"
		[[ -n $preset ]] && panel+="   → $_summon_model (preset)"

		row=''
		for pair in $_summon_efforts; do row+="  [${pair%%:*}] ${pair#*:}"; done
		panel+=$'\n'"effort  $row"
		[[ -n $effort ]] && panel+="   → $effort ✓"
		[[ -n $preset ]] && panel+="   → $_summon_effort (preset)"

		row=''
		for key in $_summon_account_keys; do
			row+="  [$key] ${${(ps:\t:)_summon_account[$key]}[2]}"
		done
		panel+=$'\n'"account $row"
		if [[ -n $account ]]; then
			panel+="   → ${${(ps:\t:)_summon_account[$account]}[2]} ✓"
		else
			panel+="   (unset ⇒ last-used: $lastlabel)"
		fi

		panel+=$'\n'"          [y]ank summons${yanked:+ ✓}   [.] eject   [Esc] abort   [Enter] invoke"
		zle -M "$panel"
		zle -R

		read -k 1 press
		(( keys++ ))
		case $press in
			$'\r'|$'\n')	fired=1; break ;;					# Enter — and only Enter — fires
			$'\e'|$'\C-c')	zle -M 'summon: aborted'
								_summon_forget
								_summon_log abort $keys ''
								return 1 ;;
			$'\a')			# arm the repeat — arming and selecting are mutually exclusive,
								# so the panel never shows two futures at once
								[[ -n $_summon_last ]] || continue
								armed=$_summon_last
								preset='' model='' effort=''
								_summon_forget ;;
			'.')				# eject the selected, armed, or last config — Felix's own ⏎ launches it
								if [[ -n $preset || -n $effort ]]; then
									[[ -n $preset ]] && _summon_describe $preset
									[[ -n $effort ]] && _summon_describe_bare $model $effort
									key=${account:-${_summon_last_account:-$_summon_account_keys[1]}}
									_summon_assemble $key
									_summon_log eject $keys $key
								elif [[ -n $_summon_last ]]; then
									_summon_identify "$_summon_last_account" "$_summon_last"
									_summon_cmd=$_summon_last
									_summon_log eject $keys "$_summon_last_account"
								else						# nothing selected, nothing ever launched
									_summon_describe $_summon_preset_keys[1]
									_summon_assemble $_summon_account_keys[1]
									_summon_log eject $keys $_summon_account_keys[1]
								fi
								BUFFER=$_summon_cmd
								CURSOR=$#BUFFER
								zle -M ''
								return 0 ;;
			y)					[[ -n $preset ]] || continue					# mantle path only
								_summon_describe $preset
								_summon_yank && yanked=1 ;;
			*)					if [[ -n ${_summon_account[$press]:-} ]]; then
									account=$press
								elif [[ -z $preset && -z $model && -n ${_summon_preset[$press]:-} ]]; then
									preset=$press armed=''
									_summon_describe $preset
								elif [[ -z $preset && -z $model ]]; then
									for pair in $_summon_models; do
										[[ ${pair%%:*} == $press ]] && { model=${pair#*:} armed=''; break }
									done
								elif [[ -n $model && -z $effort ]]; then
									for pair in $_summon_efforts; do
										[[ ${pair%%:*} == $press ]] && { effort=${pair#*:}; break }
									done
								fi ;;							# anything else: ignored, forward-only
		esac
	done

	[[ -n $fired ]] || {						# fell out of the loop on the runaway guard
		zle -M 'summon: too many keys — aborted'
		_summon_forget
		_summon_log abort $keys ''
		return 1
	}

	# --- Enter: fire what the panel showed
	local mode=pick
	if [[ -n $armed ]]; then
		mode=repeat
		_summon_identify "$_summon_last_account" "$armed"		# nulls when it was bare
		_summon_cmd=$armed
		account=$_summon_last_account
	else
		[[ -n $preset ]] && _summon_describe $preset
		[[ -n $model ]] && { mode=bare; _summon_describe_bare $model $effort }
		[[ -n $_summon_model && -n $_summon_effort ]] || {
			if [[ -n $model ]]; then
				zle -M "summon: $model selected but no effort — press l/m/h/x/M"
			else
				zle -M 'summon: nothing selected — press a mantle or a model key'
			fi
			_summon_forget
			_summon_log abort $keys ''
			return 1
		}
		account=${account:-$_summon_last_account}
		[[ -n $account ]] || {						# never guess which Claude account to spend
			zle -M 'summon: no account selected and no last-used — press an account digit'
			_summon_forget
			_summon_log abort $keys ''
			return 1
		}
		_summon_assemble $account
	fi

	_summon_log $mode $keys "$account"
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
