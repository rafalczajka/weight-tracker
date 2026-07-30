using Azure;

namespace WeightTracker.Data.Calories;

internal sealed class CalorieEntity : ITableEntity
{
    public const string TableName = "CalorieData";

    public int CaloriesKcal { get; set; }

    public string Date { get; set; } = string.Empty;

    public string? Description { get; set; }

    public string PartitionKey { get; set; } = string.Empty;

    public string RowKey { get; set; } = string.Empty;

    public DateTimeOffset? Timestamp { get; set; }

    public ETag ETag { get; set; }
}
