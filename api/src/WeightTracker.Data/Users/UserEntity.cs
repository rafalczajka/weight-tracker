using Azure;

namespace WeightTracker.Data.Users;

internal sealed class UserEntity : ITableEntity
{
    public const string TableName = "UserData";
    public const string ProfileRowKey = "profile";

    public double? HeightCm { get; set; }

    public string? Sex { get; set; }

    public string? DateOfBirth { get; set; }

    public string? ActivityLevel { get; set; }

    public string? ProteinGoal { get; set; }

    public string PartitionKey { get; set; } = string.Empty;

    public string RowKey { get; set; } = ProfileRowKey;

    public DateTimeOffset? Timestamp { get; set; }

    public ETag ETag { get; set; }
}
