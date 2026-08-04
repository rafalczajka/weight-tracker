import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getDateRangeError } from '@/date';
import type { ThemeColors } from '@/theme';
import { DateField } from './DateField';
import { PrimaryButton } from './PrimaryButton';
import { TextButton } from './TextButton';

export interface DateRange {
  from?: string;
  to?: string;
}

interface DateRangeModalProps {
  colors: ThemeColors;
  onApply: (range: DateRange) => void;
  onClose: () => void;
  range: DateRange;
  visible: boolean;
}

export function DateRangeModal({
  colors,
  onApply,
  onClose,
  range,
  visible,
}: DateRangeModalProps) {
  const insets = useSafeAreaInsets();
  const [from, setFrom] = useState<string | undefined>(range.from);
  const [to, setTo] = useState<string | undefined>(range.to);
  const error = getDateRangeError(from, to);

  useEffect(() => {
    if (visible) {
      setFrom(range.from);
      setTo(range.to);
    }
  }, [range.from, range.to, visible]);

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <View style={styles.overlay}>
        <Pressable
          accessibilityLabel="Close date filters"
          accessibilityRole="button"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />
        <View
          style={[
            styles.dialog,
            {
              backgroundColor: colors.background,
              paddingBottom: Math.max(20, insets.bottom + 12),
            },
          ]}
        >
          <Text style={[styles.title, { color: colors.text }]}>Date range</Text>
          <DateField
            colors={colors}
            label="From"
            onChange={setFrom}
            placeholder="Any date"
            value={from}
          />
          <DateField
            colors={colors}
            label="To"
            onChange={setTo}
            placeholder="Any date"
            value={to}
          />
          <Text
            accessibilityLiveRegion="polite"
            style={[styles.error, { color: colors.error }]}
          >
            {error ?? ' '}
          </Text>
          <PrimaryButton
            colors={colors}
            disabled={Boolean(error)}
            label="Apply filters"
            loading={false}
            onPress={() => onApply({ from, to })}
          />
          <View style={styles.actions}>
            <TextButton
              colors={colors}
              label="Clear"
              onPress={() => {
                setFrom(undefined);
                setTo(undefined);
              }}
            />
            <TextButton colors={colors} label="Cancel" onPress={onClose} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  dialog: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    elevation: 8,
    maxWidth: 720,
    padding: 20,
    width: '100%',
    zIndex: 1,
  },
  error: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
    minHeight: 18,
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0,
    marginBottom: 24,
  },
});
