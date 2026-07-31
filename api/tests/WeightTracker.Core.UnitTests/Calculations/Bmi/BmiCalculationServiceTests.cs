using WeightTracker.Core.Calculations.Bmi;
using WeightTracker.Core.Errors;
using WeightTracker.Core.Weights;
using static WeightTracker.Core.UnitTests.Calculations.CalculationServiceTestData;

namespace WeightTracker.Core.UnitTests.Calculations.Bmi;

public sealed class BmiCalculationServiceTests
{
    [Fact]
    public async Task Calculate_WithCompleteInput_DoesNotReadStoredData()
    {
        var userService = new StubUserService();
        var weightService = new StubWeightService();
        var service = new BmiCalculationService(CreateResolver(userService, weightService));

        var result = await service.CalculateAsync(
            UserId,
            new BmiCalculationInput(80m, 180m),
            TestContext.Current.CancellationToken);

        Assert.Equal(BmiCalculator.Calculate(80m, 180m), GetValue(result));
        Assert.Equal(0, userService.GetCallCount);
        Assert.Equal(0, weightService.GetLatestCallCount);
    }

    [Fact]
    public async Task Calculate_WithMissingInput_UsesProfileAndLatestWeight()
    {
        var userService = new StubUserService
        {
            Profile = CreateProfile(heightCm: 180m)
        };
        var weightService = new StubWeightService
        {
            LatestWeight = new WeightData(UserId, Today, 80m)
        };
        var service = new BmiCalculationService(CreateResolver(userService, weightService));

        var result = await service.CalculateAsync(
            UserId,
            new BmiCalculationInput(null, null),
            TestContext.Current.CancellationToken);

        Assert.Equal(BmiCalculator.Calculate(80m, 180m), GetValue(result));
        Assert.Equal(1, userService.GetCallCount);
        Assert.Equal(1, weightService.GetLatestCallCount);
    }

    [Fact]
    public async Task Calculate_RequestValuesTakePrecedenceOverStoredData()
    {
        var userService = new StubUserService
        {
            Profile = CreateProfile(heightCm: 160m)
        };
        var weightService = new StubWeightService
        {
            LatestWeight = new WeightData(UserId, Today, 60m)
        };
        var service = new BmiCalculationService(CreateResolver(userService, weightService));

        var result = await service.CalculateAsync(
            UserId,
            new BmiCalculationInput(80m, 180m),
            TestContext.Current.CancellationToken);

        Assert.Equal(BmiCalculator.Calculate(80m, 180m), GetValue(result));
        Assert.Equal(0, userService.GetCallCount);
        Assert.Equal(0, weightService.GetLatestCallCount);
    }

    [Fact]
    public async Task Calculate_WithoutLatestWeight_ReturnsWeightAsMissing()
    {
        var userService = new StubUserService
        {
            Profile = CreateProfile(heightCm: 180m)
        };
        var service = new BmiCalculationService(
            CreateResolver(userService, new StubWeightService()));

        var result = await service.CalculateAsync(
            UserId,
            new BmiCalculationInput(null, null),
            TestContext.Current.CancellationToken);

        var validationError = Assert.IsType<ValidationError>(GetError(result));
        Assert.Equal(["weightKg"], validationError.Errors.Keys);
    }
}
