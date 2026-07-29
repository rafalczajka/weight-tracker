using System.Globalization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.OutputCaching;
using WeightTracker.Api.Cache;
using WeightTracker.Api.Extensions;

namespace WeightTracker.Api.Endpoints.Weights.Post;

internal sealed class WeightsPostEndpoint : Endpoint<WeightsPostRequest, IResult>
{
    public required CurrentUser CurrentUser { get; init; }

    public required IOutputCacheStore Cache { get; init; }

    public required IWeightService WeightService { get; init; }

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

        var (weightKg, date) = request;
        var effectiveDate = GetDate(date);
        var data = new WeightData(CurrentUser.Id, effectiveDate, weightKg);
        var result = await WeightService.AddAsync(data, ct);

        return await result.HandleAsync(async () =>
        {
            await Cache.EvictWeightsAsync(CurrentUser.Id);
            var response = new WeightsEntryResponse(
                effectiveDate.ToDomainDateString(),
                weightKg);
            var location = $"/api/weights/{response.Date}";

            return Results.Created(location, response);
        });
    }

    private static DateOnly GetDate(string? date)
    {
        return string.IsNullOrWhiteSpace(date)
            ? DateOnly.FromDateTime(DateTime.UtcNow)
            : DateOnly.Parse(date, CultureInfo.InvariantCulture);
    }
}
