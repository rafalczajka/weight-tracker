using System.Linq;
using Microsoft.AspNetCore.Builder;
using WeightTracker.Api.Cache;
using WeightTracker.Api.Extensions;

namespace WeightTracker.Api.Endpoints.Weights.GetByDate;

internal sealed class WeightsGetByDateEndpoint : Endpoint<WeightsGetByDateRequest, IResult>
{
    public required CurrentUser CurrentUser { get; init; }

    public override void Configure()
    {
        Get("api/weights/{Date}");
        Options(builder => builder.SetCustomCache());
        Description(builder => builder
            .WithName("GetWeightEntry")
            .Produces<WeightsEntryResponse>()
            .ProducesCommonProblems());
    }

    public override async Task<IResult> ExecuteAsync(WeightsGetByDateRequest request, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(CurrentUser.Id))
            return Results.Unauthorized();

        var command = request.ToCommand(CurrentUser.Id);
        var result = await command.ExecuteAsync(ct);

        return result.Match(
            d => d.Data.Any() ? Results.Ok(d.ToResponse()) : Results.NotFound(),
            ErrorsService.HandleError);
    }
}
