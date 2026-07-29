namespace WeightTracker.Api.Cache;

internal static class CacheTags
{
    public static string Weights(string userId) => $"weights:user:{userId}";
}
