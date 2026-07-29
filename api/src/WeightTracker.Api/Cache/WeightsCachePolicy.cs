using System.Globalization;
using Microsoft.AspNetCore.OutputCaching;

namespace WeightTracker.Api.Cache;

internal sealed class WeightsCachePolicy : CustomCachePolicy
{
    private const string UtcDateKey = "utc-date";
    private const string UserIdKey = "user-id";

    protected override void ConfigureCacheKey(OutputCacheContext context)
    {
        var userId = context.HttpContext.UserId!;
        var utcDate = DateTime.UtcNow.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);

        context.CacheVaryByRules.VaryByValues[UtcDateKey] = utcDate;
        context.CacheVaryByRules.VaryByValues[UserIdKey] = userId;
    }

    protected override void AddCacheTags(OutputCacheContext context)
    {
        var userId = context.HttpContext.UserId;

        if (!string.IsNullOrWhiteSpace(userId))
            context.Tags.Add(CacheTags.Weights(userId));
    }
}
