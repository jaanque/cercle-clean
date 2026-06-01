import { Platform } from 'react-native';

export const Colors = {
  background1: '#ffffff',
  background2: '#F7F7F7',
  text: '#333333',
  accent: '#5B2333',
} as const;

export const Typography = {
  fontFamily: Platform.select({
    ios: 'System',
    android: 'sans-serif',
    web: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    default: 'System',
  }),
};
