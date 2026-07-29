using System;
using Microsoft.Extensions.DependencyInjection;
using WeightTracker.Core.Food;
using WeightTracker.FoodData.ApiClient;

namespace WeightTracker.FoodData;

public static class DependencyInjection
{
    private static readonly Uri BaseAddress = new("https://world.openfoodfacts.org/api/v3.6/");
    private static readonly TimeSpan RequestTimeout = TimeSpan.FromSeconds(10);
    private const string UserAgent = "WeightTracker/1.0 (contact@rczajka.me)";

    public static IServiceCollection AddFoodData(this IServiceCollection services)
    {
        services.AddHttpClient<IFoodService, OpenFoodFactsService>(client =>
        {
            client.BaseAddress = BaseAddress;
            client.Timeout = RequestTimeout;
            client.DefaultRequestHeaders.UserAgent.ParseAdd(UserAgent);
            client.DefaultRequestHeaders.Accept.ParseAdd("application/json");
        });

        return services;
    }
}
