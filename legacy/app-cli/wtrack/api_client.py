from __future__ import annotations

from http import HTTPStatus
from typing import TYPE_CHECKING, TypeVar
from urllib.parse import urlparse

from weight_tracker_client import AuthenticatedClient
from weight_tracker_client.api.weights import (
    create_weight_entry,
    delete_weight_entry,
    get_weight_entry,
    get_weights,
    get_weights_summary,
    update_weight_entry,
)
from weight_tracker_client.models import (
    WeightsEntryResponse,
    WeightsGetResponse,
    WeightsPostRequest,
    WeightsPutRequest,
    WeightsSummaryGetResponse,
)

from .errors import ApiError, ConfigError
from .settings import get_config

if TYPE_CHECKING:
    from weight_tracker_client.types import Response

DEFAULT_TIMEOUT_SECONDS = 15
TParsed = TypeVar('TParsed')


class WeightsApi:
    def __init__(self, access_token: str) -> None:
        self._client = _build_client(access_token)

    def get_summary(self) -> WeightsSummaryGetResponse:
        response = get_weights_summary.sync_detailed(client=self._client)
        return _parse_and_ensure_status(response, HTTPStatus.OK, 'status')

    def get(self, date_from: str | None, date_to: str | None) -> WeightsGetResponse:
        response = get_weights.sync_detailed(client=self._client, from_=date_from, to=date_to)
        return _parse_and_ensure_status(response, HTTPStatus.OK, 'report')

    def get_by_date(self, date: str) -> WeightsEntryResponse:
        response = get_weight_entry.sync_detailed(date, client=self._client)
        return _parse_and_ensure_status(response, HTTPStatus.OK, 'weight-by-date')

    def add(self, date: str | None, weight: float) -> None:
        body = WeightsPostRequest(weight=weight, date=date)
        response = create_weight_entry.sync_detailed(client=self._client, body=body)
        _ensure_status(response, HTTPStatus.CREATED, 'add-weight')

    def update(self, date: str, weight: float) -> None:
        body = WeightsPutRequest(weight=weight)
        response = update_weight_entry.sync_detailed(date, client=self._client, body=body)
        _ensure_status(response, HTTPStatus.OK, 'update-weight')

    def delete(self, date: str) -> None:
        response = delete_weight_entry.sync_detailed(date, client=self._client)
        _ensure_status(response, HTTPStatus.NO_CONTENT, 'delete-weight')


def _build_client(access_token: str) -> AuthenticatedClient:
    base_url = _resolve_base_url()

    return AuthenticatedClient(
        base_url=base_url,
        token=access_token,
        timeout=DEFAULT_TIMEOUT_SECONDS,
    )


def _resolve_base_url() -> str:
    base_url = get_config().api.base_url.strip()

    if not base_url:
        raise ConfigError("Missing 'base_url' in api configuration.")

    if not _is_absolute_url(base_url):
        raise ConfigError("Invalid 'base_url' in api configuration. It must include http or https.")

    return base_url.rstrip('/')


def _is_absolute_url(value: str) -> bool:
    parsed = urlparse(value)
    return parsed.scheme in {'http', 'https'} and bool(parsed.netloc)


def _parse_and_ensure_status[TParsed](
    response: Response[TParsed | None],
    expected_status: HTTPStatus,
    label: str,
) -> TParsed:
    if response.status_code != expected_status:
        raise ApiError(f'Server responded with an error ({response.status_code}): {label}.')

    if response.parsed is None:
        raise ApiError(f'Empty {label} response payload.')

    return response.parsed


def _ensure_status(response: Response[object], expected_status: HTTPStatus, label: str) -> None:
    if response.status_code != expected_status:
        raise ApiError(f'Server responded with an error ({response.status_code}): {label}.')
