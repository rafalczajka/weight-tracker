using System.Collections.Generic;

namespace WeightTracker.Core.Weights;

public sealed class WeightDataGroup
{
    private WeightDataGroup() { }

    public required string UserId { get; init; } = string.Empty;

    public required TodayWeight Today { get; init; }

    public required WeightStats Stats { get; init; }

    public WeightMovingAverage? MovingAverage { get; init; }

    public IEnumerable<WeightData> Data { get; set; } = [];

    public static WeightDataGroup Create(
        string userId,
        IList<WeightData> data,
        WeightMovingAverage? movingAverage = null) => new()
        {
            UserId = userId,
            Today = TodayWeight.Create(data),
            Stats = WeightStats.Create(data),
            MovingAverage = movingAverage,
            Data = data,
        };
}
