import type {
  BmiCategory,
  BmiPostResponse,
  BmiRangeResponse,
} from '@weight-tracker/api-client';

const INVALID_DATA_MESSAGE = 'BMI chart data is invalid.';

export type BmiChartData = Pick<
  BmiPostResponse,
  'category' | 'categoryName' | 'ranges'
>;

export interface BmiChartModel {
  category: BmiCategory;
  categoryName: string;
  currentRange: BmiWeightRange;
  thresholds: BmiThreshold[];
}

export interface BmiThreshold {
  bmi: number;
  weightKg: number;
}

interface BmiWeightRange {
  maximumWeightKg: number | null;
  minimumWeightKg: number | null;
}

export function createBmiChartModel(
  data: BmiChartData,
  chartWeightsKg: readonly number[],
): BmiChartModel {
  const currentRange = data.ranges.find(
    range => range.category === data.category,
  );

  if (!currentRange || chartWeightsKg.length === 0) {
    throw new Error(INVALID_DATA_MESSAGE);
  }

  const minimumChartWeight = Math.min(...chartWeightsKg);
  const maximumChartWeight = Math.max(...chartWeightsKg);

  return {
    category: data.category,
    categoryName: data.categoryName,
    currentRange: {
      maximumWeightKg: currentRange.maximumWeightKgExclusive ?? null,
      minimumWeightKg: currentRange.minimumWeightKgInclusive ?? null,
    },
    thresholds: selectNearestThresholds(
      createThresholds(data.ranges),
      minimumChartWeight,
      maximumChartWeight,
    ),
  };
}

function createThresholds(ranges: readonly BmiRangeResponse[]): BmiThreshold[] {
  const thresholds = new Map<number, BmiThreshold>();

  for (const range of ranges) {
    addThreshold(
      thresholds,
      range.minimumBmiInclusive,
      range.minimumWeightKgInclusive,
    );
    addThreshold(
      thresholds,
      range.maximumBmiExclusive,
      range.maximumWeightKgExclusive,
    );
  }

  return [...thresholds.values()].sort(
    (left, right) => left.weightKg - right.weightKg,
  );
}

function addThreshold(
  thresholds: Map<number, BmiThreshold>,
  bmi: number | null | undefined,
  weightKg: number | null | undefined,
): void {
  if (bmi != null && weightKg != null && !thresholds.has(bmi)) {
    thresholds.set(bmi, { bmi, weightKg });
  }
}

function selectNearestThresholds(
  thresholds: readonly BmiThreshold[],
  minimumWeightKg: number,
  maximumWeightKg: number,
): BmiThreshold[] {
  const visibleThresholds = thresholds.filter(
    threshold =>
      threshold.weightKg >= minimumWeightKg &&
      threshold.weightKg <= maximumWeightKg,
  );

  if (visibleThresholds.length >= 2) {
    return visibleThresholds;
  }

  return [...thresholds]
    .sort(
      (left, right) =>
        distanceFromRange(left.weightKg, minimumWeightKg, maximumWeightKg) -
        distanceFromRange(right.weightKg, minimumWeightKg, maximumWeightKg),
    )
    .slice(0, 2)
    .sort((left, right) => left.weightKg - right.weightKg);
}

function distanceFromRange(
  value: number,
  minimum: number,
  maximum: number,
): number {
  return Math.max(minimum - value, value - maximum, 0);
}
