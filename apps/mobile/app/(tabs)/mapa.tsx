import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import type { UnitSummary } from '@satre/shared-types';
import { FilterChips, type FilterKey } from '@/components/FilterChips';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SearchBar } from '@/components/SearchBar';
import { UnitMap } from '@/components/UnitMap';
import { UnitMapSheet } from '@/components/UnitMapSheet';
import { useFavorites } from '@/hooks/useFavorites';
import { API_BASE_URL, fetchUnits } from '@/lib/api';
import { isAuthenticated } from '@/lib/auth-store';
import { getUserLocation, RECIFE_CENTER } from '@/lib/location';
import { colors, spacing } from '@/constants/theme';

function filterAndSortUnits(
  units: UnitSummary[],
  search: string,
  filter: FilterKey | null,
): UnitSummary[] {
  const query = search.trim().toLowerCase();
  let result = query
    ? units.filter(
        (unit) =>
          unit.name.toLowerCase().includes(query) ||
          unit.address.toLowerCase().includes(query),
      )
    : units;

  if (filter === 'doctors') {
    result = [...result].sort((a, b) => b.doctorCount - a.doctorCount);
  } else if (filter === 'patients') {
    result = [...result].sort((a, b) => b.patientCount - a.patientCount);
  } else if (filter === 'wait') {
    result = [...result].sort((a, b) => a.estimatedWaitMinutes - b.estimatedWaitMinutes);
  }

  return result;
}

export default function MapaScreen() {
  const [selectedUnit, setSelectedUnit] = useState<UnitSummary | null>(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterKey | null>(null);

  const { isFavorite, toggleFavorite, isSaving } = useFavorites();

  const locationQuery = useQuery({
    queryKey: ['map', 'location'],
    queryFn: getUserLocation,
  });

  const unitsQuery = useQuery({
    queryKey: ['units', 'map'],
    queryFn: () => fetchUnits(),
  });

  const mapCenter = locationQuery.data?.coords ?? RECIFE_CENTER;

  const visibleUnits = useMemo(
    () => filterAndSortUnits(unitsQuery.data ?? [], search, filter),
    [unitsQuery.data, search, filter],
  );

  if (locationQuery.isLoading || unitsQuery.isLoading) {
    return (
      <View style={styles.root}>
        <ScreenHeader title="Mapa" />
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }

  if (unitsQuery.isError || !unitsQuery.data?.length) {
    return (
      <View style={styles.root}>
        <ScreenHeader title="Mapa" />
        <View style={styles.center}>
          <Text style={styles.error}>Mapa indisponível — verifique a API</Text>
          <Text style={styles.errorHint}>{API_BASE_URL}</Text>
          <Pressable style={styles.retryButton} onPress={() => unitsQuery.refetch()}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <UnitMap
        units={visibleUnits}
        center={mapCenter}
        selectedUnitId={selectedUnit?.id ?? null}
        onSelectUnit={setSelectedUnit}
      />

      <View style={styles.overlay} pointerEvents="box-none">
        <ScreenHeader title="Mapa" />
        <View style={styles.controls} pointerEvents="auto">
          <SearchBar value={search} onChangeText={setSearch} style={styles.search} />
          <FilterChips active={filter} onChange={setFilter} />
        </View>
      </View>

      {selectedUnit ? (
        <UnitMapSheet
          unit={selectedUnit}
          isFavorite={isFavorite(selectedUnit.id)}
          isAuthenticated={isAuthenticated()}
          isSaving={isSaving}
          onClose={() => setSelectedUnit(null)}
          onToggleFavorite={() => toggleFavorite(selectedUnit)}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  controls: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
  },
  search: { marginBottom: spacing.sm },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  error: { color: colors.text, fontWeight: '600', marginBottom: spacing.xs },
  errorHint: { color: colors.textMuted, fontSize: 13, marginBottom: spacing.md },
  retryButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  retryButtonText: { color: '#fff', fontWeight: '600' },
});
