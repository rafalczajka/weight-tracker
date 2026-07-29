using System.Globalization;
using System.Linq;

namespace WeightTracker.Api.Endpoints.Weights.GetByDate;

internal static class WeightsGetByDateMappings
{
    public static WeightDataFilter ToFilter(this WeightsGetByDateRequest request, string userId)
    {
        var date = DateOnly.Parse(request.Date, CultureInfo.InvariantCulture);
        return new WeightDataFilter(userId, date, date);
    }

    public static WeightsEntryResponse ToResponse(this WeightDataGroup data)
        => new(data.Data.First().Date, data.Data.First().WeightKg);
}
