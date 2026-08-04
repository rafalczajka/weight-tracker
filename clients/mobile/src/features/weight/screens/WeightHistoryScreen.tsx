import type { WeightsEntryResponse } from '@weight-tracker/api-client';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { AuthSessionController } from '../../../auth';
import {
  DateRangeModal,
  Screen,
  ScreenState,
  TextButton,
} from '../../../components';
import type { ThemeColors } from '../../../theme';
import { WeightHistoryTable } from '../components/WeightHistoryTable';
import { useWeightHistory } from '../hooks/useWeightHistory';

interface WeightHistoryScreenProps {
  auth: AuthSessionController;
  colors: ThemeColors;
  initialNotice?: string;
  onAddWeight: () => void;
  onOpenEntry: (entry: WeightsEntryResponse, previousWeightKg?: number) => void;
}

export function WeightHistoryScreen({
  auth,
  colors,
  initialNotice,
  onAddWeight,
  onOpenEntry,
}: WeightHistoryScreenProps) {
  const history = useWeightHistory(auth);
  const [filtersVisible, setFiltersVisible] = useState(false);
  const result = history.result;
  const entries = result?.data ?? [];

  if (history.loading && !history.result) {
    return (
      <Screen centered>
        <ScreenState colors={colors} kind="loading" title="Loading weights" />
      </Screen>
    );
  }

  if (history.error && !history.result) {
    return (
      <Screen centered>
        <ScreenState
          actionLabel="Try again"
          colors={colors}
          kind="error"
          onAction={history.retry}
          title={history.error}
        />
      </Screen>
    );
  }

  return (
    <>
      <Screen onRefresh={history.refresh} refreshing={history.refreshing}>
        {initialNotice ? (
          <Text
            accessibilityLiveRegion="polite"
            style={[styles.notice, { color: colors.success }]}
          >
            {initialNotice}
          </Text>
        ) : null}
        {history.error ? (
          <Text
            accessibilityLiveRegion="polite"
            style={[styles.notice, { color: colors.error }]}
          >
            {history.error}
          </Text>
        ) : null}
        <View style={styles.toolbar}>
          <Text style={[styles.resultCount, { color: colors.muted }]}>
            {entries.length}{' '}
            {entries.length === 1 ? 'measurement' : 'measurements'}
          </Text>
          <TextButton
            colors={colors}
            label={
              history.range.from || history.range.to
                ? 'Filters active'
                : 'Filters'
            }
            onPress={() => setFiltersVisible(true)}
          />
        </View>

        {!result || entries.length === 0 ? (
          <View style={styles.empty}>
            <ScreenState
              actionLabel="Add weight"
              colors={colors}
              kind="empty"
              message={
                history.range.from || history.range.to
                  ? 'No measurements match this date range.'
                  : undefined
              }
              onAction={onAddWeight}
              title="No weight entries"
            />
          </View>
        ) : (
          <>
            <WeightHistoryTable
              colors={colors}
              onOpenEntry={onOpenEntry}
              result={result}
            />
            {history.hasMore ? (
              <TextButton
                colors={colors}
                disabled={history.loading}
                label="Load more"
                loading={history.loading}
                onPress={history.loadMore}
                style={styles.loadMore}
              />
            ) : null}
          </>
        )}
      </Screen>
      <DateRangeModal
        colors={colors}
        onApply={range => {
          history.applyRange(range);
          setFiltersVisible(false);
        }}
        onClose={() => setFiltersVisible(false)}
        range={history.range}
        visible={filtersVisible}
      />
    </>
  );
}

const styles = StyleSheet.create({
  empty: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 360,
  },
  loadMore: {
    alignSelf: 'center',
    marginTop: 14,
  },
  notice: {
    fontSize: 14,
    letterSpacing: 0,
    marginBottom: 8,
    textAlign: 'center',
  },
  resultCount: {
    fontSize: 14,
    letterSpacing: 0,
  },
  toolbar: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    minHeight: 44,
  },
});
