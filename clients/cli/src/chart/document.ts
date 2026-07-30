import type { WeightChartModel } from './model';

const BACKGROUND_COLOR = '#111111';
const FOREGROUND_COLOR = '#f4f4f5';
const GRID_COLOR = '#333333';
const WEIGHT_COLOR = 'cyan';
const AVERAGE_COLOR = 'deeppink';

export function createWeightChartDocument(model: WeightChartModel): string {
  const figure = {
    data: [
      {
        line: { color: WEIGHT_COLOR },
        marker: { color: WEIGHT_COLOR, size: 6 },
        mode: model.dates.length === 1 ? 'markers' : 'lines+markers',
        name: 'Weight',
        type: 'scatter',
        x: model.dates,
        y: model.weightsKg,
      },
      {
        line: { color: AVERAGE_COLOR },
        mode: model.dates.length === 1 ? 'markers' : 'lines',
        name: 'Average',
        type: 'scatter',
        x: model.dates,
        y: model.dates.map(() => model.averageWeightKg),
      },
    ],
    layout: {
      autosize: true,
      font: { color: FOREGROUND_COLOR },
      hovermode: 'x unified',
      legend: {
        orientation: 'h',
        x: 1,
        xanchor: 'right',
        y: 1.02,
        yanchor: 'bottom',
      },
      margin: { b: 64, l: 72, r: 32, t: 96 },
      paper_bgcolor: BACKGROUND_COLOR,
      plot_bgcolor: BACKGROUND_COLOR,
      title: {
        font: { size: 24 },
        text: '<b>Weight Tracker - data visualization</b>',
        x: 0.5,
        xanchor: 'center',
      },
      xaxis: {
        gridcolor: GRID_COLOR,
        title: { text: 'Date' },
        type: 'date',
      },
      yaxis: {
        gridcolor: GRID_COLOR,
        title: { text: 'Weight [kg]' },
      },
    },
    config: {
      displaylogo: false,
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
