using Microsoft.AspNetCore.Builder;
using WeightTracker.Api.Extensions;
using WeightTracker.Core.Calculations.Protein;

namespace WeightTracker.Api.Endpoints.Calculations.Protein;

internal sealed class ProteinPostEndpoint : Endpoint<ProteinPostRequest, ProteinPostResponse>
{
    public override void Configure()
    {
        Post("api/calculations/protein");
        Description(builder => builder
            .WithName("CalculateProtein")
            .Produces<ProteinPostResponse>()
            .ProducesCommonProblems());
    }

    public override Task<ProteinPostResponse> ExecuteAsync(ProteinPostRequest request, CancellationToken ct)
    {
        var result = ProteinCalculator.Calculate(request.WeightKg, request.Goal);
        return Task.FromResult(result.ToResponse());
    }
}
