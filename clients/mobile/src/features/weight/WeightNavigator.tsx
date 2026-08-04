import { useNavigation, useTheme } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Plus } from 'lucide-react-native';
import React, { createContext, useContext, useMemo } from 'react';
import type { AuthSessionController } from '../../auth';
import { IconButton } from '../../components';
import { createStackScreenOptions } from '../../navigation/options';
import type { ThemeColors } from '../../theme';
import { AddWeightScreen } from './AddWeightScreen';
import type { AddWeightController } from './useAddWeight';
import { WeightScreen } from './WeightScreen';

type WeightStackParamList = {
  Weight: undefined;
  AddWeight: undefined;
};

const Stack = createNativeStackNavigator<WeightStackParamList>();
const WeightNavigationContext = createContext({ actionsDisabled: false });

const weightScreenOptions = {
  headerRight: AddWeightHeaderButton,
  title: 'Weight',
};

interface WeightNavigatorProps {
  auth: AuthSessionController;
  colors: ThemeColors;
  addWeight: AddWeightController;
}

export function WeightNavigator({
  auth,
  colors,
  addWeight,
}: WeightNavigatorProps) {
  const actionsDisabled = auth.busy || addWeight.submitting;
  const navigationContext = useMemo(
    () => ({ actionsDisabled }),
    [actionsDisabled],
  );

  return (
    <WeightNavigationContext.Provider value={navigationContext}>
      <Stack.Navigator screenOptions={createStackScreenOptions(colors)}>
        <Stack.Screen name="Weight" options={weightScreenOptions}>
          {({ navigation }) => (
            <WeightScreen
              colors={colors}
              disabled={actionsDisabled}
              onAddWeight={() => navigation.navigate('AddWeight')}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="AddWeight" options={{ title: 'Add Weight' }}>
          {() => (
            <AddWeightScreen
              colors={colors}
              controller={addWeight}
              disabled={auth.busy}
              notice={auth.notice ?? addWeight.notice}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </WeightNavigationContext.Provider>
  );
}

function AddWeightHeaderButton() {
  const { actionsDisabled } = useContext(WeightNavigationContext);
  const navigation =
    useNavigation<NativeStackNavigationProp<WeightStackParamList>>();
  const { colors } = useTheme();

  return (
    <IconButton
      accessibilityLabel="Add weight"
      disabled={actionsDisabled}
      onPress={() => navigation.navigate('AddWeight')}
    >
      <Plus color={colors.text} size={22} strokeWidth={2} />
    </IconButton>
  );
}
