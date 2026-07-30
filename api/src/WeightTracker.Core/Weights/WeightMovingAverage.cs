using System.Collections.Generic;
using System.Linq;

namespace WeightTracker.Core.Weights;

public sealed record WeightMovingAverage(
    int WindowDays,
    IReadOnlyList<WeightMovingAverageValue> Values)
{
    public static WeightMovingAverage Create(
        int windowDays,
        IList<WeightData> data,
        IEnumerable<WeightData> precedingData)
    {
        ArgumentOutOfRangeException.ThrowIfLessThan(windowDays, 1);
        ArgumentNullException.ThrowIfNull(data);
        ArgumentNullException.ThrowIfNull(precedingData);

        if (data.Count == 0)
        {
            return new WeightMovingAverage(windowDays, []);
        }

        var outputDates = data.Select(entry => entry.Date).ToHashSet();
        var entries = precedingData
            .Concat(data)
            .OrderBy(entry => entry.Date)
            .ToList();
        var averages = CalculateAverages(entries, outputDates, windowDays);
        var values = data
            .Select(entry => new WeightMovingAverageValue(entry.Date, averages[entry.Date]))
            .ToList();

        return new WeightMovingAverage(windowDays, values);
    }

    private static Dictionary<DateOnly, decimal> CalculateAverages(
        IEnumerable<WeightData> entries,
        HashSet<DateOnly> outputDates,
        int windowDays)
    {
        var window = new Queue<WeightData>();
        var averages = new Dictionary<DateOnly, decimal>();
        var totalWeightKg = 0m;

        foreach (var entry in entries)
        {
            var firstIncludedDay = entry.Date.DayNumber - windowDays + 1;

            while (window.TryPeek(out var oldest) && oldest.Date.DayNumber < firstIncludedDay)
            {
                totalWeightKg -= window.Dequeue().WeightKg;
            }

            window.Enqueue(entry);
            totalWeightKg += entry.WeightKg;

            if (outputDates.Contains(entry.Date))
            {
                averages[entry.Date] = totalWeightKg / window.Count;
            }
        }

        return averages;
    }
}
