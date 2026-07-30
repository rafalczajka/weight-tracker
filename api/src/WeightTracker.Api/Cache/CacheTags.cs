namespace WeightTracker.Api.Cache;

internal static class CacheTags
{
    public static string Calories(string userId) => $"calories:user:{userId}";

    public static string Weights(string userId) => $"weights:user:{userId}";
}
