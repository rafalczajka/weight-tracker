using Microsoft.Extensions.Hosting;
using WeightTracker.Data.Weights;

namespace WeightTracker.Data;

internal sealed class StartupCheck(TableServiceClient tableServiceClient) : IHostedService
{
    public async Task StartAsync(CancellationToken cancellationToken)
    {
        var tables = new[] { WeightEntity.TableName };

        foreach (var table in tables)
        {
            var tableExists = await TableExistsAsync(table, cancellationToken);
            if (!tableExists) throw new InvalidOperationException($"Azure Table Storage table '{table}' does not exist.");
        }
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;

    private async Task<bool> TableExistsAsync(string tableName, CancellationToken cancellationToken)
    {
        var filter = TableClient.CreateQueryFilter($"TableName eq {tableName}");

        await foreach (var _ in tableServiceClient.QueryAsync(filter, maxPerPage: 1, cancellationToken))
        {
            return true;
        }

        return false;
    }
}
