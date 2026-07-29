using System.Collections.Generic;

namespace WeightTracker.Core.Weights;

public sealed class WeightDataGroup
{
    private WeightDataGroup() { }

    public required string UserId { get; init; } = string.Empty;

    public required TodayWeight Today { get; init; }

    public required WeightStats Stats { get; init; }

    public IEnumerable<WeightData> Data { get; set; } = [];

    public static WeightDataGroup Create(string userId, IList<WeightData> data) => new()
    {
        UserId = userId,
        Today = TodayWeight.Create(data),
        Stats = WeightStats.Create(data),
        Data = data,
    };
}
