#!/usr/bin/env bash
cd "$(dirname "$0")/../" || exit 1
set -euo pipefail

url=${1:-'https://tools.franklan.com.au/ssh-keygen'}
echo "url=$url"

bunx lighthouse \
   "$url" \
   --output json --output html \
   --chrome-flags="--headless" \
;
