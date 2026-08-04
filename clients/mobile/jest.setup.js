/* global jest */

jest.mock('react-native-app-auth', () => ({
  authorize: jest.fn(),
  refresh: jest.fn(),
}));

jest.mock('react-native-keychain', () => ({
  getGenericPassword: jest.fn().mockResolvedValue(false),
}));

jest.mock('@react-native-community/datetimepicker', () => () => null);

jest.mock('lucide-react-native', () => ({
  CalendarDays: () => null,
  ChevronRight: () => null,
  House: () => null,
  Plus: () => null,
  Scale: () => null,
  ScanBarcode: () => null,
  UserRound: () => null,
  Utensils: () => null,
}));
