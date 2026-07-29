using System.Collections.Generic;
using System.Linq;

namespace WeightTracker.Core.Weights;

public sealed record WeightStats(
    decimal AverageWeightKg,
    decimal MaximumWeightKg,
    decimal MinimumWeightKg)
{
    public static WeightStats Empty { get; } = new(0, 0, 0);

    public static WeightStats Create(IList<WeightData> data)
    {
        ArgumentNullException.ThrowIfNull(data);

        return data.Count == 0
            ? Empty
            : new WeightStats(
                AverageWeightKg: data.Average(d => d.WeightKg),
                MaximumWeightKg: data.Max(d => d.WeightKg),
                MinimumWeightKg: data.Min(d => d.WeightKg));
    }
}
