from http import HTTPStatus
from typing import Any, cast

import httpx

from ... import errors
from ...client import AuthenticatedClient, Client
from ...models.weights_get_response import WeightsGetResponse
from ...types import UNSET, Response, Unset


def _get_kwargs(
    *,
    from_: None | str | Unset = UNSET,
    to: None | str | Unset = UNSET,
) -> dict[str, Any]:

    params: dict[str, Any] = {}

    json_from_: None | str | Unset
    if isinstance(from_, Unset):
        json_from_ = UNSET
    else:
        json_from_ = from_
    params["from"] = json_from_

    json_to: None | str | Unset
    if isinstance(to, Unset):
        json_to = UNSET
    else:
        json_to = to
    params["to"] = json_to

    params = {k: v for k, v in params.items() if v is not UNSET and v is not None}

    _kwargs: dict[str, Any] = {
        "method": "get",
        "url": "/api/weights",
        "params": params,
    }

    return _kwargs


def _parse_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> Any | WeightsGetResponse | None:
    if response.status_code == 200:
        response_200 = WeightsGetResponse.from_dict(response.json())

        return response_200

    if response.status_code == 400:
        response_400 = cast(Any, None)
        return response_400

    if response.status_code == 401:
        response_401 = cast(Any, None)
        return response_401

    if response.status_code == 404:
        response_404 = cast(Any, None)
        return response_404

    if response.status_code == 500:
        response_500 = cast(Any, None)
        return response_500

    if client.raise_on_unexpected_status:
        raise errors.UnexpectedStatus(response.status_code, response.content)
    else:
        return None


def _build_response(
    *, client: AuthenticatedClient | Client, response: httpx.Response
) -> Response[Any | WeightsGetResponse]:
    return Response(
        status_code=HTTPStatus(response.status_code),
        content=response.content,
        headers=response.headers,
        parsed=_parse_response(client=client, response=response),
    )


def sync_detailed(
    *,
    client: AuthenticatedClient,
    from_: None | str | Unset = UNSET,
    to: None | str | Unset = UNSET,
) -> Response[Any | WeightsGetResponse]:
    """
    Args:
        from_ (None | str | Unset):
        to (None | str | Unset):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[Any | WeightsGetResponse]
    """

    kwargs = _get_kwargs(
        from_=from_,
        to=to,
    )

    response = client.get_httpx_client().request(
        **kwargs,
    )

    return _build_response(client=client, response=response)


def sync(
    *,
    client: AuthenticatedClient,
    from_: None | str | Unset = UNSET,
    to: None | str | Unset = UNSET,
) -> Any | WeightsGetResponse | None:
    """
    Args:
        from_ (None | str | Unset):
        to (None | str | Unset):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Any | WeightsGetResponse
    """

    return sync_detailed(
        client=client,
        from_=from_,
        to=to,
    ).parsed


async def asyncio_detailed(
    *,
    client: AuthenticatedClient,
    from_: None | str | Unset = UNSET,
    to: None | str | Unset = UNSET,
) -> Response[Any | WeightsGetResponse]:
    """
    Args:
        from_ (None | str | Unset):
        to (None | str | Unset):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Response[Any | WeightsGetResponse]
    """

    kwargs = _get_kwargs(
        from_=from_,
        to=to,
    )

    response = await client.get_async_httpx_client().request(**kwargs)

    return _build_response(client=client, response=response)


async def asyncio(
    *,
    client: AuthenticatedClient,
    from_: None | str | Unset = UNSET,
    to: None | str | Unset = UNSET,
) -> Any | WeightsGetResponse | None:
    """
    Args:
        from_ (None | str | Unset):
        to (None | str | Unset):

    Raises:
        errors.UnexpectedStatus: If the server returns an undocumented status code and Client.raise_on_unexpected_status is True.
        httpx.TimeoutException: If the request takes longer than Client.timeout.

    Returns:
        Any | WeightsGetResponse
    """

    return (
        await asyncio_detailed(
            client=client,
            from_=from_,
            to=to,
        )
    ).parsed
