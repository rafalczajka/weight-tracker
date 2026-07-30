using System.Collections.Generic;
using System.Linq;

namespace WeightTracker.Core.Calories;

public sealed class CalorieDataGroup
{
    private CalorieDataGroup() { }

    public required string UserId { get; init; }

    public IReadOnlyList<DailyCalories> Data { get; init; } = [];

    public static CalorieDataGroup Create(
        string userId,
        IEnumerable<CalorieEntry> entries,
        int? limitDays = null)
    {
        if (limitDays.HasValue)
            ArgumentOutOfRangeException.ThrowIfLessThan(limitDays.Value, 1);

        var dailyData = entries
            .GroupBy(entry => entry.Date)
            .OrderByDescending(group => group.Key)
            .Take(limitDays ?? int.MaxValue)
            .Select(group => DailyCalories.Create(group.Key, group))
            .ToArray();

        return new CalorieDataGroup
        {
            UserId = userId,
            Data = dailyData
        };
    }
}
