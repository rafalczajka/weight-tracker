namespace WeightTracker.Api.Endpoints.Calculations.Calories;

internal sealed record CaloriesPostResponse(
    int RestingCaloriesPerDay,
    int MaintenanceCaloriesPerDay);
