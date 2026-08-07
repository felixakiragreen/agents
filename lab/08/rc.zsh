# lab/08 — test rc: the rig under shims, so no real session and no real clipboard.
# $1 (SANDBOX) is exported by run.

PS1='%# '
unsetopt zle_bracketed_paste 2>/dev/null
# the wide drive renders one row per field; narrow.exp asks for 60 to exercise the wrap.
# Both are set: zsh caches its terminal size, so stty alone leaves $COLUMNS stale at 80 —
# which would have the rig wrapping to one width while zle wraps to another.
stty columns ${SUMMON_COLUMNS:-200} rows 60 2>/dev/null
COLUMNS=${SUMMON_COLUMNS:-200}

# stand-ins: the widget's accept-line runs a normal command line, so a function named
# `claude` intercepts exactly what a real launch would have received.
claude() { print -r -- "SHIM cfg=$CLAUDE_CONFIG_DIR args=$*" }
pbcopy() { local s; IFS= read -r -d '' s; print -r -- "CLIP[$s]" }

# and the usage fetcher's two: no test may ever reach Felix's real credential store or the
# network, whatever a panel decides to refresh. The token here was never real.
security() { print -rn -- '{"claudeAiOauth":{"accessToken":"FAKE-TOKEN-DO-NOT-LOG-9f3a"}}' }
curl() { local sink; IFS= read -r -d '' sink; cat $SANDBOX/fixtures/usage-full.json }

source $SANDBOX/summon.zsh
print -r -- "READY $SUMMON_HOME"
