using Azure;
using Azure.Data.Tables.Models;
using System.Collections.Generic;
using PxBunny.Result;

namespace WeightTracker.Data.Calories;

internal sealed class CalorieService(TableServiceClient tableServiceClient) : ICalorieService
{
    private const int QueryPageSize = 100;

    private readonly TableClient _tableClient = tableServiceClient.GetTableClient(CalorieEntity.TableName);

    public async Task<Result<CalorieEntry>> AddAsync(
        string userId,
        DateOnly date,
        int caloriesKcal,
        string? description,
        CancellationToken ct)
    {
        var entry = new CalorieEntry(
            CalorieRowKey.Create(date),
            userId,
            date,
            caloriesKcal,
            description);

        try
        {
            await _tableClient.AddEntityAsync(entry.ToEntity(), ct);
            return entry;
        }
        catch (RequestFailedException exception) when (HasErrorCode(exception, TableErrorCode.EntityAlreadyExists))
        {
            return ResultErrors.ConflictError("The calorie entry already exists.");
        }
    }

    public async Task<Result<CalorieDataGroup>> GetAsync(
        CalorieDataFilter filter,
        CancellationToken ct)
    {
        var entries = await GetRangeAsync(
            filter.UserId,
            filter.DateFrom,
            filter.DateTo,
            filter.LimitDays,
            ct);

        return CalorieDataGroup.Create(filter.UserId, entries, filter.LimitDays);
    }

    public async Task<Result<DailyCalories>> GetByDateAsync(
        string userId,
        DateOnly date,
        CancellationToken ct)
    {
        var entries = await GetRangeAsync(
            userId,
            date,
            date,
            limitDays: null,
            ct);

        return DailyCalories.Create(date, entries);
    }

    public async Task<Result<CalorieEntry>> UpdateAsync(
        string userId,
        string id,
        int caloriesKcal,
        string? description,
        CancellationToken ct)
    {
        if (!CalorieRowKey.TryParse(id, out var date))
            return ResultErrors.ValidationError("Invalid calorie entry identifier.");

        var entry = new CalorieEntry(id, userId, date, caloriesKcal, description);

        try
        {
            await _tableClient.UpdateEntityAsync(
                entry.ToEntity(),
                ETag.All,
                TableUpdateMode.Replace,
                ct);
            return entry;
        }
        catch (RequestFailedException exception) when (HasErrorCode(exception, TableErrorCode.EntityNotFound))
        {
            return ResultErrors.NotFoundError("The calorie entry was not found.");
        }
    }

    public async Task<Result> DeleteAsync(
        string userId,
        string id,
        CancellationToken ct)
    {
        if (!CalorieRowKey.TryParse(id, out _))
            return ResultErrors.ValidationError("Invalid calorie entry identifier.");

        var response = await _tableClient.GetEntityIfExistsAsync<CalorieEntity>(
            userId,
            id,
            cancellationToken: ct);

        if (!response.HasValue)
            return ResultErrors.NotFoundError("The calorie entry was not found.");

        try
        {
            await _tableClient.DeleteEntityAsync(
                userId,
                id,
                ETag.All,
                ct);
            return Result.Success();
        }
        catch (RequestFailedException exception) when (HasErrorCode(exception, TableErrorCode.EntityNotFound))
        {
            return ResultErrors.NotFoundError("The calorie entry was not found.");
        }
    }

    private async Task<List<CalorieEntry>> GetRangeAsync(
        string userId,
        DateOnly? dateFrom,
        DateOnly? dateTo,
        int? limitDays,
        CancellationToken ct)
    {
        var filter = CreateRangeFilter(userId, dateFrom, dateTo);
        var entities = _tableClient.QueryAsync<CalorieEntity>(
            filter,
            maxPerPage: QueryPageSize,
            cancellationToken: ct);
        var entries = new List<CalorieEntry>();
        DateOnly? currentDate = null;
        var dayCount = 0;

        await foreach (var entity in entities)
        {
            var entry = entity.ToDomain();

            if (entry.Date != currentDate)
            {
                if (limitDays.HasValue && dayCount >= limitDays.Value)
                    break;

                currentDate = entry.Date;
                dayCount++;
            }

            entries.Add(entry);
        }

        return entries;
    }

    private static string CreateRangeFilter(
        string userId,
        DateOnly? dateFrom,
        DateOnly? dateTo)
    {
        var lowerRowKey = CalorieRowKey.CreateLowerBound(dateTo ?? DateOnly.MaxValue);
        var upperRowKey = CalorieRowKey.CreateUpperBound(dateFrom ?? DateOnly.MinValue);

        return TableClient.CreateQueryFilter(
            $"PartitionKey eq {userId} and RowKey ge {lowerRowKey} and RowKey le {upperRowKey}");
    }

    private static bool HasErrorCode(
        RequestFailedException exception,
        TableErrorCode errorCode) =>
        string.Equals(
            exception.ErrorCode,
            errorCode.ToString(),
            StringComparison.Ordinal);
}
