import type { BmiCategory } from '@weight-tracker/api-client';
import type { WeightChartModel } from './model';

const BACKGROUND_COLOR = '#0d0f12';
const PLOT_BACKGROUND_COLOR = '#14171b';
const FOREGROUND_COLOR = '#e5e7eb';
const MUTED_COLOR = '#9ca3af';
const GRID_COLOR = '#2b3036';
const WEIGHT_COLOR = '#22d3ee';
const AVERAGE_COLOR = '#f59e0b';
const BMI_THRESHOLD_COLOR = '#94a3b8';
const MAXIMUM_MARKER_COUNT = 40;

const BMI_CATEGORY_COLORS: Readonly<Record<BmiCategory, string>> = {
  healthyWeight: '#34d399',
  obesityClass1: '#fb7185',
  obesityClass2: '#f43f5e',
  obesityClass3: '#e11d48',
  overweight: '#fbbf24',
  underweight: '#60a5fa',
};

interface ChartDecorations {
  annotations: Record<string, unknown>[];
  shapes: Record<string, unknown>[];
  titleText: string;
  topMargin: number;
  yAxisRange: [number, number] | null;
}

export function createWeightChartDocument(model: WeightChartModel): string {
  const decorations = createChartDecorations(model);
  const weightMode =
    model.weight.dates.length === 1
      ? 'markers'
      : model.weight.dates.length <= MAXIMUM_MARKER_COUNT
      ? 'lines+markers'
      : 'lines';

  const figure = {
    data: [
      {
        hovertemplate: '%{x|%Y-%m-%d}<br><b>%{y:.2f} kg</b><extra></extra>',
        line: { color: WEIGHT_COLOR, width: 3 },
        marker: { color: WEIGHT_COLOR, size: 6 },
        mode: weightMode,
        name: 'Weight',
        type: 'scatter',
        x: model.weight.dates,
        y: model.weight.weightsKg,
      },
      {
        hovertemplate: '%{x|%Y-%m-%d}<br><b>%{y:.2f} kg</b><extra></extra>',
        line: { color: AVERAGE_COLOR, dash: 'dash', width: 2 },
        marker: { color: AVERAGE_COLOR, size: 5 },
        mode: model.movingAverage.dates.length === 1 ? 'markers' : 'lines',
        name: `${model.movingAverage.windowDays}-day average`,
        type: 'scatter',
        x: model.movingAverage.dates,
        y: model.movingAverage.weightsKg,
      },
    ],
    layout: {
      annotations: decorations.annotations,
      autosize: true,
      font: { color: FOREGROUND_COLOR },
      hovermode: 'x unified',
      legend: {
        font: { color: FOREGROUND_COLOR },
        orientation: 'h',
        x: 1,
        xanchor: 'right',
        y: 1.02,
        yanchor: 'bottom',
      },
      margin: { b: 64, l: 72, r: 32, t: decorations.topMargin },
      paper_bgcolor: BACKGROUND_COLOR,
      plot_bgcolor: PLOT_BACKGROUND_COLOR,
      shapes: decorations.shapes,
      title: {
        font: { size: 22 },
        text: decorations.titleText,
        x: 0.5,
        xanchor: 'center',
      },
      xaxis: {
        gridcolor: GRID_COLOR,
        hoverformat: '%Y-%m-%d',
        tickfont: { color: MUTED_COLOR },
        title: { text: 'Date' },
        type: 'date',
      },
      yaxis: {
        gridcolor: GRID_COLOR,
        ...(decorations.yAxisRange ? { range: decorations.yAxisRange } : {}),
        tickfont: { color: MUTED_COLOR },
        tickformat: '.1f',
        title: { text: 'Weight [kg]' },
      },
    },
    config: {
      displaylogo: false,
      modeBarButtonsToRemove: ['lasso2d', 'select2d'],
      responsive: true,
    },
  };

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Weight Tracker</title>
    <style>
      html, body, #chart {
        width: 100%;
        height: 100%;
        margin: 0;
      }

      body {
        overflow: hidden;
        background: ${BACKGROUND_COLOR};
      }
    </style>
    <script src="plotly-basic.min.js" charset="utf-8"></script>
  </head>
  <body>
    <div id="chart"></div>
    <script>
      const figure = ${serializeForInlineScript(figure)};
      Plotly.newPlot('chart', figure.data, figure.layout, figure.config);
    </script>
  </body>
</html>
`;
}

function createChartDecorations(model: WeightChartModel): ChartDecorations {
  if (!model.bmi) {
    return {
      annotations: [],
      shapes: [],
      titleText: '<b>Weight Tracker</b>',
      topMargin: 96,
      yAxisRange: null,
    };
  }

  const category = model.bmi.category;
  const categoryColor = BMI_CATEGORY_COLORS[category];
  const yAxisRange = createYAxisRange(model);
  const currentRangeMinimum = Math.max(
    model.bmi.currentRange.minimumWeightKg ?? yAxisRange[0],
    yAxisRange[0],
  );
  const currentRangeMaximum = Math.min(
    model.bmi.currentRange.maximumWeightKg ?? yAxisRange[1],
    yAxisRange[1],
  );
  const shapes: Record<string, unknown>[] = [];

  if (currentRangeMinimum < currentRangeMaximum) {
    shapes.push({
      fillcolor: categoryColor,
      layer: 'below',
      line: { width: 0 },
      opacity: 0.08,
      type: 'rect',
      x0: 0,
      x1: 1,
      xref: 'paper',
      y0: currentRangeMinimum,
      y1: currentRangeMaximum,
      yref: 'y',
    });
  }

  shapes.push(
    ...model.bmi.thresholds.map(threshold => ({
      layer: 'above',
      line: { color: BMI_THRESHOLD_COLOR, dash: 'dot', width: 1.5 },
      type: 'line',
      x0: 0,
      x1: 1,
      xref: 'paper',
      y0: threshold.weightKg,
      y1: threshold.weightKg,
      yref: 'y',
    })),
  );

  return {
    annotations: model.bmi.thresholds.map(threshold => ({
      bgcolor: PLOT_BACKGROUND_COLOR,
      borderpad: 2,
      font: { color: BMI_THRESHOLD_COLOR, size: 11 },
      showarrow: false,
      text: `BMI ${threshold.bmi.toFixed(1)} · ${threshold.weightKg.toFixed(
        1,
      )} kg`,
      x: 0.99,
      xanchor: 'right',
      xref: 'paper',
      y: threshold.weightKg,
      yanchor: 'bottom',
      yref: 'y',
      yshift: 2,
    })),
    shapes,
    titleText:
      '<b>Weight Tracker</b><br>' +
      `<span style="font-size:12px;color:${categoryColor}">` +
      `BMI reference: ${escapeHtml(model.bmi.categoryName)}</span>`,
    topMargin: 112,
    yAxisRange,
  };
}

function createYAxisRange(model: WeightChartModel): [number, number] {
  const values = [
    ...model.weight.weightsKg,
    ...model.movingAverage.weightsKg,
    ...(model.bmi?.thresholds.map(threshold => threshold.weightKg) ?? []),
  ];
  const minimum = Math.min(...values);
  const maximum = Math.max(...values);
  const margin = Math.max((maximum - minimum) * 0.08, 0.5);

  return [Math.max(0, minimum - margin), maximum + margin];
}

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function serializeForInlineScript(value: object): string {
  return JSON.stringify(value)
    .replaceAll('&', '\\u0026')
    .replaceAll('<', '\\u003c')
    .replaceAll('>', '\\u003e')
    .replaceAll('\u2028', '\\u2028')
    .replaceAll('\u2029', '\\u2029');
}
