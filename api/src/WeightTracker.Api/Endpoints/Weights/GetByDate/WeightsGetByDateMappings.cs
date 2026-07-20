using System.Globalization;
using System.Linq;
using WeightTracker.Api.Handlers;

namespace WeightTracker.Api.Endpoints.Weights.GetByDate;

internal static class WeightsGetByDateMappings
{
    public static GetWeightData ToCommand(this WeightsGetByDateRequest request, string userId)
    {
        var date = DateOnly.Parse(request.Date, CultureInfo.InvariantCulture);
        return new GetWeightData(userId, date, date);
    }

    public static WeightsEntryResponse ToResponse(this WeightDataGroup data)
        => new(data.Data.First().Date.ToDomainDateString(), data.Data.First().Weight);
}
