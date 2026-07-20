namespace WeightTracker.Api.Handlers;

internal sealed record RemoveWeightData(string UserId, DateOnly Date) : ICommand<Result>;

internal sealed class RemoveWeightDataHandler(IRepository repository) : ICommandHandler<RemoveWeightData, Result>
{
    public async Task<Result> ExecuteAsync(RemoveWeightData command, CancellationToken ct)
    {
        var (userId, date) = command;
        var response = await repository.DeleteAsync(userId, date, ct);
        return ResponseService.HandleResponse(response);
    }
}
