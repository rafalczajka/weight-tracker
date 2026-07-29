using System.Collections.Generic;
using System.Linq;

namespace WeightTracker.Core.Weights;

public sealed record WeightAdherence(int Window, int DaysWithEntry)
{
    public int DaysMissed => Window - DaysWithEntry;

    public static WeightAdherence Create(
        IEnumerable<WeightData> data,
        int totalDays,
        DateOnly? referenceDate = null)
    {
        if (totalDays <= 0) return new WeightAdherence(0, 0);

        var lastDate = referenceDate ?? DateOnly.FromDateTime(DateTime.UtcNow);
        var firstDate = lastDate.AddDays(-totalDays + 1);

        var datesInRange = data
            .Select(d => d.Date)
            .Distinct()
            .Count(d => d >= firstDate && d <= lastDate);

        return new WeightAdherence(totalDays, datesInRange);
    }
}
