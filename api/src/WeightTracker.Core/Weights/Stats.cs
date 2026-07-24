using System.Collections.Generic;
using System.Linq;

namespace WeightTracker.Core.Weights;

public sealed record Stats(decimal AverageWeightKg, decimal MaximumWeightKg, decimal MinimumWeightKg)
{
    public static Stats Empty { get; } = new(0, 0, 0);

    public static Stats Create(IList<WeightData> data) => data?.Count == 0
        ? Empty
        : new Stats(
            AverageWeightKg: data?.Average(d => Convert.ToDecimal(d.WeightKg)) ?? 0M,
            MaximumWeightKg: data?.Max(x => Convert.ToDecimal(x.WeightKg)) ?? 0M,
            MinimumWeightKg: data?.Min(x => Convert.ToDecimal(x.WeightKg)) ?? 0M);
}
