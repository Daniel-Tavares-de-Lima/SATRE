import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { OccupancyBadge } from '@/components/OccupancyBadge';
import { fetchUnitById } from '@/lib/api';
import { colors, spacing } from '@/constants/theme';

/** Minimal unit detail — full Emergência screen in Task 16. */
export default function UnidadeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['unit', id],
    queryFn: () => fetchUnitById(id!),
    enabled: Boolean(id),
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Unidade não encontrada</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.name}>{data.name}</Text>
        <OccupancyBadge level={data.occupancyLevel} />
      </View>

      <Text style={styles.address}>{data.address}</Text>

      <View style={styles.statsRow}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{data.estimatedWaitMinutes} min</Text>
          <Text style={styles.statLabel}>Tempo médio</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{data.doctorCount}</Text>
          <Text style={styles.statLabel}>Médicos</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{data.patientCount}</Text>
          <Text style={styles.statLabel}>Pacientes</Text>
        </View>
      </View>

      {data.specialties.length > 0 ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Especialidades</Text>
          <Text style={styles.sectionBody}>{data.specialties.join(' · ')}</Text>
        </View>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: colors.high },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  name: { flex: 1, fontSize: 22, fontWeight: '700', color: colors.text },
  address: { fontSize: 14, color: colors.textMuted, marginBottom: spacing.lg, lineHeight: 20 },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  stat: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  statValue: { fontSize: 20, fontWeight: '700', color: colors.primary },
  statLabel: { fontSize: 12, color: colors.textMuted, marginTop: spacing.xs },
  section: { marginBottom: spacing.md },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
  sectionBody: { fontSize: 14, color: colors.text, lineHeight: 20 },
});
