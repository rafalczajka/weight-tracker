using Azure;

namespace WeightTracker.Data;

internal sealed class Entity : ITableEntity
{
    public double Weight { get; set; }

    public string PartitionKey { get; set; } = string.Empty;

    public string RowKey { get; set; } = string.Empty;

    public DateTimeOffset? Timestamp { get; set; }

    public ETag ETag { get; set; }
}
