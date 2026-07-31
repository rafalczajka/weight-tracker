using Microsoft.Extensions.DependencyInjection;
using WeightTracker.Core.Calculations;
using WeightTracker.Core.Calculations.Bmi;
using WeightTracker.Core.Calculations.Calories;
using WeightTracker.Core.Calculations.Protein;

namespace WeightTracker.Core.UnitTests;

public sealed class DependencyInjectionTests
{
    [Fact]
    public void AddCore_RegistersCalculationServices()
    {
        var services = new ServiceCollection();

        services.AddCore();

        AssertSingleton<
            ICalculationService<BmiCalculationInput, BmiResult>,
            BmiCalculationService>(services);
        AssertSingleton<
            ICalculationService<CalorieCalculationInput, CalorieResult>,
            CalorieCalculationService>(services);
        AssertSingleton<
            ICalculationService<ProteinCalculationInput, ProteinResult>,
            ProteinCalculationService>(services);
        AssertSingleton<CalculationContextResolver, CalculationContextResolver>(services);

        var timeProvider = Assert.Single(
            services,
            descriptor => descriptor.ServiceType == typeof(TimeProvider));
        Assert.Equal(ServiceLifetime.Singleton, timeProvider.Lifetime);
        Assert.Same(TimeProvider.System, timeProvider.ImplementationInstance);
    }

    private static void AssertSingleton<TService, TImplementation>(
        IServiceCollection services)
    {
        var descriptor = Assert.Single(
            services,
            candidate => candidate.ServiceType == typeof(TService));

        Assert.Equal(ServiceLifetime.Singleton, descriptor.Lifetime);
        Assert.Equal(typeof(TImplementation), descriptor.ImplementationType);
    }
}
