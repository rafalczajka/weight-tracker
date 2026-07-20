using System.Globalization;

namespace WeightTracker.Core;

public static class Extensions
{
    private const string DateFormat = "yyyy-MM-dd";

    public static string ToDomainDateString(this DateOnly date) =>
        date.ToString(DateFormat, CultureInfo.InvariantCulture);

    public static bool IsValidDomainDateFormat(this string date) =>
        !string.IsNullOrEmpty(date) && DateOnly.TryParseExact(date, DateFormat, out _);
}
