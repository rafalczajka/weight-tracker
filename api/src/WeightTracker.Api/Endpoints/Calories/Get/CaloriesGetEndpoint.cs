using Microsoft.AspNetCore.Builder;
using WeightTracker.Api.Cache;
using WeightTracker.Api.Extensions;

namespace WeightTracker.Api.Endpoints.Calories.Get;

internal sealed class CaloriesGetEndpoint : Endpoint<CaloriesGetRequest, IResult>
{
    public required ICalorieService CalorieService { get; init; }

    public required CurrentUser CurrentUser { get; init; }

    public override void Configure()
    {
        Get("api/calories");
        Options(builder => builder.CacheCalories());
        Description(builder => builder
            .WithName("GetCalories")
            .Produces<CaloriesGetResponse>()
            .ProducesCommonProblems());
    }

    public override async Task<IResult> ExecuteAsync(
        CaloriesGetRequest request,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(CurrentUser.Id))
            return Results.Unauthorized();

        var result = await CalorieService.GetAsync(
            request.ToFilter(CurrentUser.Id),
            ct);

        return result.Handle(data => Results.Ok(data.ToResponse()));
    }
}
