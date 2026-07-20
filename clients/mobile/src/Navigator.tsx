import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  type Theme,
} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ChartLine, Plus, UserRound } from 'lucide-react-native';
import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import type { AuthSessionController } from './auth';
import { AccountScreen } from './features/account';
import { useWeightEntry, WeightEntryScreen } from './features/weight-entry';
import { WeightHistoryScreen } from './features/weight-history';
import type { ThemeColors } from './ui';

type AuthenticatedTabParamList = {
  Account: undefined;
  Add: undefined;
  Chart: undefined;
};

const Tab = createBottomTabNavigator<AuthenticatedTabParamList>();

interface NavigatorProps {
  auth: AuthSessionController;
  colors: ThemeColors;
  isDarkMode: boolean;
}

export function Navigator({ auth, colors, isDarkMode }: NavigatorProps) {
  const weightEntry = useWeightEntry({
    getAccessToken: auth.getAccessToken,
    onUnauthorized: auth.expireSession,
  });
  const navigationTheme = useMemo(
    () => createNavigationTheme(colors, isDarkMode),
    [colors, isDarkMode],
  );

  return (
    <NavigationContainer theme={navigationTheme}>
      <Tab.Navigator
        initialRouteName="Add"
        screenOptions={({ route }) => ({
          headerShown: false,
          sceneStyle: { backgroundColor: colors.background },
          tabBarActiveTintColor: colors.chartLine,
          tabBarHideOnKeyboard: true,
          tabBarIcon: ({ color, size }) =>
            renderTabIcon(route.name, color, size),
          tabBarInactiveTintColor: colors.muted,
          tabBarLabelStyle: styles.tabLabel,
          tabBarStyle: {
            backgroundColor: colors.input,
            borderTopColor: colors.border,
            paddingTop: 6,
          },
        })}
      >
        <Tab.Screen name="Add">
          {() => (
            <WeightEntryScreen
              colors={colors}
              controller={weightEntry}
              disabled={auth.busy}
              notice={auth.notice ?? weightEntry.notice}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Chart">
          {() => (
            <WeightHistoryScreen
              colors={colors}
              getAccessToken={auth.getAccessToken}
              onUnauthorized={auth.expireSession}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Account">
          {() => (
            <AccountScreen
              colors={colors}
              disabled={auth.busy || weightEntry.submitting}
              loading={auth.signingOut}
              notice={auth.notice}
              onSignOut={auth.signOut}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function renderTabIcon(
  name: keyof AuthenticatedTabParamList,
  color: string,
  size: number,
) {
  const properties = { color, size, strokeWidth: 2 };

  switch (name) {
    case 'Add':
      return <Plus {...properties} />;
    case 'Chart':
      return <ChartLine {...properties} />;
    case 'Account':
      return <UserRound {...properties} />;
  }
}

function createNavigationTheme(
  colors: ThemeColors,
  isDarkMode: boolean,
): Theme {
  const baseTheme = isDarkMode ? DarkTheme : DefaultTheme;

  return {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      background: colors.background,
      border: colors.border,
      card: colors.input,
      notification: colors.error,
      primary: colors.chartLine,
      text: colors.text,
    },
  };
}

const styles = StyleSheet.create({
  tabLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0,
  },
});
