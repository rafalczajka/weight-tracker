using WeightTracker.Core.Weights;

namespace WeightTracker.Core.UnitTests.Weights;

public sealed class WeightStatsTests
{
    [Fact]
    public void Create_WithNoData_ReturnsEmpty()
    {
        var result = WeightStats.Create([]);

        Assert.Equal(WeightStats.Empty, result);
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

        var result = WeightStats.Create(data);

        Assert.Equal(100m, result.AverageWeightKg);
        Assert.Equal(120m, result.MaximumWeightKg);
        Assert.Equal(80m, result.MinimumWeightKg);
    }
}
