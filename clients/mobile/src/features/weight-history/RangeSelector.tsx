import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ThemeColors } from '../../ui';
import type { WeightHistoryRange } from './range';

const RANGE_OPTIONS: ReadonlyArray<{
  label: string;
  value: WeightHistoryRange;
}> = [
  { label: '30D', value: '30d' },
  { label: '90D', value: '90d' },
  { label: 'All', value: 'all' },
];

interface RangeSelectorProps {
  colors: ThemeColors;
  value: WeightHistoryRange;
  onChange: (range: WeightHistoryRange) => void;
}

export function RangeSelector({ colors, value, onChange }: RangeSelectorProps) {
  return (
    <View
      accessibilityLabel="Weight history range"
      accessibilityRole="tablist"
      style={[styles.container, { borderColor: colors.border }]}
    >
      {RANGE_OPTIONS.map(range => {
        const selected = range.value === value;

        return (
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            key={range.value}
            onPress={() => onChange(range.value)}
            style={({ pressed }) => [
              styles.option,
              selected && { backgroundColor: colors.button },
              pressed && styles.pressed,
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: selected ? colors.buttonText : colors.text },
              ]}
            >
              {range.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    height: 42,
    overflow: 'hidden',
    width: 240,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0,
  },
  option: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.78,
  },
});
