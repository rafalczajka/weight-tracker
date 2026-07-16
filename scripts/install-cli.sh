#!/usr/bin/env bash

set -euo pipefail

readonly ROOT_DIRECTORY="$(git rev-parse --show-toplevel)"
readonly ENVIRONMENT_PATH="$ROOT_DIRECTORY/.env"

cd "$ROOT_DIRECTORY"
corepack pnpm --filter '@weight-tracker/cli' build:binary

readonly SOURCE_PATH="$ROOT_DIRECTORY/clients/cli/dist/wtrack-next.exe"

if [[ -f "$ENVIRONMENT_PATH" ]]; then
  # shellcheck disable=SC1090
  source "$ENVIRONMENT_PATH"
fi

if [[ -z "${CLI_APP_NAME:-}" || -z "${CLI_APP_INSTALLATION_DIR:-}" ]]; then
  printf 'Built %s\n' "$SOURCE_PATH"
  printf 'Skipping installation: CLI_APP_NAME and CLI_APP_INSTALLATION_DIR must both be set.\n'
  exit 0
fi

readonly TARGET_DIRECTORY="$CLI_APP_INSTALLATION_DIR/$CLI_APP_NAME"
readonly TARGET_PATH="$TARGET_DIRECTORY/wtrack-next.exe"

mkdir -p "$TARGET_DIRECTORY"
cp "$SOURCE_PATH" "$TARGET_PATH"

printf 'Installed %s\n' "$TARGET_PATH"
