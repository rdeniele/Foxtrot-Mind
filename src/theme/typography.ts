import { Platform, TextStyle } from 'react-native';

export const fontFamily = {
  regular: Platform.select({ web: 'Inter_400Regular, sans-serif', default: 'Inter_400Regular' }),
  medium: Platform.select({ web: 'Inter_500Medium, sans-serif', default: 'Inter_500Medium' }),
  semibold: Platform.select({ web: 'Inter_600SemiBold, sans-serif', default: 'Inter_600SemiBold' }),
  bold: Platform.select({ web: 'Inter_700Bold, sans-serif', default: 'Inter_700Bold' }),
};

type TypeScale = Record<string, TextStyle>;

export const typography: TypeScale = {
  display: {
    fontFamily: fontFamily.semibold,
    fontSize: 32,
    lineHeight: 39,
    letterSpacing: -0.4,
  },
  h1: {
    fontFamily: fontFamily.semibold,
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.3,
  },
  h2: {
    fontFamily: fontFamily.semibold,
    fontSize: 21,
    lineHeight: 27,
    letterSpacing: -0.2,
  },
  h3: {
    fontFamily: fontFamily.medium,
    fontSize: 17,
    lineHeight: 23,
  },
  bodyLarge: {
    fontFamily: fontFamily.regular,
    fontSize: 17,
    lineHeight: 26,
  },
  body: {
    fontFamily: fontFamily.regular,
    fontSize: 15,
    lineHeight: 23,
  },
  bodyMedium: {
    fontFamily: fontFamily.medium,
    fontSize: 15,
    lineHeight: 22,
  },
  caption: {
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
  },
  captionMedium: {
    fontFamily: fontFamily.medium,
    fontSize: 13,
    lineHeight: 18,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.3,
  },
  button: {
    fontFamily: fontFamily.semibold,
    fontSize: 15,
    lineHeight: 20,
  },
};
