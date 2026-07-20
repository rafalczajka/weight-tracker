import React, { useEffect } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { SignInView, type AuthSessionController, useAuthSession } from './auth';
import { Navigator } from './Navigator';
import { darkColors, lightColors, type ThemeColors } from './ui';

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const colors = isDarkMode ? darkColors : lightColors;
  const auth = useAuthSession();

  useEffect(() => {
    StatusBar.setBarStyle(isDarkMode ? 'light-content' : 'dark-content');
  }, [isDarkMode]);

  return (
    <SafeAreaProvider>
      <SafeAreaView
        edges={auth.status === 'signed-in' ? ['top'] : undefined}
        style={[styles.screen, { backgroundColor: colors.background }]}
      >
        <AppContent auth={auth} colors={colors} isDarkMode={isDarkMode} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

interface AppContentProps {
  auth: AuthSessionController;
  colors: ThemeColors;
  isDarkMode: boolean;
}

function AppContent({ auth, colors, isDarkMode }: AppContentProps) {
  switch (auth.status) {
    case 'restoring':
      return (
        <View style={styles.loading}>
          <ActivityIndicator
            accessibilityLabel="Loading"
            color={colors.text}
            size="large"
          />
        </View>
      );
    case 'signed-out':
      return <SignedOutView auth={auth} colors={colors} />;
    case 'signed-in':
      return (
        <View style={styles.fill}>
          <AppHeader color={colors.text} compact />
          <Navigator auth={auth} colors={colors} isDarkMode={isDarkMode} />
        </View>
      );
  }
}

interface SignedOutViewProps {
  auth: AuthSessionController;
  colors: ThemeColors;
}

function SignedOutView({ auth, colors }: SignedOutViewProps) {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.fill}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <AppHeader color={colors.text} />
          <SignInView
            colors={colors}
            disabled={auth.busy}
            loading={auth.signingIn}
            notice={auth.notice}
            onSignIn={auth.signIn}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

interface AppHeaderProps {
  color: string;
  compact?: boolean;
}

function AppHeader({ color, compact = false }: AppHeaderProps) {
  return (
    <View style={compact ? styles.compactHeader : undefined}>
      <Text accessibilityRole="header" style={[styles.brand, { color }]}>
        Weight Tracker
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  brand: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0,
    lineHeight: 34,
    textAlign: 'center',
  },
  content: {
    alignSelf: 'center',
    maxWidth: 420,
    paddingHorizontal: 24,
    width: '100%',
  },
  fill: {
    flex: 1,
  },
  compactHeader: {
    paddingBottom: 12,
    paddingHorizontal: 24,
    paddingTop: 18,
  },
  loading: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  screen: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 32,
    paddingTop: 32,
  },
});
