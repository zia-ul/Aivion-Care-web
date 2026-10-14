export const APP_NAME = 'Aivion Care';

import { resolveApiOrigin } from '@/lib/api/config';
export const API_BASE_URL = resolveApiOrigin();

export const WS_BASE_URL = resolveApiOrigin();

export const TURN_CONFIG = {
  url: process.env.NEXT_PUBLIC_TURN_URL || '',
  username: process.env.NEXT_PUBLIC_TURN_USERNAME || '',
  password: process.env.NEXT_PUBLIC_TURN_PASSWORD || '',
};

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  USER: 'user',
} as const;

export const DATE_FORMAT = {
  YEAR: 'numeric',
  MONTH: 'short',
  DAY: 'numeric',
} as const;

export const TIME_FORMAT = {
  HOUR: '2-digit',
  MINUTE: '2-digit',
} as const;

export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',
} as const;
