import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  DateField,
  FormField,
  FormScreen,
  PrimaryButton,
  StatusNotice,
  type StatusNoticeValue,
} from '@/components';
import { formatCaloriesKcal } from '@/format';
import type { ThemeColors } from '@/theme';
import type {
  ProductCalorieMode,
  ProductCalorieSource,
} from '../productCalories';
import { ProductCalorieModeSelector } from './ProductCalorieModeSelector';

interface ProductCalorieFormProps {
  authBusy: boolean;
  caloriesKcal: number | null;
  colors: ThemeColors;
  date: string;
  description: string;
  descriptionError: string | null;
  mode: ProductCalorieMode;
  notice: StatusNoticeValue | null;
  onDateChange: (value: string) => void;
  onDescriptionBlur: () => void;
  onDescriptionChange: (value: string) => void;
  onModeChange: (mode: ProductCalorieMode) => void;
  onQuantityBlur: () => void;
  onQuantityChange: (value: string) => void;
  onSubmit: () => void;
  productName: string;
  quantity: string;
  quantityError: string | null;
  source: ProductCalorieSource;
  sourceCount: number;
  submitting: boolean;
}

export function ProductCalorieForm({
  authBusy,
  caloriesKcal,
  colors,
  date,
  description,
  descriptionError,
  mode,
  notice,
  onDateChange,
  onDescriptionBlur,
  onDescriptionChange,
  onModeChange,
  onQuantityBlur,
  onQuantityChange,
  onSubmit,
  productName,
  quantity,
  quantityError,
  source,
  sourceCount,
  submitting,
}: ProductCalorieFormProps) {
  const servingMode = mode === 'serving';

  return (
    <FormScreen>
      <Text style={[styles.productName, { color: colors.text }]}>
        {productName}
      </Text>

      {sourceCount > 1 ? (
        <ProductCalorieModeSelector
          colors={colors}
          mode={mode}
          onChange={onModeChange}
        />
      ) : null}

      <FormField
        accessibilityLabel={
          servingMode ? 'Number of servings' : `Amount in ${source.unit}`
        }
        colors={colors}
        disabled={submitting}
        error={quantityError}
        keyboardType="decimal-pad"
        label={servingMode ? 'Servings' : 'Amount'}
        onBlur={onQuantityBlur}
        onChangeText={onQuantityChange}
        onSubmitEditing={onSubmit}
        placeholder="0"
        suffix={servingMode ? 'servings' : source.unit}
        value={quantity}
      />

      <View
        accessibilityLabel={
          caloriesKcal ? `${caloriesKcal} kilocalories` : 'Calories unavailable'
        }
        style={[styles.total, { borderColor: colors.border }]}
      >
        <Text style={[styles.totalLabel, { color: colors.muted }]}>
          Calories
        </Text>
        <Text style={[styles.totalValue, { color: colors.text }]}>
          {caloriesKcal ? formatCaloriesKcal(caloriesKcal) : 'Not available'}
        </Text>
      </View>

      <FormField
        accessibilityLabel="Calorie entry description"
        colors={colors}
        disabled={submitting}
        error={descriptionError}
        label="Description (optional)"
        maxLength={200}
        onBlur={onDescriptionBlur}
        onChangeText={onDescriptionChange}
        placeholder="Product name"
        value={description}
      />

      <DateField
        colors={colors}
        disabled={submitting}
        label="Date"
        onChange={onDateChange}
        value={date}
      />

      <PrimaryButton
        colors={colors}
        disabled={submitting || authBusy || !caloriesKcal}
        label="Add calories"
        loading={submitting}
        onPress={onSubmit}
      />
      <StatusNotice colors={colors} notice={notice} />
    </FormScreen>
  );
}

const styles = StyleSheet.create({
  productName: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 26,
    marginBottom: 24,
    textAlign: 'center',
  },
  total: {
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
    marginBottom: 24,
    paddingVertical: 16,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0,
  },
  totalValue: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0,
    marginTop: 6,
  },
});
