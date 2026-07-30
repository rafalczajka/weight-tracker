using System.Collections.Generic;
using System.Linq;

namespace WeightTracker.Core.Calories;

public sealed class DailyCalories
{
    private DailyCalories() { }

    public required DateOnly Date { get; init; }

    public required long TotalCaloriesKcal { get; init; }

    public IReadOnlyList<CalorieEntry> Entries { get; init; } = [];

    public static DailyCalories Create(
        DateOnly date,
        IEnumerable<CalorieEntry> entries)
    {
        var orderedEntries = entries
            .OrderBy(entry => entry.Id, StringComparer.Ordinal)
            .ToArray();

        return new DailyCalories
        {
            Date = date,
            TotalCaloriesKcal = orderedEntries.Sum(entry => (long)entry.CaloriesKcal),
            Entries = orderedEntries
        };
    }
}
