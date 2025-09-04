#!/usr/bin/env bash
cd "$(dirname "$0")/../" || exit 1
set -euo pipefail

bunx @better-auth/cli migrate --yes
