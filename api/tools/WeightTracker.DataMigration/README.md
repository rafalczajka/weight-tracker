# Weight data migration

The tool migrates the existing `WeightData` table to reverse chronological
`RowKey` values and adds the ISO `Date` property.

Stop the API, verify the backup, and set `AzureWebJobsStorage` before running
the tool. Run the following commands from the repository's `api` directory.

Analyze the complete table without writing changes:

```sh
dotnet run --project tools/WeightTracker.DataMigration
```

After reviewing the summary, apply the migration:

```sh
dotnet run --project tools/WeightTracker.DataMigration -- --execute
```

Run the analysis again before starting the API. All change counts and validation
errors must be zero.
