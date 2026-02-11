import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider, useAppTheme } from './src/context/ThemeContext';
import { UsersLocationProvider } from './src/context/UsersLocationContext';
import RootNavigator from './src/navigation/RootNavigator';

function ThemedNavigation() {
  const { isDark } = useAppTheme();
  const navigationTheme = isDark ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer theme={navigationTheme}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <RootNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UsersLocationProvider>
          <ThemedNavigation />
        </UsersLocationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

