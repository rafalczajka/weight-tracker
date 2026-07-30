using System.Globalization;
using System.Linq;

namespace WeightTracker.Api.Endpoints.Weights.Get;

internal static class WeightsGetMappings
{
    public static WeightDataFilter ToFilter(this WeightsGetRequest request, string userId)
    {
        var (from, to, limit) = request;

        var dateFrom = string.IsNullOrWhiteSpace(from)
            ? DateOnly.MinValue
            : DateOnly.Parse(from, CultureInfo.InvariantCulture);

        var dateTo = string.IsNullOrWhiteSpace(to)
            ? DateOnly.MaxValue
            : DateOnly.Parse(to, CultureInfo.InvariantCulture);

        return new WeightDataFilter(userId, dateFrom, dateTo, limit);
    }

    public static WeightsGetResponse ToResponse(this WeightDataGroup data) => new()
    {
        Stats = data.Stats,
        Data = data.Data.Select(d => new WeightsEntryResponse(d.Date, d.WeightKg))
    };
}
