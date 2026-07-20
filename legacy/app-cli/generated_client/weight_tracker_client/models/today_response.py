from __future__ import annotations

import datetime
from collections.abc import Mapping
from typing import Any, TypeVar, cast

from attrs import define as _attrs_define

from ..types import UNSET, Unset

T = TypeVar("T", bound="TodayResponse")


@_attrs_define
class TodayResponse:
    """
    Attributes:
        date (datetime.date):
        has_entry (bool):
        weight (float | None | Unset):
    """

    date: datetime.date
    has_entry: bool
    weight: float | None | Unset = UNSET

    def to_dict(self) -> dict[str, Any]:
        date = self.date.isoformat()

        has_entry = self.has_entry

        weight: float | None | Unset
        if isinstance(self.weight, Unset):
            weight = UNSET
        else:
            weight = self.weight

        field_dict: dict[str, Any] = {}

        field_dict.update(
            {
                "date": date,
                "hasEntry": has_entry,
            }
        )
        if weight is not UNSET:
            field_dict["weight"] = weight

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        date = datetime.date.fromisoformat(d.pop("date"))

        has_entry = d.pop("hasEntry")

        def _parse_weight(data: object) -> float | None | Unset:
            if data is None:
                return data
            if isinstance(data, Unset):
                return data
            return cast(float | None | Unset, data)

        weight = _parse_weight(d.pop("weight", UNSET))

        today_response = cls(
            date=date,
            has_entry=has_entry,
            weight=weight,
        )

        return today_response
