using Azure;
using Azure.Data.Tables;

namespace WeightTracker.DataMigration;

internal static class Program
{
    private const string TableName = "WeightData";
    private const string DatePropertyName = "Date";
    private const string WeightPropertyName = "Weight";

    private const string ConnectionStringVariable = "AzureWebJobsStorage";
    private const string ExecuteArgument = "--execute";

    public static async Task<int> Main(string[] args)
    {
        var execute = ParseExecuteArgument(args);

        if (execute is null)
        {
            await PrintUsageAsync();
            return 2;
        }

        var connectionString = Environment.GetEnvironmentVariable(ConnectionStringVariable);

        if (string.IsNullOrWhiteSpace(connectionString))
        {
            await Console.Error.WriteLineAsync($"Environment variable '{ConnectionStringVariable}' is not configured.");
            return 2;
        }

        using var cancellation = new CancellationTokenSource();

        Console.CancelKeyPress += (_, eventArgs) =>
        {
            eventArgs.Cancel = true;
            cancellation.Cancel();
        };

        try
        {
            var serviceClient = new TableServiceClient(connectionString);
            var tableClient = serviceClient.GetTableClient(TableName);
            var migrator = new WeightDataMigrator(tableClient);
            var snapshot = await migrator.LoadSnapshotAsync(TableName, cancellation.Token);
            var plan = MigrationPlan.Create(snapshot, DatePropertyName, WeightPropertyName);

            PrintSummary(plan);

            if (!plan.IsValid)
            {
                await PrintValidationErrorsAsync(plan.ValidationErrors);
                return 1;
            }

            if (!execute.Value)
            {
                Console.WriteLine();
                Console.WriteLine($"Dry run only. Re-run with {ExecuteArgument} to apply changes.");
                return 0;
            }

            await migrator.ExecuteAsync(plan, DatePropertyName, cancellation.Token);

            Console.WriteLine();
            Console.WriteLine("Migration completed successfully.");
            return 0;
        }
        catch (OperationCanceledException)
        {
            await Console.Error.WriteLineAsync("Migration cancelled.");
            return 1;
        }
        catch (RequestFailedException exception)
        {
            await Console.Error.WriteLineAsync($"Storage request failed with {exception.Status} {exception.ErrorCode}.");
            return 1;
        }
        catch (InvalidOperationException exception)
        {
            await Console.Error.WriteLineAsync(exception.Message);
            return 1;
        }
        catch (ArgumentException exception)
        {
            await Console.Error.WriteLineAsync($"Invalid storage configuration: {exception.Message}");
            return 1;
        }
        catch (FormatException exception)
        {
            await Console.Error.WriteLineAsync($"Invalid storage configuration: {exception.Message}");
            return 1;
        }
    }

    private static bool? ParseExecuteArgument(string[] args) => args.Length switch
    {
        0 => false,
        1 when args[0] == ExecuteArgument => true,
        _ => null
    };

    private static void PrintSummary(MigrationPlan plan)
    {
        Console.WriteLine($"Table: {TableName}");
        Console.WriteLine($"Total entries: {plan.TotalCount}");
        Console.WriteLine($"RowKeys to migrate: {plan.MoveCount}");
        Console.WriteLine($"Date fields to add: {plan.AddDateCount}");
        Console.WriteLine($"Entries unchanged: {plan.UnchangedCount}");
        Console.WriteLine($"Validation errors: {plan.ValidationErrors.Count}");
    }

    private static async Task PrintValidationErrorsAsync(IEnumerable<string> errors)
    {
        await Console.Error.WriteLineAsync();
        await Console.Error.WriteLineAsync("Validation failed. No changes were written.");

        foreach (var error in errors)
        {
            await Console.Error.WriteLineAsync($"- {error}");
        }
    }

    private static async Task PrintUsageAsync() =>
        await Console.Error.WriteLineAsync($"Usage: WeightTracker.DataMigration [{ExecuteArgument}]");
}
