import React, { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { AppBootstrap } from './composition/AppBootstrap';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});
  }, []);

  return <AppBootstrap />;
}
