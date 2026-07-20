from __future__ import annotations

import os
import sys
from collections.abc import Mapping
from dataclasses import dataclass, field

import yaml

from .errors import ConfigError

CONFIG_FILENAME = 'config.yaml'


@dataclass
class ApiConfig:
    base_url: str = ''


@dataclass
class AuthConfig:
    client_id: str = ''
    tenant_id: str = ''


@dataclass
class Config:
    api: ApiConfig = field(default_factory=ApiConfig)
    auth: AuthConfig = field(default_factory=AuthConfig)


_CONFIG: Config | None = None


def load_config(filename: str = CONFIG_FILENAME) -> Config:
    config_path = _resolve_config_path(filename)

    try:
        with open(config_path, encoding='utf-8') as f:
            raw = yaml.safe_load(f) or {}
    except OSError as exc:
        raise ConfigError(f"Unable to read config file '{config_path}': {exc}") from exc

    if not isinstance(raw, Mapping):
        raise ConfigError(f"Config file '{config_path}' must contain a YAML mapping at top level.")

    return _parse_config(raw)


def get_config() -> Config:
    global _CONFIG

    if _CONFIG is None:
        _CONFIG = load_config()

    return _CONFIG


def _resolve_config_path(filename: str) -> str:
    if os.path.exists(filename):
        return filename

    executable_dir = os.path.abspath(os.path.dirname(sys.executable))
    candidate = os.path.join(executable_dir, filename)

    if os.path.exists(candidate):
        return candidate

    raise ConfigError(f"Config file '{filename}' not found in current directory or '{executable_dir}'.")


def _parse_config(raw: Mapping[str, object]) -> Config:
    return Config(
        api=_load_section('api', ApiConfig, raw),
        auth=_load_section('auth', AuthConfig, raw),
    )


def _load_section[T](section_name: str, section_cls: type[T], raw: Mapping[str, object]) -> T:
    section_data = raw.get(section_name, {}) or {}

    if not isinstance(section_data, Mapping):
        raise ConfigError(f"Section '{section_name}' must be a mapping.")

    try:
        return section_cls(**section_data)
    except TypeError as exc:
        raise ConfigError(f"Invalid keys in '{section_name}' section: {exc}") from exc
