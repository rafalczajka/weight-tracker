import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import type { AuthSessionController } from '@/auth';
import {
  BmiCalculatorScreen,
  CalorieCalculatorScreen,
  ProteinCalculatorScreen,
} from '@/features/calculations';
import { createStackScreenOptions } from '@/navigation/options';
import type { ThemeColors } from '@/theme';
import { HomeScreen } from './HomeScreen';

export type HomeStackParamList = {
  HomeOverview: undefined;
  BmiCalculator: undefined;
  CalorieCalculator: undefined;
  ProteinCalculator: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

interface HomeNavigatorProps {
  auth: AuthSessionController;
  colors: ThemeColors;
  onAddCalories: (date: string) => void;
  onAddWeight: (date?: string) => void;
  onEditProfile: () => void;
  onOpenCalories: (date: string) => void;
  onEditWeight: (date: string, weightKg: number) => void;
  onScanProduct: () => void;
}

export function HomeNavigator(props: HomeNavigatorProps) {
  return (
    <Stack.Navigator screenOptions={createStackScreenOptions(props.colors)}>
      <Stack.Screen name="HomeOverview" options={{ title: 'Home' }}>
        {({ navigation }) => (
          <HomeScreen
            auth={props.auth}
            colors={props.colors}
            onAddCalories={props.onAddCalories}
            onAddWeight={date => props.onAddWeight(date)}
            onEditWeight={props.onEditWeight}
            onOpenBmiCalculator={() => navigation.navigate('BmiCalculator')}
            onOpenCalorieCalculator={() =>
              navigation.navigate('CalorieCalculator')
            }
            onOpenCalories={props.onOpenCalories}
            onOpenProteinCalculator={() =>
              navigation.navigate('ProteinCalculator')
            }
            onScanProduct={props.onScanProduct}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="BmiCalculator" options={{ title: 'BMI' }}>
        {() => (
          <BmiCalculatorScreen
            auth={props.auth}
            colors={props.colors}
            onAddWeight={() => props.onAddWeight()}
            onUpdateProfile={props.onEditProfile}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="CalorieCalculator"
        options={{ title: 'Calorie Requirement' }}
      >
        {() => (
          <CalorieCalculatorScreen
            auth={props.auth}
            colors={props.colors}
            onAddWeight={() => props.onAddWeight()}
            onUpdateProfile={props.onEditProfile}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="ProteinCalculator"
        options={{ title: 'Protein Requirement' }}
      >
        {() => (
          <ProteinCalculatorScreen
            auth={props.auth}
            colors={props.colors}
            onAddWeight={() => props.onAddWeight()}
            onUpdateProfile={props.onEditProfile}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
