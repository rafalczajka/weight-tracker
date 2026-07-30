namespace WeightTracker.Api.Cache;

internal static class CachePolicies
{
    public const string Calories = "Calories";
    public const string Weights = "Weights";
    public const string Food = "Food";

    public static readonly TimeSpan CaloriesDuration = TimeSpan.FromHours(1);
    public static readonly TimeSpan WeightsDuration = TimeSpan.FromHours(1);
    public static readonly TimeSpan FoodDuration = TimeSpan.FromDays(1);
}
