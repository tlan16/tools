#!/usr/bin/env bash
cd "$(dirname "$0")/../" || exit 1
set -euo pipefail

function EPHEMERAL_PORT() {
    LOW_BOUND=49152
    RANGE=16384
    while true; do
        CANDIDATE=$[$LOW_BOUND + ($RANDOM % $RANGE)]
        (echo -n >/dev/tcp/127.0.0.1/${CANDIDATE}) >/dev/null 2>&1
        if [ $? -ne 0 ]; then
            echo $CANDIDATE
            break
        fi
    done
}

bun run build
port=$(EPHEMERAL_PORT)
base_url="http://localhost:${port}"
bunx http-server --gzip --port "$port" out &
SERVER_PID=$!
echo "Started server on $base_url with PID $SERVER_PID"
curl --retry 10 --retry-delay 1 --retry-connrefused --silent --head "$base_url" > /dev/null

rm -vf "lighthouse-report.report.html" "lighthouse-report.report.json"
bunx lighthouse \
   "${base_url}/ssh-keygen" \
   --output json --output html \
   --output-path 'lighthouse-report' \
   --chrome-flags="--headless" \
;

kill $SERVER_PID
echo "Killed server with PID $SERVER_PID"

open "lighthouse-report.report.html"
