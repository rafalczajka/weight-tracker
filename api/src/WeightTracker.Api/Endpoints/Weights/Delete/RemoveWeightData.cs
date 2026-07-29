namespace WeightTracker.Api.Endpoints.Weights.Delete;

internal sealed record RemoveWeightData(string UserId, DateOnly Date) : ICommand<Result>;

internal sealed class RemoveWeightDataHandler(IWeightService service) : ICommandHandler<RemoveWeightData, Result>
{
    public async Task<Result> ExecuteAsync(RemoveWeightData command, CancellationToken ct)
    {
        var (userId, date) = command;
        var response = await service.DeleteAsync(userId, date, ct);
        return ResponseService.HandleResponse(response);
    }
}
