using System.Globalization;
using WeightTracker.Core;

namespace WeightTracker.Data;

internal static class DateUtils
{
    private const string RowKeyFormat = "D7";
    private const int RowKeyLength = 7;

    public static string CreateRowKey(DateOnly date) =>
        (DateOnly.MaxValue.DayNumber - date.DayNumber)
        .ToString(RowKeyFormat, CultureInfo.InvariantCulture);

    public static bool TryParseRowKey(string? rowKey, out DateOnly date)
    {
        date = default;

        if (rowKey?.Length != RowKeyLength ||
            !int.TryParse(rowKey, NumberStyles.None, CultureInfo.InvariantCulture, out var invertedDayNumber) ||
            invertedDayNumber > DateOnly.MaxValue.DayNumber)
        {
            return false;
        }

        date = DateOnly.FromDayNumber(DateOnly.MaxValue.DayNumber - invertedDayNumber);
        return true;
    }

    public static string FormatDate(DateOnly date) => date.ToString(
        Constants.DateFormat,
        CultureInfo.InvariantCulture);

    public static DateOnly ParseDate(string value) => DateOnly.ParseExact(
        value,
        Constants.DateFormat,
        CultureInfo.InvariantCulture);

    public static bool TryParseDate(string? value, out DateOnly date) => DateOnly.TryParseExact(
        value,
        Constants.DateFormat,
        CultureInfo.InvariantCulture,
        DateTimeStyles.None,
        out date);
}
