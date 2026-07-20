from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define

if TYPE_CHECKING:
    from ..models.stats_response import StatsResponse
    from ..models.weights_entry_response import WeightsEntryResponse


T = TypeVar("T", bound="WeightsGetResponse")


@_attrs_define
class WeightsGetResponse:
    """
    Attributes:
        stats (StatsResponse):
        data (list[WeightsEntryResponse]):
    """

    stats: StatsResponse
    data: list[WeightsEntryResponse]

    def to_dict(self) -> dict[str, Any]:
        stats = self.stats.to_dict()

        data = []
        for data_item_data in self.data:
            data_item = data_item_data.to_dict()
            data.append(data_item)

        field_dict: dict[str, Any] = {}

        field_dict.update(
            {
                "stats": stats,
                "data": data,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.stats_response import StatsResponse
        from ..models.weights_entry_response import WeightsEntryResponse

        d = dict(src_dict)
        stats = StatsResponse.from_dict(d.pop("stats"))

        data = []
        _data = d.pop("data")
        for data_item_data in _data:
            data_item = WeightsEntryResponse.from_dict(data_item_data)

            data.append(data_item)

        weights_get_response = cls(
            stats=stats,
            data=data,
        )

        return weights_get_response
