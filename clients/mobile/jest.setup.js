/* global jest */

jest.mock('react-native-app-auth', () => ({
  authorize: jest.fn(),
  refresh: jest.fn(),
}));

jest.mock('react-native-keychain', () => ({
  getGenericPassword: jest.fn().mockResolvedValue(false),
}));

jest.mock('lucide-react-native', () => ({
  ChartLine: () => null,
  Plus: () => null,
  UserRound: () => null,
}));

jest.mock('react-native-gifted-charts', () => ({
  LineChart: () => null,
  ruleTypes: { DASHED: 'dashed' },
}));

jest.mock('react-native-linear-gradient', () => () => null);
