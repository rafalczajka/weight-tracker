namespace WeightTracker.Api.Endpoints.Weights;

internal sealed record GetWeightData(string UserId, DateOnly DateFrom, DateOnly DateTo)
    : ICommand<Result<WeightDataGroup>>;

internal sealed class GetWeightDataHandler(IWeightService service)
    : ICommandHandler<GetWeightData, Result<WeightDataGroup>>
{
    public async Task<Result<WeightDataGroup>> ExecuteAsync(GetWeightData command, CancellationToken ct)
    {
        var (userId, dateFrom, dateTo) = command;
        var filter = new WeightDataFilter(userId, dateFrom, dateTo);
        var data = await service.GetAsync(filter, ct);
        return data;
    }
}
