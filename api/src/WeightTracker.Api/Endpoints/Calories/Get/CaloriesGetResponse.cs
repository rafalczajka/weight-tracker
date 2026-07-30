namespace WeightTracker.Api.Endpoints.Calories.Get;

internal sealed class CaloriesGetResponse
{
    public IEnumerable<DailyCaloriesResponse> Data { get; init; } = [];
}
