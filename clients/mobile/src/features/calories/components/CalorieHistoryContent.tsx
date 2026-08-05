import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { DateRangeModal, Screen, ScreenState, TextButton } from '@/components';
import type { ThemeColors } from '@/theme';
import type { useCalorieHistory } from '../hooks/useCalorieHistory';
import { CalorieHistoryTable } from './CalorieHistoryTable';

interface CalorieHistoryContentProps {
  colors: ThemeColors;
  history: ReturnType<typeof useCalorieHistory>;
  onAddEntry: () => void;
  onOpenDay: (date: string) => void;
}

export function CalorieHistoryContent({
  colors,
  history,
  onAddEntry,
  onOpenDay,
}: CalorieHistoryContentProps) {
  const [filtersVisible, setFiltersVisible] = useState(false);
  const days = history.result?.data ?? [];

  return (
    <>
      <Screen onRefresh={history.refresh} refreshing={history.refreshing}>
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
            {days.length} {days.length === 1 ? 'day' : 'days'}
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

        {days.length === 0 ? (
          <View style={styles.empty}>
            <ScreenState
              actionLabel="Add calories"
              colors={colors}
              kind="empty"
              message={
                history.range.from || history.range.to
                  ? 'No calorie entries match this date range.'
                  : undefined
              }
              onAction={onAddEntry}
              title="No calorie entries"
            />
          </View>
        ) : (
          <>
            <CalorieHistoryTable
              colors={colors}
              days={days}
              onOpenDay={onOpenDay}
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
