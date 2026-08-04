import type { NavigatorScreenParams } from '@react-navigation/native';
import type { AccountStackParamList } from '@/features/account';
import type { CaloriesStackParamList } from '@/features/calories';
import type { HomeStackParamList } from '@/features/home';
import type { ScanStackParamList } from '@/features/scan';
import type { WeightStackParamList } from '@/features/weight';

export type RootTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList> | undefined;
  Weight: NavigatorScreenParams<WeightStackParamList> | undefined;
  Scan: NavigatorScreenParams<ScanStackParamList> | undefined;
  Calories: NavigatorScreenParams<CaloriesStackParamList> | undefined;
  Account: NavigatorScreenParams<AccountStackParamList> | undefined;
};
