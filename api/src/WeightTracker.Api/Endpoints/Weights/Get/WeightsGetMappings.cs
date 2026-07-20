using System.Globalization;
using System.Linq;
using WeightTracker.Api.Handlers;

namespace WeightTracker.Api.Endpoints.Weights.Get;

internal static class WeightsGetMappings
{
    public static GetWeightData ToCommand(this WeightsGetRequest request, string userId)
    {
        var (from, to) = request;

        var dateFrom = string.IsNullOrWhiteSpace(from)
            ? DateOnly.MinValue
            : DateOnly.Parse(from, CultureInfo.InvariantCulture);

        var dateTo = string.IsNullOrWhiteSpace(to)
            ? DateOnly.MaxValue
            : DateOnly.Parse(to, CultureInfo.InvariantCulture);

        return new GetWeightData(userId, dateFrom, dateTo);
    }

    public static WeightsGetResponse ToResponse(this WeightDataGroup data) => new()
    {
        Stats = data.Data.Any()
            ? new StatsResponse(Avg: data.Stats.AverageWeight, Max: data.Stats.MaxWeight, Min: data.Stats.MinWeight)
            : new StatsResponse(0, 0, 0),
        Data = data.Data.Select(d => new WeightsEntryResponse(d.Date.ToDomainDateString(), d.Weight))
    };
}
