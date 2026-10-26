import { NavigationProp, useNavigation } from '@react-navigation/native';

export function useAppNavigation<TParamList extends Record<string, object | undefined>>() {
  return useNavigation<NavigationProp<TParamList>>();
}
