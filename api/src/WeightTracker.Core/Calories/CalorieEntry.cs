namespace WeightTracker.Core.Calories;

public sealed record CalorieEntry(
    string Id,
    string UserId,
    DateOnly Date,
    int CaloriesKcal,
    string? Description);
