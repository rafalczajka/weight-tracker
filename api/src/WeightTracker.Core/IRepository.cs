using System.Threading;
using System.Threading.Tasks;
using WeightTracker.Core.Models;

namespace WeightTracker.Core;

public interface IRepository
{
    Task<ResponseTuple> AddAsync(WeightData weightData, CancellationToken ct);

    Task<WeightDataGroup> GetAsync(WeightDataFilter filter, CancellationToken ct);

    Task<ResponseTuple> UpdateAsync(WeightData weightData, CancellationToken ct);

    Task<ResponseTuple> DeleteAsync(string userId, DateOnly date, CancellationToken ct);
}
