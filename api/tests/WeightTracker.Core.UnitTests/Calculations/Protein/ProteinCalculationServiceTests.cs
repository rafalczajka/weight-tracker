using WeightTracker.Core.Calculations.Protein;
using WeightTracker.Core.Users;
using WeightTracker.Core.Weights;
using static WeightTracker.Core.UnitTests.Calculations.CalculationServiceTestData;

namespace WeightTracker.Core.UnitTests.Calculations.Protein;

public sealed class ProteinCalculationServiceTests
{
    [Fact]
    public async Task Calculate_UsesProfileGoalAndLatestWeight()
    {
        var userService = new StubUserService
        {
            Profile = CreateProfile(proteinGoal: ProteinGoal.MuscleGain)
        };
        var weightService = new StubWeightService
        {
            LatestWeight = new WeightData(UserId, Today, 80m)
        };
        var service = new ProteinCalculationService(
            CreateResolver(userService, weightService));

        var result = await service.CalculateAsync(
            UserId,
            new ProteinCalculationInput(null, null),
            TestContext.Current.CancellationToken);

        Assert.Equal(
            ProteinCalculator.Calculate(80m, ProteinGoal.MuscleGain),
            GetValue(result));
    }
}
