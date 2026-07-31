using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.OutputCaching;
using WeightTracker.Api.Cache;
using WeightTracker.Api.Extensions;

namespace WeightTracker.Api.Endpoints.User.Put;

internal sealed class UserPutEndpoint : Endpoint<UserPutRequest, IResult>
{
    public required IOutputCacheStore Cache { get; init; }

    public required CurrentUser CurrentUser { get; init; }

    public required IUserService UserService { get; init; }

    public override void Configure()
    {
        Put("api/user");
        Description(builder => builder
            .WithName("UpdateUserProfile")
            .Produces<UserResponse>()
            .ProducesWriteCommonProblems());
    }

    public override async Task<IResult> ExecuteAsync(
        UserPutRequest request,
        CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(CurrentUser.Id))
            return Results.Unauthorized();

        var result = await UserService.UpsertAsync(
            request.ToDomain(CurrentUser.Id),
            ct);

        return await result.HandleAsync(async profile =>
        {
            await Cache.EvictUserProfileAsync(CurrentUser.Id);
            return Results.Ok(profile.ToResponse());
        });
    }
}
