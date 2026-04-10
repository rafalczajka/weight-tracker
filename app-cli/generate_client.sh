#!/bin/sh
set -e

root_dir=$(git rev-parse --show-toplevel)

. "$root_dir/scripts/venv.sh"
set_venv_python "$root_dir/app-cli"

openapi_path="${1:-$root_dir/app-api/src/WeightTracker.Api/openapi.json}"
output_path="${2:-$root_dir/app-cli/generated_client}"

if [ ! -f "$openapi_path" ]; then
  echo "OpenAPI file not found: $openapi_path" >&2
  exit 1
fi

"$VENV_PY" -m openapi_python_client generate --path "$openapi_path" --output-path "$output_path" --overwrite
"$VENV_PY" -m pip install -e "$output_path"
