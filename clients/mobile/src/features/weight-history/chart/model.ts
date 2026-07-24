import type {
  WeightsEntryResponse,
  WeightsGetResponse,
} from '@weight-tracker/api-client';
import type { lineDataItem } from 'react-native-gifted-charts';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
const MINIMUM_Y_PADDING = 0.5;
const SCALE_STEP = 0.5;
const EDGE_SPACING = 4;
const MINIMUM_POINT_SPACING = 8;

interface DatedWeightEntry {
  date: string;
  day: number;
  weightKg: number;
}

interface ChartLayout {
  endSpacing: number;
  initialSpacing: number;
  plotWidth: number;
  showPoints: boolean;
}

interface YScale {
  maximumValue: number;
  offset: number;
}

export interface WeightChartModel {
  averageWeightKg: number;
  data: lineDataItem[];
  dateFrom: string;
  dateTo: string;
  endSpacing: number;
  initialSpacing: number;
  maximumWeightKg: number;
  maximumValue: number;
  minimumWeightKg: number;
  showPoints: boolean;
  stepValue: number;
  yAxisOffset: number;
}

export function createWeightChartModel(
  report: WeightsGetResponse,
  width: number,
): WeightChartModel | null {
  if (
    report.data.length === 0 ||
    !Number.isFinite(width) ||
    width <= 0 ||
    !Number.isFinite(report.stats.averageWeightKg)
  ) {
    return null;
  }

  const entries = parseEntries(report.data);

  if (!entries) {
    return null;
  }

  const firstEntry = entries[0];
  const lastEntry = entries.at(-1);

  if (!firstEntry || !lastEntry) {
    return null;
  }

  const weightsKg = entries.map(entry => entry.weightKg);
  const minimumWeightKg = Math.min(...weightsKg);
  const maximumWeightKg = Math.max(...weightsKg);
  const layout = createChartLayout(width, entries.length);
  const scale = createYScale(
    minimumWeightKg,
    maximumWeightKg,
    report.stats.averageWeightKg,
  );

  return {
    averageWeightKg: report.stats.averageWeightKg,
    data: createLineData(entries, layout.plotWidth),
    dateFrom: firstEntry.date,
    dateTo: lastEntry.date,
    endSpacing: layout.endSpacing,
    initialSpacing: layout.initialSpacing,
    maximumWeightKg,
    maximumValue: scale.maximumValue,
    minimumWeightKg,
    showPoints: layout.showPoints,
    stepValue: scale.maximumValue / 4,
    yAxisOffset: scale.offset,
  };
}

function parseEntries(
  entries: readonly WeightsEntryResponse[],
): DatedWeightEntry[] | null {
  const parsedEntries: DatedWeightEntry[] = [];

  for (const entry of entries) {
    const parsedEntry = parseEntry(entry);

    if (!parsedEntry) {
      return null;
    }

    parsedEntries.push(parsedEntry);
  }

  return parsedEntries.sort(compareByDay);
}

function parseEntry(entry: WeightsEntryResponse): DatedWeightEntry | null {
  const timestamp = Date.parse(`${entry.date}T00:00:00Z`);

  if (
    !DATE_PATTERN.test(entry.date) ||
    !Number.isFinite(timestamp) ||
    !Number.isFinite(entry.weightKg)
  ) {
    return null;
  }

  const normalizedDate = new Date(timestamp).toISOString().slice(0, 10);

  if (normalizedDate !== entry.date) {
    return null;
  }

  return {
    date: entry.date,
    day: timestamp / MILLISECONDS_PER_DAY,
    weightKg: entry.weightKg,
  };
}

function compareByDay(left: DatedWeightEntry, right: DatedWeightEntry): number {
  return left.day - right.day;
}

function createChartLayout(width: number, entryCount: number): ChartLayout {
  const singleEntry = entryCount === 1;
  const initialSpacing = singleEntry ? width / 2 : EDGE_SPACING;
  const endSpacing = singleEntry ? width / 2 : EDGE_SPACING;
  const plotWidth = Math.max(0, width - initialSpacing - endSpacing);
  const averagePointSpacing = plotWidth / Math.max(entryCount - 1, 1);

  return {
    endSpacing,
    initialSpacing,
    plotWidth,
    showPoints: singleEntry || averagePointSpacing >= MINIMUM_POINT_SPACING,
  };
}

function createLineData(
  entries: readonly DatedWeightEntry[],
  width: number,
): lineDataItem[] {
  const firstEntry = entries[0];
  const lastEntry = entries.at(-1);

  if (!firstEntry || !lastEntry) {
    return [];
  }

  const labelDays = createLabelDays(entries, firstEntry, lastEntry);
  const totalDays = lastEntry.day - firstEntry.day;
  const equalSpacing = width / Math.max(entries.length - 1, 1);

  return entries.map((entry, index) => ({
    label: labelDays.has(entry.day) ? entry.date.slice(5) : undefined,
    spacing: calculatePointSpacing(
      entry,
      entries[index + 1],
      totalDays,
      width,
      equalSpacing,
    ),
    value: entry.weightKg,
  }));
}

function calculatePointSpacing(
  entry: DatedWeightEntry,
  nextEntry: DatedWeightEntry | undefined,
  totalDays: number,
  width: number,
  equalSpacing: number,
): number {
  if (!nextEntry) {
    return 0;
  }

  if (totalDays <= 0) {
    return equalSpacing;
  }

  return ((nextEntry.day - entry.day) / totalDays) * width;
}

function createLabelDays(
  entries: readonly DatedWeightEntry[],
  firstEntry: DatedWeightEntry,
  lastEntry: DatedWeightEntry,
): Set<number> {
  if (firstEntry.day === lastEntry.day) {
    return new Set([firstEntry.day]);
  }

  const middleDay = firstEntry.day + (lastEntry.day - firstEntry.day) / 2;
  const middleEntry = entries.reduce(
    (closest, entry) =>
      Math.abs(entry.day - middleDay) < Math.abs(closest.day - middleDay)
        ? entry
        : closest,
    firstEntry,
  );

  return new Set([firstEntry.day, middleEntry.day, lastEntry.day]);
}

function createYScale(
  minimumWeightKg: number,
  maximumWeightKg: number,
  averageWeightKg: number,
): YScale {
  const scaleMinimum = Math.min(minimumWeightKg, averageWeightKg);
  const scaleMaximum = Math.max(maximumWeightKg, averageWeightKg);
  const padding = Math.max(
    (scaleMaximum - scaleMinimum) * 0.1,
    MINIMUM_Y_PADDING,
  );
  const offset = Math.max(
    0,
    Math.floor((scaleMinimum - padding) / SCALE_STEP) * SCALE_STEP,
  );
  const upperBound =
    Math.ceil((scaleMaximum + padding) / SCALE_STEP) * SCALE_STEP;

  return {
    maximumValue: Math.max(SCALE_STEP * 2, upperBound - offset),
    offset,
  };
}
