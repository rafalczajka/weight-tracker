namespace WeightTracker.Api.Handlers;

internal sealed record AddWeightData(string UserId, DateOnly Date, decimal Weight) : ICommand<Result>;

internal sealed class AddWeightDataHandler(IRepository repository) : ICommandHandler<AddWeightData, Result>
{
    public async Task<Result> ExecuteAsync(AddWeightData command, CancellationToken ct)
    {
        var (userId, date, weight) = command;
        var data = new WeightData(userId, date, weight);
        var response = await repository.AddAsync(data, ct);
        return ResponseService.HandleResponse(response);
    }
}
