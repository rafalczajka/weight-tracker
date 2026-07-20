import type { WeightsGetResponse } from '@weight-tracker/api-client';
import React, { useMemo, useState } from 'react';
import type { LayoutChangeEvent } from 'react-native';
import { StyleSheet, Text, View } from 'react-native';
import { LineChart, ruleTypes } from 'react-native-gifted-charts';
import type { ThemeColors } from '../../../ui';
import { createWeightChartModel, type WeightChartModel } from './model';

const MINIMUM_CHART_HEIGHT = 260;
const MAXIMUM_CHART_HEIGHT = 380;
const Y_AXIS_LABEL_WIDTH = 52;

interface WeightChartProps {
  colors: ThemeColors;
  report: WeightsGetResponse;
}

export function WeightChart({ colors, report }: WeightChartProps) {
  const [width, setWidth] = useState(0);
  const chartWidth = Math.max(0, width - Y_AXIS_LABEL_WIDTH);
  const chartHeight = calculateChartHeight(width);
  const chart = useMemo(
    () => createWeightChartModel(report, chartWidth),
    [chartWidth, report],
  );

  function handleLayout(event: LayoutChangeEvent) {
    const measuredWidth = Math.round(event.nativeEvent.layout.width);
    setWidth(currentWidth =>
      currentWidth === measuredWidth ? currentWidth : measuredWidth,
    );
  }

  return (
    <View>
      <View accessibilityElementsHidden style={styles.legend}>
        <LegendItem
          color={colors.chartLine}
          label="Weight"
          textColor={colors.text}
        />
        <LegendItem
          color={colors.chartAverage}
          label="Average"
          textColor={colors.text}
        />
      </View>

      <View
        accessibilityLabel={createAccessibilityLabel(chart)}
        accessibilityRole="image"
        accessible
        onLayout={handleLayout}
        style={styles.chartContainer}
      >
        {chart ? (
          <>
            <Text style={[styles.axisTitle, { color: colors.text }]}>
              Weight [kg]
            </Text>
            <LineChart
              color={colors.chartLine}
              data={chart.data}
              dataPointsColor={colors.chartLine}
              dataPointsRadius={3.5}
              disableScroll
              endSpacing={chart.endSpacing}
              height={chartHeight}
              hideDataPoints={!chart.showPoints}
              initialSpacing={chart.initialSpacing}
              isAnimated={false}
              maxValue={chart.maximumValue}
              noOfSections={4}
              referenceLine1Config={{
                color: colors.chartAverage,
                dashGap: 5,
                dashWidth: 7,
                thickness: 2,
                type: ruleTypes.DASHED,
                width: chartWidth,
              }}
              referenceLine1Position={chart.average}
              referenceLinesOverChartContent={false}
              roundToDigits={1}
              rulesColor={colors.chartGrid}
              rulesThickness={1}
              showFractionalValues
              showReferenceLine1
              stepValue={chart.stepValue}
              thickness={3}
              width={chartWidth}
              xAxisColor={colors.muted}
              xAxisLabelTextStyle={[styles.xAxisLabel, { color: colors.muted }]}
              xAxisLabelsHeight={22}
              yAxisColor={colors.muted}
              yAxisLabelWidth={Y_AXIS_LABEL_WIDTH}
              yAxisOffset={chart.yAxisOffset}
              yAxisTextStyle={[styles.yAxisLabel, { color: colors.muted }]}
            />
            <Text style={[styles.xAxisTitle, { color: colors.text }]}>
              Date
            </Text>
          </>
        ) : (
          <View style={{ height: chartHeight }} />
        )}
      </View>
    </View>
  );
}

function calculateChartHeight(width: number): number {
  return Math.max(
    MINIMUM_CHART_HEIGHT,
    Math.min(MAXIMUM_CHART_HEIGHT, width * 0.68),
  );
}

function createAccessibilityLabel(chart: WeightChartModel | null): string {
  if (!chart) {
    return 'Weight chart';
  }

  return [
    `Weight chart from ${chart.dateFrom} to ${chart.dateTo}.`,
    `Minimum ${chart.minimum.toFixed(2)} kilograms,`,
    `maximum ${chart.maximum.toFixed(2)} kilograms,`,
    `average ${chart.average.toFixed(2)} kilograms.`,
  ].join(' ');
}

interface LegendItemProps {
  color: string;
  label: string;
  textColor: string;
}

function LegendItem({ color, label, textColor }: LegendItemProps) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.swatch, { backgroundColor: color }]} />
      <Text style={[styles.legendText, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  axisTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0,
    marginBottom: 6,
    textAlign: 'center',
  },
  chartContainer: {
    minHeight: MINIMUM_CHART_HEIGHT,
    width: '100%',
  },
  legend: {
    flexDirection: 'row',
    gap: 24,
    justifyContent: 'center',
    marginBottom: 8,
    marginTop: 24,
  },
  legendItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  legendText: {
    fontSize: 13,
    letterSpacing: 0,
  },
  swatch: {
    height: 3,
    width: 24,
  },
  xAxisLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  xAxisTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0,
    marginTop: 4,
    textAlign: 'center',
  },
  yAxisLabel: {
    fontSize: 11,
  },
});
