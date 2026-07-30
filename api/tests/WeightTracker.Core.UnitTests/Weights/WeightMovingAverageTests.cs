using System.Globalization;
using WeightTracker.Core.Weights;

namespace WeightTracker.Core.UnitTests.Weights;

public sealed class WeightMovingAverageTests
{
    private const string UserId = "user-1";

    [Fact]
    public void Create_WithNoData_ReturnsEmptyValues()
    {
        var result = WeightMovingAverage.Create(7, [], []);

        Assert.Equal(7, result.WindowDays);
        Assert.Empty(result.Values);
    }

    [Fact]
    public void Create_WithOneDayWindow_ReturnsOriginalWeights()
    {
        IList<WeightData> data =
        [
            Entry("2026-01-01", 80m),
            Entry("2026-01-02", 82m)
        ];

        var result = WeightMovingAverage.Create(1, data, []);

        Assert.Collection(
            result.Values,
            value => Assert.Equal(80m, value.AverageWeightKg),
            value => Assert.Equal(82m, value.AverageWeightKg));
    }

    [Fact]
    public void Create_WithConsecutiveDays_CalculatesRollingAverage()
    {
        IList<WeightData> data =
        [
            Entry("2026-01-01", 78m),
            Entry("2026-01-02", 81m),
            Entry("2026-01-03", 84m),
            Entry("2026-01-04", 90m)
        ];

        var result = WeightMovingAverage.Create(3, data, []);

        Assert.Collection(
            result.Values,
            value => Assert.Equal(78m, value.AverageWeightKg),
            value => Assert.Equal(79.5m, value.AverageWeightKg),
            value => Assert.Equal(81m, value.AverageWeightKg),
            value => Assert.Equal(85m, value.AverageWeightKg));
    }

    [Fact]
    public void Create_WithMissingDays_UsesCalendarWindow()
    {
        IList<WeightData> data =
        [
            Entry("2026-01-01", 75m),
            Entry("2026-01-03", 81m),
            Entry("2026-01-05", 90m)
        ];

        var result = WeightMovingAverage.Create(3, data, []);

        Assert.Collection(
            result.Values,
            value => Assert.Equal(75m, value.AverageWeightKg),
            value => Assert.Equal(78m, value.AverageWeightKg),
            value => Assert.Equal(85.5m, value.AverageWeightKg));
    }

    [Fact]
    public void Create_ExcludesEntryBeforeWindowBoundary()
    {
        IList<WeightData> data = [Entry("2026-01-08", 84m)];
        WeightData[] precedingData =
        [
            Entry("2026-01-01", 70m),
            Entry("2026-01-02", 80m)
        ];

        var result = WeightMovingAverage.Create(7, data, precedingData);

        var value = Assert.Single(result.Values);
        Assert.Equal(82m, value.AverageWeightKg);
    }

    [Fact]
    public void Create_WithPrecedingData_UsesItWithoutReturningIt()
    {
        IList<WeightData> data =
        [
            Entry("2026-01-08", 84m),
            Entry("2026-01-09", 87m)
        ];
        WeightData[] precedingData = [Entry("2026-01-07", 78m)];

        var result = WeightMovingAverage.Create(7, data, precedingData);

        Assert.Collection(
            result.Values,
            value =>
            {
                Assert.Equal(new DateOnly(2026, 1, 8), value.Date);
                Assert.Equal(81m, value.AverageWeightKg);
            },
            value =>
            {
                Assert.Equal(new DateOnly(2026, 1, 9), value.Date);
                Assert.Equal(83m, value.AverageWeightKg);
            });
    }

    [Fact]
    public void Create_PreservesDataOrderWithoutModifyingInput()
    {
        IList<WeightData> data =
        [
            Entry("2026-01-03", 84m),
            Entry("2026-01-02", 81m)
        ];

        var result = WeightMovingAverage.Create(3, data, []);

        Assert.Equal(
            [new DateOnly(2026, 1, 3), new DateOnly(2026, 1, 2)],
            result.Values.Select(value => value.Date));
        Assert.Equal(
            [new DateOnly(2026, 1, 3), new DateOnly(2026, 1, 2)],
            data.Select(entry => entry.Date));
    }

    private static WeightData Entry(string date, decimal weightKg) =>
        new(UserId, DateOnly.Parse(date, CultureInfo.InvariantCulture), weightKg);
}
