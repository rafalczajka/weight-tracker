using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Azure;

namespace WeightTracker.Data;

internal sealed class Repository(TableServiceClient tableServiceClient) : IRepository
{
    private const string TableName = "WeightData";

    public async Task<ResponseTuple> AddAsync(WeightData weightData, CancellationToken ct)
    {
        var tableClient = await GetTableClientAsync(ct);
        var entity = weightData.ToEntity();

        try
        {
            var response = await tableClient.AddEntityAsync(entity, ct);
            return GetResponse(response);
        }
        catch (RequestFailedException ex)
        {
            return GetResponse(ex);
        }
    }

    public async Task<WeightDataGroup> GetAsync(WeightDataFilter weightDataFilter, CancellationToken ct)
    {
        var tableClient = await GetTableClientAsync(ct);
        var (userId, dateFrom, dateTo) = weightDataFilter;

        var from = (dateFrom ?? DateOnly.MinValue).ToDomainDateString();
        var to = (dateTo ?? DateOnly.MaxValue).ToDomainDateString();

        var filter = $"PartitionKey eq '{userId}' and RowKey ge '{from}' and RowKey le '{to}'";
        var result = tableClient.Query<Entity>(filter, cancellationToken: ct).ToList();

        var data = result.Select(e => e.ToDomain()).ToList();
        return WeightDataGroup.Create(userId, data);
    }

    public async Task<ResponseTuple> UpdateAsync(WeightData weightData, CancellationToken ct)
    {
        var tableClient = await GetTableClientAsync(ct);
        var entity = weightData.ToEntity();
        entity.ETag = ETag.All;

        try
        {
            var response = await tableClient.UpdateEntityAsync(entity, entity.ETag, TableUpdateMode.Replace, ct);
            return GetResponse(response);
        }
        catch (RequestFailedException ex)
        {
            return GetResponse(ex);
        }
    }

    public async Task<ResponseTuple> DeleteAsync(string userId, DateOnly date, CancellationToken ct)
    {
        var tableClient = await GetTableClientAsync(ct);

        try
        {
            var response = await tableClient.DeleteEntityAsync(userId, date.ToDomainDateString(), cancellationToken: ct);
            return GetResponse(response);
        }
        catch (RequestFailedException ex)
        {
            return GetResponse(ex);
        }
    }

    private async Task<TableClient> GetTableClientAsync(CancellationToken ct)
    {
        var tableClient = tableServiceClient.GetTableClient(tableName: TableName);
        await tableClient.CreateIfNotExistsAsync(ct);
        return tableClient;
    }

    private static ResponseTuple GetResponse(Response response) => (!response.IsError, (HttpStatusCode)response.Status);
    private static ResponseTuple GetResponse(RequestFailedException ex) => (false, (HttpStatusCode)ex.Status);
}
