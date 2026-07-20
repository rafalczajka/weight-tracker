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
import { SignInView, useAuthSession } from './auth';
import { AuthenticatedView } from './AuthenticatedView';
import { darkColors, lightColors } from './ui';

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
        style={[styles.screen, { backgroundColor: colors.background }]}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.fill}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.content}>
              {auth.status === 'restoring' ? (
                <ActivityIndicator
                  accessibilityLabel="Loading"
                  color={colors.text}
                  size="large"
                />
              ) : (
                <>
                  <Text
                    accessibilityRole="header"
                    style={[styles.brand, { color: colors.text }]}
                  >
                    Weight Tracker
                  </Text>

                  {auth.status === 'signed-out' ? (
                    <SignInView
                      colors={colors}
                      disabled={auth.busy}
                      loading={auth.signingIn}
                      notice={auth.notice}
                      onSignIn={auth.signIn}
                    />
                  ) : (
                    <AuthenticatedView auth={auth} colors={colors} />
                  )}
                </>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
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
