from __future__ import annotations

from collections.abc import Mapping
from typing import TYPE_CHECKING, Any, TypeVar

from attrs import define as _attrs_define

if TYPE_CHECKING:
    from ..models.adherence_response_item import AdherenceResponseItem
    from ..models.streak_response import StreakResponse
    from ..models.today_response import TodayResponse


T = TypeVar("T", bound="WeightsSummaryGetResponse")


@_attrs_define
class WeightsSummaryGetResponse:
    """
    Attributes:
        today (TodayResponse):
        streak (StreakResponse):
        adherence (list[AdherenceResponseItem]):
    """

    today: TodayResponse
    streak: StreakResponse
    adherence: list[AdherenceResponseItem]

    def to_dict(self) -> dict[str, Any]:
        today = self.today.to_dict()

        streak = self.streak.to_dict()

        adherence = []
        for adherence_item_data in self.adherence:
            adherence_item = adherence_item_data.to_dict()
            adherence.append(adherence_item)

        field_dict: dict[str, Any] = {}

        field_dict.update(
            {
                "today": today,
                "streak": streak,
                "adherence": adherence,
            }
        )

        return field_dict

    @classmethod
    def from_dict(cls: type[T], src_dict: Mapping[str, Any]) -> T:
        from ..models.adherence_response_item import AdherenceResponseItem
        from ..models.streak_response import StreakResponse
        from ..models.today_response import TodayResponse

        d = dict(src_dict)
        today = TodayResponse.from_dict(d.pop("today"))

        streak = StreakResponse.from_dict(d.pop("streak"))

        adherence = []
        _adherence = d.pop("adherence")
        for adherence_item_data in _adherence:
            adherence_item = AdherenceResponseItem.from_dict(adherence_item_data)

            adherence.append(adherence_item)

        weights_summary_get_response = cls(
            today=today,
            streak=streak,
            adherence=adherence,
        )

        return weights_summary_get_response
