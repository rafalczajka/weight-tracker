/* global jest */

jest.mock('react-native-app-auth', () => ({
  authorize: jest.fn(),
  refresh: jest.fn(),
}));

jest.mock('react-native-keychain', () => ({
  getGenericPassword: jest.fn().mockResolvedValue(false),
}));

jest.mock('@react-native-community/datetimepicker', () => () => null);

jest.mock('react-native-camera-kit', () => ({
  Camera: () => null,
  CameraType: { Back: 'back' },
}));

jest.mock('react-native-permissions', () => ({
  check: jest.fn().mockResolvedValue('granted'),
  openSettings: jest.fn().mockResolvedValue(undefined),
  PERMISSIONS: {
    ANDROID: { CAMERA: 'android.permission.CAMERA' },
    IOS: { CAMERA: 'ios.permission.CAMERA' },
  },
  request: jest.fn().mockResolvedValue('granted'),
  RESULTS: {
    BLOCKED: 'blocked',
    DENIED: 'denied',
    GRANTED: 'granted',
    LIMITED: 'limited',
    UNAVAILABLE: 'unavailable',
  },
}));

jest.mock('lucide-react-native', () => ({
  CalendarDays: () => null,
  ChevronDown: () => null,
  ChevronRight: () => null,
  ChevronUp: () => null,
  Flashlight: () => null,
  House: () => null,
  Plus: () => null,
  Scale: () => null,
  ScanBarcode: () => null,
  UserRound: () => null,
  Utensils: () => null,
}));
