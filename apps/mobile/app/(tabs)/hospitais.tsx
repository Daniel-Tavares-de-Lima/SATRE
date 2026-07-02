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
import type { UnitSummary, UnitType } from '@satre/shared-types';
import { UnitCard } from '@/components/UnitCard';
import { API_BASE_URL, fetchUnits } from '@/lib/api';
import { colors, spacing } from '@/constants/theme';

type TypeFilter = 'all' | UnitType;

export default function HospitaisScreen() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');

  const { data, isLoading, isError, refetch, isRefetching } = useQuery({
    queryKey: ['units', 'all'],
    queryFn: fetchUnits,
  });

  const units = useMemo(() => {
    if (!data) return [];
    const q = search.trim().toLowerCase();
    return data
      .filter((u) => (typeFilter === 'all' ? true : u.type === typeFilter))
      .filter(
        (u) =>
          !q || u.name.toLowerCase().includes(q) || u.address.toLowerCase().includes(q),
      )
      .sort((a, b) => a.estimatedWaitMinutes - b.estimatedWaitMinutes);
  }, [data, search, typeFilter]);

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
        value={search}
        onChangeText={setSearch}
        placeholderTextColor={colors.textMuted}
      />

      <View style={styles.filters}>
        {(['all', 'upa', 'private'] as TypeFilter[]).map((key) => (
          <Text
            key={key}
            style={[styles.filterBtn, typeFilter === key && styles.filterBtnActive]}
            onPress={() => setTypeFilter(key)}
          >
            {key === 'all' ? 'Todas' : key === 'upa' ? 'UPAs' : 'Privadas'}
          </Text>
        ))}
      </View>

      {isLoading && <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />}

      {isError && (
        <Text style={styles.error}>Erro ao conectar em {API_BASE_URL}</Text>
      )}

      {units.map((unit: UnitSummary) => (
        <UnitCard
          key={unit.id}
          unit={unit}
          onPress={() => router.push(`/unidade/${unit.id}`)}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.md },
  search: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    marginBottom: spacing.md,
    color: colors.text,
  },
  filters: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.md },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  filterBtnActive: {
    backgroundColor: colors.primary,
    color: '#fff',
    borderColor: colors.primary,
    fontWeight: '600',
  },
  loader: { marginVertical: spacing.lg },
  error: { color: colors.high, marginBottom: spacing.md },
});
