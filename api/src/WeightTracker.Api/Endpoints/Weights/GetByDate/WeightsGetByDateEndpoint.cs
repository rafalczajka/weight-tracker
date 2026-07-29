using System.Linq;
using Microsoft.AspNetCore.Builder;
using WeightTracker.Api.Cache;
using WeightTracker.Api.Extensions;

namespace WeightTracker.Api.Endpoints.Weights.GetByDate;

internal sealed class WeightsGetByDateEndpoint : Endpoint<WeightsGetByDateRequest, IResult>
{
    public required CurrentUser CurrentUser { get; init; }

    public required IWeightService WeightService { get; init; }

    public override void Configure()
    {
        Get("api/weights/{Date}");
        Options(builder => builder.CacheWeights());
        Description(builder => builder
            .WithName("GetWeightEntry")
            .Produces<WeightsEntryResponse>()
            .ProducesCommonProblems());
    }

    public override async Task<IResult> ExecuteAsync(WeightsGetByDateRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(CurrentUser.Id))
            return Results.Unauthorized();

        var filter = request.ToFilter(CurrentUser.Id);
        var result = await WeightService.GetAsync(filter, ct);

        return result.Handle(
            data => data.Data.Any()
                ? Results.Ok(data.ToResponse())
                : Results.NotFound());
    }
}
