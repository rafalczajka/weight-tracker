using System.Globalization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.OutputCaching;
using WeightTracker.Api.Cache;
using WeightTracker.Api.Extensions;
using WeightTracker.Api.Handlers;

namespace WeightTracker.Api.Endpoints.Weights.Delete;

internal sealed class WeightsDeleteEndpoint : Endpoint<WeightsDeleteRequest, IResult>
{
    public required CurrentUser CurrentUser { get; init; }

    public required IOutputCacheStore Cache { get; init; }

    public override void Configure()
    {
        Delete("api/weights/{Date}");
        Description(builder => builder
            .WithName("DeleteWeightEntry")
            .Produces(StatusCodes.Status204NoContent)
            .ProducesWriteCommonProblems());
    }

    public override async Task<IResult> ExecuteAsync(WeightsDeleteRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(CurrentUser.Id))
            return Results.Unauthorized();

        var command = new RemoveWeightData(
            UserId: CurrentUser.Id,
            Date: DateOnly.Parse(request.Date, CultureInfo.InvariantCulture));
        var result = await command.ExecuteAsync(ct);

        await Cache.EvictByUidAsync(CurrentUser.Id, ct);
        return result.Match(Results.NoContent, ErrorsService.HandleError);
    }
}
