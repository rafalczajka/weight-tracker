using PxBunny.Result;

namespace WeightTracker.Core.Users;

public interface IUserService
{
    Task<Result<UserProfile>> GetAsync(string userId, CancellationToken ct);

    Task<Result<UserProfile>> UpsertAsync(UserProfile profile, CancellationToken ct);
}
