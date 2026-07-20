using System.Linq;

namespace WeightTracker.Api.Endpoints.Weights.GetSummary;

internal static class WeightsSummaryGetMappings
{
    public static WeightsSummaryGetResponse ToResponse(this Summary data) => new(
        Today: new TodayResponse(data.Today.Date, data.Today.HasEntry, data.Today.Weight),
        Streak: new StreakResponse(data.Streak.Current, data.Streak.Longest),
        Adherence: data.Adherence.Select(a => new AdherenceResponseItem(a.Window, a.DaysWithEntry, a.DaysMissed)));
}
