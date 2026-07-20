from __future__ import annotations

import os
import sys
from typing import TypedDict

from msal import PublicClientApplication, SerializableTokenCache

from .constants import APP_NAME
from .errors import AppError
from .settings import get_config


class AuthResult(TypedDict, total=False):
    access_token: str
    error_description: str
    error: str


class _PersistentTokenCache(SerializableTokenCache):
    def __init__(self) -> None:
        super().__init__()
        self.cache_file = self._get_cache_path()
        self.deserialize(self._load_cache())

    def persist_cache(self) -> None:
        os.makedirs(os.path.dirname(self.cache_file), exist_ok=True)

        with open(self.cache_file, 'wb') as f:
            f.write(self.serialize().encode('utf-8'))

        if not sys.platform.startswith('win'):
            os.chmod(self.cache_file, 0o600)

    def clear_cache(self) -> None:
        if os.path.exists(self.cache_file):
            os.remove(self.cache_file)

    def _get_cache_path(self) -> str:
        home = os.path.expanduser('~')

        if sys.platform.startswith('win'):
            return os.path.join(home, 'AppData', 'Local', APP_NAME, 'token_cache.bin')

        return os.path.join(home, f'.{APP_NAME}_token_cache')

    def _load_cache(self) -> str:
        if not os.path.exists(self.cache_file):
            return ''

        try:
            with open(self.cache_file, 'rb') as f:
                return f.read().decode('utf-8')
        except (OSError, UnicodeDecodeError):
            return ''


def acquire_token() -> str:
    cache = _PersistentTokenCache()
    result: AuthResult | None = None

    auth_config = get_config().auth

    client_id = auth_config.client_id.strip()
    tenant_id = auth_config.tenant_id.strip()

    if not client_id or not tenant_id:
        raise AppError("Missing auth configuration: 'client_id' and 'tenant_id' are required.")

    authority = f'https://login.microsoftonline.com/{tenant_id}'

    app = PublicClientApplication(client_id, authority=authority, token_cache=cache)

    scopes = [f'api://{client_id}/access_as_user']
    accounts = app.get_accounts()

    if accounts:
        result = app.acquire_token_silent(scopes, account=accounts[0])
    else:
        result = app.acquire_token_interactive(scopes, timeout=60)

    if not result or 'access_token' not in result:
        error_description = 'Unknown authentication error.'

        if result is not None:
            error_description = result.get('error_description') or result.get('error') or error_description

        raise AppError(f'Authentication failed: {error_description}')

    if cache.has_state_changed:
        cache.persist_cache()

    return result['access_token']


def logout() -> None:
    _PersistentTokenCache().clear_cache()
