using System.Threading;
using System.Threading.Tasks;
using PxBunny.Result;

namespace WeightTracker.Core.Calories;

public interface ICalorieService
{
    Task<Result<CalorieEntry>> AddAsync(
        string userId,
        DateOnly date,
        int caloriesKcal,
        string? description,
        CancellationToken ct);

    Task<Result<CalorieDataGroup>> GetAsync(
        CalorieDataFilter filter,
        CancellationToken ct);

    Task<Result<DailyCalories>> GetByDateAsync(
        string userId,
        DateOnly date,
        CancellationToken ct);

    Task<Result<CalorieEntry>> UpdateAsync(
        string userId,
        string id,
        int caloriesKcal,
        string? description,
        CancellationToken ct);

    Task<Result> DeleteAsync(
        string userId,
        string id,
        CancellationToken ct);
}
