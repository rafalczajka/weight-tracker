import type { WeightsGetResponse } from '@weight-tracker/api-client';
import plot from 'simple-ascii-chart';
import { AppError } from '../errors';
import { createWeightChartModel } from './model';
import { createWeightChartSettings } from './settings';

export function createWeightChart(report: WeightsGetResponse): string | null {
  try {
    const model = createWeightChartModel(report);

    if (!model) {
      return null;
    }

    return plot(model.points, createWeightChartSettings(model));
  } catch (error) {
    throw new AppError('Unable to render weight chart.', { cause: error });
  }
}
