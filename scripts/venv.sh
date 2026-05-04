#!/bin/sh

find_venv_python() {
  _venv_root_dir="$1"
  _venv_name="$2"
  _venv_python="$_venv_root_dir/$_venv_name/Scripts/python.exe"

  if [ ! -f "$_venv_python" ]; then
    _venv_python="$_venv_root_dir/$_venv_name/bin/python"
  fi

  if [ ! -f "$_venv_python" ]; then
    echo "Python venv not found. Create it in $_venv_root_dir/$_venv_name first." >&2
    return 1
  fi

  printf '%s\n' "$_venv_python"
  return 0
}

set_venv_python() {
  _venv_root_dir="$1"
  VENV_PY=$(find_venv_python "$_venv_root_dir" ".venv") || return 1
  return 0
}

set_tools_venv_python() {
  _venv_root_dir="$1"
  TOOLS_VENV_PY=$(find_venv_python "$_venv_root_dir" ".venv-tools") || return 1
  return 0
}
