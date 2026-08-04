import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type KeyboardTypeOptions,
} from 'react-native';
import type { ThemeColors } from '../theme';

interface FormFieldProps {
  accessibilityLabel: string;
  colors: ThemeColors;
  disabled?: boolean;
  error?: string | null;
  keyboardType?: KeyboardTypeOptions;
  label: string;
  maxLength?: number;
  multiline?: boolean;
  onBlur?: () => void;
  onChangeText: (value: string) => void;
  onSubmitEditing?: () => void;
  placeholder?: string;
  suffix?: string;
  value: string;
}

export function FormField({
  accessibilityLabel,
  colors,
  disabled = false,
  error = null,
  keyboardType = 'default',
  label,
  maxLength,
  multiline = false,
  onBlur,
  onChangeText,
  onSubmitEditing,
  placeholder,
  suffix,
  value,
}: FormFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View
        style={[
          styles.inputRow,
          multiline && styles.multilineRow,
          {
            backgroundColor: colors.input,
            borderColor: error ? colors.error : colors.border,
          },
        ]}
      >
        <TextInput
          accessibilityLabel={accessibilityLabel}
          accessibilityState={{ disabled }}
          editable={!disabled}
          keyboardType={keyboardType}
          maxLength={maxLength}
          multiline={multiline}
          onBlur={onBlur}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmitEditing}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          returnKeyType={multiline ? 'default' : 'done'}
          style={[
            styles.input,
            multiline && styles.multilineInput,
            { color: colors.text },
          ]}
          value={value}
        />
        {suffix ? (
          <Text style={[styles.suffix, { color: colors.muted }]}>{suffix}</Text>
        ) : null}
      </View>
      <Text
        accessibilityLiveRegion="polite"
        style={[styles.error, { color: colors.error }]}
      >
        {error ?? ' '}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  error: {
    fontSize: 13,
    letterSpacing: 0,
    lineHeight: 18,
    marginTop: 6,
    minHeight: 18,
  },
  field: {
    width: '100%',
  },
  input: {
    flex: 1,
    fontSize: 18,
    height: 54,
    letterSpacing: 0,
    paddingHorizontal: 14,
    paddingVertical: 0,
  },
  inputRow: {
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    marginTop: 8,
    minHeight: 54,
    overflow: 'hidden',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0,
  },
  multilineInput: {
    height: 92,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  multilineRow: {
    alignItems: 'flex-start',
    minHeight: 94,
  },
  suffix: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0,
    paddingHorizontal: 14,
  },
});
