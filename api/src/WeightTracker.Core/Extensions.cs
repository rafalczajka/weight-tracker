using System.Globalization;

namespace WeightTracker.Core;

public static class Extensions
{
    public static string ToDomainDateString(this DateOnly date) =>
        date.ToString(Constants.DateFormat, CultureInfo.InvariantCulture);

    public static bool IsValidDomainDateFormat(this string date) =>
        !string.IsNullOrEmpty(date) && DateOnly.TryParseExact(date, Constants.DateFormat, out _);
}
