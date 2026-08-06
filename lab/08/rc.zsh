# lab/08 — test rc: the rig under shims, so no real session and no real clipboard.
# $1 (SANDBOX) is exported by run.

PS1='%# '
unsetopt zle_bracketed_paste 2>/dev/null

# stand-ins: the widget's accept-line runs a normal command line, so a function named
# `claude` intercepts exactly what a real launch would have received.
claude() { print -r -- "SHIM cfg=$CLAUDE_CONFIG_DIR args=$*" }
pbcopy() { local s; IFS= read -r -d '' s; print -r -- "CLIP[$s]" }

source $SANDBOX/summon.zsh
print -r -- "READY $SUMMON_HOME"
