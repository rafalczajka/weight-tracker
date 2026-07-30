using System.Globalization;

namespace WeightTracker.Data.UnitTests;

public sealed class DateUtilsTests
{
    [Theory]
    [InlineData("0001-01-01")]
    [InlineData("2026-07-30")]
    [InlineData("9999-12-31")]
    public void RowKey_RoundTripsDate(string value)
    {
        var date = DateOnly.Parse(value, CultureInfo.InvariantCulture);

        var rowKey = DateUtils.CreateRowKey(date);
        var parsed = DateUtils.TryParseRowKey(rowKey, out var result);

        Assert.True(parsed);
        Assert.Equal(7, rowKey.Length);
        Assert.Equal(date, result);
    }

    [Fact]
    public void CreateRowKey_SortsNewerDateFirst()
    {
        var older = new DateOnly(2026, 7, 29);
        var newer = older.AddDays(1);

        var olderRowKey = DateUtils.CreateRowKey(older);
        var newerRowKey = DateUtils.CreateRowKey(newer);

        Assert.True(string.CompareOrdinal(newerRowKey, olderRowKey) < 0);
    }

    [Theory]
    [InlineData("")]
    [InlineData("123")]
    [InlineData("abcdefg")]
    [InlineData("9999999")]
    public void TryParseRowKey_WithInvalidValue_ReturnsFalse(string value)
    {
        var parsed = DateUtils.TryParseRowKey(value, out _);

        Assert.False(parsed);
    }

    [Fact]
    public void Date_RoundTripsExpectedFormat()
    {
        var date = new DateOnly(2026, 7, 30);

        var value = DateUtils.FormatDate(date);
        var result = DateOnly.Parse(value, CultureInfo.InvariantCulture);

        Assert.Equal("2026-07-30", value);
        Assert.Equal(date, result);
    }
}
