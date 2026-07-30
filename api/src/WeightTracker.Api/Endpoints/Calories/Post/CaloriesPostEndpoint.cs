using System.Globalization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.OutputCaching;
using WeightTracker.Api.Cache;
using WeightTracker.Api.Extensions;

namespace WeightTracker.Api.Endpoints.Calories.Post;

internal sealed class CaloriesPostEndpoint : Endpoint<CalorieEntryPostRequest, IResult>
{
    public required IOutputCacheStore Cache { get; init; }

    public required ICalorieService CalorieService { get; init; }

    public required CurrentUser CurrentUser { get; init; }

    public override void Configure()
    {
        Post("api/calories");
        Description(builder => builder
            .WithName("CreateCalorieEntry")
            .Produces<CalorieEntryDetailsResponse>(StatusCodes.Status201Created)
            .ProducesWriteCommonProblems());
    }

    public override async Task<IResult> ExecuteAsync(
        CalorieEntryPostRequest request,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(CurrentUser.Id))
            return Results.Unauthorized();

        var date = GetDate(request.Date);
        var description = CalorieMappings.NormalizeDescription(request.Description);
        var result = await CalorieService.AddAsync(
            CurrentUser.Id,
            date,
            request.CaloriesKcal,
            description,
            ct);

        return await result.HandleAsync(async entry =>
        {
            await Cache.EvictCaloriesAsync(CurrentUser.Id);
            return Results.Created(
                $"/api/calories/{entry.Id}",
                entry.ToDetailsResponse());
        });
    }

    private static DateOnly GetDate(string? date) =>
        string.IsNullOrWhiteSpace(date)
            ? DateOnly.FromDateTime(DateTime.UtcNow)
            : DateOnly.Parse(date, CultureInfo.InvariantCulture);
}
