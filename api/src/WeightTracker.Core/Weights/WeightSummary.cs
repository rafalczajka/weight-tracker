using System.Collections.Generic;

namespace WeightTracker.Core.Weights;

public sealed record WeightSummary(
    TodayWeight Today,
    WeightStreak Streak,
    IEnumerable<WeightAdherence> Adherence)
{
    public static WeightSummary Create(
        IList<WeightData> data,
        DateOnly? referenceDate = null)
    {
        var today = referenceDate ?? DateOnly.FromDateTime(DateTime.UtcNow);

        return new WeightSummary(
            TodayWeight.Create(data, today),
            WeightStreak.Create(data, today),
            [
                WeightAdherence.Create(data, 7, today),
                WeightAdherence.Create(data, 14, today),
                WeightAdherence.Create(data, 30, today)
            ]);
    }
}
