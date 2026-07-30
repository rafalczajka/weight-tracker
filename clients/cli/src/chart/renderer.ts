import { createRequire } from 'node:module';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { getRawAsset, isSea } from 'node:sea';
import { pathToFileURL } from 'node:url';
import type { WeightsGetResponse } from '@weight-tracker/api-client';
import { openBrowser } from '../browser';
import { AppError } from '../errors';
import { createWeightChartDocument } from './document';
import { createWeightChartModel } from './model';

const PLOTLY_PACKAGE_NAME = 'plotly.js-basic-dist-min';
const PLOTLY_ASSET_NAME = 'plotly-basic.min.js';
const CHART_FILE_NAME = 'weight-chart.html';
const TEMP_DIRECTORY_NAME = 'wtrack';

export async function showWeightChart(
  report: WeightsGetResponse,
): Promise<void> {
  try {
    const model = createWeightChartModel(report);

    if (!model) {
      return;
    }

    const directory = join(tmpdir(), TEMP_DIRECTORY_NAME);
    const chartPath = join(directory, CHART_FILE_NAME);
    const plotlyPath = join(directory, PLOTLY_ASSET_NAME);
    const plotlyBundle = await loadPlotlyBundle();

    await mkdir(directory, { recursive: true });
    await Promise.all([
      writeFile(chartPath, createWeightChartDocument(model), 'utf8'),
      writeFile(plotlyPath, plotlyBundle),
    ]);
    await openBrowser(pathToFileURL(chartPath).href);
  } catch (error) {
    throw new AppError('Unable to display weight chart.', { cause: error });
  }
}

async function loadPlotlyBundle(): Promise<Uint8Array> {
  if (isSea()) {
    return new Uint8Array(getRawAsset(PLOTLY_ASSET_NAME));
  }

  const entryPoint = resolve(process.argv[1] ?? 'package.json');
  const bundledAsset = join(dirname(entryPoint), PLOTLY_ASSET_NAME);

  try {
    return await readFile(bundledAsset);
  } catch (error) {
    if (!isFileNotFound(error)) {
      throw error;
    }
  }

  const require = createRequire(entryPoint);
  const packagePath = require.resolve(PLOTLY_PACKAGE_NAME);

  return readFile(packagePath);
}

function isFileNotFound(error: unknown): boolean {
  return error instanceof Error && 'code' in error && error.code === 'ENOENT';
}
