import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  DateField,
  FormField,
  PrimaryButton,
  StatusNotice,
  type StatusNoticeValue,
} from '@/components';
import type { ThemeColors } from '@/theme';

interface WeightFormProps {
  buttonLabel: string;
  colors: ThemeColors;
  date: string;
  dateEditable: boolean;
  disabled: boolean;
  notice: StatusNoticeValue | null;
  onDateChange: (value: string) => void;
  onSubmit: () => void;
  onWeightBlur: () => void;
  onWeightChange: (value: string) => void;
  submitting: boolean;
  weight: string;
  weightError: string | null;
}

export function WeightForm({
  buttonLabel,
  colors,
  date,
  dateEditable,
  disabled,
  notice,
  onDateChange,
  onSubmit,
  onWeightBlur,
  onWeightChange,
  submitting,
  weight,
  weightError,
}: WeightFormProps) {
  return (
    <View style={styles.form}>
      <FormField
        accessibilityLabel="Weight in kilograms"
        colors={colors}
        disabled={disabled}
        error={weightError}
        keyboardType="decimal-pad"
        label="Weight"
        onBlur={onWeightBlur}
        onChangeText={onWeightChange}
        onSubmitEditing={onSubmit}
        placeholder="0.0"
        suffix="kg"
        value={weight}
      />
      <DateField
        colors={colors}
        disabled={disabled || !dateEditable}
        label="Date"
        onChange={onDateChange}
        value={date}
      />
      <PrimaryButton
        colors={colors}
        disabled={disabled}
        label={buttonLabel}
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
    marginTop: 4,
  },
  form: {
    width: '100%',
  },
});
