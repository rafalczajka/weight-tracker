using System.Collections.Generic;
using System.Linq;

namespace WeightTracker.Core.Models;

public sealed record Stats(decimal AverageWeight, decimal MaxWeight, decimal MinWeight)
{
    public static Stats Empty { get; } = new(0, 0, 0);

    public static Stats Create(IList<WeightData> data) => data?.Count == 0
        ? Empty
        : new Stats(
            AverageWeight: data?.Average(d => Convert.ToDecimal(d.Weight)) ?? 0M,
            MaxWeight: data?.Max(x => Convert.ToDecimal(x.Weight)) ?? 0M,
            MinWeight: data?.Min(x => Convert.ToDecimal(x.Weight)) ?? 0M);
}
