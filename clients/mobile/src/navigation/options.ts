import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import type { ThemeColors } from '../theme';

export function createStackScreenOptions(
  colors: ThemeColors,
): NativeStackNavigationOptions {
  return {
    contentStyle: { backgroundColor: colors.background },
    headerBackButtonDisplayMode: 'minimal',
    headerStyle: { backgroundColor: colors.input },
    headerTintColor: colors.text,
    headerTitleAlign: 'center',
    headerTitleStyle: {
      fontSize: 18,
      fontWeight: '600',
    },
  };
}
