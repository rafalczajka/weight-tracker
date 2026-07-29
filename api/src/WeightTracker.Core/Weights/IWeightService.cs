using System.Threading;
using System.Threading.Tasks;

namespace WeightTracker.Core.Weights;

public interface IWeightService
{
    Task<ResponseTuple> AddAsync(WeightData weightData, CancellationToken ct);

    Task<WeightDataGroup> GetAsync(WeightDataFilter filter, CancellationToken ct);

    Task<ResponseTuple> UpdateAsync(WeightData weightData, CancellationToken ct);

    Task<ResponseTuple> DeleteAsync(string userId, DateOnly date, CancellationToken ct);
}
