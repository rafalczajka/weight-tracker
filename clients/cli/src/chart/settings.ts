import { stdout } from 'node:process';
import type {
  Color,
  Formatter,
  GraphPoint,
  Settings,
  Threshold,
} from 'simple-ascii-chart';
import { formatShortDate, type WeightChartModel } from './model';

const CHART_HEIGHT = 12;
const DEFAULT_CHART_WIDTH = 68;
const MINIMUM_CHART_WIDTH = 20;
const MAXIMUM_CHART_WIDTH = 100;
const CHART_HORIZONTAL_OVERHEAD = 12;
const NARROW_CHART_WIDTH = 50;
const WEIGHT_COLOR: Color = 'ansiCyan';
const AVERAGE_COLOR: Color = 'ansiMagenta';

interface TerminalChartOptions {
  colorsEnabled: boolean;
  width: number;
}

export function createWeightChartSettings(model: WeightChartModel): Settings {
  const terminal = getTerminalChartOptions();
  const settings: Settings = {
    customXAxisTicks: createDateTicks(model, terminal.width),
    formatter: formatAxisLabel,
    height: CHART_HEIGHT,
    legend: {
      position: 'bottom',
      series: 'Weight',
      thresholds: 'Average',
    },
    mode: model.points.length === 1 ? 'point' : 'line',
    symbols: {
      thresholds: { x: '\u2504' },
    },
    thresholds: [
      createAverageThreshold(model.averageWeightKg, terminal.colorsEnabled),
    ],
    title: `Weight [kg] ${model.dateFrom} - ${model.dateTo}`,
    width: terminal.width,
    xLabel: 'Date',
    yRange: model.yRange,
  };

  if (terminal.colorsEnabled) {
    settings.color = WEIGHT_COLOR;
  }

  const singlePoint = createSinglePoint(model, terminal.colorsEnabled);

  if (singlePoint) {
    settings.points = [singlePoint];
  }

  return settings;
}

const formatAxisLabel: Formatter = (value, { axis }) =>
  axis === 'y' ? value.toFixed(1) : formatShortDate(value);

function createDateTicks(model: WeightChartModel, width: number): number[] {
  if (model.firstDay === model.lastDay) {
    return [model.firstDay];
  }

  if (width < NARROW_CHART_WIDTH) {
    return [model.firstDay, model.lastDay];
  }

  const middleDay = model.firstDay + (model.lastDay - model.firstDay) / 2;

  return [model.firstDay, middleDay, model.lastDay];
}

function createAverageThreshold(
  averageWeightKg: number,
  colorsEnabled: boolean,
): Threshold {
  const threshold: Threshold = { y: averageWeightKg };

  if (colorsEnabled) {
    threshold.color = AVERAGE_COLOR;
  }

  return threshold;
}

function createSinglePoint(
  model: WeightChartModel,
  colorsEnabled: boolean,
): GraphPoint | undefined {
  const coordinates = model.points[0];

  if (model.points.length !== 1 || !coordinates) {
    return undefined;
  }

  const [x, y] = coordinates;
  const point: GraphPoint = { x, y };

  if (colorsEnabled) {
    point.color = WEIGHT_COLOR;
  }

  return point;
}

function getTerminalChartOptions(): TerminalChartOptions {
  return {
    colorsEnabled: isColorOutputEnabled(),
    width: calculateChartWidth(stdout.columns),
  };
}

function calculateChartWidth(terminalWidth: number | undefined): number {
  if (!terminalWidth) {
    return DEFAULT_CHART_WIDTH;
  }

  const availableWidth = terminalWidth - CHART_HORIZONTAL_OVERHEAD;

  return Math.max(
    MINIMUM_CHART_WIDTH,
    Math.min(MAXIMUM_CHART_WIDTH, availableWidth),
  );
}

function isColorOutputEnabled(): boolean {
  return (
    Boolean(stdout.isTTY) && !process.env.NO_COLOR && process.env.CI !== 'true'
  );
}
