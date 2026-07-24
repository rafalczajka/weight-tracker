using WeightTracker.Core.Weights;

namespace WeightTracker.Core.UnitTests.Weights;

public sealed class WeightDataGroupTests
{
    [Fact]
    public void Create_WithData_ComposesWeightDataGroup()
    {
        const string userId = "user-1";
        IList<WeightData> data =
        [
            new(userId, new DateOnly(2000, 1, 1), 80m),
            new(userId, new DateOnly(2000, 1, 2), 82m)
        ];

        var result = WeightDataGroup.Create(userId, data);

        Assert.Equal(userId, result.UserId);
        Assert.False(result.Today.HasEntry);
        Assert.Null(result.Today.WeightKg);
        Assert.Equal(new Stats(81m, 82m, 80m), result.Stats);
        Assert.Same(data, result.Data);
    }
}
