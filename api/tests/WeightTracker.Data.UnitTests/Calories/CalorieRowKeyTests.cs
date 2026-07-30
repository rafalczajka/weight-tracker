using System.Globalization;
using WeightTracker.Data.Calories;

namespace WeightTracker.Data.UnitTests.Calories;

public sealed class CalorieRowKeyTests
{
    private static readonly Guid OlderIdentifier =
        Guid.Parse("01982f80-0000-7000-8000-000000000001");

    private static readonly Guid NewerIdentifier =
        Guid.Parse("01982f80-0001-7000-8000-000000000001");

    [Theory]
    [InlineData("0001-01-01")]
    [InlineData("2026-07-31")]
    [InlineData("9999-12-31")]
    public void RowKey_RoundTripsDate(string value)
    {
        var date = DateOnly.Parse(value, CultureInfo.InvariantCulture);

        var rowKey = CalorieRowKey.Create(date, OlderIdentifier);
        var parsed = CalorieRowKey.TryParse(rowKey, out var result);

        Assert.True(parsed);
        Assert.Equal(40, rowKey.Length);
        Assert.Equal(date, result);
    }

    [Fact]
    public void Create_SortsNewerDateFirst()
    {
        var olderDate = new DateOnly(2026, 7, 30);
        var newerDate = olderDate.AddDays(1);

        var olderRowKey = CalorieRowKey.Create(olderDate, OlderIdentifier);
        var newerRowKey = CalorieRowKey.Create(newerDate, OlderIdentifier);

        Assert.True(string.CompareOrdinal(newerRowKey, olderRowKey) < 0);
    }

    [Fact]
    public void Create_ForSameDate_SortsOlderIdentifierFirst()
    {
        var date = new DateOnly(2026, 7, 31);

        var olderRowKey = CalorieRowKey.Create(date, OlderIdentifier);
        var newerRowKey = CalorieRowKey.Create(date, NewerIdentifier);

        Assert.True(string.CompareOrdinal(olderRowKey, newerRowKey) < 0);
    }

    [Fact]
    public void Bounds_ContainEveryIdentifierForDate()
    {
        var date = new DateOnly(2026, 7, 31);
        var rowKey = CalorieRowKey.Create(date, OlderIdentifier);

        var lowerBound = CalorieRowKey.CreateLowerBound(date);
        var upperBound = CalorieRowKey.CreateUpperBound(date);

        Assert.True(string.CompareOrdinal(lowerBound, rowKey) <= 0);
        Assert.True(string.CompareOrdinal(rowKey, upperBound) <= 0);
    }

    [Theory]
    [InlineData("")]
    [InlineData("1234567")]
    [InlineData("1234567_invalid")]
    [InlineData("1234567-01982f80000070008000000000000001")]
    [InlineData("9999999_01982f80000070008000000000000001")]
    public void TryParse_WithInvalidValue_ReturnsFalse(string value)
    {
        var parsed = CalorieRowKey.TryParse(value, out _);

        Assert.False(parsed);
    }
}
