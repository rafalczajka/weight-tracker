using System.Threading;
using System.Threading.Tasks;
using PxBunny.Result;

namespace WeightTracker.Core.Weights;

public interface IWeightService
{
    Task<Result> AddAsync(WeightData weightData, CancellationToken ct);

    Task<Result<WeightData>> GetByDateAsync(string userId, DateOnly date, CancellationToken ct);

    Task<Result<WeightDataGroup>> GetAsync(WeightDataFilter filter, CancellationToken ct);

    Task<Result> UpdateAsync(WeightData weightData, CancellationToken ct);

    Task<Result> DeleteAsync(string userId, DateOnly date, CancellationToken ct);
}
