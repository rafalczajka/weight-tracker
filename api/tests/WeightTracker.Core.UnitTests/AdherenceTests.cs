using WeightTracker.Core.Models;

namespace WeightTracker.Core.UnitTests;

public sealed class AdherenceTests
{
    [Theory]
    [InlineData("2024-12-01", "2024-12-31", 1, "2024-12-26")]
    [InlineData("2024-12-01", "2024-12-31", 0, "0001-01-01")]
    [InlineData("2024-12-01", "2024-12-31", 3, "2024-12-31", "2024-12-26", "2024-12-20")]
    public void Create_ShouldCalculateMissingRecordsCorrectly(
        string dateFrom,
        string dateTo,
        int expectedDaysMissed,
        params string[] excludedDates)
    {
        const decimal weight = 50;
        var userId = Guid.NewGuid().ToString();

        var weightData = Helpers.GenerateWeightData(userId, weight, dateFrom, dateTo, excludedDates);
        var referenceDate = DateOnly.FromDateTime(DateTime.Parse(dateTo, Helpers.DefaultCultureInfo));
        var result = Adherence.Create(weightData, 30, referenceDate);

        Assert.Equal(expectedDaysMissed, result.DaysMissed);
    }
}
