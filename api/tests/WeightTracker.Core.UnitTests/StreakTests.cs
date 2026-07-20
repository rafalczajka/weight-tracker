using WeightTracker.Core.Models;

namespace WeightTracker.Core.UnitTests;

public sealed class StreakTests
{
    [Theory]
    [InlineData("2024-12-01", "2024-12-31", 5, 25, "2024-12-26")]
    [InlineData("2024-12-20", "2024-12-31", 8, 8, "2024-12-23")]
    [InlineData("2024-12-21", "2024-12-31", 10, 10, "2024-12-31")]
    [InlineData("2024-12-21", "2024-12-31", 0, 9, "2024-12-30", "2024-12-31")]
    public void Create_ShouldCalculateStreakValuesCorrectly(
        string dateFrom,
        string dateTo,
        int expectedStreak,
        int expectedLongestStreak,
        params string[] excludedDates)
    {
        const decimal weight = 50;
        var userId = Guid.NewGuid().ToString();

        var weightData = Helpers.GenerateWeightData(userId, weight, dateFrom, dateTo, excludedDates);
        var referenceDate = DateOnly.FromDateTime(DateTime.Parse(dateTo, Helpers.DefaultCultureInfo));
        var (streak, longestStreak) = Streak.Create(weightData, referenceDate);

        Assert.Equal(expectedStreak, streak);
        Assert.Equal(expectedLongestStreak, longestStreak);
    }
}
