using Azure.Data.Tables;
using WeightTracker.Data;

namespace WeightTracker.DataMigration;

internal enum MigrationAction
{
    None,
    AddDate,
    Move
}

internal sealed record MigrationItem(
    TableEntity Source,
    DateOnly Date,
    string TargetRowKey,
    MigrationAction Action);

internal sealed class MigrationPlan
{
    private MigrationPlan(
        int totalCount,
        IReadOnlyList<MigrationItem> items,
        IReadOnlyList<string> validationErrors)
    {
        TotalCount = totalCount;
        Items = items;
        ValidationErrors = validationErrors;
    }

    public int TotalCount { get; }

    public IReadOnlyList<MigrationItem> Items { get; }

    public IReadOnlyList<string> ValidationErrors { get; }

    public bool IsValid => ValidationErrors.Count == 0;

    public int MoveCount => Items.Count(item => item.Action == MigrationAction.Move);

    public int AddDateCount => Items.Count(item => item.Action == MigrationAction.AddDate);

    public int UnchangedCount => Items.Count(item => item.Action == MigrationAction.None);

    public static MigrationPlan Create(
        IReadOnlyList<TableEntity> entities,
        string datePropertyName,
        string weightPropertyName)
    {
        ArgumentNullException.ThrowIfNull(entities);

        var items = new List<MigrationItem>(entities.Count);
        var errors = new List<string>();

        foreach (var entity in entities)
        {
            var item = Analyze(entity, datePropertyName, weightPropertyName, errors);

            if (item is not null)
            {
                items.Add(item);
            }
        }

        ValidateTargetKeys(entities, items, errors);
        return new MigrationPlan(entities.Count, items, errors);
    }

    private static MigrationItem? Analyze(
        TableEntity entity,
        string datePropertyName,
        string weightPropertyName,
        List<string> errors)
    {
        var identity = FormatIdentity(entity);

        if (string.IsNullOrWhiteSpace(entity.PartitionKey) || string.IsNullOrWhiteSpace(entity.RowKey))
        {
            errors.Add($"{identity}: PartitionKey and RowKey must not be empty.");
            return null;
        }

        if (!entity.TryGetValue(weightPropertyName, out var weight) || weight is not double)
        {
            errors.Add($"{identity}: Weight must be stored as Double.");
            return null;
        }

        DateOnly? storedDate = null;
        var hasDate = entity.TryGetValue(datePropertyName, out var dateValue);

        if (hasDate)
        {
            if (dateValue is not string dateText || !DateUtils.TryParseDate(dateText, out var parsedDate))
            {
                errors.Add($"{identity}: Date must be a string in yyyy-MM-dd format.");
                return null;
            }

            storedDate = parsedDate;
        }

        if (!TryParseRowKey(entity.RowKey, out var rowKeyDate))
        {
            errors.Add($"{identity}: RowKey has an unknown format.");
            return null;
        }

        if (storedDate is { } dateFromProperty && dateFromProperty != rowKeyDate)
        {
            errors.Add(
                $"{identity}: Date {DateUtils.FormatDate(dateFromProperty)} " +
                $"does not match RowKey date {DateUtils.FormatDate(rowKeyDate)}.");
            return null;
        }

        var date = storedDate ?? rowKeyDate;
        var targetRowKey = DateUtils.CreateRowKey(date);
        var action = entity.RowKey != targetRowKey
            ? MigrationAction.Move
            : hasDate
                ? MigrationAction.None
                : MigrationAction.AddDate;

        return new MigrationItem(entity, date, targetRowKey, action);
    }

    private static bool TryParseRowKey(string rowKey, out DateOnly date) =>
        DateUtils.TryParseDate(rowKey, out date) ||
        DateUtils.TryParseRowKey(rowKey, out date);

    private static void ValidateTargetKeys(
        IReadOnlyList<TableEntity> entities,
        IEnumerable<MigrationItem> items,
        List<string> errors)
    {
        var sourceKeys = entities
            .Select(entity => (entity.PartitionKey, entity.RowKey))
            .ToHashSet();
        var targetKeys = new Dictionary<(string PartitionKey, string RowKey), MigrationItem>();

        foreach (var item in items)
        {
            var targetKey = (item.Source.PartitionKey, item.TargetRowKey);

            if (targetKeys.TryGetValue(targetKey, out var existingItem))
            {
                errors.Add(
                    $"{FormatIdentity(item.Source)}: target RowKey collides with " +
                    $"{FormatIdentity(existingItem.Source)}.");
                continue;
            }

            targetKeys.Add(targetKey, item);

            var sourceKey = (item.Source.PartitionKey, item.Source.RowKey);
            if (item.Action == MigrationAction.Move && targetKey != sourceKey && sourceKeys.Contains(targetKey))
            {
                errors.Add(
                    $"{FormatIdentity(item.Source)}: target RowKey '{item.TargetRowKey}' " +
                    "already exists in the partition.");
            }
        }
    }

    private static string FormatIdentity(TableEntity entity) => $"[{entity.PartitionKey}/{entity.RowKey}]";
}
