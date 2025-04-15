import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {PaperProvider} from 'react-native-paper';
import {useAppTheme, ThemeProvider} from './src/hooks/useAppTheme';
import {AuthProvider, useAuth} from './src/hooks/useAuth.tsx';
import {AccountProvider} from './src/hooks/useAccount.tsx';
import AppNavigator from './src/components/AppNavigation.tsx';
import AuthNavigator from './src/components/AuthNavigation.tsx';
import {
  initialWindowMetrics,
  SafeAreaProvider,
} from 'react-native-safe-area-context';

const AppContainer = (): React.JSX.Element => {
  const {theme} = useAppTheme();
  const {user} = useAuth();
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={theme}>
        {user ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </PaperProvider>
  );
};

const App = (): React.JSX.Element => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AccountProvider>
          <SafeAreaProvider initialMetrics={initialWindowMetrics}>
            <AppContainer />
          </SafeAreaProvider>
        </AccountProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
