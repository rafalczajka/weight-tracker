namespace WeightTracker.Api.Endpoints.Calories;

internal sealed record CalorieEntryDetailsResponse(
    string Id,
    DateOnly Date,
    int CaloriesKcal,
    string? Description);
