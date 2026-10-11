import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';

import { theme } from './src/theme/theme';
import { AuthProvider } from './src/context/AuthContext';
import { FavoritesProvider } from './src/context/FavoritesContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <FavoritesProvider>
            <StatusBar style="dark" />
            <AppNavigator />
          </FavoritesProvider>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
