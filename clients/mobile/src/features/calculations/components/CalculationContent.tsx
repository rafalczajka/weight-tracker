import React, { type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {
  ListRow,
  PrimaryButton,
  Screen,
  StatusNotice,
  TextButton,
  type StatusNoticeValue,
} from '@/components';
import type { ThemeColors } from '@/theme';
import type { CalculationRequirement } from '../requirements';

export interface CalculationValue {
  label: string;
  value: string;
}

interface CalculationContentProps {
  authBusy: boolean;
  calculating: boolean;
  children?: ReactNode;
  colors: ThemeColors;
  loadError: string | null;
  missing: CalculationRequirement[];
  notice: StatusNoticeValue | null;
  onAddWeight: () => void;
  onCalculate: () => void;
  onUpdateProfile: () => void;
  values: CalculationValue[];
}

export function CalculationContent({
  authBusy,
  calculating,
  children,
  colors,
  loadError,
  missing,
  notice,
  onAddWeight,
  onCalculate,
  onUpdateProfile,
  values,
}: CalculationContentProps) {
  const needsProfile = missing.some(item => item.source === 'profile');
  const needsWeight = missing.some(item => item.source === 'weight');
  const disabled = authBusy || calculating || missing.length > 0;

  return (
    <Screen>
      {loadError ? (
        <Text
          accessibilityLiveRegion="polite"
          style={[styles.loadError, { color: colors.error }]}
        >
          {loadError}
        </Text>
      ) : null}

      <SectionTitle colors={colors}>Data used</SectionTitle>
      <View style={[styles.rows, { borderTopColor: colors.border }]}>
        {values.map(value => (
          <ListRow
            colors={colors}
            key={value.label}
            title={value.label}
            value={value.value}
          />
        ))}
      </View>

      {missing.length > 0 ? (
        <View style={styles.missingSection}>
          <SectionTitle colors={colors}>Missing data</SectionTitle>
          {missing.map(item => (
            <View
              key={item.field}
              style={[styles.missingRow, { borderTopColor: colors.border }]}
            >
              <Text style={[styles.missingLabel, { color: colors.text }]}>
                {item.label}
              </Text>
              <Text style={[styles.missingMessage, { color: colors.muted }]}>
                {item.message}
              </Text>
            </View>
          ))}
          <View style={styles.actions}>
            {needsProfile ? (
              <TextButton
                colors={colors}
                label="Update profile"
                onPress={onUpdateProfile}
              />
            ) : null}
            {needsWeight ? (
              <TextButton
                colors={colors}
                label="Add weight"
                onPress={onAddWeight}
              />
            ) : null}
          </View>
        </View>
      ) : null}

      <PrimaryButton
        colors={colors}
        disabled={disabled}
        label="Calculate"
        loading={calculating}
        onPress={onCalculate}
        style={styles.calculate}
      />
      <StatusNotice colors={colors} notice={notice} />
      {children}
    </Screen>
  );
}

function SectionTitle({
  children,
  colors,
}: {
  children: string;
  colors: ThemeColors;
}) {
  return (
    <Text
      accessibilityRole="header"
      style={[styles.sectionTitle, { color: colors.text }]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  actions: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginLeft: -12,
    marginTop: 6,
  },
  calculate: {
    marginTop: 28,
  },
  loadError: {
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  missingLabel: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0,
  },
  missingMessage: {
    fontSize: 13,
    letterSpacing: 0,
    lineHeight: 19,
    marginTop: 3,
  },
  missingRow: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingVertical: 10,
  },
  missingSection: {
    marginTop: 6,
  },
  rows: {
    borderTopWidth: 1,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0,
    marginBottom: 8,
    marginTop: 22,
  },
});
