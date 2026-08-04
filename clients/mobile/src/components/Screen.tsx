import React, { type PropsWithChildren } from 'react';
import {
  ScrollView,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

interface ScreenProps extends PropsWithChildren {
  centered?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
}

export function Screen({
  centered = false,
  children,
  contentStyle,
}: ScreenProps) {
  return (
    <ScrollView
      contentContainerStyle={[
        styles.content,
        centered && styles.centered,
        contentStyle,
      ]}
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
