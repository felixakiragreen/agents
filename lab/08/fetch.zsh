#!/usr/bin/env zsh
# lab/08 — the fetcher under shims: no Keychain, no network, no token that was ever real.
# `security` and `curl` are zsh functions, so they intercept exactly what the rig invokes.
# The token's whole journey is asserted here without any artefact ever holding it: the curl
# shim compares its stdin against the expected header and records only the verdict.
#   fetch.zsh <sandbox> <mode>     mode: ok | nofable | garbage | fail
set -u

SANDBOX=$1
MODE=$2
LAB=${0:A:h}
OUT=$LAB/out
FAKE_TOKEN='FAKE-TOKEN-DO-NOT-LOG-9f3a'

# the credential blob as the Keychain hands it over — same shape as the real one (10-E2)
CREDS="{\"claudeAiOauth\":{\"accessToken\":\"$FAKE_TOKEN\",\"refreshToken\":\"FAKE-REFRESH\",\"expiresAt\":1786134447060,\"scopes\":[\"user:inference\"],\"subscriptionType\":\"team\"}}"

security() {
	print -r -- "SECURITY argv: $*" >> $OUT/shim-security.txt
	[[ $MODE == fail ]] && return 1
	print -rn -- $CREDS
}

curl() {
	print -r -- "CURL argv: $*" >> $OUT/shim-curl.txt
	local sent
	IFS= read -r -d '' sent
	# the verdict, never the header: no harness artefact may carry a token, real or fake
	if [[ $sent == "Authorization: Bearer $FAKE_TOKEN"$'\n' ]]; then
		print -r -- 'CURL stdin: the Authorization header arrived intact' >> $OUT/shim-curl.txt
	else
		print -r -- "CURL stdin: UNEXPECTED (${#sent} bytes)" >> $OUT/shim-curl.txt
	fi
	case $MODE in
		nofable)	cat $LAB/fixtures/usage-nofable.json ;;
		garbage)	cat $LAB/fixtures/usage-garbage.json ;;
		fail)		return 1 ;;
		*)			cat $LAB/fixtures/usage-full.json ;;
	esac
}

source $SANDBOX/summon.zsh 2>/dev/null
COLUMNS=80
summon-usage
print -r -- "summon-usage exit: $?"
