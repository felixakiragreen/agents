#!/bin/sh
# P1 probe driver — one scratch session per run, hooks writing to a named census file.
# usage: run.sh <run-name> <permission-mode|-> <prompt...>
# Env inherited from a cmux pane is the point of the probe; the parent session's own
# CLAUDE_* identity is stripped so the child is a clean session, CMUX_* left intact.
set -e
lab=$(cd "$(dirname "$0")" && pwd)
name="$1"; mode="$2"; shift 2
proj="${P1_PROJ:-/private/tmp/claude-502/-Users-felix-code-agents/aa67709f-a7d4-4024-b3a3-1bd2ceddac23/scratchpad/p1-hooks}"
census="$HOME/code/agents/summon/log/census/p1"
export P1_OUT="$census/$name.jsonl"
rm -f "$P1_OUT" "$P1_OUT.hookenv"
unset CLAUDE_CODE_SESSION_ID CLAUDE_CODE_CHILD_SESSION CLAUDE_CODE_MESSAGING_SOCKET \
      CLAUDE_CODE_MESSAGING_TOKEN CLAUDE_PID CLAUDECODE CLAUDE_EFFORT CLAUDE_CODE_ENTRYPOINT \
      CLAUDE_CODE_EXECPATH CLAUDE_ENV_FILE
set -- "$@"
cd "$proj"
if [ "$mode" = "-" ]; then
	/Users/felix/.local/bin/claude -p "$*" --model haiku < /dev/null 2>&1 | tail -3
else
	/Users/felix/.local/bin/claude -p "$*" --model haiku --allowedTools "$mode" < /dev/null 2>&1 | tail -3
fi
echo "--- $name: $(wc -l < "$P1_OUT" 2>/dev/null || echo 0) census lines ---"
jq -r '.payload.hook_event_name // .cfg_event' "$P1_OUT" 2>/dev/null | sort | uniq -c
