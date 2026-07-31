using Microsoft.AspNetCore.Builder;
using WeightTracker.Api.Extensions;
using WeightTracker.Core.Calculations;
using WeightTracker.Core.Calculations.Bmi;

namespace WeightTracker.Api.Endpoints.Calculations.Bmi;

internal sealed class BmiPostEndpoint : Endpoint<BmiPostRequest, IResult>
{
    public required ICalculationService<BmiCalculationInput, BmiResult> CalculationService { get; init; }

    public required CurrentUser CurrentUser { get; init; }

    public override void Configure()
    {
        Post("api/calculations/bmi");
        Description(builder => builder
            .WithName("CalculateBmi")
            .Produces<BmiPostResponse>()
            .ProducesCommonProblems());
    }

    public override async Task<IResult> ExecuteAsync(
        BmiPostRequest request,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(CurrentUser.Id))
            return Results.Unauthorized();

        var result = await CalculationService.CalculateAsync(
            CurrentUser.Id,
            new BmiCalculationInput(request.WeightKg, request.HeightCm),
            ct);

        return result.Handle(data => Results.Ok(data.ToResponse()));
    }
}
