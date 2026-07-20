using Microsoft.Extensions.DependencyInjection;

namespace WeightTracker.Api.Cache;

internal static class ServicesRegistration
{
    public static IServiceCollection AddCustomOutputCache(this IServiceCollection services) =>
        services.AddOutputCache(options =>
        {
            options.AddPolicy(CustomCacheDefaults.PolicyName, policyBuilder => policyBuilder
                .AddPolicy<CustomCachePolicy>()
                .Expire(TimeSpan.FromMinutes(CustomCacheDefaults.DurationInMinutes)), true);
        });
}
