using Microsoft.Extensions.DependencyInjection;

namespace WeightTracker.Api.Cache;

internal static class DependencyInjection
{
    public static IServiceCollection AddApiOutputCache(this IServiceCollection services) =>
        services.AddOutputCache(options =>
        {
            options.AddPolicy(CachePolicies.Calories, builder => builder
                .AddPolicy<CaloriesCachePolicy>()
                .Expire(CachePolicies.CaloriesDuration), true);

            options.AddPolicy(CachePolicies.Weights, builder => builder
                .AddPolicy<WeightsCachePolicy>()
                .Expire(CachePolicies.WeightsDuration), true);

            options.AddPolicy(CachePolicies.Food, builder => builder
                .AddPolicy<CustomCachePolicy>()
                .Expire(CachePolicies.FoodDuration), true);
        });
}
