using PxBunny.Result;

namespace WeightTracker.Core.Calculations;

public interface ICalculationService<in TInput, TResult>
{
    Task<Result<TResult>> CalculateAsync(
        string userId,
        TInput input,
        CancellationToken ct);
}
