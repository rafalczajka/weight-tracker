using System.Collections.Generic;
using System.Linq;

namespace WeightTracker.Core.Weights;

public sealed record WeightStreak(int Current, int Longest)
{
    public static WeightStreak Create(
        IEnumerable<WeightData> data,
        DateOnly? referenceDate = null)
    {
        var today = referenceDate ?? DateOnly.FromDateTime(DateTime.UtcNow);

        var datesOnly = data
            .Where(d => d.Date <= today).ToList()
            .OrderBy(d => d.Date)
            .Select(d => d.Date)
            .ToList();

        if (datesOnly.Count == 0) return new WeightStreak(0, 0);

        var streak = 0;
        var longestStreak = 0;

        for (var x = datesOnly.First(); x < today; x = x.AddDays(1))
        {
            streak = datesOnly.Contains(x) ? streak + 1 : 0;
            if (streak > longestStreak) longestStreak = streak;
        }

        if (datesOnly.Contains(today)) streak++;
        if (streak > longestStreak) longestStreak = streak;

        return new WeightStreak(streak, longestStreak);
    }
}
