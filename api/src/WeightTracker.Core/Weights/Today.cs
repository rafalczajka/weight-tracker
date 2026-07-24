using System.Collections.Generic;
using System.Linq;

namespace WeightTracker.Core.Weights;

public sealed record Today(DateOnly Date, bool HasEntry, decimal? WeightKg)
{
    public static Today Create(IEnumerable<WeightData> data, DateOnly? referenceDate = null)
    {
        var today = referenceDate ?? DateOnly.FromDateTime(DateTime.UtcNow);
        var currentData = data.SingleOrDefault(d => d.Date == today);

        return currentData is not null
            ? new Today(today, true, currentData.WeightKg)
            : new Today(today, false, null);
    }
}
