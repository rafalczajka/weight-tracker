namespace WeightTracker.Api.Handlers;

internal sealed record GetWeightData(string UserId, DateOnly DateFrom, DateOnly DateTo)
    : ICommand<Result<WeightDataGroup>>;

internal sealed class GetWeightDataHandler(IRepository repository)
    : ICommandHandler<GetWeightData, Result<WeightDataGroup>>
{
    public async Task<Result<WeightDataGroup>> ExecuteAsync(GetWeightData command, CancellationToken ct)
    {
        var (userId, dateFrom, dateTo) = command;
        var filter = new WeightDataFilter(userId, dateFrom, dateTo);
        var data = await repository.GetAsync(filter, ct);
        return data;
    }
}
