using System.Globalization;
using WeightTracker.Core.Models;

namespace WeightTracker.Core.UnitTests;

internal static class Helpers
{
    public static CultureInfo DefaultCultureInfo => CultureInfo.InvariantCulture;

    public static IList<WeightData> GenerateWeightData(
        string userId,
        decimal weight,
        string dateFrom,
        string dateTo,
        params IEnumerable<string> excludedDates)
    {
        var from = DateTime.Parse(dateFrom, DefaultCultureInfo);
        var to = DateTime.Parse(dateTo, DefaultCultureInfo);

        var dateRange = Enumerable.Range(0, 1 + to.Subtract(from).Days)
            .Select(offset => from.AddDays(offset))
            .ToList();

        foreach (var excludedDate in excludedDates)
        {
            var date = DateTime.Parse(excludedDate, DefaultCultureInfo);
            dateRange.Remove(date);
        }

        return [.. dateRange.Select(d => new WeightData(userId, DateOnly.FromDateTime(d), weight))];
    }
}
