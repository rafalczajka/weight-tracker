from __future__ import annotations

from collections.abc import Mapping
from typing import Any, TypeVar

from attrs import define as _attrs_define

T = TypeVar("T", bound="WeightsPutRequest")


@_attrs_define
class WeightsPutRequest:
    """
    Attributes:
        weight (float):
    """

    weight: float

    def to_dict(self) -> dict[str, Any]:
        weight = self.weight

        field_dict: dict[str, Any] = {}

        field_dict.update(
            {
                "weight": weight,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        d = dict(src_dict)
        weight = d.pop("weight")

        weights_put_request = cls(
            weight=weight,
        )

        return weights_put_request
