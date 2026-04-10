#!/bin/sh

set -e

root_dir=$(git rev-parse --show-toplevel)

. "$root_dir/scripts/venv.sh"
set_venv_python "$root_dir/app-cli"

echo "Loading environment variables..."

source "$root_dir/.env"

echo "Creating executable..."

rm -rf "$root_dir/app-cli/dist"

"$VENV_PY" -m PyInstaller "$root_dir/app-cli/wtrack/__main__.py" \
  --name "$CLI_APP_NAME" \
  --distpath "$root_dir/app-cli/dist" \
  --workpath "$root_dir/app-cli/build" \
  --log-level=WARN \
  --exclude-module pyinstaller

branch_name=$(git rev-parse --abbrev-ref HEAD)

if [ "$branch_name" != "main" ]; then
  echo "Skipping install to $CLI_APP_INSTALLATION_DIR - not on the main branch."
  exit 0
fi

if [ -z "$CLI_APP_INSTALLATION_DIR" ]; then
  echo "CLI_APP_INSTALLATION_DIR environment variable is not set."
  exit 1
fi

echo "Removing existing installation at $CLI_APP_INSTALLATION_DIR..."

rm -rf "$CLI_APP_INSTALLATION_DIR/$CLI_APP_NAME"

echo "Copying executable to $CLI_APP_INSTALLATION_DIR..."

cp "$root_dir/app-cli/config.prod.yaml" "$root_dir/app-cli/dist/$CLI_APP_NAME/config.yaml"
cp -r "$root_dir/app-cli/dist/$CLI_APP_NAME" "$CLI_APP_INSTALLATION_DIR"
