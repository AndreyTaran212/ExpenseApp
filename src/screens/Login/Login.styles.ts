import {StyleSheet} from 'react-native';
import {MD3Theme} from 'react-native-paper';

export const useLoginScreenStyles = (theme: MD3Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 24,
      backgroundColor: theme.colors.background,
      margin: 20,
    },
    title: {
      marginBottom: 32,
      textAlign: 'center',
      color: theme.colors.primary,
    },
    input: {
      marginBottom: 4,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 13,
      marginBottom: 12,
      marginLeft: 4,
    },
    button: {
      marginTop: 20,
    },
    buttonContent: {
      height: 48,
    },
  });
