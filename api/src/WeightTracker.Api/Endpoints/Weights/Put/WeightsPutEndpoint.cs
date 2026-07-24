using System.Globalization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.OutputCaching;
using WeightTracker.Api.Cache;
using WeightTracker.Api.Extensions;

namespace WeightTracker.Api.Endpoints.Weights.Put;

internal sealed class WeightsPutEndpoint : Endpoint<WeightsPutRequest, IResult>
{
    public required CurrentUser CurrentUser { get; init; }

    public required IOutputCacheStore Cache { get; init; }

    public override void Configure()
    {
        Put("api/weights/{Date}");
        Description(builder => builder
            .WithName("UpdateWeightEntry")
            .Produces<WeightsEntryResponse>(StatusCodes.Status200OK)
            .ProducesWriteCommonProblems());
    }

    public override async Task<IResult> ExecuteAsync(WeightsPutRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(CurrentUser.Id))
            return Results.Unauthorized();

        var (date, weightKg) = request;
        var parsedDate = DateOnly.Parse(date, CultureInfo.InvariantCulture);
        var command = new UpdateWeightData(
            UserId: CurrentUser.Id,
            Date: parsedDate,
            WeightKg: weightKg);
        var result = await command.ExecuteAsync(ct);

        await Cache.EvictByUidAsync(CurrentUser.Id, ct);

        var response = new WeightsEntryResponse(parsedDate.ToDomainDateString(), weightKg);
        return result.Match(() => Results.Ok(response), ErrorsService.HandleError);
    }
}
