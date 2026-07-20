export const colors = {
  bg: '#FAF7F0',
  card: '#FFFDF9',
  gold: '#9A7B2E',
  goldPale: '#D8B45E',
  dark: '#211A12',
  text: '#1E1813',
  textSecondary: '#4A3F35',
  textMuted: '#8A7E6E',
  white: '#FFFFFF',
  border: '#E8E0D4',
  error: '#A0392D',
} as const;

export const fonts = {
  display: 'CormorantGaramond_700Bold',
  displayRegular: 'CormorantGaramond_400Regular',
  displayItalic: 'CormorantGaramond_400Regular_Italic',
  body: 'PlusJakartaSans_400Regular',
  bodyMedium: 'PlusJakartaSans_500Medium',
  bodySemiBold: 'PlusJakartaSans_600SemiBold',
  bodyBold: 'PlusJakartaSans_700Bold',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
} as const;

export const shadows = {
  sm: {
    shadowColor: '#211A12',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#211A12',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#211A12',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;
