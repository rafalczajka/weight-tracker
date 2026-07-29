using Microsoft.AspNetCore.Builder;
using WeightTracker.Api.Cache;
using WeightTracker.Api.Extensions;

namespace WeightTracker.Api.Endpoints.Weights.Get;

internal sealed class WeightsGetEndpoint : Endpoint<WeightsGetRequest, IResult>
{
    public required CurrentUser CurrentUser { get; init; }

    public required IWeightService WeightService { get; init; }

    public override void Configure()
    {
        Get("api/weights");
        Options(builder => builder.CacheWeights());
        Description(builder => builder
            .WithName("GetWeights")
            .Produces<WeightsGetResponse>()
            .ProducesCommonProblems());
    }

    public override async Task<IResult> ExecuteAsync(WeightsGetRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(CurrentUser.Id))
            return Results.Unauthorized();

        var filter = request.ToFilter(CurrentUser.Id);
        var result = await WeightService.GetAsync(filter, ct);

        return result.Handle(data => Results.Ok(data.ToResponse()));
    }
}
