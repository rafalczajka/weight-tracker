using System.Threading;
using System.Threading.Tasks;
using PxBunny.Result;

namespace WeightTracker.Core.Food;

public interface IFoodService
{
    Task<Result<Product>> GetProductAsync(string code, CancellationToken cancellationToken);
}
