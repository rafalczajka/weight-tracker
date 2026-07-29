using System.Threading;
using System.Threading.Tasks;

namespace WeightTracker.Core.Food;

public interface IFoodService
{
    Task<Product?> GetProductAsync(string code, CancellationToken cancellationToken);
}
