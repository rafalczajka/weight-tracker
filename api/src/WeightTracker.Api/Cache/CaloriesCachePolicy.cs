using Microsoft.AspNetCore.OutputCaching;

namespace WeightTracker.Api.Cache;

internal sealed class CaloriesCachePolicy : CustomCachePolicy
{
    private const string UserIdKey = "user-id";

    protected override void ConfigureCacheKey(OutputCacheContext context) =>
        context.CacheVaryByRules.VaryByValues[UserIdKey] = context.HttpContext.UserId!;

    protected override void AddCacheTags(OutputCacheContext context)
    {
        var userId = context.HttpContext.UserId;

        if (!string.IsNullOrWhiteSpace(userId))
            context.Tags.Add(CacheTags.Calories(userId));
    }
}
