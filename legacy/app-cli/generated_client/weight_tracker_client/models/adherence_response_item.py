from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define

T = TypeVar("T", bound="AdherenceResponseItem")


@_attrs_define
class AdherenceResponseItem:
    """
    Attributes:
        window (int):
        days_with_entry (int):
        days_missed (int):
    """

    window: int
    days_with_entry: int
    days_missed: int

    def to_dict(self) -> dict[str, Any]:
        window = self.window

        days_with_entry = self.days_with_entry

        days_missed = self.days_missed

        field_dict: dict[str, Any] = {}

        field_dict.update(
            {
                "window": window,
                "daysWithEntry": days_with_entry,
                "daysMissed": days_missed,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        window = d.pop("window")

        days_with_entry = d.pop("daysWithEntry")

        days_missed = d.pop("daysMissed")

        adherence_response_item = cls(
            window=window,
            days_with_entry=days_with_entry,
            days_missed=days_missed,
        )

        return adherence_response_item
