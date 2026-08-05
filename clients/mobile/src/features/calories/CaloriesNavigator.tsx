import { useNavigation, useTheme } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Plus, ScanBarcode } from 'lucide-react-native';
import React, { createContext, useContext } from 'react';
import { StyleSheet, View } from 'react-native';
import type { AuthSessionController } from '@/auth';
import { IconButton } from '@/components';
import { createStackScreenOptions } from '@/navigation/options';
import type { ThemeColors } from '@/theme';
import { AddCalorieScreen } from './screens/AddCalorieScreen';
import { CalorieEntryDetailsScreen } from './screens/CalorieEntryDetailsScreen';
import { CalorieHistoryScreen } from './screens/CalorieHistoryScreen';
import { DailyCaloriesScreen } from './screens/DailyCaloriesScreen';
import { EditCalorieScreen } from './screens/EditCalorieScreen';

export type CaloriesStackParamList = {
  CalorieHistory: undefined;
  DailyCalories: { date: string; initialNotice?: string };
  AddCalorie: { date?: string; initialDescription?: string } | undefined;
  CalorieEntryDetails: {
    date: string;
    id: string;
    initialNotice?: string;
  };
  EditCalorieEntry: {
    caloriesKcal: number;
    date: string;
    description?: string | null;
    id: string;
  };
};

const Stack = createNativeStackNavigator<CaloriesStackParamList>();
const CaloriesNavigationContext = createContext({ onScanProduct: () => {} });

interface CaloriesNavigatorProps {
  auth: AuthSessionController;
  colors: ThemeColors;
  onScanProduct: () => void;
}

export function CaloriesNavigator({
  auth,
  colors,
  onScanProduct,
}: CaloriesNavigatorProps) {
  return (
    <CaloriesNavigationContext.Provider value={{ onScanProduct }}>
      <Stack.Navigator screenOptions={createStackScreenOptions(colors)}>
        <Stack.Screen
          name="CalorieHistory"
          options={{ headerRight: CaloriesHeaderActions, title: 'Calories' }}
        >
          {({ navigation }) => (
            <CalorieHistoryScreen
              auth={auth}
              colors={colors}
              onAddEntry={() => navigation.navigate('AddCalorie')}
              onOpenDay={date => navigation.navigate('DailyCalories', { date })}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="DailyCalories"
          options={{ title: 'Daily Calories' }}
        >
          {({ navigation, route }) => (
            <DailyCaloriesScreen
              auth={auth}
              colors={colors}
              date={route.params.date}
              initialNotice={route.params.initialNotice}
              onAddEntry={() =>
                navigation.navigate('AddCalorie', { date: route.params.date })
              }
              onOpenEntry={entry =>
                navigation.navigate('CalorieEntryDetails', {
                  date: route.params.date,
                  id: entry.id,
                })
              }
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="AddCalorie" options={{ title: 'Add Calories' }}>
          {({ navigation, route }) => (
            <AddCalorieScreen
              auth={auth}
              colors={colors}
              initialDate={route.params?.date}
              initialDescription={route.params?.initialDescription}
              onCreated={entry =>
                navigation.popTo('DailyCalories', {
                  date: entry.date,
                  initialNotice: 'Calorie entry added.',
                })
              }
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="CalorieEntryDetails"
          options={{ title: 'Calorie Entry' }}
        >
          {({ navigation, route }) => (
            <CalorieEntryDetailsScreen
              auth={auth}
              colors={colors}
              date={route.params.date}
              id={route.params.id}
              initialNotice={route.params.initialNotice}
              onDeleted={() =>
                navigation.popTo('DailyCalories', {
                  date: route.params.date,
                  initialNotice: 'Calorie entry deleted.',
                })
              }
              onEdit={entry => navigation.navigate('EditCalorieEntry', entry)}
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="EditCalorieEntry"
          options={{ title: 'Edit Calories' }}
        >
          {({ navigation, route }) => (
            <EditCalorieScreen
              auth={auth}
              colors={colors}
              entry={route.params}
              onSaved={entry =>
                navigation.popTo('CalorieEntryDetails', {
                  date: entry.date,
                  id: entry.id,
                  initialNotice: 'Calorie entry updated.',
                })
              }
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </CaloriesNavigationContext.Provider>
  );
}

function CaloriesHeaderActions() {
  const { onScanProduct } = useContext(CaloriesNavigationContext);
  const navigation =
    useNavigation<NativeStackNavigationProp<CaloriesStackParamList>>();
  const { colors } = useTheme();

  return (
    <View style={styles.headerActions}>
      <IconButton accessibilityLabel="Scan product" onPress={onScanProduct}>
        <ScanBarcode color={colors.text} size={21} strokeWidth={2} />
      </IconButton>
      <IconButton
        accessibilityLabel="Add calories"
        onPress={() => navigation.navigate('AddCalorie')}
      >
        <Plus color={colors.text} size={22} strokeWidth={2} />
      </IconButton>
    </View>
  );
}

const styles = StyleSheet.create({
  headerActions: {
    flexDirection: 'row',
    marginRight: -8,
  },
});
