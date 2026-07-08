import type { AuthUser } from '@satre/shared-types';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';

const AUTH_STORAGE_KEY = 'satre-auth';

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AuthUser | null;
  isHydrated: boolean;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
}

const secureStorage: StateStorage = Platform.OS === 'web'
  ? {
      getItem: (name) => Promise.resolve(localStorage.getItem(name)),
      setItem: (name, value) => {
        localStorage.setItem(name, value);
        return Promise.resolve();
      },
      removeItem: (name) => {
        localStorage.removeItem(name);
        return Promise.resolve();
      },
    }
  : {
      getItem: (name) => SecureStore.getItemAsync(name),
      setItem: (name, value) => SecureStore.setItemAsync(name, value),
      removeItem: (name) => SecureStore.deleteItemAsync(name),
    };

/** Persists JWT tokens and minimal user profile in SecureStore. */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isHydrated: false,
      setSession: ({ accessToken, refreshToken, user }) =>
        set({ accessToken, refreshToken, user }),
      clearSession: () => set({ accessToken: null, refreshToken: null, user: null }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
      onRehydrateStorage: () => () => {
        useAuthStore.setState({ isHydrated: true });
      },
    },
  ),
);

export function isAuthenticated(): boolean {
  return Boolean(useAuthStore.getState().accessToken);
}
