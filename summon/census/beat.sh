#!/bin/sh
# Belvedere census heartbeat — one JSONL line per hook event.
#
# Record: P1 F6, verbatim.  Projects a fixed field set — no prompt text, no tool
# inputs, no command lines: census is telemetry, never truth (README §2), and the
# dropped fields are exactly where secrets live.
#
# The whole script is stderr-silenced and always exits 0.  A sensor that can break
# a session is worse than no sensor: hooks block, and a nonzero exit is a signal
# Claude Code acts on.  Failures (no jq, unwritable dir, bad payload) are silent
# here and LOUD in `deploy.ts --check`, which probes this script end to end.
dir="${CENSUS_DIR:-$HOME/code/agents/summon/log/census}"
{
	[ -d "$dir" ] || mkdir -p "$dir"
	# `bg` is F6's only unbounded field; capped so one record can never exceed the
	# stdio buffer and split into two write()s (P1 F6, concurrent-append guard).
	/usr/bin/jq -c --arg ws "$CMUX_WORKSPACE_ID" --arg sf "$CMUX_SURFACE_ID" \
		--arg acct "$CLAUDE_CONFIG_DIR" --arg pid "$CLAUDE_PID" '
		{ t: now, ev: .hook_event_name, sid: .session_id, acct: $acct, ws: $ws, sf: $sf,
		  pid: $pid, cwd: .cwd, tp: .transcript_path, pmt: .prompt_id, mode: .permission_mode,
		  aid: .agent_id, at: .agent_type, tool: .tool_name,
		  why: (.source // .reason // .notification_type // .trigger),
		  bg: [ (.background_tasks // [])[] | { id, type, status, agent_type } ][0:16] }' \
		>> "$dir/census.jsonl"
} 2>/dev/null
exit 0
