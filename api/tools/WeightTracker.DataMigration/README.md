# Weight data migration

The tool migrates the existing `WeightData` table to reverse chronological
`RowKey` values and adds the ISO `Date` property.

Stop the API, verify the backup, and set `AzureWebJobsStorage` before running
the tool.

Analyze the complete table without writing changes:

```sh
dotnet run --project api/tools/WeightTracker.DataMigration/WeightTracker.DataMigration.csproj
```

After reviewing the summary, apply the migration:

```sh
dotnet run --project api/tools/WeightTracker.DataMigration/WeightTracker.DataMigration.csproj -- --execute
```

Run the analysis again before starting the API. All change counts and validation
errors must be zero.
