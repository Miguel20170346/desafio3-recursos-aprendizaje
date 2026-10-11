import { MD3LightTheme, MD3Theme } from 'react-native-paper';

export const theme: MD3Theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#1D4ED8', // Azul institucional UDB
    onPrimary: '#FFFFFF',
    primaryContainer: '#DBEAFE',
    onPrimaryContainer: '#1E3A8A',
    secondary: '#0F766E', // Teal elegante
    onSecondary: '#FFFFFF',
    secondaryContainer: '#CCFBF1',
    onSecondaryContainer: '#115E59',
    tertiary: '#D97706', // Ámbar para calificaciones/estrellas
    onTertiary: '#FFFFFF',
    background: '#F8FAFC', // Slate muy claro
    surface: '#FFFFFF',
    surfaceVariant: '#F1F5F9',
    error: '#DC2626',
    outline: '#CBD5E1',
  },
};
