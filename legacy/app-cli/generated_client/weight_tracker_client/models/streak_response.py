from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define

T = TypeVar("T", bound="StreakResponse")


@_attrs_define
class StreakResponse:
    """
    Attributes:
        current (int):
        longest (int):
    """

    current: int
    longest: int

    def to_dict(self) -> dict[str, Any]:
        current = self.current

        longest = self.longest

        field_dict: dict[str, Any] = {}

        field_dict.update(
            {
                "current": current,
                "longest": longest,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        current = d.pop("current")

        longest = d.pop("longest")

        streak_response = cls(
            current=current,
            longest=longest,
        )

        return streak_response
