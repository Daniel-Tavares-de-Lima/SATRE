import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthHydration } from '@/components/AuthHydration';
import { colors } from '@/constants/theme';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthHydration>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="unidade/[id]"
            options={{
              headerShown: true,
              title: 'Emergência',
              headerTintColor: colors.textOnPrimary,
              headerStyle: { backgroundColor: colors.primary },
            }}
          />
          <Stack.Screen
            name="configuracoes"
            options={{
              headerShown: false,
              presentation: 'modal',
            }}
          />
        </Stack>
      </AuthHydration>
    </QueryClientProvider>
  );
}
