namespace WeightTracker.Core.Calories;

public sealed record CalorieDataFilter(
    string UserId,
    DateOnly? DateFrom = null,
    DateOnly? DateTo = null,
    int? LimitDays = null);
