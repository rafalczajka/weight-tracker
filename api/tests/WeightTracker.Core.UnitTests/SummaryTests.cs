using WeightTracker.Core.Models;

namespace WeightTracker.Core.UnitTests;

public sealed class SummaryTests
{
    [Fact]
    public void Create_ShouldCalculateSummaryForReferenceDate()
    {
        const decimal weight = 80m;

        var userId = Guid.NewGuid().ToString();

        var data = Helpers.GenerateWeightData(
            userId,
            weight,
            "2024-12-01",
            "2024-12-31",
            "2024-12-30",
            "2024-12-31");

        var referenceDate = DateOnly.FromDateTime(DateTime.Parse("2024-12-31", Helpers.DefaultCultureInfo));

        var summary = Summary.Create(data, referenceDate);

        Assert.Equal(referenceDate, summary.Today.Date);
        Assert.False(summary.Today.HasEntry);
        Assert.Null(summary.Today.Weight);

        Assert.Equal(0, summary.Streak.Current);
        Assert.Equal(29, summary.Streak.Longest);

        var adherence = summary.Adherence.ToDictionary(a => a.Window, a => a.DaysWithEntry);

        Assert.Equal(5, adherence[7]);
        Assert.Equal(12, adherence[14]);
        Assert.Equal(28, adherence[30]);
    }
}
