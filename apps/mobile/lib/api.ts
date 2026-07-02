import { Platform } from 'react-native';
import Constants from 'expo-constants';
import type { UnitDetail, UnitSummary } from '@satre/shared-types';

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

async function apiFetch<T>(path: string): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const response = await fetch(url, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new ApiError(response.status, text || response.statusText);
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

export function fetchHealth(): Promise<{ status: string }> {
  return apiFetch('/health');
}
