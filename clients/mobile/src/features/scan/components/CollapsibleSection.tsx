import { ChevronDown, ChevronUp } from 'lucide-react-native';
import React, { type PropsWithChildren, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ThemeColors } from '@/theme';

interface CollapsibleSectionProps extends PropsWithChildren {
  colors: ThemeColors;
  initiallyExpanded?: boolean;
  title: string;
}

export function CollapsibleSection({
  children,
  colors,
  initiallyExpanded = false,
  title,
}: CollapsibleSectionProps) {
  const [expanded, setExpanded] = useState(initiallyExpanded);
  const Icon = expanded ? ChevronUp : ChevronDown;

  return (
    <View style={[styles.section, { borderTopColor: colors.border }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        onPress={() => setExpanded(value => !value)}
        style={({ pressed }) => [styles.header, pressed && styles.pressed]}
      >
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        <Icon color={colors.muted} size={21} strokeWidth={2} />
      </Pressable>
      {expanded ? <View style={styles.content}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: 16,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    minHeight: 56,
  },
  pressed: {
    opacity: 0.65,
  },
  section: {
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0,
  },
});
