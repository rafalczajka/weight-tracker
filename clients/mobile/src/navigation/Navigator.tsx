import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  type Theme,
} from '@react-navigation/native';
import {
  House,
  Scale,
  ScanBarcode,
  UserRound,
  Utensils,
} from 'lucide-react-native';
import React, { useMemo } from 'react';
import { StyleSheet } from 'react-native';
import type { AuthSessionController } from '../auth';
import { AccountNavigator } from '../features/account';
import { CaloriesNavigator } from '../features/calories';
import { HomeNavigator } from '../features/home';
import { ScanNavigator } from '../features/scan';
import { useAddWeight, WeightNavigator } from '../features/weight';
import type { ThemeColors } from '../theme';
import type { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

interface NavigatorProps {
  auth: AuthSessionController;
  colors: ThemeColors;
  isDarkMode: boolean;
}

export function Navigator({ auth, colors, isDarkMode }: NavigatorProps) {
  const addWeight = useAddWeight({
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
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          headerShown: false,
          sceneStyle: { backgroundColor: colors.background },
          tabBarActiveTintColor: colors.accent,
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
        <Tab.Screen name="Home">
          {() => <HomeNavigator colors={colors} />}
        </Tab.Screen>
        <Tab.Screen name="Weight">
          {() => (
            <WeightNavigator
              addWeight={addWeight}
              auth={auth}
              colors={colors}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Scan">
          {() => <ScanNavigator colors={colors} />}
        </Tab.Screen>
        <Tab.Screen name="Calories">
          {() => <CaloriesNavigator colors={colors} />}
        </Tab.Screen>
        <Tab.Screen name="Account">
          {() => (
            <AccountNavigator
              addWeight={addWeight}
              auth={auth}
              colors={colors}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function renderTabIcon(
  name: keyof RootTabParamList,
  color: string,
  size: number,
) {
  const properties = { color, size, strokeWidth: 2 };

  switch (name) {
    case 'Home':
      return <House {...properties} />;
    case 'Weight':
      return <Scale {...properties} />;
    case 'Scan':
      return <ScanBarcode {...properties} />;
    case 'Calories':
      return <Utensils {...properties} />;
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
      primary: colors.accent,
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
