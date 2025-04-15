import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react';
import {useColorScheme} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {LightTheme, DarkTheme} from '../assets/theme.ts';

type ThemeName = 'light' | 'dark' | 'system';

const ThemeContext = createContext<{
  theme: typeof LightTheme;
  themeName: ThemeName;
  toggleTheme: () => void;
}>({
  theme: LightTheme,
  themeName: 'system',
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const system = useColorScheme();
  const [themeName, setThemeName] = useState<ThemeName>('system');

  useEffect(() => {
    AsyncStorage.getItem('APP_THEME').then(saved => {
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        setThemeName(saved);
      }
    });
  }, []);

  const theme = useMemo(() => {
    const mode = themeName === 'system' ? system : themeName;
    return mode === 'dark' ? DarkTheme : LightTheme;
  }, [themeName, system]);

  const toggleTheme = async () => {
    const next = themeName === 'light' ? 'dark' : 'light';
    setThemeName(next);
    await AsyncStorage.setItem('APP_THEME', next);
  };

  return (
    <ThemeContext.Provider value={{theme, themeName, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
