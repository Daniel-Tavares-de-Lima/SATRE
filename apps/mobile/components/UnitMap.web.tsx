import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { UnitSummary } from '@satre/shared-types';
import { OccupancyBadge } from '@/components/OccupancyBadge';
import { colors, spacing } from '@/constants/theme';

interface UnitMapProps {
  units: UnitSummary[];
  center?: { lat: number; lng: number };
  selectedUnitId?: string | null;
  onSelectUnit: (unit: UnitSummary) => void;
}

/** Web fallback — react-native-maps is native-only. */
export function UnitMap({ units, selectedUnitId, onSelectUnit }: UnitMapProps) {
  return (
    <View style={styles.container}>
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Mapa interativo</Text>
        <Text style={styles.bannerText}>
          No navegador, selecione uma unidade abaixo. No celular, use o mapa com pins.
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.list}>
        {units.map((unit) => (
          <Pressable
            key={unit.id}
            style={[styles.card, selectedUnitId === unit.id && styles.cardSelected]}
            onPress={() => onSelectUnit(unit)}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardName}>{unit.name}</Text>
              <OccupancyBadge level={unit.occupancyLevel} />
            </View>
            <Text style={styles.cardMeta}>
              {unit.estimatedWaitMinutes} min · {unit.doctorCount} médicos
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  banner: {
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    padding: spacing.md,
  },
  bannerTitle: { fontWeight: '700', color: colors.text, marginBottom: 4 },
  bannerText: { color: colors.textMuted, fontSize: 13, lineHeight: 18 },
  list: { padding: spacing.md, gap: spacing.sm },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardSelected: { borderColor: colors.primary, borderWidth: 2 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  cardName: { flex: 1, fontWeight: '700', color: colors.text },
  cardMeta: { color: colors.primary, fontWeight: '600', fontSize: 14 },
});
