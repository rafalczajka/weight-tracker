from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define

T = TypeVar("T", bound="StatsResponse")


@_attrs_define
class StatsResponse:
    """
    Attributes:
        avg (float):
        max_ (float):
        min_ (float):
    """

    avg: float
    max_: float
    min_: float

    def to_dict(self) -> dict[str, Any]:
        avg = self.avg

        max_ = self.max_

        min_ = self.min_

        field_dict: dict[str, Any] = {}

        field_dict.update(
            {
                "avg": avg,
                "max": max_,
                "min": min_,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        avg = d.pop("avg")

        max_ = d.pop("max")

        min_ = d.pop("min")

        stats_response = cls(
            avg=avg,
            max_=max_,
            min_=min_,
        )

        return stats_response
