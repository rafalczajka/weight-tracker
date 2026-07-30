using WeightTracker.Core.Calories;

namespace WeightTracker.Core.UnitTests.Calories;

public sealed class CalorieDataGroupTests
{
    [Fact]
    public void Create_WithEntries_GroupsNewestDaysFirst()
    {
        const string userId = "user-1";
        var olderDate = new DateOnly(2026, 7, 30);
        var newerDate = olderDate.AddDays(1);
        CalorieEntry[] entries =
        [
            new("older_b", userId, olderDate, 400, null),
            new("newer_a", userId, newerDate, 600, null),
            new("older_a", userId, olderDate, 500, null)
        ];

        var result = CalorieDataGroup.Create(userId, entries);

        Assert.Equal(userId, result.UserId);
        Assert.Equal([newerDate, olderDate], result.Data.Select(day => day.Date));
        Assert.Equal(900, result.Data[1].TotalCaloriesKcal);
        Assert.Equal(
            ["older_a", "older_b"],
            result.Data[1].Entries.Select(entry => entry.Id));
        Assert.Equal(
            ["older_b", "newer_a", "older_a"],
            entries.Select(entry => entry.Id));
    }

    [Fact]
    public void Create_WithLimit_ReturnsCompleteDays()
    {
        const string userId = "user-1";
        var oldestDate = new DateOnly(2026, 7, 29);
        var middleDate = oldestDate.AddDays(1);
        var newestDate = middleDate.AddDays(1);
        CalorieEntry[] entries =
        [
            new("newest_a", userId, newestDate, 100, null),
            new("middle_a", userId, middleDate, 200, null),
            new("middle_b", userId, middleDate, 300, null),
            new("oldest_a", userId, oldestDate, 400, null)
        ];

        var result = CalorieDataGroup.Create(userId, entries, limitDays: 2);

        Assert.Equal([newestDate, middleDate], result.Data.Select(day => day.Date));
        Assert.Equal(2, result.Data[1].Entries.Count);
        Assert.Equal(500, result.Data[1].TotalCaloriesKcal);
    }

    [Fact]
    public void Create_WithNoEntries_ReturnsEmptyGroup()
    {
        var result = CalorieDataGroup.Create("user-1", []);

        Assert.Empty(result.Data);
    }
}
