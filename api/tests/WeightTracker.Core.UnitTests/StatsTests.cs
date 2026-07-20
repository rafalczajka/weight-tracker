using WeightTracker.Core.Models;

namespace WeightTracker.Core.UnitTests;

public sealed class StatsTests
{
    [Fact]
    public void Create_WithNoData_ReturnsEmpty()
    {
        var result = Stats.Create([]);

        Assert.Equal(Stats.Empty, result);
    }

    [Fact]
    public void Create_WithData_ReturnsExpectedValues()
    {
        var userId = Guid.NewGuid().ToString();

        var data = new List<WeightData>
        {
            new(userId, new DateOnly(2025, 12, 1), 80m),
            new(userId, new DateOnly(2025, 12, 2), 100m),
            new(userId, new DateOnly(2025, 12, 3), 120m)
        };

        var result = Stats.Create(data);

        Assert.Equal(100m, result.AverageWeight);
        Assert.Equal(120m, result.MaxWeight);
        Assert.Equal(80m, result.MinWeight);
    }
}
