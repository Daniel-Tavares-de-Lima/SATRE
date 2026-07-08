import { Platform } from 'react-native';
import Constants from 'expo-constants';
import type { AuthUser, UnitDetail, UnitSummary } from '@satre/shared-types';
import { useAuthStore, type AuthSession } from './auth-store';

function resolveApiBaseUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) return envUrl.replace(/\/$/, '');

  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:3000';
  }

  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const host = hostUri.split(':')[0];
    return `http://${host}:3000`;
  }

  return 'http://localhost:3000';
}

export const API_BASE_URL = resolveApiBaseUrl();

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = useAuthStore.getState().accessToken;
  const headers = new Headers(options.headers);

  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }

  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new ApiError(response.status, text || response.statusText);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function fetchUnits(): Promise<UnitSummary[]> {
  return apiFetch('/units');
}

export function fetchNearbyUnits(lat: number, lng: number): Promise<UnitSummary[]> {
  return apiFetch(`/units/nearby?lat=${lat}&lng=${lng}`);
}

export function fetchUnitById(id: string): Promise<UnitDetail> {
  return apiFetch(`/units/${id}`);
}

export function fetchHealth(): Promise<{ status: string; timestamp: string }> {
  return apiFetch('/health');
}

export function login(email: string, password: string): Promise<AuthSession> {
  return apiFetch<AuthSession>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function register(body: {
  name: string;
  email: string;
  password: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}): Promise<AuthSession> {
  return apiFetch<AuthSession>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export function logout(refreshToken: string): Promise<void> {
  return apiFetch<void>('/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  });
}

export function fetchProfile(): Promise<AuthUser> {
  return apiFetch('/users/me');
}
