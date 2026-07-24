using Microsoft.AspNetCore.Builder;
using WeightTracker.Api.Extensions;
using WeightTracker.Core.Calculations.Bmi;

namespace WeightTracker.Api.Endpoints.Calculations.Bmi;

internal sealed class BmiPostEndpoint : Endpoint<BmiPostRequest, BmiPostResponse>
{
    public override void Configure()
    {
        Post("api/calculations/bmi");
        Description(builder => builder
            .WithName("CalculateBmi")
            .Produces<BmiPostResponse>()
            .ProducesCommonProblems());
    }

    public override Task<BmiPostResponse> ExecuteAsync(BmiPostRequest request, CancellationToken ct)
    {
        var result = BmiCalculator.Calculate(request.WeightKg, request.HeightCm);
        return Task.FromResult(result.ToResponse());
    }
}
