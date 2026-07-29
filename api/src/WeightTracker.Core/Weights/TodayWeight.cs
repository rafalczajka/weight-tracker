using System.Collections.Generic;
using System.Linq;

namespace WeightTracker.Core.Weights;

public sealed record TodayWeight(DateOnly Date, bool HasEntry, decimal? WeightKg)
{
    public static TodayWeight Create(
        IEnumerable<WeightData> data,
        DateOnly? referenceDate = null)
    {
        var today = referenceDate ?? DateOnly.FromDateTime(DateTime.UtcNow);
        var currentData = data.SingleOrDefault(d => d.Date == today);

        return currentData is not null
            ? new TodayWeight(today, true, currentData.WeightKg)
            : new TodayWeight(today, false, null);
    }
}
