using Microsoft.AspNetCore.Builder;
using WeightTracker.Api.Extensions;
using WeightTracker.Core.Calculations;
using WeightTracker.Core.Calculations.Calories;

namespace WeightTracker.Api.Endpoints.Calculations.Calories;

internal sealed class CaloriesPostEndpoint : Endpoint<CaloriesPostRequest, IResult>
{
    public required ICalculationService<CalorieCalculationInput, CalorieResult> CalculationService { get; init; }

    public required CurrentUser CurrentUser { get; init; }

    public override void Configure()
    {
        Post("api/calculations/calories");
        Description(builder => builder
            .WithName("CalculateCalories")
            .Produces<CalorieResult>()
            .ProducesCommonProblems());
    }

    public override async Task<IResult> ExecuteAsync(
        CaloriesPostRequest request,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(CurrentUser.Id))
            return Results.Unauthorized();

        var result = await CalculationService.CalculateAsync(
            CurrentUser.Id,
            new CalorieCalculationInput(
                request.WeightKg,
                request.HeightCm,
                request.AgeYears,
                request.Sex,
                request.ActivityLevel),
            ct);

        return result.Handle(data => Results.Ok(data));
    }
}
