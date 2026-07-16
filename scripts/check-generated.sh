#!/usr/bin/env bash

set -euo pipefail

readonly GENERATED_PATH='packages/api-client/src/generated'

status="$(git status --short --untracked-files=all -- "$GENERATED_PATH")"

if [[ -z "$status" ]]; then
  exit 0
fi

printf '%s\n' 'Generated API client is not up to date:' "$status" >&2
exit 1
