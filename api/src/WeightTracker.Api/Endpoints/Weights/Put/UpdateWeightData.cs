namespace WeightTracker.Api.Endpoints.Weights.Put;

internal sealed record UpdateWeightData(string UserId, DateOnly Date, decimal WeightKg) : ICommand<Result>;

internal sealed class UpdateWeightDataHandler(IWeightRepository repository) : ICommandHandler<UpdateWeightData, Result>
{
    public async Task<Result> ExecuteAsync(UpdateWeightData command, CancellationToken ct)
    {
        var (userId, date, weightKg) = command;
        var data = new WeightData(userId, date, weightKg);
        var response = await repository.UpdateAsync(data, ct);
        return ResponseService.HandleResponse(response);
    }
}
