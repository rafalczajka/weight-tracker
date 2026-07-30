# API tools

Utilities in this directory support API and storage maintenance. Run them from
the repository root and review each tool's documentation before making changes.

## WeightTracker.DataMigration

Migrates records in the existing Azure Table Storage `WeightData` table to the
current schema:

- adds the ISO `Date` property,
- replaces date-based `RowKey` values with reverse chronological keys,
- preserves custom entity properties.

The default mode only analyzes and validates the complete table. Writes require
the explicit `--execute` argument.

See the [migration instructions](WeightTracker.DataMigration/README.md) for
requirements, commands, and the execution sequence.
