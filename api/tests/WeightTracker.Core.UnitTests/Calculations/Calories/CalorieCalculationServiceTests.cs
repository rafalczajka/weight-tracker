using WeightTracker.Core.Calculations.Calories;
using WeightTracker.Core.Errors;
using WeightTracker.Core.Users;
using WeightTracker.Core.Weights;
using static WeightTracker.Core.UnitTests.Calculations.CalculationServiceTestData;

namespace WeightTracker.Core.UnitTests.Calculations.Calories;

public sealed class CalorieCalculationServiceTests
{
    [Fact]
    public async Task Calculate_UsesCompleteProfileAndLatestWeight()
    {
        var profile = CreateProfile(
            heightCm: 180m,
            sex: Sex.Male,
            dateOfBirth: new DateOnly(1996, 8, 1),
            activityLevel: ActivityLevel.ModeratelyActive);
        var userService = new StubUserService { Profile = profile };
        var weightService = new StubWeightService
        {
            LatestWeight = new WeightData(UserId, Today, 80m)
        };
        var service = new CalorieCalculationService(
            CreateResolver(userService, weightService),
            CreateTimeProvider());

        var result = await service.CalculateAsync(
            UserId,
            new CalorieCalculationInput(null, null, null, null, null),
            TestContext.Current.CancellationToken);

        var expected = CalorieCalculator.Calculate(
            80m,
            180m,
            ageYears: 29,
            Sex.Male,
            ActivityLevel.ModeratelyActive);
        Assert.Equal(expected, GetValue(result));
    }

    [Fact]
    public async Task Calculate_WithNoStoredData_ReturnsAllMissingInputs()
    {
        var service = new CalorieCalculationService(
            CreateResolver(new StubUserService(), new StubWeightService()),
            CreateTimeProvider());

        var result = await service.CalculateAsync(
            UserId,
            new CalorieCalculationInput(null, null, null, null, null),
            TestContext.Current.CancellationToken);

        var validationError = Assert.IsType<ValidationError>(GetError(result));
        Assert.Equal(
            ["activityLevel", "ageYears", "heightCm", "sex", "weightKg"],
            validationError.Errors.Keys.Order());
    }
}
