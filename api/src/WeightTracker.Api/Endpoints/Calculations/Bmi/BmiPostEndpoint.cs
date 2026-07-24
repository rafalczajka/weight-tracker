using Microsoft.AspNetCore.Builder;
using WeightTracker.Api.Extensions;
using WeightTracker.Core.Calculations;

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
        var bmi = BmiCalculator.Calculate(request.WeightKg, request.HeightCm);
        return Task.FromResult(new BmiPostResponse(bmi));
    }
}
