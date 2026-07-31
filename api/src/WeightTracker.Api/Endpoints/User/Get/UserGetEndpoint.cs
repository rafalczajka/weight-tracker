using Microsoft.AspNetCore.Builder;
using WeightTracker.Api.Cache;
using WeightTracker.Api.Extensions;

namespace WeightTracker.Api.Endpoints.User.Get;

internal sealed class UserGetEndpoint : EndpointWithoutRequest<IResult>
{
    public required CurrentUser CurrentUser { get; init; }

    public required IUserService UserService { get; init; }

    public override void Configure()
    {
        Get("api/user");
        Options(builder => builder.CacheUserProfile());
        Description(builder => builder
            .WithName("GetUserProfile")
            .Produces<UserResponse>()
            .ProducesCommonProblems());
    }

    public override async Task<IResult> ExecuteAsync(CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(CurrentUser.Id))
            return Results.Unauthorized();

        var result = await UserService.GetAsync(CurrentUser.Id, ct);

        return result.Handle(profile => Results.Ok(profile.ToResponse()));
    }
}
