import React from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { PrimaryButton, StatusNotice, type ThemeColors } from '../../ui';
import { RangeSelector } from './RangeSelector';
import { WeightChart } from './chart';
import {
  useWeightHistory,
  type WeightHistoryController,
} from './useWeightHistory';

interface WeightHistoryScreenProps {
  colors: ThemeColors;
  getAccessToken: () => Promise<string | null>;
  onUnauthorized: () => Promise<void>;
}

export function WeightHistoryScreen({
  colors,
  getAccessToken,
  onUnauthorized,
}: WeightHistoryScreenProps) {
  const history = useWeightHistory({ getAccessToken, onUnauthorized });

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl
          colors={[colors.chartLine]}
          onRefresh={history.refresh}
          refreshing={history.refreshing}
          tintColor={colors.chartLine}
        />
      }
    >
      <View style={styles.content}>
        <RangeSelector
          colors={colors}
          onChange={history.changeRange}
          value={history.range}
        />
        <HistoryContent colors={colors} history={history} />
      </View>
    </ScrollView>
  );
}

interface HistoryContentProps {
  colors: ThemeColors;
  history: WeightHistoryController;
}

function HistoryContent({ colors, history }: HistoryContentProps) {
  if (history.loading) {
    return (
      <View style={styles.stateArea}>
        <ActivityIndicator
          accessibilityLabel="Loading weight history"
          color={colors.text}
          size="large"
        />
      </View>
    );
  }

  if (!history.report?.data.length) {
    return <HistoryMessage colors={colors} history={history} />;
  }

  return (
    <>
      <WeightChart colors={colors} report={history.report} />
      <StatusNotice colors={colors} notice={history.notice} />
    </>
  );
}

function HistoryMessage({ colors, history }: HistoryContentProps) {
  return (
    <View style={styles.stateArea}>
      <Text
        accessibilityLiveRegion={history.notice ? 'assertive' : 'none'}
        style={[
          styles.stateText,
          { color: history.notice ? colors.error : colors.muted },
        ]}
      >
        {history.notice?.text ?? 'No weight data yet.'}
      </Text>
      {history.notice ? (
        <PrimaryButton
          colors={colors}
          disabled={history.refreshing}
          label="Try again"
          loading={history.refreshing}
          onPress={history.refresh}
          style={styles.retryButton}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    alignSelf: 'center',
    maxWidth: 720,
    paddingHorizontal: 20,
    width: '100%',
  },
  retryButton: {
    marginTop: 20,
    maxWidth: 240,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 28,
    paddingTop: 24,
  },
  stateArea: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
  stateText: {
    fontSize: 15,
    letterSpacing: 0,
    textAlign: 'center',
  },
});
