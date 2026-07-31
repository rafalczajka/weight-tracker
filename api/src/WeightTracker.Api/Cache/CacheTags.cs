namespace WeightTracker.Api.Cache;

internal static class CacheTags
{
    public static string Calories(string userId) => $"calories:user:{userId}";

    public static string UserProfile(string userId) => $"user-profile:user:{userId}";

    public static string Weights(string userId) => $"weights:user:{userId}";
}
