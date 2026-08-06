# summon — Ctrl-G ignition for Claude sessions.
#
# Source from .zshrc:   source ~/code/agents/summon/summon.zsh
#
# Ctrl-G opens the panel with every field pre-selected from the last launch — like the
# Claude Code model selector. Every key selects; **Enter, and only Enter, fires**.
#
#   ^G ⏎                        refire the last configuration exactly       (2 keys)
#   ^G <key> ⏎                  change one field, fire                     (3 keys)
#   ^G <preset> <account> ⏎     a fresh mantle on a named account           (4 keys)
#   ^G n ⏎                      bare — no name, no colour, no prompt
#   ^G <preset> y … ⏎           yank the derived summons on the way past
#   ^G .                        eject an editable command, launching nothing
#   ^G <esc>  /  ^G ^G          close, discarding this panel's changes
#
# Every key is global: a preset key cascades mantle + model + effort, and a model or
# effort key afterwards overrides that one field, keeping the mantle. haiku is `k`
# (hai[k]u) so `h` is unambiguously [h]igh; a fat-finger costs one key — press the right
# one. The four fields — mantle, model, effort, account — persist in log/state **on fire
# only**: Esc and a second Ctrl-G discard whatever the panel was showing.
#
# Clipboard law: `y` is the only clipboard write this rig ever makes — Felix's clipboard
# usually carries the previous agent's kickoff, and clobbering it costs more than the
# paste it saves. A positional prompt can carry `/color <colour>` OR a summons, never
# both: the colour parser eats the whole first message (README — E1).
#
# presets.tsv and accounts.tsv are re-read on every invocation — edit them freely.
# Every invocation, closes included, appends one JSONL line; `summon-stats` reports it.

zmodload zsh/datetime || print -u2 'summon: zsh/datetime missing — timestamps dead'

typeset -g SUMMON_HOME=${${(%):-%x}:A:h}
[[ -d $SUMMON_HOME/log ]] || mkdir -p $SUMMON_HOME/log

typeset -gA _summon_preset _summon_account				# key → tab-joined row
typeset -ga _summon_preset_keys _summon_account_keys	# panel order, as filed
typeset -g  _summon_error										# why _summon_load refused

# the global key namespaces — panel order and lookup from one source
typeset -ga _summon_models=(f:fable o:opus s:sonnet k:haiku)
typeset -ga _summon_efforts=(l:low m:medium h:high x:xhigh M:max)

# the palette (D36): brackets and unselected items grey, the selected item bold with an
# inline ✓, one colour per row label, and each preset's session colour as a ● swatch.
# These are zle highlight styles, not escapes: zle renders a control character visibly, so
# an ANSI escape in a panel string reaches the screen as a literal `^[[90m` (F1). `fg=8`
# is bright black — zle's `fg=90` would mean palette index 90, a purple — and zle emits it
# as `\e[90m`, so the wire bytes are exactly what D36 specified.
typeset -g _summon_grey='fg=8' _summon_bold='bold'
typeset -gA _summon_label_color=(mantle fg=green model fg=yellow effort fg=208 account fg=red)
typeset -gA _summon_swatch=(green fg=green pink fg=213 red fg=red blue fg=blue
	yellow fg=yellow magenta fg=magenta cyan fg=cyan orange fg=208 grey fg=8 gray fg=8)

# the selection: four sticky fields, and everything _summon_resolve derives from them
typeset -g _summon_mantle_key _summon_model _summon_effort _summon_account_key
typeset -g _summon_mantle _summon_color _summon_summons _summon_desc _summon_cmd _summon_why

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
	# every key is global now, so the panel owns all of them — a preset may shadow none
	local -a reserved=(${_summon_models%%:*} ${_summon_efforts%%:*} n y . {0..9})
	reserved=(${(u)reserved})
	for key in $_summon_preset_keys; do
		(( $reserved[(Ie)$key] )) || continue
		_summon_error="presets.tsv claims reserved key '$key' (reserved: $reserved)"
		return 1
	done
	return 0
}

# --- sticky state ----------------------------------------------------------------

# log/state → the four fields, dropping any value the data files no longer know. Sticky
# state is a cache of the last launch, not a contract: presets.tsv may move under it, and
# a dropped field shows on the panel as unselected rather than failing an invocation.
_summon_state_load() {
	local key value
	_summon_mantle_key='' _summon_model='' _summon_effort='' _summon_account_key=''
	[[ -r $SUMMON_HOME/log/state ]] || return 1
	while IFS=$'\t' read -r key value; do
		case $key in
			mantle)	[[ -n ${_summon_preset[$value]:-} ]]			&& _summon_mantle_key=$value ;;
			model)	[[ -n ${_summon_models[(r)*:$value]:-} ]]	&& _summon_model=$value ;;
			effort)	[[ -n ${_summon_efforts[(r)*:$value]:-} ]]	&& _summon_effort=$value ;;
			account)	[[ -n ${_summon_account[$value]:-} ]]		&& _summon_account_key=$value ;;
		esac
	done < $SUMMON_HOME/log/state
	return 0
}

# the four fields → log/state. Called on fire and nowhere else — that is the whole of the
# discard rule. An empty field is simply absent.
_summon_state_save() {
	{
		[[ -n $_summon_mantle_key ]]	&& print -r -- $'mantle\t'$_summon_mantle_key
		[[ -n $_summon_model ]]			&& print -r -- $'model\t'$_summon_model
		[[ -n $_summon_effort ]]		&& print -r -- $'effort\t'$_summon_effort
		[[ -n $_summon_account_key ]]	&& print -r -- $'account\t'$_summon_account_key
	} > $SUMMON_HOME/log/state
	return 0
}

# --- the selection → what Enter fires --------------------------------------------

# the four fields → mantle slug, colour, summons, one-line description and command line;
# or refusal in $_summon_why. The single place a selection becomes a launch: the preview
# footer, the eject, the fire, the refusal and the log all read this, so none of them can
# disagree with what the panel showed.
_summon_resolve() {
	_summon_mantle='' _summon_color='' _summon_summons=''
	_summon_desc='' _summon_cmd='' _summon_why=''
	local -a p
	if [[ -n $_summon_mantle_key ]]; then
		p=(${(ps:\t:)_summon_preset[$_summon_mantle_key]})
		_summon_mantle=$p[1] _summon_color=$p[4]
	fi
	[[ -n $_summon_model && -n $_summon_effort ]] || {
		_summon_why='nothing selected — press a mantle, or a model and an effort'
		return 1
	}
	if [[ -n $_summon_mantle ]]; then			# the summons carries the overridden tier
		local title="${(C)${_summon_mantle//-/ }}" article=a
		[[ $title[1] == [AEIOU] ]] && article=an
		[[ $_summon_mantle == grand-architect ]] && article=the	# canon: "the Grand Architect"
		_summon_summons="You are $article $title at $_summon_model-$_summon_effort. Wear ~/code/agents/canon/mantles/$_summon_mantle.md."
	fi
	local desc="${_summon_mantle:-bare} · $_summon_model-$_summon_effort"
	[[ -n $_summon_account_key ]] || {			# never guess which Claude account to spend
		_summon_why="$desc @ no account — press an account digit"
		return 1
	}
	local -a acct=(${(ps:\t:)_summon_account[$_summon_account_key]})
	_summon_desc="$desc @ $acct[2]${_summon_color:+ · $_summon_color}"
	_summon_cmd="CLAUDE_CONFIG_DIR=$acct[1] claude --model $_summon_model --effort $_summon_effort"
	[[ -n $_summon_mantle ]] && _summon_cmd+=" -n $_summon_mantle \"/color $_summon_color\""
	return 0
}

# --- the panel -------------------------------------------------------------------

typeset -ga _summon_item_plain _summon_item_span	# one row, mid-build: text and its spans
typeset -g  _summon_panel_value						# plain text — POSTDISPLAY takes it verbatim
typeset -ga _summon_highlight							# the matching zle region_highlight spans

# <key> <label> <selected> [<colour-name>] → one item: its plain text, plus the spans that
# style it, at offsets relative to the item's own start. The key is bracketed where it
# falls inside the label — [f]able, hai[k]u — and prefixed when it falls nowhere, which is
# how the digits and the named keys read: [0] personal.
_summon_item() {
	local key=$1 label=$2 sel=$3 swatch=${4:-} plain='' pre post
	local style=$_summon_grey
	local -a span=()
	local -i at=0
	local cut=${${label:l}%%${(b)${key:l}}*}
	if [[ $cut == ${label:l} ]]; then
		pre='' post=" $label"
	else
		pre=${label[1,$#cut]} post=${label[$#cut+2,-1]}
	fi
	[[ -n $sel ]] && style=$_summon_bold
	[[ -n $swatch ]] && {
		plain='●' ; span+=("0 1 ${_summon_swatch[$swatch]:-fg=white}") ; at=1
	}
	# the brackets stay grey even when the item is bold, so no two spans ever overlap
	(( $#pre )) && { plain+=$pre ; span+=("$at $((at + $#pre)) $style") ; at+=$#pre }
	plain+="[$key]"
	span+=("$at $((at + 1)) $_summon_grey")							; (( at++ ))
	span+=("$at $((at + $#key)) $style")							; at+=$#key
	span+=("$at $((at + 1)) $_summon_grey")							; (( at++ ))
	(( $#post )) && { plain+=$post ; span+=("$at $((at + $#post)) $style") ; at+=$#post }
	[[ -n $sel ]] && { plain+=' ✓' ; span+=("$at $((at + 2)) $_summon_bold") }
	_summon_item_plain+=("$plain")
	_summon_item_span+=("${(j:|:)span}")
}

# <text> → an unstyled item (the footer's segments carry the row's own styling)
_summon_text() {
	_summon_item_plain+=("$1")
	_summon_item_span+=('')
}

# <text> <style|''> <base> → append plain text to the panel, styling it if asked
_summon_append() {
	local -i at=$(( $3 + $#_summon_panel_value ))
	_summon_panel_value+=$1
	[[ -n $2 ]] && _summon_highlight+=("P$at $(( $3 + $#_summon_panel_value )) $2")
	return 0
}

# <first column> <its style|''> <separator> <base> → the built items appended to the panel
# behind that column, wrapped at $COLUMNS on item boundaries only, continuations aligned
# under the first item. Consumes and clears the item arrays.
_summon_wrap() {
	local sep=$3 s
	local -i width=$#1 avail=$(( ${COLUMNS:-80} - $#1 - 1 )) w=0 i at base=$4
	_summon_append $'\n' '' $base
	_summon_append "$1" "$2" $base
	for (( i = 1; i <= $#_summon_item_plain; i++ )); do
		if (( w == 0 )); then
			:															# the first item needs no separator
		elif (( w + $#sep + ${#_summon_item_plain[i]} <= avail )); then
			_summon_append "$sep" '' $base ; w+=$#sep
		else
			_summon_append $'\n'"${(r:$width:):-}" '' $base ; w=0
		fi
		at=$(( base + $#_summon_panel_value ))
		_summon_panel_value+=$_summon_item_plain[i]
		for s in ${(ps:|:)_summon_item_span[i]}; do
			_summon_highlight+=("P$(( at + ${s%% *} )) $(( at + ${${s#* }%% *} )) ${s##* }")
		done
		w+=${#_summon_item_plain[i]}
	done
	_summon_item_plain=() _summon_item_span=()
}

# <label|''> <base> → one labelled row; the 9-column gutter is what continuations align to
_summon_row() {
	_summon_wrap "${(r:9:)1}" "${_summon_label_color[$1]:-}" '  ' $2
}

# <keys spent> <yanked> <display offset> → the whole panel: $_summon_panel_value for
# POSTDISPLAY and $_summon_highlight for region_highlight, a pure function of the
# selection, $COLUMNS and that offset. Builtins only, because a fork here is input delay
# Felix would feel.
_summon_panel() {
	local key pair sel label part
	local -a p acct seg
	local -A slug_count
	local -i base=$3
	_summon_panel_value='' _summon_highlight=()
	_summon_append $'\n' '' $base					# the panel hangs below the prompt line
	_summon_append summon $_summon_grey $base

	for key in $_summon_preset_keys; do							# two presets, one mantle: the
		p=(${(ps:\t:)_summon_preset[$key]})						# effort tells them apart
		slug_count[$p[1]]=$(( ${slug_count[$p[1]]:-0} + 1 ))
	done
	for key in $_summon_preset_keys; do
		p=(${(ps:\t:)_summon_preset[$key]})
		label=$p[1]
		(( slug_count[$p[1]] > 1 )) && label+="·$p[3]"
		sel=''; [[ $key == $_summon_mantle_key ]] && sel=1
		_summon_item $key $label "$sel" $p[4]
	done
	sel=''; [[ -z $_summon_mantle_key ]] && sel=1				# mantle cleared ⇒ bare launch
	_summon_item n none "$sel"
	_summon_row mantle $base

	for pair in $_summon_models; do
		sel=''; [[ ${pair#*:} == $_summon_model ]] && sel=1
		_summon_item ${pair%%:*} ${pair#*:} "$sel"
	done
	_summon_row model $base

	for pair in $_summon_efforts; do
		sel=''; [[ ${pair#*:} == $_summon_effort ]] && sel=1
		_summon_item ${pair%%:*} ${pair#*:} "$sel"
	done
	_summon_row effort $base

	for key in $_summon_account_keys; do
		acct=(${(ps:\t:)_summon_account[$key]})
		sel=''; [[ $key == $_summon_account_key ]] && sel=1
		_summon_item $key $acct[2] "$sel"
	done
	_summon_row account $base

	_summon_item y yank "$2"
	_summon_item . eject ''
	_summon_item Esc close ''
	_summon_item Enter invoke ''
	_summon_row '' $base

	# the preview footer: exactly what Enter will fire, or why it won't, plus the counter
	_summon_resolve
	seg=("${(@ps: · :)${_summon_desc:-$_summon_why}}" "keys: $1")
	for part in "$seg[@]"; do _summon_text "$part"; done
	_summon_wrap '⏎  ' $_summon_bold ' · ' $base
}

# --- clipboard + telemetry -------------------------------------------------------

# the one clipboard write, and only on `y` — post-decision, so the fork costs nothing
_summon_yank() {
	[[ -n $_summon_summons ]] || return 1
	print -rn -- $_summon_summons | pbcopy
}

# <key> → $_summon_keyname_value: what the telemetry records for that press. Printable
# keys are themselves; the rest read as glyphs or caret names, so the JSON stays valid
# (raw control bytes are not legal in a JSON string) and a fat-finger stays legible.
_summon_keyname() {
	local c=$1
	case $c in
		$'\r'|$'\n')	_summon_keyname_value='⏎' ;;
		$'\e')			_summon_keyname_value='⎋' ;;
		[[:print:]])	_summon_keyname_value=$c ;;
		*)					_summon_keyname_value="^${(#)$(( #c + 64 ))}" ;;
	esac
}

_summon_json() {
	local v=${1//\\/\\\\}
	[[ -n $v ]] && _summon_json_value="\"${v//\"/\\\"}\"" || _summon_json_value=null
}

# <mode> <keys spent> <keys pressed> — every other field is the current selection,
# resolved here so a log line can never disagree with the panel. Empty fields log null;
# `mantle`/`color` null is how a bare launch reads. `keys` goes last on purpose: it is the
# one field carrying arbitrary keystrokes, so no garbage in it can shadow a real field for
# the reporter's parser.
_summon_log() {
	local ts
	_summon_resolve
	strftime -s ts '%Y-%m-%dT%H:%M:%S%z' $EPOCHSECONDS
	local rec="{\"ts\":\"$ts\",\"mode\":\"$1\",\"n\":$2"
	_summon_json "${${(ps:\t:)${_summon_account[$_summon_account_key]:-}}[2]}"
	rec+=",\"account\":$_summon_json_value"
	_summon_json "$_summon_mantle"	; rec+=",\"mantle\":$_summon_json_value"
	_summon_json "$_summon_model"		; rec+=",\"model\":$_summon_json_value"
	_summon_json "$_summon_effort"	; rec+=",\"effort\":$_summon_json_value"
	_summon_json "$_summon_color"		; rec+=",\"color\":$_summon_json_value"
	_summon_json "$_summon_cmd"		; rec+=",\"cmd\":$_summon_json_value"
	_summon_json "$3"						; rec+=",\"keys\":$_summon_json_value}"
	print -r -- "$rec" >> $SUMMON_HOME/log/invocations.jsonl
}

# --- the widget ------------------------------------------------------------------

# the panel is zle's own display, so taking it down is zle's own two variables
_summon_hide() {
	POSTDISPLAY='' region_highlight=()
	return 0
}

_summon_widget() {
	[[ -n $BUFFER ]] && zle push-input			# never clobber a line in progress
	_summon_mantle_key='' _summon_model='' _summon_effort='' _summon_account_key=''
	_summon_load || {
		zle -M "summon: $_summon_error"
		_summon_log abort 1 '^G'					# a keystroke that went nowhere still counts
		return 1
	}
	_summon_state_load
	local before="$_summon_mantle_key|$_summon_model|$_summon_effort|$_summon_account_key"

	local press pair keys='^G' yanked='' fired=''
	local -a p
	local -i n=1
	while (( n < 32 )); do							# a picker cannot run away
		_summon_panel $n "$yanked" $(( $#PREDISPLAY + $#BUFFER ))
		POSTDISPLAY=$_summon_panel_value
		region_highlight=("$_summon_highlight[@]")
		zle -R										# in place: `zle -I` would abandon each paint and
														# leave one stale panel on screen per keystroke

		read -k 1 press
		_summon_keyname $press
		keys+=$_summon_keyname_value
		(( n++ ))
		case $press in
			$'\r'|$'\n')	fired=1; break ;;			# Enter — and only Enter — fires
			$'\e'|$'\C-c'|$'\a')								# Esc, or Ctrl-G toggling the panel shut
								_summon_hide
								zle -M 'summon: closed — changes discarded'
								_summon_log abort $n "$keys"
								return 1 ;;
			'.')				# eject exactly what the footer promised — Felix's own ⏎ launches it
								_summon_hide
								_summon_resolve || {
									zle -M "summon: $_summon_why"
									_summon_log abort $n "$keys"
									return 1
								}
								_summon_log eject $n "$keys"
								BUFFER=$_summon_cmd
								CURSOR=$#BUFFER
								return 0 ;;
			y)					_summon_resolve					# the summons needs no account, so ignore
								_summon_yank && yanked=1 ;;	# the verdict — the yank has its own guard
			n)					_summon_mantle_key='' ;;		# bare is a state, not a mode
			*)					if [[ -n ${_summon_preset[$press]:-} ]]; then
									p=(${(ps:\t:)_summon_preset[$press]})
									_summon_mantle_key=$press				# the cascade: mantle sets the tier
									_summon_model=$p[2] _summon_effort=$p[3]
								elif [[ -n ${_summon_account[$press]:-} ]]; then
									_summon_account_key=$press
								else
									for pair in $_summon_models; do		# and a tier key overrides one
										[[ ${pair%%:*} == $press ]] && { _summon_model=${pair#*:}; break }
									done
									for pair in $_summon_efforts; do
										[[ ${pair%%:*} == $press ]] && { _summon_effort=${pair#*:}; break }
									done
								fi ;;								# anything else: ignored, but counted
		esac
	done

	_summon_hide
	[[ -n $fired ]] || {						# fell out of the loop on the runaway guard
		zle -M 'summon: too many keys — closed'
		_summon_log abort $n "$keys"
		return 1
	}

	_summon_resolve || {						# the footer said so before Enter was pressed
		zle -M "summon: $_summon_why"
		_summon_log abort $n "$keys"
		return 1
	}
	local mode=pick
	[[ "$_summon_mantle_key|$_summon_model|$_summon_effort|$_summon_account_key" == $before ]] && mode=refire

	_summon_log $mode $n "$keys"
	_summon_state_save						# on fire, and only on fire
	BUFFER=$_summon_cmd
	zle accept-line
}

zle -N _summon_widget
bindkey '^G' _summon_widget

# --- the reporter ----------------------------------------------------------------

# <line> <field> → $_summon_field_value, empty for JSON null. Reads what _summon_log
# writes and nothing else: values are null, a bare number, or a string whose escapes are
# \" and \\ — so a string ends at the next `","` key boundary, or at `"}` on the last
# field. A value containing `","` would break its own read, which is why the one field
# holding arbitrary keystrokes is written last (see _summon_log).
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
		_summon_field "$line" n			; k=${_summon_field_value:-0}			# keystrokes spent
		_summon_field "$line" cmd		; cmd=${_summon_field_value//\\\"/\"}	# as typed, not as logged
		_summon_field "$line" mode		; mode=$_summon_field_value
		_summon_field "$line" account	; account=${_summon_field_value:-—}
		_summon_field "$line" mantle	; mantle=${_summon_field_value:-$mode}	# bare + closes have none
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
