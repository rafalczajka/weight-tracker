using WeightTracker.Core.Weights;

namespace WeightTracker.Core.UnitTests.Weights;

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
        const decimal weightKg = 50;
        var userId = Guid.NewGuid().ToString();

        var weightData = Helpers.GenerateWeightData(userId, weightKg, dateFrom, dateTo, excludedDates);
        var referenceDate = DateOnly.FromDateTime(DateTime.Parse(dateTo, Helpers.DefaultCultureInfo));
        var result = Adherence.Create(weightData, 30, referenceDate);

        Assert.Equal(30, result.Window);
        Assert.Equal(30 - expectedDaysMissed, result.DaysWithEntry);
        Assert.Equal(expectedDaysMissed, result.DaysMissed);
    }

    [Theory]
    [InlineData(0)]
    [InlineData(-1)]
    public void Create_WithNonPositiveWindow_ReturnsEmptyAdherence(int totalDays)
    {
        var result = Adherence.Create([], totalDays, new DateOnly(2024, 12, 31));

        Assert.Equal(new Adherence(0, 0), result);
    }

    [Fact]
    public void Create_WithDuplicateDates_CountsEachDayOnce()
    {
        const string userId = "user-1";
        var referenceDate = new DateOnly(2024, 12, 31);
        WeightData[] data =
        [
            new(userId, referenceDate, 80m),
            new(userId, referenceDate, 81m),
            new(userId, referenceDate.AddDays(-1), 82m)
        ];

        var result = Adherence.Create(data, 3, referenceDate);

        Assert.Equal(new Adherence(3, 2), result);
        Assert.Equal(1, result.DaysMissed);
    }

    [Fact]
    public void Create_CountsInclusiveWindowBoundariesAndIgnoresOutsideDates()
    {
        const string userId = "user-1";
        var referenceDate = new DateOnly(2024, 12, 31);
        WeightData[] data =
        [
            new(userId, referenceDate.AddDays(-3), 80m),
            new(userId, referenceDate.AddDays(-2), 81m),
            new(userId, referenceDate, 82m),
            new(userId, referenceDate.AddDays(1), 83m)
        ];

        var result = Adherence.Create(data, 3, referenceDate);

        Assert.Equal(new Adherence(3, 2), result);
        Assert.Equal(1, result.DaysMissed);
    }
}
