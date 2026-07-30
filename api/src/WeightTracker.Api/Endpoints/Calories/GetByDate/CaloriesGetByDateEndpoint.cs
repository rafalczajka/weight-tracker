using System.Globalization;
using Microsoft.AspNetCore.Builder;
using WeightTracker.Api.Cache;
using WeightTracker.Api.Extensions;

namespace WeightTracker.Api.Endpoints.Calories.GetByDate;

internal sealed class CaloriesGetByDateEndpoint : Endpoint<CaloriesGetByDateRequest, IResult>
{
    public required ICalorieService CalorieService { get; init; }

    public required CurrentUser CurrentUser { get; init; }

    public override void Configure()
    {
        Get("api/calories/days/{Date}");
        Options(builder => builder.CacheCalories());
        Description(builder => builder
            .WithName("GetDailyCalories")
            .Produces<DailyCaloriesResponse>()
            .ProducesCommonProblems());
    }

    public override async Task<IResult> ExecuteAsync(
        CaloriesGetByDateRequest request,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(CurrentUser.Id))
            return Results.Unauthorized();

        var date = DateOnly.Parse(request.Date, CultureInfo.InvariantCulture);
        var result = await CalorieService.GetByDateAsync(
            CurrentUser.Id,
            date,
            ct);

        return result.Handle(data => Results.Ok(data.ToResponse()));
    }
}
