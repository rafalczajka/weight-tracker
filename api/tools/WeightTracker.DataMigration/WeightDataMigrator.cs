using Azure;
using Azure.Data.Tables;
using WeightTracker.Data;

namespace WeightTracker.DataMigration;

internal sealed class WeightDataMigrator(TableClient tableClient)
{
    public async Task<IReadOnlyList<TableEntity>> LoadSnapshotAsync(string tableName, CancellationToken ct)
    {
        var entities = new List<TableEntity>();

        try
        {
            await foreach (var entity in tableClient.QueryAsync<TableEntity>(cancellationToken: ct))
            {
                entities.Add(entity);
            }
        }
        catch (RequestFailedException exception) when (exception.Status == 404)
        {
            throw new InvalidOperationException($"Table '{tableName}' does not exist.", exception);
        }

        return entities;
    }

    public async Task ExecuteAsync(MigrationPlan plan, string datePropertyName, CancellationToken ct)
    {
        ArgumentNullException.ThrowIfNull(plan);

        if (!plan.IsValid)
        {
            throw new InvalidOperationException("A plan with validation errors cannot be executed.");
        }

        foreach (var item in plan.Items)
        {
            try
            {
                switch (item.Action)
                {
                    case MigrationAction.Move:
                        await MoveAsync(item, datePropertyName, ct);
                        break;
                    case MigrationAction.AddDate:
                        await AddDateAsync(item, datePropertyName, ct);
                        break;
                    case MigrationAction.None:
                        break;
                    default:
                        throw new InvalidOperationException($"Unknown migration action '{item.Action}'.");
                }
            }
            catch (RequestFailedException exception)
            {
                throw new InvalidOperationException(
                    $"Migration failed for [{item.Source.PartitionKey}/{item.Source.RowKey}] " +
                    $"with {exception.Status} {exception.ErrorCode}.",
                    exception);
            }
        }
    }

    private async Task MoveAsync(MigrationItem item, string datePropertyName, CancellationToken ct)
    {
        var target = new TableEntity(item.Source.PartitionKey, item.TargetRowKey);

        foreach (var property in item.Source)
        {
            if (property.Key is not nameof(TableEntity.PartitionKey)
                and not nameof(TableEntity.RowKey)
                and not nameof(TableEntity.Timestamp))
            {
                target[property.Key] = property.Value;
            }
        }

        target[datePropertyName] = DateUtils.FormatDate(item.Date);
        var source = new TableEntity(item.Source.PartitionKey, item.Source.RowKey);

        var actions = new[]
        {
            new TableTransactionAction(TableTransactionActionType.Add, target),
            new TableTransactionAction(TableTransactionActionType.Delete, source, item.Source.ETag)
        };

        await tableClient.SubmitTransactionAsync(actions, ct);
    }

    private async Task AddDateAsync(MigrationItem item, string datePropertyName, CancellationToken ct)
    {
        var patch = new TableEntity(item.Source.PartitionKey, item.Source.RowKey)
        {
            [datePropertyName] = DateUtils.FormatDate(item.Date)
        };

        await tableClient.UpdateEntityAsync(patch, item.Source.ETag, TableUpdateMode.Merge, ct);
    }
}
