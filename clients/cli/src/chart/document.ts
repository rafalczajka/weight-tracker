import type { WeightChartModel } from './model';

const BACKGROUND_COLOR = '#0d0f12';
const PLOT_BACKGROUND_COLOR = '#14171b';
const FOREGROUND_COLOR = '#e5e7eb';
const MUTED_COLOR = '#9ca3af';
const GRID_COLOR = '#2b3036';
const WEIGHT_COLOR = '#22d3ee';
const AVERAGE_COLOR = '#f59e0b';
const MAXIMUM_MARKER_COUNT = 40;

export function createWeightChartDocument(model: WeightChartModel): string {
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
      margin: { b: 64, l: 72, r: 32, t: 96 },
      paper_bgcolor: BACKGROUND_COLOR,
      plot_bgcolor: PLOT_BACKGROUND_COLOR,
      title: {
        font: { size: 22 },
        text: '<b>Weight Tracker</b>',
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

function serializeForInlineScript(value: object): string {
  return JSON.stringify(value)
    .replaceAll('&', '\\u0026')
    .replaceAll('<', '\\u003c')
    .replaceAll('>', '\\u003e')
    .replaceAll('\u2028', '\\u2028')
    .replaceAll('\u2029', '\\u2029');
}
