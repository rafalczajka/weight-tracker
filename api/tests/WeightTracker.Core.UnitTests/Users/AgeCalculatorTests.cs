using System.Globalization;
using WeightTracker.Core.Users;

namespace WeightTracker.Core.UnitTests.Users;

public sealed class AgeCalculatorTests
{
    [Theory]
    [InlineData("2000-08-01", "2026-07-31", 25)]
    [InlineData("2000-07-31", "2026-07-31", 26)]
    [InlineData("2000-07-30", "2026-07-31", 26)]
    [InlineData("2000-02-29", "2026-02-28", 26)]
    public void Calculate_ReturnsAgeOnDate(
        string dateOfBirthValue,
        string dateValue,
        int expected)
    {
        var dateOfBirth = DateOnly.Parse(dateOfBirthValue, CultureInfo.InvariantCulture);
        var date = DateOnly.Parse(dateValue, CultureInfo.InvariantCulture);

        var result = AgeCalculator.Calculate(dateOfBirth, date);

        Assert.Equal(expected, result);
    }

    [Theory]
    [InlineData("2008-07-31", "2026-07-31", true)]
    [InlineData("2008-08-01", "2026-07-31", false)]
    [InlineData("1906-07-31", "2026-07-31", true)]
    [InlineData("1905-07-31", "2026-07-31", false)]
    public void IsAdultAgeSupported_ValidatesSupportedRange(
        string dateOfBirthValue,
        string dateValue,
        bool expected)
    {
        var dateOfBirth = DateOnly.Parse(dateOfBirthValue, CultureInfo.InvariantCulture);
        var date = DateOnly.Parse(dateValue, CultureInfo.InvariantCulture);

        var result = AgeCalculator.IsAdultAgeSupported(dateOfBirth, date);

        Assert.Equal(expected, result);
    }
}
