#!/bin/sh
set -e

root_dir=$(git rev-parse --show-toplevel)

. "$root_dir/scripts/venv.sh"
set_venv_python "$root_dir/app-cli"
APP_VENV_PY="$VENV_PY"
set_venv_python "$root_dir/app-cli" ".venv-tools"
TOOLS_VENV_PY="$VENV_PY"

openapi_path="${1:-$root_dir/app-api/src/WeightTracker.Api/openapi.json}"
output_path="${2:-$root_dir/app-cli/generated_client}"
config_path="$root_dir/app-cli/generator-config.yml"

if [ ! -f "$openapi_path" ]; then
  echo "OpenAPI file not found: $openapi_path" >&2
  exit 1
fi

"$TOOLS_VENV_PY" -m openapi_python_client generate \
  --config "$config_path" \
  --path "$openapi_path" \
  --output-path "$output_path" \
  --overwrite

"$TOOLS_VENV_PY" -m ruff check --fix-only "$output_path"
"$TOOLS_VENV_PY" -m ruff format "$output_path"

"$APP_VENV_PY" -m pip install -e "$output_path"
