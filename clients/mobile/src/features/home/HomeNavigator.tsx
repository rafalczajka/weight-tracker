import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { createStackScreenOptions } from '../../navigation/options';
import type { ThemeColors } from '../../theme';
import { HomeScreen } from './HomeScreen';

type HomeStackParamList = {
  Home: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

interface HomeNavigatorProps {
  colors: ThemeColors;
}

export function HomeNavigator({ colors }: HomeNavigatorProps) {
  return (
    <Stack.Navigator screenOptions={createStackScreenOptions(colors)}>
      <Stack.Screen name="Home" options={{ title: 'Home' }}>
        {() => <HomeScreen colors={colors} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
