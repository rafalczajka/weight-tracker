#!/bin/sh

set_venv_python() {
  root_directory="$1"
  venv_directory="${2:-.venv}"
  venv_path="$root_directory/$venv_directory"
  venv_python="$venv_path/Scripts/python.exe"

  if [ ! -f "$venv_python" ]; then
    venv_python="$venv_path/bin/python"
  fi

  if [ ! -f "$venv_python" ]; then
    echo "Python venv not found. Create it in $venv_path first." >&2
    return 1
  fi

  VENV_PY="$venv_python"
  return 0
}
