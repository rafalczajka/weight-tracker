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

interface CalorieFormProps {
  buttonLabel: string;
  calories: string;
  caloriesError: string | null;
  colors: ThemeColors;
  date: string;
  dateEditable: boolean;
  description: string;
  descriptionError: string | null;
  disabled: boolean;
  notice: StatusNoticeValue | null;
  onCaloriesBlur: () => void;
  onCaloriesChange: (value: string) => void;
  onDateChange: (value: string) => void;
  onDescriptionBlur: () => void;
  onDescriptionChange: (value: string) => void;
  onSubmit: () => void;
  submitting: boolean;
}

export function CalorieForm({
  buttonLabel,
  calories,
  caloriesError,
  colors,
  date,
  dateEditable,
  description,
  descriptionError,
  disabled,
  notice,
  onCaloriesBlur,
  onCaloriesChange,
  onDateChange,
  onDescriptionBlur,
  onDescriptionChange,
  onSubmit,
  submitting,
}: CalorieFormProps) {
  return (
    <View style={styles.form}>
      <FormField
        accessibilityLabel="Calories in kilocalories"
        colors={colors}
        disabled={disabled}
        error={caloriesError}
        keyboardType="number-pad"
        label="Calories"
        onBlur={onCaloriesBlur}
        onChangeText={onCaloriesChange}
        onSubmitEditing={onSubmit}
        placeholder="0"
        suffix="kcal"
        value={calories}
      />
      <FormField
        accessibilityLabel="Calorie entry description"
        colors={colors}
        disabled={disabled}
        error={descriptionError}
        label="Description (optional)"
        multiline
        onBlur={onDescriptionBlur}
        onChangeText={onDescriptionChange}
        placeholder="Meal or product name"
        value={description}
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
      />
      <StatusNotice colors={colors} notice={notice} />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    gap: 4,
    width: '100%',
  },
});
