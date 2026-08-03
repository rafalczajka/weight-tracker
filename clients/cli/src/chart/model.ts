import type {
  WeightMovingAverageValue,
  WeightsEntryResponse,
  WeightsGetResponse,
} from '@weight-tracker/api-client';
import {
  createBmiChartModel,
  type BmiChartData,
  type BmiChartModel,
} from './bmi';

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const INVALID_DATA_MESSAGE = 'Weight chart data is invalid.';

interface ChartPoint {
  date: string;
  weightKg: number;
}

interface ChartSeries {
  dates: string[];
  weightsKg: number[];
}

export interface WeightChartModel {
  bmi: BmiChartModel | null;
  movingAverage: ChartSeries & {
    windowDays: number;
  };
  weight: ChartSeries;
}

export function createWeightChartModel(
  report: WeightsGetResponse,
  bmiData?: BmiChartData,
): WeightChartModel | null {
  if (report.data.length === 0) {
    return null;
  }

  const movingAverage = report.movingAverage;

  if (
    !movingAverage ||
    !Number.isSafeInteger(movingAverage.windowDays) ||
    movingAverage.windowDays <= 0
  ) {
    throw new Error(INVALID_DATA_MESSAGE);
  }

  const weightPoints = report.data.map(parseWeightPoint).sort(compareByDate);
  const averagePoints = movingAverage.values
    .map(parseAveragePoint)
    .sort(compareByDate);

  if (
    weightPoints.length !== averagePoints.length ||
    weightPoints.some(
      (point, index) => point.date !== averagePoints[index]?.date,
    )
  ) {
    throw new Error(INVALID_DATA_MESSAGE);
  }

  const weight = createSeries(weightPoints);
  const movingAverageSeries = createSeries(averagePoints);

  return {
    bmi: bmiData
      ? createBmiChartModel(bmiData, [
          ...weight.weightsKg,
          ...movingAverageSeries.weightsKg,
        ])
      : null,
    movingAverage: {
      ...movingAverageSeries,
      windowDays: movingAverage.windowDays,
    },
    weight,
  };
}

function parseWeightPoint(entry: WeightsEntryResponse): ChartPoint {
  return parsePoint(entry.date, entry.weightKg);
}

function parseAveragePoint(entry: WeightMovingAverageValue): ChartPoint {
  return parsePoint(entry.date, entry.averageWeightKg);
}

function parsePoint(date: string, weightKg: number): ChartPoint {
  if (!isValidDate(date) || !Number.isFinite(weightKg)) {
    throw new Error(INVALID_DATA_MESSAGE);
  }

  return { date, weightKg };
}

function createSeries(points: ChartPoint[]): ChartSeries {
  return {
    dates: points.map(point => point.date),
    weightsKg: points.map(point => point.weightKg),
  };
}

function isValidDate(date: string): boolean {
  const timestamp = Date.parse(`${date}T00:00:00Z`);

  if (!DATE_PATTERN.test(date) || !Number.isFinite(timestamp)) {
    return false;
  }

  return new Date(timestamp).toISOString().slice(0, 10) === date;
}

function compareByDate(left: ChartPoint, right: ChartPoint): number {
  return left.date.localeCompare(right.date);
}
