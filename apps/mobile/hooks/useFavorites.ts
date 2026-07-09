import { useMemo } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Alert } from 'react-native';
import type { UnitSummary } from '@satre/shared-types';
import { addFavorite, fetchFavorites, removeFavorite } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/auth-errors';
import { isAuthenticated, useAuthStore } from '@/lib/auth-store';
import { router } from 'expo-router';

export function useFavorites() {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((state) => state.accessToken);

  const favoritesQuery = useQuery({
    queryKey: ['favorites'],
    queryFn: fetchFavorites,
    enabled: Boolean(accessToken),
  });

  const favoriteIds = useMemo(
    () => new Set(favoritesQuery.data?.map((unit) => unit.id) ?? []),
    [favoritesQuery.data],
  );

  const toggleMutation = useMutation({
    mutationFn: async (unit: UnitSummary) => {
      if (!isAuthenticated()) {
        throw new Error('AUTH_REQUIRED');
      }
      const current = queryClient.getQueryData<UnitSummary[]>(['favorites']) ?? [];
      const isFav = current.some((item) => item.id === unit.id);
      if (isFav) {
        await removeFavorite(unit.id);
        return { removed: true };
      }
      await addFavorite(unit.id);
      return { removed: false };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
    onError: (error) => {
      if (error instanceof Error && error.message === 'AUTH_REQUIRED') {
        Alert.alert('Entre na sua conta', 'Faça login para salvar favoritos.', [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Entrar', onPress: () => router.push('/(auth)/login') },
        ]);
        return;
      }
      Alert.alert('Favorito', getApiErrorMessage(error, 'Não foi possível atualizar favorito.'));
    },
  });

  return {
    favoriteIds,
    isFavorite: (unitId: string) => favoriteIds.has(unitId),
    toggleFavorite: (unit: UnitSummary) => toggleMutation.mutate(unit),
    isSaving: toggleMutation.isPending,
  };
}
