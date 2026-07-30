using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.OutputCaching;
using WeightTracker.Api.Cache;
using WeightTracker.Api.Extensions;

namespace WeightTracker.Api.Endpoints.Calories.Delete;

internal sealed class CaloriesDeleteEndpoint : Endpoint<CaloriesDeleteRequest, IResult>
{
    public required IOutputCacheStore Cache { get; init; }

    public required ICalorieService CalorieService { get; init; }

    public required CurrentUser CurrentUser { get; init; }

    public override void Configure()
    {
        Delete("api/calories/{Id}");
        Description(builder => builder
            .WithName("DeleteCalorieEntry")
            .Produces(StatusCodes.Status204NoContent)
            .ProducesWriteCommonProblems());
    }

    public override async Task<IResult> ExecuteAsync(
        CaloriesDeleteRequest request,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(CurrentUser.Id))
            return Results.Unauthorized();

        var result = await CalorieService.DeleteAsync(
            CurrentUser.Id,
            request.Id,
            ct);

        return await result.HandleAsync(async () =>
        {
            await Cache.EvictCaloriesAsync(CurrentUser.Id);
            return Results.NoContent();
        });
    }
}
