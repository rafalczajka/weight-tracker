import { formatLabel } from '@weight-tracker/client-core';
import React from 'react';
import {
  DateField,
  FormField,
  FormScreen,
  PrimaryButton,
  SelectField,
  StatusNotice,
  TextButton,
  type SelectOption,
  type StatusNoticeValue,
} from '@/components';
import type { ThemeColors } from '@/theme';
import {
  ACTIVITY_LEVEL_VALUES,
  PROTEIN_GOAL_VALUES,
  SEX_VALUES,
  type ProfileFormErrors,
  type ProfileFormValues,
} from '../profile';

const SEX_OPTIONS = createOptions(SEX_VALUES);
const ACTIVITY_OPTIONS = createOptions(ACTIVITY_LEVEL_VALUES);
const PROTEIN_GOAL_OPTIONS = createOptions(PROTEIN_GOAL_VALUES);

interface ProfileFormProps {
  birthDateBounds: { maximumDate: Date; minimumDate: Date };
  colors: ThemeColors;
  disabled: boolean;
  errors: ProfileFormErrors;
  notice: StatusNoticeValue | null;
  onChange: <K extends keyof ProfileFormValues>(
    field: K,
    value: ProfileFormValues[K],
  ) => void;
  onClear: () => void;
  onSubmit: () => void;
  onValidate: (field: keyof ProfileFormErrors) => void;
  submitting: boolean;
  values: ProfileFormValues;
}

export function ProfileForm({
  birthDateBounds,
  colors,
  disabled,
  errors,
  notice,
  onChange,
  onClear,
  onSubmit,
  onValidate,
  submitting,
  values,
}: ProfileFormProps) {
  return (
    <FormScreen>
      <FormField
        accessibilityLabel="Height in centimetres"
        colors={colors}
        disabled={disabled}
        error={errors.heightCm}
        keyboardType="decimal-pad"
        label="Height (optional)"
        onBlur={() => onValidate('heightCm')}
        onChangeText={value => onChange('heightCm', value)}
        placeholder="Not set"
        suffix="cm"
        value={values.heightCm}
      />
      <SelectField
        accessibilityLabel="Sex"
        colors={colors}
        disabled={disabled}
        label="Sex (optional)"
        onChange={value => onChange('sex', value)}
        options={SEX_OPTIONS}
        value={values.sex}
      />
      <DateField
        colors={colors}
        disabled={disabled}
        error={errors.dateOfBirth}
        label="Date of birth (optional)"
        maximumDate={birthDateBounds.maximumDate}
        minimumDate={birthDateBounds.minimumDate}
        onChange={value => onChange('dateOfBirth', value)}
        onClear={() => onChange('dateOfBirth', undefined)}
        value={values.dateOfBirth}
      />
      <SelectField
        accessibilityLabel="Activity level"
        colors={colors}
        disabled={disabled}
        label="Activity level (optional)"
        onChange={value => onChange('activityLevel', value)}
        options={ACTIVITY_OPTIONS}
        value={values.activityLevel}
      />
      <SelectField
        accessibilityLabel="Protein goal"
        colors={colors}
        disabled={disabled}
        label="Protein goal (optional)"
        onChange={value => onChange('proteinGoal', value)}
        options={PROTEIN_GOAL_OPTIONS}
        value={values.proteinGoal}
      />
      <PrimaryButton
        colors={colors}
        disabled={disabled}
        label="Save profile"
        loading={submitting}
        onPress={onSubmit}
      />
      <TextButton
        colors={colors}
        destructive
        disabled={disabled}
        label="Clear profile"
        onPress={onClear}
      />
      <StatusNotice colors={colors} notice={notice} />
    </FormScreen>
  );
}

function createOptions<T extends string>(
  values: readonly T[],
): SelectOption<T>[] {
  return values.map(value => ({ label: formatLabel(value), value }));
}
