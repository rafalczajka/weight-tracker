using Microsoft.AspNetCore.Builder;
using WeightTracker.Api.Extensions;
using WeightTracker.Core.Calculations;
using WeightTracker.Core.Calculations.Protein;

namespace WeightTracker.Api.Endpoints.Calculations.Protein;

internal sealed class ProteinPostEndpoint : Endpoint<ProteinPostRequest, IResult>
{
    public required ICalculationService<ProteinCalculationInput, ProteinResult> CalculationService { get; init; }

    public required CurrentUser CurrentUser { get; init; }

    public override void Configure()
    {
        Post("api/calculations/protein");
        Description(builder => builder
            .WithName("CalculateProtein")
            .Produces<ProteinResult>()
            .ProducesCommonProblems());
    }

    public override async Task<IResult> ExecuteAsync(
        ProteinPostRequest request,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(CurrentUser.Id))
            return Results.Unauthorized();

        var result = await CalculationService.CalculateAsync(
            CurrentUser.Id,
            new ProteinCalculationInput(request.WeightKg, request.Goal),
            ct);

        return result.Handle(data => Results.Ok(data));
    }
}
