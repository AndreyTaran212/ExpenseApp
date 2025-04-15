import React from 'react';
import {IconButton} from 'react-native-paper';
import {useAppTheme} from '../hooks/useAppTheme';

const ThemeToggleButton = () => {
  const {toggleTheme, themeName} = useAppTheme();

  return (
    <IconButton
      style={{position: 'absolute', top: 25, right: 10}}
      icon={
        themeName === 'dark'
          ? 'weather-sunny'
          : themeName === 'light'
          ? 'weather-night'
          : 'weather-night'
      }
      onPress={toggleTheme}
    />
  );
};

export default ThemeToggleButton;
