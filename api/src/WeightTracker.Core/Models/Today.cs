using System.Collections.Generic;
using System.Linq;

namespace WeightTracker.Core.Models;

public sealed record Today(DateOnly Date, bool HasEntry, decimal? Weight)
{
    public static Today Create(IEnumerable<WeightData> data, DateOnly? referenceDate = null)
    {
        var today = referenceDate ?? DateOnly.FromDateTime(DateTime.UtcNow);
        var currentData = data.SingleOrDefault(d => d.Date == today);

        return currentData is not null
            ? new Today(today, true, currentData.Weight)
            : new Today(today, false, null);
    }
}
