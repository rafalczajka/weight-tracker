import type {
  WeightsEntryResponse,
  WeightsGetResponse,
} from '@weight-tracker/api-client';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const INVALID_DATA_MESSAGE = 'Weight chart data is invalid.';

interface DatedWeightEntry {
  date: string;
  weightKg: number;
}

export interface WeightChartModel {
  averageWeightKg: number;
  dates: string[];
  weightsKg: number[];
}

export function createWeightChartModel(
  report: WeightsGetResponse,
): WeightChartModel | null {
  if (report.data.length === 0) {
    return null;
  }

  if (!Number.isFinite(report.stats.averageWeightKg)) {
    throw new Error(INVALID_DATA_MESSAGE);
  }

  const entries = report.data.map(parseEntry).sort(compareByDate);

  return {
    averageWeightKg: report.stats.averageWeightKg,
    dates: entries.map(entry => entry.date),
    weightsKg: entries.map(entry => entry.weightKg),
  };
}

function parseEntry(entry: WeightsEntryResponse): DatedWeightEntry {
  if (!isValidDate(entry.date) || !Number.isFinite(entry.weightKg)) {
    throw new Error(INVALID_DATA_MESSAGE);
  }

  return {
    date: entry.date,
    weightKg: entry.weightKg,
  };
}

function isValidDate(date: string): boolean {
  const timestamp = Date.parse(`${date}T00:00:00Z`);

  if (!DATE_PATTERN.test(date) || !Number.isFinite(timestamp)) {
    return false;
  }

  return new Date(timestamp).toISOString().slice(0, 10) === date;
}

function compareByDate(
  left: DatedWeightEntry,
  right: DatedWeightEntry,
): number {
  return left.date.localeCompare(right.date);
}
