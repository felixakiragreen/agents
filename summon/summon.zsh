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
# `usage` is grey, not a colour of its own: the other four labels name key namespaces, and
# grey is already the panel's word for "nothing here is selectable" (v1.2)
typeset -gA _summon_label_color=(mantle fg=green model fg=yellow effort fg=208 account fg=red
	usage fg=8)
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

# --- usage (v1.2) ----------------------------------------------------------------

# Per-account quota, so the account digit Felix presses is an informed spend (D41). The
# source is the OAuth usage endpoint — the same payload `/usage` shows, and the same one
# Claude Code caches in `.claude.json`; the rig fetches it live because that cache is
# stale by hours (10-E2), and a stale session number inverts the very decision the row
# exists to inform.
#
# Token law, absolute: the access token flows `security` → _summon_usage_header → curl's
# stdin and lives nowhere else — never in argv (`ps` leaks that), never in a cache, log or
# message. The rig only ever READS the credential store: it never refreshes or rotates a
# token, because Claude Code owns the auth lifecycle and a rig-side refresh could race it
# and invalidate live sessions. An expired token is a failed fetch is a stale table.

typeset -g  _summon_usage_url='https://api.anthropic.com/api/oauth/usage'
typeset -ga _summon_usage_buckets=(sess week fable)
typeset -gA _summon_usage_window=(sess 18000 week 604800 fable 604800)
typeset -g  _summon_usage_fresh=600		# a cache older than this renders grey, uncoloured
typeset -g  _summon_usage_stale=60			# ...and a cache older than this is refetched on open

typeset -gi _summon_usage_delta_value		# the pacing delta, in whole points
typeset -gA _summon_usage_fetched			# account key → fetched_at epoch; unset ⇒ no cache
typeset -gA _summon_usage_cell				# "<key>.<bucket>" → "<used_pct> <resets_at>"

# <ISO-8601 UTC> → $_summon_usage_epoch_value. The API stamps `2026-08-07T22:00:00.470292
# +00:00`; days-from-civil turns that into an epoch with no fork and no TZ dependency —
# `strftime -r` would read it as local time, and a `TZ=UTC` prefix on a builtin leaks into
# the interactive shell's environment. Cross-checked against python in lab/08.
_summon_usage_epoch() {
	local iso=$1
	_summon_usage_epoch_value=0
	# fixed-width by the standard, so sliced rather than pattern-matched: `(#b)` would make
	# the rig depend on EXTENDED_GLOB being set in whatever shell sourced it
	[[ $#iso -ge 19 && $iso[5] == '-' && $iso[8] == '-' && $iso[11] == 'T' \
		&& $iso[14] == ':' && $iso[17] == ':' ]] || return 1
	# 10# because a zero-padded month is not an octal literal
	local -i y=10#$iso[1,4] m=10#$iso[6,7] d=10#$iso[9,10]
	local -i hh=10#$iso[12,13] mm=10#$iso[15,16] ss=10#$iso[18,19]
	local -i yy era yoe doy doe
	(( yy  = y - (m <= 2) ))
	(( era = (yy >= 0 ? yy : yy - 399) / 400 ))
	(( yoe = yy - era * 400 ))
	(( doy = (153 * (m + (m > 2 ? -3 : 9)) + 2) / 5 + d - 1 ))
	(( doe = yoe * 365 + yoe / 4 - yoe / 100 + doy ))
	(( _summon_usage_epoch_value = (era * 146097 + doe - 719468) * 86400 + hh * 3600 + mm * 60 + ss ))
	return 0
}

# <config dir> → $_summon_usage_service_value. Claude Code files each account's credentials
# under the sha256 of its config dir's absolute path, first 8 hex (10-E2, verified against
# all three accounts) — so the service name derives from accounts.tsv and the rig stores no
# secret and no mapping of its own.
_summon_usage_service() {
	local dir=${~1} sum
	sum=$(print -rn -- ${dir:A} | shasum -a 256)
	_summon_usage_service_value="Claude Code-credentials-${sum[1,8]}"
	return 0
}

# stdin: the Keychain credential blob → stdout: the one Authorization header, for `curl -H @-`.
# This function is the token's entire lifetime.
_summon_usage_header() {
	local blob token
	IFS= read -r -d '' blob
	token=${${blob#*\"accessToken\":\"}%%\"*}
	[[ -n $token && $token != $blob ]] || return 1
	print -r -- "Authorization: Bearer $token"
	return 0
}

# <response body> → $_summon_usage_parsed: "<bucket> <used_pct> <resets_epoch>" per bucket the
# response actually carried. sess/week read the flat scalar objects; only fable needs the
# limits[] array, where it is the weekly_scoped entry scoped to the Fable model.
_summon_usage_parse() {
	local body=$1 bucket seg iso used chunk
	local -A scalar=(sess '"five_hour":{' week '"seven_day":{')
	_summon_usage_parsed=()
	for bucket in sess week; do
		seg=${body#*${scalar[$bucket]}}
		[[ $seg == $body ]] && continue					# the response omitted this bucket
		seg=${seg%%\}*}
		used=${${seg#*\"utilization\":}%%,*}
		iso=${${seg#*\"resets_at\":\"}%%\"*}
		[[ $used == null || -z $iso ]] && continue
		_summon_usage_epoch $iso || continue
		_summon_usage_parsed+=("$bucket ${used%%.*} $_summon_usage_epoch_value")
	done
	seg=${body#*\"limits\":\[}
	[[ $seg == $body ]] && return 0
	seg=${seg%%\]*}
	# every element opens with its `kind`, so that is the boundary — walked explicitly rather
	# than counting nested braces, of which `scope` has two
	while [[ $seg == *'{"kind":"'* ]]; do
		seg=${seg#*\{\"kind\":\"}
		chunk=${seg%%\{\"kind\":\"*}
		[[ $chunk == weekly_scoped\"* && $chunk == *'"display_name":"Fable"'* ]] || continue
		used=${${chunk#*\"percent\":}%%,*}
		iso=${${chunk#*\"resets_at\":\"}%%\"*}
		[[ $used == null || -z $iso ]] && continue
		_summon_usage_epoch $iso || continue
		_summon_usage_parsed+=("fable ${used%%.*} $_summon_usage_epoch_value")
		break
	done
	return 0
}

# <config dir> <cache path> → one account fetched and cached, or a non-zero return with the
# previous cache untouched. Limits on everything: one attempt, `curl -m 5`, and a body that
# does not parse is a failure rather than a cache full of nothing.
_summon_usage_fetch() {
	local dir=$1 cache=$2 body line tmp
	_summon_usage_service $dir
	body=$(security find-generic-password -w -s $_summon_usage_service_value -a $USER 2>/dev/null \
		| _summon_usage_header \
		| curl -sS -m 5 -H @- -H 'anthropic-beta: oauth-2025-04-20' $_summon_usage_url 2>/dev/null)
	_summon_usage_parse "$body"
	(( $#_summon_usage_parsed )) || return 1
	# atomic: a background fetcher racing a render must never serve a torn read
	tmp=$cache.$$.tmp
	{
		print -rn -- "{\"fetched_at\":$EPOCHSECONDS,\"windows\":{"
		for line in $_summon_usage_parsed; do
			local -a f=(${=line})
			print -rn -- "\"$f[1]\":{\"used_pct\":$f[2],\"resets_at\":$f[3],\"window_secs\":${_summon_usage_window[$f[1]]}}"
			[[ $line == $_summon_usage_parsed[-1] ]] || print -rn -- ','
		done
		print -r -- '}}'
	} > $tmp || { rm -f $tmp; return 1 }
	mv -f $tmp $cache || { rm -f $tmp; return 1 }
	return 0
}

# every cache file → $_summon_usage_fetched + $_summon_usage_cell. Builtins only: this runs
# on every paint, and the files are the truth (the TSV law), so a background fetch landing
# mid-panel shows up on the next keystroke.
_summon_usage_load() {
	local key dir cache raw seg bucket
	_summon_usage_fetched=() _summon_usage_cell=()
	[[ -d $SUMMON_HOME/log/usage ]] || return 1		# not configured ⇒ no block at all
	for key in $_summon_account_keys; do
		dir=${${(ps:\t:)_summon_account[$key]}[1]}
		cache=$SUMMON_HOME/log/usage/${${~dir}:t}.json
		[[ -r $cache ]] || continue
		raw=$(<$cache)
		[[ $raw == *\"fetched_at\":* ]] || continue
		_summon_usage_fetched[$key]=${${raw#*\"fetched_at\":}%%,*}
		for bucket in $_summon_usage_buckets; do
			seg=${raw#*\"$bucket\":\{}
			[[ $seg == $raw ]] && continue				# this account has no such bucket
			seg=${seg%%\}*}
			_summon_usage_cell[$key.$bucket]="${${seg#*\"used_pct\":}%%,*} ${${seg#*\"resets_at\":}%%,*}"
		done
	done
	return 0
}

# <used_pct> <resets_at> <window_secs> → $_summon_usage_delta_value, the pacing delta:
# how far ahead of the window's own clock the spend is. Positive is headroom.
_summon_usage_delta() {
	local -F elapsed diff
	(( elapsed = 100.0 * (1.0 - ($2 - EPOCHSECONDS) / (1.0 * $3)) ))
	(( elapsed < 0 ))   && (( elapsed = 0 ))			# a reset further out than one window
	(( elapsed > 100 )) && (( elapsed = 100 ))		# a reset already past: the clock ran out
	# assignment to an integer truncates toward zero, so the half is added by hand — and
	# away from zero, not to even, so a delta reads the way a human rounds it
	(( diff = elapsed - $1 ))
	(( _summon_usage_delta_value = diff + (diff >= 0 ? 0.5 : -0.5) ))
	return 0
}

# the usage block: one line per account, appended behind the `usage` label. The figures
# always read at full contrast — used% in the terminal's own foreground, the delta green
# (headroom) or red (burning faster than the clock) — because a number you have to squint
# at is a number you misread. Staleness greys the furniture instead: the account digit and
# the window names. A line whose fetch has stopped landing therefore looks visibly different
# without any figure on it ever becoming hard to read (Felix's ruling, amending D41's
# "stale data never wears colour").
_summon_usage_rows() {
	local -i base=$1
	local key bucket text value delta style label='usage'
	local -a c spans
	local -i fresh at
	_summon_usage_load || return 1
	for key in $_summon_account_keys; do
		fresh=0
		[[ -n ${_summon_usage_fetched[$key]:-} ]] &&
			(( EPOCHSECONDS - _summon_usage_fetched[$key] <= _summon_usage_fresh )) && fresh=1
		style=$_summon_grey
		(( fresh )) && style=''
		_summon_item_plain+=("$key")
		_summon_item_span+=("${style:+0 $#key $style}")
		for bucket in $_summon_usage_buckets; do
			c=(${=${_summon_usage_cell[$key.$bucket]:-}})
			delta=''
			if (( $#c == 2 )); then
				_summon_usage_delta $c[1] $c[2] ${_summon_usage_window[$bucket]}
				printf -v delta '%+d' $_summon_usage_delta_value
				value="$c[1]%$delta"
			else
				value='—'											# the account has no such bucket
			fi
			text="$bucket $value"
			# a cell is padded whole, so every line's columns start in the same place; fable is
			# last and takes no trailing pad, so no line ends in whitespace. 13 is the widest a
			# cell can get — `sess 100%-100`
			[[ $bucket == $_summon_usage_buckets[-1] ]] || text="${(r:13:)text}"
			_summon_item_plain+=("$text")
			spans=()
			[[ -n $style ]] && spans+=("0 $#bucket $style")	# the window name is furniture
			if [[ -n $delta ]]; then
				at=$(( $#bucket + 1 + ${#c[1]} + 1 ))		# past `<name> `, `<used>`, `%`
				if (( _summon_usage_delta_value >= 0 )); then
					spans+=("$at $(( at + $#delta )) fg=green")
				else
					spans+=("$at $(( at + $#delta )) fg=red")
				fi
			elif [[ -n $style ]]; then
				spans=("0 $#text $style")						# no number to protect: grey it whole
			fi
			_summon_item_span+=("${(j:|:)spans}")
		done
		_summon_row "$label" $base
		label=''														# the label heads the block, not every line
	done
	return 0
}

# panel open, after the first paint: one disowned background fetch per account whose cache
# has gone cold. This is the only fork the rig adds to opening the panel, and it happens
# once, after Felix already has his panel on screen. Two panels racing spawn duplicate
# fetches — harmless under atomic writes, and accepted.
#
# The worker is a setsid-detached fresh zsh, never a `{ _summon_usage_fetch } &!` block —
# two independent hazards force this shape (10-F10). (a) A block forked here is a copy of
# the interactive shell taken *inside an active zle widget*, and on zsh 5.9 such a copy
# busy-spins forever in the pipeline wait of the fetch's `$(...)` — one wedged 95%-CPU
# zsh per account per panel-open. (b) Even an exec'd fresh worker still has the panel's
# tty as controlling terminal, and spawned mid-widget the kernel stops its pipeline
# members with SIGTTIN/SIGTTOU — the fetch freezes, the cache stays stale, and every
# open spawns three more frozen trees. `trap '' TTOU` cannot save the pipeline (zsh
# subshells reset dispositions), so the worker drops the tty entirely: fork+setsid+exec
# via macOS-shipped perl. `summon-fetch` is the name `ps` shows; argv carries only paths
# — the token law holds.
_summon_usage_spawn() {
	local key dir cache
	[[ -d $SUMMON_HOME/log/usage ]] || return 1
	for key in $_summon_account_keys; do
		[[ -n ${_summon_usage_fetched[$key]:-} ]] &&
			(( EPOCHSECONDS - _summon_usage_fetched[$key] < _summon_usage_stale )) && continue
		dir=${${(ps:\t:)_summon_account[$key]}[1]}
		cache=$SUMMON_HOME/log/usage/${${~dir}:t}.json
		perl -MPOSIX -e 'fork && exit; setsid; exec @ARGV' -- \
			zsh -fc 'source $1/summon.zsh && _summon_usage_fetch $2 $3' summon-fetch \
			$SUMMON_HOME $dir $cache < /dev/null > /dev/null 2>&1 &!
	done
	return 0
}

# summon-usage — the by-hand fetcher, and the diagnostic for "why is my table grey": every
# account fetched in the foreground, then the very table the panel will paint, then each
# cache's age. The table comes from the panel's own renderer, so this and the panel cannot
# disagree about what the numbers are.
summon-usage() {
	_summon_load || { print -u2 "summon-usage: $_summon_error"; return 1 }
	[[ -d $SUMMON_HOME/log/usage ]] || mkdir -p $SUMMON_HOME/log/usage
	local key dir cache label
	local -i failed=0 age
	for key in $_summon_account_keys; do
		dir=${${(ps:\t:)_summon_account[$key]}[1]}
		label=${${(ps:\t:)_summon_account[$key]}[2]}
		cache=$SUMMON_HOME/log/usage/${${~dir}:t}.json
		if _summon_usage_fetch $dir $cache; then
			print -r -- "  fetched  $key $label"
		else
			print -r -- "  FAILED   $key $label — previous cache left untouched"
			(( failed++ ))
		fi
	done
	_summon_panel_value='' _summon_highlight=()
	_summon_item_plain=() _summon_item_span=()
	_summon_usage_rows 0
	print -r -- $_summon_panel_value
	print -r -- '  cache age'
	for key in $_summon_account_keys; do
		label=${${(ps:\t:)_summon_account[$key]}[2]}
		if [[ -z ${_summon_usage_fetched[$key]:-} ]]; then
			printf '    %s %-14s no cache — the line renders all —\n' $key $label
			continue
		fi
		(( age = EPOCHSECONDS - _summon_usage_fetched[$key] ))
		printf '    %s %-14s %4d s  %s\n' $key $label $age \
			"$( (( age <= _summon_usage_fresh )) && print -rn fresh || print -rn 'stale — renders grey')"
	done
	return $(( failed > 0 ))
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
	[[ -n $swatch ]] && {			# the space is load-bearing: at most fonts the ● crowds the [
		plain='● ' ; span+=("0 1 ${_summon_swatch[$swatch]:-fg=white}") ; at=2
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
	# with no tty zsh reports COLUMNS as 0, not unset, and `:-` keeps the zero — which would
	# make every item wrap. A piped `summon-usage` is the case that finds this.
	local -i cols=${COLUMNS:-80}
	(( cols > 0 )) || cols=80
	local -i width=$#1 avail=$(( cols - $#1 - 1 )) w=0 i at base=$4
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

	_summon_usage_rows $base			# absent entirely when log/usage/ does not exist

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

	local press pair keys='^G' yanked='' fired='' refreshed=''
	local -a p
	local -i n=1
	while (( n < 32 )); do							# a picker cannot run away
		_summon_panel $n "$yanked" $(( $#PREDISPLAY + $#BUFFER ))
		POSTDISPLAY=$_summon_panel_value
		region_highlight=("$_summon_highlight[@]")
		zle -R										# in place: `zle -I` would abandon each paint and
														# leave one stale panel on screen per keystroke
		[[ -n $refreshed ]] || {				# after the first paint, never before it, and once
			_summon_usage_spawn
			refreshed=1
		}

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
