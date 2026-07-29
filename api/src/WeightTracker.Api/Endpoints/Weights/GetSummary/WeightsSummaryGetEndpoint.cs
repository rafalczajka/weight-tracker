using Microsoft.AspNetCore.Builder;
using WeightTracker.Api.Cache;
using WeightTracker.Api.Extensions;
using WeightSummary = WeightTracker.Core.Weights.Summary;

namespace WeightTracker.Api.Endpoints.Weights.GetSummary;

internal sealed class WeightsSummaryGetEndpoint : EndpointWithoutRequest<IResult>
{
    public required CurrentUser CurrentUser { get; init; }

    public required IWeightService WeightService { get; init; }

    public override void Configure()
    {
        Get("api/weights/summary");
        Options(builder => builder.CacheWeights());
        Description(builder => builder
            .WithName("GetWeightsSummary")
            .Produces<WeightsSummaryGetResponse>()
            .ProducesCommonProblems());
    }

    public override async Task<IResult> ExecuteAsync(CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(CurrentUser.Id))
            return Results.Unauthorized();

        var filter = new WeightDataFilter(CurrentUser.Id);
        var result = await WeightService.GetAsync(filter, ct);

        return result.Handle(data =>
        {
            var summary = WeightSummary.Create([.. data.Data]);
            return Results.Ok(summary.ToResponse());
        });
    }
}
