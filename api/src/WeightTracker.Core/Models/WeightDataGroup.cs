using System.Collections.Generic;

namespace WeightTracker.Core.Models;

public sealed class WeightDataGroup
{
    private WeightDataGroup() { }

    public required string UserId { get; init; } = string.Empty;

    public required Today Today { get; init; }

    public required Stats Stats { get; init; }

    public IEnumerable<WeightData> Data { get; set; } = [];

    public static WeightDataGroup Create(string userId, IList<WeightData> data) => new()
    {
        UserId = userId,
        Today = Today.Create(data),
        Stats = Stats.Create(data),
        Data = data,
    };
}
