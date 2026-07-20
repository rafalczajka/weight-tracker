using System.Globalization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.OutputCaching;
using WeightTracker.Api.Cache;
using WeightTracker.Api.Extensions;
using WeightTracker.Api.Handlers;

namespace WeightTracker.Api.Endpoints.Weights.Post;

internal sealed class WeightsPostEndpoint : Endpoint<WeightsPostRequest, IResult>
{
    public required CurrentUser CurrentUser { get; init; }

    public required IOutputCacheStore Cache { get; init; }

    public override void Configure()
    {
        Post("api/weights");
        Description(builder => builder
            .WithName("CreateWeightEntry")
            .Produces<WeightsEntryResponse>(StatusCodes.Status201Created)
            .ProducesWriteCommonProblems());
    }

    public override async Task<IResult> ExecuteAsync(WeightsPostRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(CurrentUser.Id))
            return Results.Unauthorized();

        var (weight, date) = request;
        var effectiveDate = GetDate(date);
        var command = new AddWeightData(CurrentUser.Id, effectiveDate, weight);
        var result = await command.ExecuteAsync(ct);

        await Cache.EvictByUidAsync(CurrentUser.Id, ct);

        var response = new WeightsEntryResponse(effectiveDate.ToDomainDateString(), weight);
        var location = $"/api/weights/{response.Date}";

        return result.Match(() => Results.Created(location, response), ErrorsService.HandleError);
    }

    private static DateOnly GetDate(string? date)
    {
        return string.IsNullOrWhiteSpace(date)
            ? DateOnly.FromDateTime(DateTime.UtcNow)
            : DateOnly.Parse(date, CultureInfo.InvariantCulture);
    }
}
