using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.Extensions.DependencyInjection;

namespace WeightTracker.Api.Cache;

internal static class Extensions
{
    public static RouteHandlerBuilder SetCustomCache(this RouteHandlerBuilder builder) =>
        builder.CacheOutput(CustomCacheDefaults.PolicyName);

    public static ValueTask EvictByUidAsync(this IOutputCacheStore cache, string uid, CancellationToken ct) =>
        cache.EvictByTagAsync($"user:{uid}", ct);
}
