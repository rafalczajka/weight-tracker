using Microsoft.AspNetCore.Builder;
using WeightTracker.Api.Extensions;
using WeightTracker.Core.Calculations.Calories;

namespace WeightTracker.Api.Endpoints.Calculations.Calories;

internal sealed class CaloriesPostEndpoint : Endpoint<CaloriesPostRequest, CalorieResult>
{
    public override void Configure()
    {
        Post("api/calculations/calories");
        Description(builder => builder
            .WithName("CalculateCalories")
            .Produces<CalorieResult>()
            .ProducesCommonProblems());
    }

    public override Task<CalorieResult> ExecuteAsync(
        CaloriesPostRequest request,
        CancellationToken ct)
    {
        var result = CalorieCalculator.Calculate(
            request.WeightKg,
            request.HeightCm,
            request.AgeYears,
            request.Sex,
            request.ActivityLevel);

        return Task.FromResult(result);
    }
}
