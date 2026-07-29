using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.OutputCaching;
using Microsoft.Extensions.DependencyInjection;

namespace WeightTracker.Api.Cache;

internal static class Extensions
{
    extension(RouteHandlerBuilder builder)
    {
        public RouteHandlerBuilder CacheWeights() => builder.CacheOutput(CachePolicies.Weights);

        public RouteHandlerBuilder CacheFood() => builder.CacheOutput(CachePolicies.Food);
    }

    public static ValueTask EvictWeightsAsync(this IOutputCacheStore cache, string userId) =>
        cache.EvictByTagAsync(CacheTags.Weights(userId), CancellationToken.None);
}
