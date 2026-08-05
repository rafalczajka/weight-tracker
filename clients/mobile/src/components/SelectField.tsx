import { Check, ChevronDown } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { ThemeColors } from '@/theme';

export interface SelectOption<T extends string> {
  label: string;
  value: T;
}

interface SelectFieldProps<T extends string> {
  accessibilityLabel: string;
  colors: ThemeColors;
  disabled?: boolean;
  label: string;
  onChange: (value: T | null) => void;
  options: readonly SelectOption<T>[];
  placeholder?: string;
  value: T | null;
}

export function SelectField<T extends string>({
  accessibilityLabel,
  colors,
  disabled = false,
  label,
  onChange,
  options,
  placeholder = 'Not set',
  value,
}: SelectFieldProps<T>) {
  const insets = useSafeAreaInsets();
  const [visible, setVisible] = useState(false);
  const selectedLabel = options.find(option => option.value === value)?.label;

  function select(nextValue: T | null) {
    setVisible(false);
    onChange(nextValue);
  }

  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: colors.text }]}>{label}</Text>
      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        accessibilityState={{ disabled, expanded: visible }}
        disabled={disabled}
        onPress={() => setVisible(true)}
        style={({ pressed }) => [
          styles.control,
          { backgroundColor: colors.input, borderColor: colors.border },
          disabled && styles.disabled,
          pressed && !disabled && styles.pressed,
        ]}
      >
        <Text
          style={[
            styles.value,
            { color: selectedLabel ? colors.text : colors.muted },
          ]}
        >
          {selectedLabel ?? placeholder}
        </Text>
        <ChevronDown color={colors.muted} size={20} strokeWidth={2} />
      </Pressable>

      <Modal
        animationType="fade"
        onRequestClose={() => setVisible(false)}
        transparent
        visible={visible}
      >
        <View
          accessibilityViewIsModal
          onAccessibilityEscape={() => setVisible(false)}
          style={[
            styles.overlay,
            {
              paddingBottom: Math.max(24, insets.bottom + 12),
              paddingTop: Math.max(24, insets.top + 12),
            },
          ]}
        >
          <Pressable
            accessibilityLabel="Close selection"
            onPress={() => setVisible(false)}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.dialog, { backgroundColor: colors.input }]}>
            <Text style={[styles.dialogTitle, { color: colors.text }]}>
              {label}
            </Text>
            <ScrollView
              accessibilityRole="radiogroup"
              bounces={false}
              showsVerticalScrollIndicator
            >
              <SelectRow
                colors={colors}
                label={placeholder}
                onPress={() => select(null)}
                selected={value === null}
              />
              {options.map(option => (
                <SelectRow
                  colors={colors}
                  key={option.value}
                  label={option.label}
                  onPress={() => select(option.value)}
                  selected={option.value === value}
                />
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

interface SelectRowProps {
  colors: ThemeColors;
  label: string;
  onPress: () => void;
  selected: boolean;
}

function SelectRow({ colors, label, onPress, selected }: SelectRowProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.option,
        { borderTopColor: colors.border },
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.optionLabel, { color: colors.text }]}>{label}</Text>
      {selected ? (
        <Check color={colors.accent} size={20} strokeWidth={2} />
      ) : null}
    </Pressable>
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
  dialog: {
    borderRadius: 6,
    maxHeight: '100%',
    maxWidth: 420,
    paddingHorizontal: 16,
    paddingVertical: 8,
    width: '100%',
  },
  dialogTitle: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0,
    paddingHorizontal: 4,
    paddingVertical: 16,
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
  option: {
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 52,
    paddingHorizontal: 4,
  },
  optionLabel: {
    fontSize: 16,
    letterSpacing: 0,
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  pressed: {
    opacity: 0.65,
  },
  value: {
    flex: 1,
    fontSize: 16,
    letterSpacing: 0,
  },
});
