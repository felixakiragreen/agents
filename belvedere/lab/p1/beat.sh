#!/bin/sh
# Belvedere census heartbeat — the production-candidate hook.
# One JSONL line per hook event, appended to $CENSUS_DIR/census.jsonl.  Projects a
# fixed field set (no prompt text, no tool inputs): liveness telemetry, never truth.
# One process, one exec, one append — the glass tails the file and indexes by sid.
dir="${CENSUS_DIR:-$HOME/code/agents/summon/log/census}"
exec /usr/bin/jq -c --arg ws "$CMUX_WORKSPACE_ID" --arg sf "$CMUX_SURFACE_ID" \
	--arg acct "$CLAUDE_CONFIG_DIR" --arg pid "$CLAUDE_PID" '
	{ t: now, ev: .hook_event_name, sid: .session_id, acct: $acct, ws: $ws, sf: $sf,
	  pid: $pid, cwd: .cwd, tp: .transcript_path, pmt: .prompt_id, mode: .permission_mode,
	  aid: .agent_id, at: .agent_type, tool: .tool_name,
	  why: (.source // .reason // .notification_type // .trigger),
	  bg: [ (.background_tasks // [])[] | { id, type, status, agent_type } ] }' >> "$dir/census.jsonl"
