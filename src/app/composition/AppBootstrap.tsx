import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { defaultAssessmentsRepository } from '../features/history';
import { defaultParticipantsRepository } from '../features/participants';
import { Colors, LoadingState } from '../shared';
import { RootNavigator } from './RootNavigator';

export const AppBootstrap: React.FC = () => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function initialize() {
      try {
        // Pre-load repositories and offline cache
        await Promise.all([
          defaultParticipantsRepository.getAll(),
          defaultAssessmentsRepository.getAll(),
        ]);
      } catch {
        // Continue even if local cache init logs error
      } finally {
        setIsReady(true);
      }
    }

    initialize();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.splashContainer}>
        <LoadingState message="Inicializando LIA Mobile..." />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
