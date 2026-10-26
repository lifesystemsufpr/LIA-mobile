import React, { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { AppBootstrap } from './src/app/composition/AppBootstrap';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function App() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return <AppBootstrap />;
}
