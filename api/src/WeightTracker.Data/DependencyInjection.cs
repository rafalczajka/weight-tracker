using Microsoft.Extensions.Azure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using WeightTracker.Data.Calories;
using WeightTracker.Data.Weights;

namespace WeightTracker.Data;

public static class DependencyInjection
{
    public static IServiceCollection AddData(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddAzureClients(clientBuilder =>
        {
            clientBuilder.AddTableServiceClient(configuration["AzureWebJobsStorage"]);
        });

        services.AddHostedService<StartupCheck>();
        services.AddSingleton<ICalorieService, CalorieService>();
        services.AddSingleton<IWeightService, WeightService>();

        return services;
    }
}
