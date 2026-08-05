import {
  createBottomTabNavigator,
  type BottomTabNavigationProp,
} from '@react-navigation/bottom-tabs';
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
import type { AuthSessionController } from '@/auth';
import { AccountNavigator } from '@/features/account';
import { CaloriesNavigator } from '@/features/calories';
import type { CalculatorRouteName } from '@/features/calculations';
import { HomeNavigator } from '@/features/home';
import { ScanNavigator } from '@/features/scan';
import { WeightNavigator } from '@/features/weight';
import { MutationProvider } from '@/mutations';
import type { ThemeColors } from '@/theme';
import type { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

interface NavigatorProps {
  auth: AuthSessionController;
  colors: ThemeColors;
  isDarkMode: boolean;
}

export function Navigator({ auth, colors, isDarkMode }: NavigatorProps) {
  const navigationTheme = useMemo(
    () => createNavigationTheme(colors, isDarkMode),
    [colors, isDarkMode],
  );

  return (
    <NavigationContainer theme={navigationTheme}>
      <MutationProvider>
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
            {({ navigation }) => (
              <HomeNavigator
                auth={auth}
                colors={colors}
                onAddCalories={date =>
                  navigation.navigate('Calories', {
                    params: { date },
                    screen: 'AddCalorie',
                  })
                }
                onAddWeight={(date, returnToCalculator) =>
                  navigation.navigate('Weight', {
                    params: { date, returnToCalculator },
                    screen: 'AddWeight',
                  })
                }
                onEditProfile={returnToCalculator =>
                  navigation.navigate('Account', {
                    params: { returnToCalculator },
                    screen: 'EditProfile',
                  })
                }
                onOpenCalories={date =>
                  navigation.navigate('Calories', {
                    params: { date },
                    screen: 'DailyCalories',
                  })
                }
                onEditWeight={(date, weightKg) =>
                  navigation.navigate('Weight', {
                    params: { date, weightKg },
                    screen: 'EditWeight',
                  })
                }
                onScanProduct={() =>
                  navigation.navigate('Scan', { screen: 'Scanner' })
                }
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Weight">
            {({ navigation }) => (
              <WeightNavigator
                auth={auth}
                colors={colors}
                onReturnToCalculator={calculator =>
                  openCalculator(navigation, calculator)
                }
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Scan">
            {({ navigation }) => (
              <ScanNavigator
                auth={auth}
                colors={colors}
                onAddCaloriesManually={initialDescription =>
                  navigation.navigate('Calories', {
                    params: { initialDescription },
                    screen: 'AddCalorie',
                  })
                }
                onCaloriesAdded={date =>
                  navigation.navigate('Calories', {
                    params: { date, initialNotice: 'Calories added.' },
                    screen: 'DailyCalories',
                  })
                }
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Calories">
            {({ navigation }) => (
              <CaloriesNavigator
                auth={auth}
                colors={colors}
                onScanProduct={() =>
                  navigation.navigate('Scan', { screen: 'Scanner' })
                }
              />
            )}
          </Tab.Screen>
          <Tab.Screen name="Account">
            {({ navigation }) => (
              <AccountNavigator
                auth={auth}
                colors={colors}
                onReturnToCalculator={calculator =>
                  openCalculator(navigation, calculator)
                }
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </MutationProvider>
    </NavigationContainer>
  );
}

function openCalculator(
  navigation: BottomTabNavigationProp<RootTabParamList>,
  calculator: CalculatorRouteName,
) {
  navigation.navigate('Home', { screen: calculator });
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
