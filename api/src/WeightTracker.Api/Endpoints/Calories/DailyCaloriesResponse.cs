namespace WeightTracker.Api.Endpoints.Calories;

internal sealed record DailyCaloriesResponse(
    DateOnly Date,
    long TotalCaloriesKcal,
    IEnumerable<CalorieEntryResponse> Entries);
