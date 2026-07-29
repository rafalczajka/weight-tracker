using WeightTracker.Core.Weights;

namespace WeightTracker.Core.UnitTests.Weights;

public sealed class WeightStreakTests
{
    [Fact]
    public void Create_WithNoData_ReturnsEmptyStreak()
    {
        var result = WeightStreak.Create([], new DateOnly(2024, 12, 31));

        Assert.Equal(new WeightStreak(0, 0), result);
    }

    [Fact]
    public void Create_WithSingleEntryOnReferenceDate_ReturnsOneDayStreak()
    {
        const string userId = "user-1";
        var referenceDate = new DateOnly(2024, 12, 31);
        WeightData[] data = [new(userId, referenceDate, 80m)];

        var result = WeightStreak.Create(data, referenceDate);

        Assert.Equal(new WeightStreak(1, 1), result);
    }

    [Fact]
    public void Create_WithUnorderedData_CalculatesStreakChronologically()
    {
        const string userId = "user-1";
        var referenceDate = new DateOnly(2024, 12, 31);
        WeightData[] data =
        [
            new(userId, referenceDate, 80m),
            new(userId, referenceDate.AddDays(-2), 82m),
            new(userId, referenceDate.AddDays(-1), 81m)
        ];

        var result = WeightStreak.Create(data, referenceDate);

        Assert.Equal(new WeightStreak(3, 3), result);
    }

    [Fact]
    public void Create_WithOnlyFutureData_ReturnsEmptyStreak()
    {
        const string userId = "user-1";
        var referenceDate = new DateOnly(2024, 12, 31);
        WeightData[] data =
        [
            new(userId, referenceDate.AddDays(1), 80m),
            new(userId, referenceDate.AddDays(2), 81m)
        ];

        var result = WeightStreak.Create(data, referenceDate);

        Assert.Equal(new WeightStreak(0, 0), result);
    }

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
        const decimal weightKg = 50;
        var userId = Guid.NewGuid().ToString();

        var weightData = Helpers.GenerateWeightData(userId, weightKg, dateFrom, dateTo, excludedDates);
        var referenceDate = DateOnly.FromDateTime(DateTime.Parse(dateTo, Helpers.DefaultCultureInfo));
        var (streak, longestStreak) = WeightStreak.Create(weightData, referenceDate);

        Assert.Equal(expectedStreak, streak);
        Assert.Equal(expectedLongestStreak, longestStreak);
    }
}
