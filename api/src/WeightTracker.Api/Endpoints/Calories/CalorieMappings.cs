using System.Linq;

namespace WeightTracker.Api.Endpoints.Calories;

internal static class CalorieMappings
{
    public static CalorieEntryDetailsResponse ToDetailsResponse(
        this CalorieEntry entry) => new(
            entry.Id,
            entry.Date,
            entry.CaloriesKcal,
            entry.Description);

    public static DailyCaloriesResponse ToResponse(
        this DailyCalories data) => new(
            data.Date,
            data.TotalCaloriesKcal,
            data.Entries.Select(entry => new CalorieEntryResponse(
                entry.Id,
                entry.CaloriesKcal,
                entry.Description)));

    public static string? NormalizeDescription(string? description) =>
        string.IsNullOrWhiteSpace(description)
            ? null
            : description.Trim();
}
