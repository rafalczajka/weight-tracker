import { ChevronRight } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ThemeColors } from '../theme';

interface ListRowProps {
  colors: ThemeColors;
  onPress?: () => void;
  subtitle?: string;
  title: string;
  value?: string;
}

export function ListRow({
  colors,
  onPress,
  subtitle,
  title,
  value,
}: ListRowProps) {
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        { borderBottomColor: colors.border },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {value ? (
        <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
      ) : null}
      {onPress ? (
        <ChevronRight color={colors.muted} size={20} strokeWidth={2} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    minWidth: 0,
  },
  pressed: {
    opacity: 0.65,
  },
  row: {
    alignItems: 'center',
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    minHeight: 60,
    paddingVertical: 10,
  },
  subtitle: {
    fontSize: 13,
    letterSpacing: 0,
    marginTop: 3,
  },
  title: {
    fontSize: 16,
    letterSpacing: 0,
  },
  value: {
    flexShrink: 1,
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0,
    marginLeft: 12,
    maxWidth: '60%',
    textAlign: 'right',
  },
});
