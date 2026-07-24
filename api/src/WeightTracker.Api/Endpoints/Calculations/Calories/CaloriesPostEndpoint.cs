using Microsoft.AspNetCore.Builder;
using WeightTracker.Api.Extensions;
using WeightTracker.Core.Calculations.Calories;

namespace WeightTracker.Api.Endpoints.Calculations.Calories;

internal sealed class CaloriesPostEndpoint : Endpoint<CaloriesPostRequest, CaloriesPostResponse>
{
    public override void Configure()
    {
        Post("api/calculations/calories");
        Description(builder => builder
            .WithName("CalculateCalories")
            .Produces<CaloriesPostResponse>()
            .ProducesCommonProblems());
    }

    public override Task<CaloriesPostResponse> ExecuteAsync(CaloriesPostRequest request, CancellationToken ct)
    {
        var result = CalorieCalculator.Calculate(
            request.WeightKg,
            request.HeightCm,
            request.AgeYears,
            request.Sex,
            request.ActivityLevel);

        return Task.FromResult(result.ToResponse());
    }
}
