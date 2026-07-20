import type {
  WeightsEntryResponse,
  WeightsGetResponse,
} from '@weight-tracker/api-client';
import type { Point } from 'simple-ascii-chart';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
const MINIMUM_Y_PADDING = 0.5;
const INVALID_DATA_MESSAGE = 'Weight chart data is invalid.';

interface DatedWeightEntry {
  date: string;
  day: number;
  weight: number;
}

export interface WeightChartModel {
  average: number;
  dateFrom: string;
  dateTo: string;
  firstDay: number;
  lastDay: number;
  points: Point[];
  yRange: [number, number];
}

export function createWeightChartModel(
  report: WeightsGetResponse,
): WeightChartModel | null {
  if (report.data.length === 0) {
    return null;
  }

  if (!Number.isFinite(report.stats.avg)) {
    throw new Error(INVALID_DATA_MESSAGE);
  }

  const entries = report.data.map(parseEntry).sort(compareByDay);
  const firstEntry = entries[0];
  const lastEntry = entries.at(-1);

  if (!firstEntry || !lastEntry) {
    throw new Error(INVALID_DATA_MESSAGE);
  }

  const points = entries.map(
    entry => [entry.day, entry.weight] satisfies Point,
  );

  return {
    average: report.stats.avg,
    dateFrom: firstEntry.date,
    dateTo: lastEntry.date,
    firstDay: firstEntry.day,
    lastDay: lastEntry.day,
    points,
    yRange: calculateYRange(entries, report.stats.avg),
  };
}

export function formatShortDate(day: number): string {
  return new Date(day * MILLISECONDS_PER_DAY).toISOString().slice(5, 10);
}

function parseEntry(entry: WeightsEntryResponse): DatedWeightEntry {
  if (!Number.isFinite(entry.weight)) {
    throw new Error(INVALID_DATA_MESSAGE);
  }

  return {
    date: entry.date,
    day: parseUtcDay(entry.date),
    weight: entry.weight,
  };
}

function parseUtcDay(date: string): number {
  const timestamp = Date.parse(`${date}T00:00:00Z`);

  if (!DATE_PATTERN.test(date) || !Number.isFinite(timestamp)) {
    throw new Error(INVALID_DATA_MESSAGE);
  }

  const normalizedDate = new Date(timestamp).toISOString().slice(0, 10);

  if (normalizedDate !== date) {
    throw new Error(INVALID_DATA_MESSAGE);
  }

  return timestamp / MILLISECONDS_PER_DAY;
}

function compareByDay(left: DatedWeightEntry, right: DatedWeightEntry): number {
  return left.day - right.day;
}

function calculateYRange(
  entries: readonly DatedWeightEntry[],
  average: number,
): [number, number] {
  const weights = entries.map(entry => entry.weight);
  const minimum = Math.min(...weights, average);
  const maximum = Math.max(...weights, average);
  const padding = Math.max((maximum - minimum) * 0.1, MINIMUM_Y_PADDING);

  return [Math.max(0, minimum - padding), maximum + padding];
}
