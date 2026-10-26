import { NativeStackNavigationOptions } from '@react-navigation/native-stack';

export const defaultScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'slide_from_right',
  contentStyle: { backgroundColor: '#F7F9FC' },
};

export const modalScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  presentation: 'transparentModal',
  animation: 'fade',
};

export const darkScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  animation: 'fade',
  contentStyle: { backgroundColor: '#091223' },
};
