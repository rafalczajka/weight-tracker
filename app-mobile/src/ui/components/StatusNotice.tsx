import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import type { ThemeColors } from '../theme';

interface NoticeValue {
  kind: 'error' | 'info' | 'success';
  text: string;
}

interface StatusNoticeProps {
  colors: ThemeColors;
  notice: NoticeValue | null;
}

export function StatusNotice({ colors, notice }: StatusNoticeProps) {
  const color =
    notice?.kind === 'error'
      ? colors.error
      : notice?.kind === 'success'
      ? colors.success
      : colors.text;

  return (
    <View style={styles.noticeArea}>
      {notice ? (
        <Text
          accessibilityLiveRegion={
            notice.kind === 'error' ? 'assertive' : 'polite'
          }
          style={[styles.noticeText, { color }]}
        >
          {notice.text}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  noticeArea: {
    height: 56,
    justifyContent: 'center',
    paddingTop: 16,
  },
  noticeText: {
    fontSize: 14,
    letterSpacing: 0,
    lineHeight: 20,
    textAlign: 'center',
  },
});
