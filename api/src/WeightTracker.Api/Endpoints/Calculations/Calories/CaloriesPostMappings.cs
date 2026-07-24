using WeightTracker.Core.Calculations.Calories;

namespace WeightTracker.Api.Endpoints.Calculations.Calories;

internal static class CaloriesPostMappings
{
    public static CaloriesPostResponse ToResponse(this CalorieResult result) => new(
        result.RestingCaloriesPerDay,
        result.MaintenanceCaloriesPerDay);
}
