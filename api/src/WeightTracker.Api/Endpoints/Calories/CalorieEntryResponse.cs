namespace WeightTracker.Api.Endpoints.Calories;

internal sealed record CalorieEntryResponse(
    string Id,
    int CaloriesKcal,
    string? Description);
