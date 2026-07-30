using System.Globalization;

namespace WeightTracker.Api.Endpoints.Weights.GetByDate;

internal static class WeightsGetByDateMappings
{
    public static DateOnly ToDate(this WeightsGetByDateRequest request) =>
        DateOnly.Parse(request.Date, CultureInfo.InvariantCulture);

    public static WeightsEntryResponse ToResponse(this WeightData data) =>
        new(data.Date, data.WeightKg);
}
