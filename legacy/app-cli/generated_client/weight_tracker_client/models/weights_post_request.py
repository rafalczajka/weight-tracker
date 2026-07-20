from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define

from ..types import UNSET, Unset

T = TypeVar("T", bound="WeightsPostRequest")


@_attrs_define
class WeightsPostRequest:
    """
    Attributes:
        weight (float):
        date (None | str | Unset):
    """

    weight: float
    date: None | str | Unset = UNSET

    def to_dict(self) -> dict[str, Any]:
        weight = self.weight

        date: None | str | Unset
        if isinstance(self.date, Unset):
            date = UNSET
        else:
            date = self.date

        field_dict: dict[str, Any] = {}

        field_dict.update(
            {
                "weight": weight,
            }
        )
        if date is not UNSET:
            field_dict["date"] = date

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        weight = d.pop("weight")

        def _parse_date(data: object) -> None | str | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(None | str | Unset, data)

        date = _parse_date(d.pop("date", UNSET))

        weights_post_request = cls(
            weight=weight,
            date=date,
        )

        return weights_post_request
