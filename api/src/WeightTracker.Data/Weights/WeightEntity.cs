using Azure;

namespace WeightTracker.Data.Weights;

internal sealed class WeightEntity : ITableEntity
{
    public const string TableName = "WeightData";

    public string Date { get; set; } = string.Empty;

    public double Weight { get; set; }

    public string PartitionKey { get; set; } = string.Empty;

    public string RowKey { get; set; } = string.Empty;

    public DateTimeOffset? Timestamp { get; set; }

    public ETag ETag { get; set; }
}
