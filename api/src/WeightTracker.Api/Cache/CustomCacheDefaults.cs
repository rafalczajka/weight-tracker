namespace WeightTracker.Api.Cache;

internal static class CustomCacheDefaults
{
    public const int DurationInMinutes = 60;

    public static readonly string PolicyName = $"PerUser{DurationInMinutes}";
}
