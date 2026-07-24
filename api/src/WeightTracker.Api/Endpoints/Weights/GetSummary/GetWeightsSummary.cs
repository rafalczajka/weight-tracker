namespace WeightTracker.Api.Endpoints.Weights.GetSummary;

internal sealed record GetWeightsSummary(string UserId) : ICommand<Result<Summary>>;

internal sealed class GetWeightsSummaryHandler(IWeightRepository repository)
    : ICommandHandler<GetWeightsSummary, Result<Summary>>
{
    public async Task<Result<Summary>> ExecuteAsync(GetWeightsSummary command, CancellationToken ct)
    {
        var filter = new WeightDataFilter(command.UserId);
        var dataGroup = await repository.GetAsync(filter, ct);
        return Summary.Create([.. dataGroup.Data]);
    }
}
