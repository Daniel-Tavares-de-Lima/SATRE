import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { AuthHydration } from '@/components/AuthHydration';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthHydration>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="unidade/[id]"
            options={{ headerShown: true, title: 'Emergência', headerTintColor: '#fff', headerStyle: { backgroundColor: '#0B6E4F' } }}
          />
          <Stack.Screen
            name="configuracoes"
            options={{ headerShown: true, title: 'Configurações', presentation: 'modal' }}
          />
        </Stack>
      </AuthHydration>
    </QueryClientProvider>
  );
}
