using System.Globalization;
using System.Linq;

namespace WeightTracker.Api.Endpoints.Calories.Get;

internal static class CaloriesGetMappings
{
    public static CalorieDataFilter ToFilter(
        this CaloriesGetRequest request,
        string userId)
    {
        DateOnly? dateFrom = string.IsNullOrWhiteSpace(request.From)
            ? null
            : DateOnly.Parse(request.From, CultureInfo.InvariantCulture);

        DateOnly? dateTo = string.IsNullOrWhiteSpace(request.To)
            ? null
            : DateOnly.Parse(request.To, CultureInfo.InvariantCulture);

        return new CalorieDataFilter(
            userId,
            dateFrom,
            dateTo,
            request.LimitDays);
    }

    public static CaloriesGetResponse ToResponse(
        this CalorieDataGroup data) => new()
        {
            Data = data.Data.Select(day => day.ToResponse())
        };
}
