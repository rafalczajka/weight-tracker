using Microsoft.AspNetCore.Builder;
using WeightTracker.Api.Cache;
using WeightTracker.Api.Extensions;
using WeightTracker.Api.Handlers;

namespace WeightTracker.Api.Endpoints.Weights.GetSummary;

internal sealed class WeightsSummaryGetEndpoint : EndpointWithoutRequest<IResult>
{
    public required CurrentUser CurrentUser { get; init; }

    public override void Configure()
    {
        Get("api/weights/summary");
        Options(builder => builder.SetCustomCache());
        Description(builder => builder
            .WithName("GetWeightsSummary")
            .Produces<WeightsSummaryGetResponse>()
            .ProducesCommonProblems());
    }

    public override async Task<IResult> ExecuteAsync(CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(CurrentUser.Id))
            return Results.Unauthorized();

        var command = new GetWeightsSummary(CurrentUser.Id);
        var result = await command.ExecuteAsync(ct);

        return result.Match(d => Results.Ok(d.ToResponse()), ErrorsService.HandleError);
    }
}
