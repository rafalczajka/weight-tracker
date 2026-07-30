using WeightTracker.Core.Calories;

namespace WeightTracker.Core.UnitTests.Calories;

public sealed class DailyCaloriesTests
{
    [Fact]
    public void Create_WithNoEntries_ReturnsEmptyDay()
    {
        var date = new DateOnly(2026, 7, 31);

        var result = DailyCalories.Create(date, []);

        Assert.Equal(date, result.Date);
        Assert.Equal(0, result.TotalCaloriesKcal);
        Assert.Empty(result.Entries);
    }

    [Fact]
    public void Create_WithEntries_CalculatesTotalAndOrdersById()
    {
        var date = new DateOnly(2026, 7, 31);
        CalorieEntry[] entries =
        [
            new("key_b", "user-1", date, 700, "Lunch"),
            new("key_a", "user-1", date, 500, "Breakfast")
        ];

        var result = DailyCalories.Create(date, entries);

        Assert.Equal(1200, result.TotalCaloriesKcal);
        Assert.Equal(["key_a", "key_b"], result.Entries.Select(entry => entry.Id));
        Assert.Equal(["key_b", "key_a"], entries.Select(entry => entry.Id));
    }
}
