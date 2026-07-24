using WeightTracker.Core;

namespace WeightTracker.Core.UnitTests;

public sealed class ExtensionsTests
{
    public static TheoryData<string?, bool> DomainDateCases => new()
    {
        { "2024-02-29", true },
        { "0001-01-01", true },
        { "9999-12-31", true },
        { null, false },
        { string.Empty, false },
        { " ", false },
        { "2023-02-29", false },
        { "2024-2-29", false },
        { "29-02-2024", false },
        { "2024-13-01", false },
        { "2024-01-32", false },
        { "2024-02-29T00:00:00", false }
    };

    [Fact]
    public void ToDomainDateString_ReturnsInvariantIsoDate()
    {
        var result = new DateOnly(2024, 2, 29).ToDomainDateString();

        Assert.Equal("2024-02-29", result);
    }

    [Theory]
    [MemberData(nameof(DomainDateCases))]
    public void IsValidDomainDateFormat_ReturnsExpectedResult(string? date, bool expected)
    {
        var result = date!.IsValidDomainDateFormat();

        Assert.Equal(expected, result);
    }
}
