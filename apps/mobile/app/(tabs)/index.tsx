import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { UnitSummary } from '@satre/shared-types';
import { FilterChips, type FilterKey } from '@/components/FilterChips';
import { UnitCard } from '@/components/UnitCard';
import { API_BASE_URL, fetchNearbyUnits } from '@/lib/api';
import { getUserCoords } from '@/lib/location';
import { colors, spacing } from '@/constants/theme';

function sortUnits(units: UnitSummary[], filter: FilterKey | null): UnitSummary[] {
  const copy = [...units];
  if (filter === 'doctors') return copy.sort((a, b) => b.doctorCount - a.doctorCount);
  if (filter === 'patients') return copy.sort((a, b) => b.patientCount - a.patientCount);
  if (filter === 'wait') return copy.sort((a, b) => a.estimatedWaitMinutes - b.estimatedWaitMinutes);
  return copy;
}

export default function InicioScreen() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterKey | null>(null);

  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['units', 'nearby'],
    queryFn: async () => {
      const coords = await getUserCoords();
      return fetchNearbyUnits(coords.lat, coords.lng);
    },
  });

  const units = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    const filtered = q
      ? data.filter(
          (u) =>
            u.name.toLowerCase().includes(q) || u.address.toLowerCase().includes(q),
        )
      : data;
    return sortUnits(filtered, filter);
  }, [data, search, filter]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
      }
    >
      <TextInput
        style={styles.search}
        placeholder="Pesquisar"
        placeholderTextColor={colors.textMuted}
        value={search}
        onChangeText={setSearch}
        accessibilityLabel="Pesquisar unidades"
      />

      <FilterChips active={filter} onChange={setFilter} />

      <Text style={styles.sectionTitle}>Perto de você</Text>

      {isLoading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}

      {isError && (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Não foi possível carregar</Text>
          <Text style={styles.errorText}>API: {API_BASE_URL}</Text>
          <Text style={styles.errorText}>Confira se a API está rodando (npm run dev:api)</Text>
        </View>
      )}

      {!isLoading && !isError && units.length === 0 && (
        <Text style={styles.empty}>Nenhuma unidade encontrada</Text>
      )}

      {units.map((unit) => (
        <UnitCard
          key={unit.id}
          unit={unit}
          onPress={() => router.push(`/unidade/${unit.id}`)}
        />
      ))}

      {!isLoading && !isError && units.length > 0 && (
        <Text
          style={styles.link}
          onPress={() => router.push('/(tabs)/hospitais')}
          accessibilityRole="link"
        >
          ver todos
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  search: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: spacing.md,
    color: colors.text,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  center: { paddingVertical: spacing.xl, alignItems: 'center' },
  errorBox: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  errorTitle: { fontWeight: '700', color: '#B91C1C', marginBottom: spacing.xs },
  errorText: { color: '#7F1D1D', fontSize: 13 },
  empty: { color: colors.textMuted, textAlign: 'center', paddingVertical: spacing.lg },
  link: {
    color: colors.primary,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: spacing.sm,
    fontSize: 15,
  },
});
