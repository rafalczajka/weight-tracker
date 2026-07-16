import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { PrimaryButton, StatusNotice, type ThemeColors } from '../../ui';
import type { Notice } from './useWeightEntry';

interface WeightFormProps {
  colors: ThemeColors;
  disabled: boolean;
  notice: Notice | null;
  submitting: boolean;
  weight: string;
  weightError: string | null;
  onSubmit: () => void;
  onWeightBlur: () => void;
  onWeightChange: (value: string) => void;
}

export function WeightForm({
  colors,
  disabled,
  notice,
  submitting,
  weight,
  weightError,
  onSubmit,
  onWeightBlur,
  onWeightChange,
}: WeightFormProps) {
  return (
    <View style={styles.form}>
      <Text style={[styles.label, { color: colors.text }]}>Weight</Text>
      <View
        style={[
          styles.inputRow,
          {
            backgroundColor: colors.input,
            borderColor: weightError ? colors.error : colors.border,
          },
        ]}
      >
        <TextInput
          accessibilityLabel="Weight in kilograms"
          accessibilityState={{ disabled }}
          editable={!disabled}
          keyboardType="decimal-pad"
          onBlur={onWeightBlur}
          onChangeText={onWeightChange}
          onSubmitEditing={onSubmit}
          placeholder="0.0"
          placeholderTextColor={colors.placeholder}
          returnKeyType="done"
          style={[styles.input, { color: colors.text }]}
          value={weight}
        />
        <Text style={[styles.unit, { color: colors.muted }]}>kg</Text>
      </View>
      <Text
        accessibilityLiveRegion="polite"
        style={[styles.validation, { color: colors.error }]}
      >
        {weightError ?? ' '}
      </Text>

      <PrimaryButton
        colors={colors}
        disabled={disabled}
        label="Add weight"
        loading={submitting}
        onPress={onSubmit}
        style={styles.button}
      />
      <StatusNotice colors={colors} notice={notice} />
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
  },
  form: {
    marginTop: 36,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: '600',
    height: 58,
    letterSpacing: 0,
    paddingHorizontal: 16,
    paddingVertical: 0,
  },
  inputRow: {
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    height: 60,
    marginTop: 8,
    overflow: 'hidden',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0,
  },
  unit: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0,
    paddingHorizontal: 16,
  },
  validation: {
    fontSize: 13,
    letterSpacing: 0,
    lineHeight: 18,
    marginTop: 6,
    minHeight: 18,
  },
});
