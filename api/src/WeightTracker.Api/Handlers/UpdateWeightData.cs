namespace WeightTracker.Api.Handlers;

internal sealed record UpdateWeightData(string UserId, DateOnly Date, decimal Weight) : ICommand<Result>;

internal sealed class UpdateWeightDataHandler(IRepository repository) : ICommandHandler<UpdateWeightData, Result>
{
    public async Task<Result> ExecuteAsync(UpdateWeightData command, CancellationToken ct)
    {
        var (userId, date, weight) = command;
        var data = new WeightData(userId, date, weight);
        var response = await repository.UpdateAsync(data, ct);
        return ResponseService.HandleResponse(response);
    }
}
