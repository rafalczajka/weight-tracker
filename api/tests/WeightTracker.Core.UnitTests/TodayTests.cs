using WeightTracker.Core.Models;

namespace WeightTracker.Core.UnitTests;

public sealed class TodayTests
{
    [Fact]
    public void Create_WhenEntryExists_ReturnsExpectedToday()
    {
        var userId = Guid.NewGuid().ToString();
        var referenceDate = new DateOnly(2024, 12, 31);
        var data = new List<WeightData> { new(userId, referenceDate, 85m) };

        var result = Today.Create(data, referenceDate);

        Assert.Equal(referenceDate, result.Date);
        Assert.True(result.HasEntry);
        Assert.Equal(85m, result.Weight);
    }

    [Fact]
    public void Create_WhenEntryMissing_ReturnsEmptyToday()
    {
        var userId = Guid.NewGuid().ToString();
        var referenceDate = new DateOnly(2024, 12, 31);
        var data = new List<WeightData> { new(userId, referenceDate.AddDays(-1), 85m) };

        var result = Today.Create(data, referenceDate);

        Assert.Equal(referenceDate, result.Date);
        Assert.False(result.HasEntry);
        Assert.Null(result.Weight);
    }
}
