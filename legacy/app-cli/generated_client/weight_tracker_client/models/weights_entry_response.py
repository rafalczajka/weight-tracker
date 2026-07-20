from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define

T = TypeVar("T", bound="WeightsEntryResponse")


@_attrs_define
class WeightsEntryResponse:
    """
    Attributes:
        date (str):
        weight (float):
    """

    date: str
    weight: float

    def to_dict(self) -> dict[str, Any]:
        date = self.date

        weight = self.weight

        field_dict: dict[str, Any] = {}

        field_dict.update(
            {
                "date": date,
                "weight": weight,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        date = d.pop("date")

        weight = d.pop("weight")

        weights_entry_response = cls(
            date=date,
            weight=weight,
        )

        return weights_entry_response
