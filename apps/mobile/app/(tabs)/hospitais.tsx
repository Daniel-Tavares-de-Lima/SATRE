import { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
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
import { ApiDownState } from '@/components/ApiDownState';
import { UnitCardFigma } from '@/components/UnitCardFigma';
import { useFavorites } from '@/hooks/useFavorites';
import { UnitFiltersModal } from '@/components/UnitFiltersModal';
import { ScreenHeader } from '@/components/ScreenHeader';
import { SearchBar } from '@/components/SearchBar';
import { StaleDataBanner } from '@/components/StaleDataBanner';
import { fetchUnitsWithCache } from '@/lib/api';
import {
  countActiveFilters,
  DEFAULT_UNIT_FILTERS,
  type UnitListFilters,
} from '@/lib/unit-filters';
import { colors, spacing } from '@/constants/theme';

export default function HospitaisScreen() {
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<UnitListFilters>(DEFAULT_UNIT_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeFilterCount = countActiveFilters(filters);

  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['units', 'all', filters, search],
    queryFn: () => fetchUnitsWithCache(search, filters),
  });

  const units = useMemo(() => {
    if (!data?.units) return [];
    return [...data.units].sort((a, b) => a.estimatedWaitMinutes - b.estimatedWaitMinutes);
  }, [data]);

  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <>
      <View style={styles.root}>
        <ScreenHeader title="Hospitais" />
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.primary} />
          }
        >
          <View style={styles.searchRow}>
            <SearchBar
              value={search}
              onChangeText={setSearch}
              style={styles.searchFlex}
            />

            <Pressable
              style={[styles.filterButton, activeFilterCount > 0 && styles.filterButtonActive]}
              onPress={() => setFiltersOpen(true)}
              accessibilityRole="button"
              accessibilityLabel="Abrir filtros"
            >
              <Text
                style={[
                  styles.filterButtonText,
                  activeFilterCount > 0 && styles.filterButtonTextActive,
                ]}
              >
                Filtros{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
              </Text>
            </Pressable>
          </View>

          <StaleDataBanner visible={Boolean(data?.fromCache)} />

          {activeFilterCount > 0 && !data?.fromCache ? (
            <Text style={styles.filterSummary}>
              {units.length} unidade{units.length === 1 ? '' : 's'} com filtros aplicados
            </Text>
          ) : null}

          {isLoading && (
            <View style={styles.center}>
              <ActivityIndicator size="large" color={colors.primary} />
            </View>
          )}

          {isError && <ApiDownState onRetry={() => refetch()} />}

          {!isLoading && !isError && units.length === 0 && (
            <Text style={styles.empty}>Nenhuma unidade encontrada</Text>
          )}

          {units.map((unit) => (
            <UnitCardFigma
              key={unit.id}
              unit={unit}
              showAddress={false}
              isFavorite={isFavorite(unit.id)}
              onToggleFavorite={() => toggleFavorite(unit)}
              onPress={() => router.push(`/unidade/${unit.id}`)}
            />
          ))}
        </ScrollView>
      </View>

      <UnitFiltersModal
        visible={filtersOpen}
        filters={filters}
        onClose={() => setFiltersOpen(false)}
        onApply={setFilters}
      />
    </>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  searchRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
    alignItems: 'center',
  },
  searchFlex: { flex: 1 },
  filterButton: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 14,
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  filterSummary: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  center: { paddingVertical: spacing.xl, alignItems: 'center' },
  empty: { color: colors.textMuted, textAlign: 'center', paddingVertical: spacing.lg },
});
