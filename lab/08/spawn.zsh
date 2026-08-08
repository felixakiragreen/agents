#!/usr/bin/env zsh
# lab/08 — panel-open refresh: exactly the cold caches get a background fetch, and the
# fresh one is left alone. The fetches are disowned, so this waits on their evidence
# (the shim's record) rather than on the jobs table.
#
# The shims are PATH executables, not functions: the spawn execs a fresh worker zsh
# (10-F10), so only the environment crosses — a function shim would silently let the
# worker hit the real keychain and the real endpoint.
#   spawn.zsh <sandbox>
set -u
LAB=${0:A:h}
SANDBOX=$1
RECORD=$LAB/out/spawn-fetched.txt
: > $RECORD

SHIMBIN=$LAB/out/spawn-bin
mkdir -p $SHIMBIN
export SPAWN_RECORD=$RECORD SPAWN_FIXTURE=$LAB/fixtures/usage-full.json

# the config dir each service name belongs to (10-E2), so the record reads as accounts
cat > $SHIMBIN/security <<'EOF'
#!/usr/bin/env zsh
typeset -A account_of=(dcd01a92 personal 15cc4976 thg-fgreen 33751bfc thg-doorbell)
svc=${@[(r)Claude*]}
print -r -- "${account_of[${svc##*-}]:-unknown}" >> $SPAWN_RECORD
print -rn -- '{"claudeAiOauth":{"accessToken":"FAKE-TOKEN-DO-NOT-LOG-9f3a"}}'
EOF
cat > $SHIMBIN/curl <<'EOF'
#!/usr/bin/env zsh
IFS= read -r -d '' sink				# drain the header from stdin, as curl -H @- would
cat $SPAWN_FIXTURE
EOF
chmod +x $SHIMBIN/security $SHIMBIN/curl
export PATH=$SHIMBIN:$PATH

source $SANDBOX/summon.zsh 2>/dev/null
_summon_load
_summon_usage_load			# what a paint would have seen
_summon_usage_spawn

# two accounts should fetch: the one with no cache and the stale one
for i in {1..100}; do
	(( $(wc -l < $RECORD) >= 2 )) && break
	sleep 0.05
done
sleep 0.2						# and give a third fetch, if the rig wrongly spawned one, time to land
print -r -- "SPAWNED ${(j: :)${(f)$(sort $RECORD)}}"
