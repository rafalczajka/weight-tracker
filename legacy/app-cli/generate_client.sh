#!/bin/sh
set -e

root_dir=$(git rev-parse --show-toplevel)
legacy_dir="$root_dir/legacy"
cli_dir="$legacy_dir/app-cli"

. "$legacy_dir/scripts/venv.sh"
set_venv_python "$cli_dir"
set_tools_venv_python "$cli_dir"

openapi_path="${1:-$root_dir/api/src/WeightTracker.Api/openapi.json}"
output_path="${2:-$cli_dir/generated_client}"
config_path="$cli_dir/generator-config.yml"

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

"$VENV_PY" -m pip install -e "$output_path"
