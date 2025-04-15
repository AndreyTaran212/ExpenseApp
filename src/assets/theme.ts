import {MD3DarkTheme, MD3LightTheme} from 'react-native-paper';

export const LightTheme = {
  ...MD3LightTheme,
  roundness: 8,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#0066cc',
    background: '#ffffff',
    surface: '#f2f2f2',
    error: '#d32f2f',
    text: '#212121',
  },
};

export const DarkTheme = {
  ...MD3DarkTheme,
  roundness: 8,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#4dabf5',
    background: '#121212',
    surface: '#1e1e1e',
    error: '#cf6679',
    text: '#ffffff',
  },
};
