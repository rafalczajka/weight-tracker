using Microsoft.AspNetCore.Builder;
using WeightTracker.Api.Extensions;
using WeightTracker.Core.Food;

namespace WeightTracker.Api.Endpoints.Food;

internal sealed class FoodGetEndpoint : Endpoint<FoodGetRequest, IResult>
{
    public required CurrentUser CurrentUser { get; init; }

    public required IFoodService FoodService { get; init; }

    public override void Configure()
    {
        Get("api/food/{Code}");
        // Options(builder => builder.SetCustomCache());
        Description(builder => builder
            .WithName("GetFood")
            .Produces<FoodGetResponse>()
            .ProducesCommonProblems());
    }

    public override async Task<IResult> ExecuteAsync(FoodGetRequest request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(CurrentUser.Id))
            return Results.Unauthorized();

        var product = await FoodService.GetProductAsync(request.Code, cancellationToken);

        return product is null
            ? Results.NotFound()
            : Results.Ok(product.ToResponse());
    }
}
