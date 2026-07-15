import type { UnitSummary } from '@satre/shared-types';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { OccupancyBadge } from '@/components/OccupancyBadge';
import { colors, spacing } from '@/constants/theme';

interface UnitCardProps {
  unit: UnitSummary;
  onPress: () => void;
}

export function UnitCard({ unit, onPress }: UnitCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${unit.name}, ${unit.estimatedWaitMinutes} minutos de espera`}
      accessibilityHint="Abre o detalhe da unidade"
    >
      <View style={styles.header}>
        <Text style={styles.name}>{unit.name}</Text>
        <OccupancyBadge level={unit.occupancyLevel} />
      </View>
      <Text style={styles.address} numberOfLines={2}>
        {unit.address}
      </Text>
      <View style={styles.meta}>
        <Text style={styles.metaText}>{unit.estimatedWaitMinutes} min</Text>
        <Text style={styles.metaDot}>·</Text>
        <Text style={styles.metaText}>{unit.doctorCount} médicos</Text>
        <Text style={styles.metaDot}>·</Text>
        <Text style={styles.metaText}>{unit.type === 'upa' ? 'UPA' : 'Privada'}</Text>
        {unit.distanceMeters !== undefined && (
          <>
            <Text style={styles.metaDot}>·</Text>
            <Text style={styles.metaText}>
              {(unit.distanceMeters / 1000).toFixed(1)} km
            </Text>
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.85 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  name: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  address: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: '600',
  },
  metaDot: {
    color: colors.textMuted,
  },
});
