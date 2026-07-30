using Microsoft.AspNetCore.Builder;
using WeightTracker.Api.Cache;
using WeightTracker.Api.Extensions;

namespace WeightTracker.Api.Endpoints.Weights.GetLatest;

internal sealed class WeightsLatestGetEndpoint : EndpointWithoutRequest<IResult>
{
    public required CurrentUser CurrentUser { get; init; }

    public required IWeightService WeightService { get; init; }

    public override void Configure()
    {
        Get("api/weights/latest");
        Options(builder => builder.CacheWeights());
        Description(builder => builder
            .WithName("GetLatestWeightEntry")
            .Produces<WeightsEntryResponse>()
            .ProducesCommonProblems());
    }

    public override async Task<IResult> ExecuteAsync(CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(CurrentUser.Id))
            return Results.Unauthorized();

        var result = await WeightService.GetLatestAsync(CurrentUser.Id, ct);

        return result.Handle(data =>
            Results.Ok(new WeightsEntryResponse(data.Date, data.WeightKg)));
    }
}
