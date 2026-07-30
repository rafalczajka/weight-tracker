using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.OutputCaching;
using WeightTracker.Api.Cache;
using WeightTracker.Api.Extensions;

namespace WeightTracker.Api.Endpoints.Calories.Put;

internal sealed class CaloriesPutEndpoint : Endpoint<CaloriesPutRequest, IResult>
{
    public required IOutputCacheStore Cache { get; init; }

    public required ICalorieService CalorieService { get; init; }

    public required CurrentUser CurrentUser { get; init; }

    public override void Configure()
    {
        Put("api/calories/{Id}");
        Description(builder => builder
            .WithName("UpdateCalorieEntry")
            .Produces<CalorieEntryDetailsResponse>()
            .ProducesWriteCommonProblems());
    }

    public override async Task<IResult> ExecuteAsync(
        CaloriesPutRequest request,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(CurrentUser.Id))
            return Results.Unauthorized();

        var description = CalorieMappings.NormalizeDescription(request.Description);
        var result = await CalorieService.UpdateAsync(
            CurrentUser.Id,
            request.Id,
            request.CaloriesKcal,
            description,
            ct);

        return await result.HandleAsync(async entry =>
        {
            await Cache.EvictCaloriesAsync(CurrentUser.Id);
            return Results.Ok(entry.ToDetailsResponse());
        });
    }
}
