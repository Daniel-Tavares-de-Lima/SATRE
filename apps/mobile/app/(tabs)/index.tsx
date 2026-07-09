import { useMemo, useState } from 'react';
import { router } from 'expo-router';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { UnitSummary } from '@satre/shared-types';
import { FilterChips, type FilterKey } from '@/components/FilterChips';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SearchBar } from '@/components/SearchBar';
import { UnitCardFigma } from '@/components/UnitCardFigma';
import { ProfileCompleteBanner } from '@/components/ProfileCompleteBanner';
import { useFavorites } from '@/hooks/useFavorites';
import { useNearbyUnits } from '@/hooks/useNearbyUnits';
import { API_BASE_URL } from '@/lib/api';
import { useAuthStore } from '@/lib/auth-store';
import { colors, spacing } from '@/constants/theme';

function sortUnits(units: UnitSummary[], filter: FilterKey | null): UnitSummary[] {
  const copy = [...units];

  if (filter === 'doctors') {
    return copy.sort((a, b) => b.doctorCount - a.doctorCount);
  }

  if (filter === 'patients') {
    return copy.sort((a, b) => b.patientCount - a.patientCount);
  }

  if (filter === 'wait') {
    return copy.sort((a, b) => a.estimatedWaitMinutes - b.estimatedWaitMinutes);
  }

  return copy;
}

export default function InicioScreen() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterKey | null>(null);
  const user = useAuthStore((state) => state.user);
  const { isFavorite, toggleFavorite } = useFavorites();

  const { data, isLoading, isError, refetch, isRefetching } = useNearbyUnits();

  const units = useMemo(() => {
    if (!data?.units) return [];

    const query = search.trim().toLowerCase();
    const filtered = query
      ? data.units.filter(
          (unit) =>
            unit.name.toLowerCase().includes(query) ||
            unit.address.toLowerCase().includes(query),
        )
      : data.units;

    return sortUnits(filtered, filter);
  }, [data, search, filter]);

  return (
    <View style={styles.root}>
      <ScreenHeader variant="home" userLabel={user?.name ?? 'Usuário'} />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
        }
      >
        <SearchBar
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />

        <FilterChips active={filter} onChange={setFilter} />

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Perto de você</Text>
        {data && !data.permissionGranted ? (
          <Text style={styles.locationHint}>Usando localização padrão (Recife)</Text>
        ) : null}
      </View>

      {isLoading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Buscando unidades próximas…</Text>
        </View>
      )}

      {isError && (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Não foi possível carregar</Text>
          <Text style={styles.errorText}>API: {API_BASE_URL}</Text>
          <Text style={styles.errorText}>Confira se a API está rodando (npm run dev:api)</Text>
          <Pressable style={styles.retryButton} onPress={() => refetch()}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </Pressable>
        </View>
      )}

      {!isLoading && !isError && units.length === 0 && (
        <Text style={styles.empty}>Nenhuma unidade encontrada</Text>
      )}

      {units.map((unit) => (
        <UnitCardFigma
          key={unit.id}
          unit={unit}
          isFavorite={isFavorite(unit.id)}
          onToggleFavorite={() => toggleFavorite(unit)}
          onPress={() => router.push(`/unidade/${unit.id}`)}
        />
      ))}

      <ProfileCompleteBanner visible={!user} />

      {!isLoading && !isError && units.length > 0 && (
        <Pressable
          onPress={() => router.push('/(tabs)/hospitais')}
          accessibilityRole="link"
          style={styles.linkWrap}
        >
          <Text style={styles.link}>ver todos</Text>
        </Pressable>
      )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  searchInput: { marginBottom: spacing.md },
  sectionHeader: {
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  locationHint: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  center: { paddingVertical: spacing.xl, alignItems: 'center', gap: spacing.sm },
  loadingText: { color: colors.textMuted, fontSize: 14 },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorTitle: { fontWeight: '700', color: '#B91C1C', marginBottom: spacing.xs },
  errorText: { color: '#7F1D1D', fontSize: 13 },
  retryButton: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  retryButtonText: { color: '#fff', fontWeight: '600' },
  empty: { color: colors.textMuted, textAlign: 'center', paddingVertical: spacing.lg },
  linkWrap: { marginTop: spacing.sm, alignItems: 'center' },
  link: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 15,
  },
});
