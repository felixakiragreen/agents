#!/bin/sh
# P1 probe — capture one hook invocation verbatim: config event name, hook-process
# env (the CMUX join candidates), and the raw stdin payload, as one JSON line.
# $1 = event name as written in settings.json.  Output: $P1_OUT (JSONL).
out="${P1_OUT:-/tmp/p1-census.jsonl}"
payload=$(cat)
[ -n "$payload" ] || payload='null'
printf '{"cap_ts":"%s","cfg_event":"%s","hook_cwd":"%s","hook_ppid":"%s","env":{"CMUX_WORKSPACE_ID":"%s","CMUX_SURFACE_ID":"%s","CMUX_PANEL_ID":"%s","CMUX_TAB_ID":"%s","CMUX_PORT":"%s","CMUX_TERMINAL_LIFECYCLE_ID":"%s","CLAUDE_CODE_SESSION_ID":"%s","CLAUDE_PID":"%s","CLAUDE_CONFIG_DIR":"%s","CLAUDE_PROJECT_DIR":"%s","CLAUDE_CODE_CHILD_SESSION":"%s","TERM_PROGRAM":"%s"},"payload":%s}\n' \
	"$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$1" "$PWD" "$PPID" \
	"$CMUX_WORKSPACE_ID" "$CMUX_SURFACE_ID" "$CMUX_PANEL_ID" "$CMUX_TAB_ID" "$CMUX_PORT" "$CMUX_TERMINAL_LIFECYCLE_ID" \
	"$CLAUDE_CODE_SESSION_ID" "$CLAUDE_PID" "$CLAUDE_CONFIG_DIR" "$CLAUDE_PROJECT_DIR" "$CLAUDE_CODE_CHILD_SESSION" "$TERM_PROGRAM" \
	"$payload" >> "$out"
