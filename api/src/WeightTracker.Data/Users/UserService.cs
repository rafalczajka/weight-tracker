using PxBunny.Result;

namespace WeightTracker.Data.Users;

internal sealed class UserService(TableServiceClient tableServiceClient) : IUserService
{
    private readonly TableClient _tableClient = tableServiceClient.GetTableClient(UserEntity.TableName);

    public async Task<Result<UserProfile>> GetAsync(
        string userId,
        CancellationToken ct)
    {
        var response = await _tableClient.GetEntityIfExistsAsync<UserEntity>(
            userId,
            UserEntity.ProfileRowKey,
            cancellationToken: ct);

        return response.HasValue
            ? response.Value!.ToDomain()
            : UserProfile.Empty(userId);
    }

    public async Task<Result<UserProfile>> UpsertAsync(
        UserProfile profile,
        CancellationToken ct)
    {
        await _tableClient.UpsertEntityAsync(
            profile.ToEntity(),
            TableUpdateMode.Replace,
            ct);

        return profile;
    }
}
