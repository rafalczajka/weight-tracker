import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ThemeColors } from '@/theme';
import type { ProductCalorieMode } from '../productCalories';

interface ProductCalorieModeSelectorProps {
  colors: ThemeColors;
  mode: ProductCalorieMode;
  onChange: (mode: ProductCalorieMode) => void;
}

const options: ReadonlyArray<{
  label: string;
  value: ProductCalorieMode;
}> = [
  { label: 'Serving', value: 'serving' },
  { label: 'Amount', value: 'amount' },
];

export function ProductCalorieModeSelector({
  colors,
  mode,
  onChange,
}: ProductCalorieModeSelectorProps) {
  return (
    <View
      accessibilityRole="radiogroup"
      style={[styles.container, { borderColor: colors.border }]}
    >
      {options.map(option => {
        const selected = option.value === mode;

        return (
          <Pressable
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            key={option.value}
            onPress={() => onChange(option.value)}
            style={({ pressed }) => [
              styles.option,
              selected && { backgroundColor: colors.accent },
              pressed && styles.pressed,
            ]}
          >
            <Text
              style={[
                styles.label,
                { color: selected ? colors.background : colors.text },
              ]}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    height: 46,
    marginBottom: 24,
    overflow: 'hidden',
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0,
  },
  option: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  pressed: {
    opacity: 0.72,
  },
});
