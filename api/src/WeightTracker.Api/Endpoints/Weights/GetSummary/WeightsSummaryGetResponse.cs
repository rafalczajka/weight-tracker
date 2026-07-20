namespace WeightTracker.Api.Endpoints.Weights.GetSummary;

internal sealed record WeightsSummaryGetResponse(
    TodayResponse Today,
    StreakResponse Streak,
    IEnumerable<AdherenceResponseItem> Adherence);

internal sealed record StreakResponse(int Current, int Longest);

internal sealed record AdherenceResponseItem(int Window, int DaysWithEntry, int DaysMissed);
