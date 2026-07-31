using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using WeightTracker.Core.Calculations;
using WeightTracker.Core.Calculations.Bmi;
using WeightTracker.Core.Calculations.Calories;
using WeightTracker.Core.Calculations.Protein;

namespace WeightTracker.Core;

public static class DependencyInjection
{
    public static IServiceCollection AddCore(this IServiceCollection services)
    {
        services.TryAddSingleton(TimeProvider.System);

        services.AddSingleton<CalculationContextResolver>();
        services.AddSingleton<ICalculationService<BmiCalculationInput, BmiResult>, BmiCalculationService>();
        services.AddSingleton<ICalculationService<CalorieCalculationInput, CalorieResult>, CalorieCalculationService>();
        services.AddSingleton<ICalculationService<ProteinCalculationInput, ProteinResult>, ProteinCalculationService>();

        return services;
    }
}
