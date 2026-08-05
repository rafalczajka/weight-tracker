import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { CalendarDays, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { formatDisplayDate, formatPickerDate, parseApiDate } from '@/date';
import type { ThemeColors } from '@/theme';

interface DateFieldProps {
  colors: ThemeColors;
  disabled?: boolean;
  error?: string | null;
  label: string;
  maximumDate?: Date;
  minimumDate?: Date;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  value?: string;
}

export function DateField({
  colors,
  disabled = false,
  error,
  label,
  maximumDate,
  minimumDate,
  onChange,
  onClear,
  placeholder = 'Select date',
  value,
}: DateFieldProps) {
  const [pickerVisible, setPickerVisible] = useState(false);

  function handleChange(event: DateTimePickerEvent, date?: Date) {
    setPickerVisible(false);

    if (event.type === 'set' && date) {
      onChange(formatPickerDate(date));
    }
  }

  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <View
        style={[
          styles.control,
          {
            backgroundColor: colors.input,
            borderColor: error ? colors.error : colors.border,
          },
          disabled && styles.disabled,
        ]}
      >
        <Pressable
          accessibilityLabel={label}
          accessibilityRole="button"
          accessibilityState={{ disabled }}
          disabled={disabled}
          onPress={() => setPickerVisible(true)}
          style={({ pressed }) => [
            styles.dateButton,
            pressed && !disabled && styles.pressed,
          ]}
        >
          <Text
            style={[
              styles.value,
              { color: value ? colors.text : colors.muted },
            ]}
          >
            {value ? formatDisplayDate(value) : placeholder}
          </Text>
          <CalendarDays color={colors.muted} size={20} strokeWidth={2} />
        </Pressable>
        {value && onClear ? (
          <Pressable
            accessibilityLabel={`Clear ${label.toLowerCase()}`}
            accessibilityRole="button"
            disabled={disabled}
            hitSlop={8}
            onPress={onClear}
            style={({ pressed }) => [
              styles.clearButton,
              pressed && !disabled && styles.pressed,
            ]}
          >
            <X color={colors.muted} size={20} strokeWidth={2} />
          </Pressable>
        ) : null}
      </View>
      {pickerVisible ? (
        <DateTimePicker
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          maximumDate={maximumDate}
          minimumDate={minimumDate}
          mode="date"
          onChange={handleChange}
          value={value ? parseApiDate(value) : maximumDate ?? new Date()}
        />
      ) : null}
      {error !== undefined ? (
        <Text
          accessibilityLiveRegion="polite"
          style={[styles.error, { color: colors.error }]}
        >
          {error ?? ' '}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  control: {
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: 'row',
    height: 54,
    marginTop: 8,
    overflow: 'hidden',
  },
  clearButton: {
    alignItems: 'center',
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  dateButton: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    height: 54,
    justifyContent: 'space-between',
    paddingLeft: 14,
    paddingRight: 12,
  },
  disabled: {
    opacity: 0.55,
  },
  error: {
    fontSize: 13,
    letterSpacing: 0,
    lineHeight: 18,
    marginTop: 6,
    minHeight: 18,
  },
  field: {
    marginBottom: 24,
    width: '100%',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0,
  },
  pressed: {
    opacity: 0.72,
  },
  value: {
    flex: 1,
    fontSize: 16,
    letterSpacing: 0,
  },
});
