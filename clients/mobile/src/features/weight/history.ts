import type { WeightsEntryResponse } from '@weight-tracker/api-client';

export interface WeightHistoryRow {
  changeKg?: number;
  entry: WeightsEntryResponse;
  previousWeightKg?: number;
}

export function createWeightHistoryRows(
  entries: readonly WeightsEntryResponse[],
): WeightHistoryRow[] {
  const newestFirst = [...entries].sort((first, second) =>
    second.date.localeCompare(first.date),
  );

  return newestFirst.map((entry, index) => {
    const previousEntry = newestFirst[index + 1];

    return {
      entry,
      ...(previousEntry
        ? {
            changeKg: entry.weightKg - previousEntry.weightKg,
            previousWeightKg: previousEntry.weightKg,
          }
        : {}),
    };
  });
}
