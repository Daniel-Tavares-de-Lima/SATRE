import type { ReactNode } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useAuthStore } from '@/lib/auth-store';
import { colors } from '@/constants/theme';

/** Waits for SecureStore session rehydration before rendering protected UI. */
export function AuthHydration({ children }: { children: ReactNode }) {
  const isHydrated = useAuthStore((state) => state.isHydrated);

  if (!isHydrated) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return children;
}
