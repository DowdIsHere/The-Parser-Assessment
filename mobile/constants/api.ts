import { Platform } from 'react-native';

const DEV_API_URL = Platform.select({
  android: 'http://10.0.2.2:3000',
  ios: 'http://localhost:3000',
  default: 'http://localhost:3000',
});

const PROD_API_URL = 'https://twentyseven-parser-production.up.railway.app';

export const API_BASE_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;

export const endpoints = {
  login: '/api/auth/login',
  register: '/api/auth/register',
  profile: '/api/profile',
  assessment: '/api/assessment',
  careers: '/api/careers',
} as const;
