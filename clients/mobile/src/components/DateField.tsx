import DateTimePicker, {
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';
import { CalendarDays } from 'lucide-react-native';
import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { formatDisplayDate, formatPickerDate, parseApiDate } from '@/date';
import type { ThemeColors } from '@/theme';

interface DateFieldProps {
  colors: ThemeColors;
  disabled?: boolean;
  label: string;
  onChange: (value: string) => void;
  placeholder?: string;
  value?: string;
}

export function DateField({
  colors,
  disabled = false,
  label,
  onChange,
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
      <Pressable
        accessibilityLabel={label}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        disabled={disabled}
        onPress={() => setPickerVisible(true)}
        style={({ pressed }) => [
          styles.control,
          { backgroundColor: colors.input, borderColor: colors.border },
          disabled && styles.disabled,
          pressed && !disabled && styles.pressed,
        ]}
      >
        <Text
          style={[styles.value, { color: value ? colors.text : colors.muted }]}
        >
          {value ? formatDisplayDate(value) : placeholder}
        </Text>
        <CalendarDays color={colors.muted} size={20} strokeWidth={2} />
      </Pressable>
      {pickerVisible ? (
        <DateTimePicker
          display={Platform.OS === 'ios' ? 'inline' : 'default'}
          mode="date"
          onChange={handleChange}
          value={value ? parseApiDate(value) : new Date()}
        />
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
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 14,
  },
  disabled: {
    opacity: 0.55,
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
    fontSize: 16,
    letterSpacing: 0,
  },
});
