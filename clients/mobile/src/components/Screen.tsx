import React, { type PropsWithChildren } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

interface ScreenProps extends PropsWithChildren {
  centered?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export function Screen({
  centered = false,
  children,
  contentStyle,
  onRefresh,
  refreshing = false,
}: ScreenProps) {
  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        centered && styles.centered,
        contentStyle,
      ]}
      refreshControl={
        onRefresh ? (
          <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
        ) : undefined
      }
    >
      {children}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    justifyContent: 'center',
  },
  content: {
    alignSelf: 'center',
    flexGrow: 1,
    maxWidth: 720,
    paddingBottom: 32,
    paddingHorizontal: 20,
    paddingTop: 24,
    width: '100%',
  },
});
