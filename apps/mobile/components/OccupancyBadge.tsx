import { Ionicons } from '@expo/vector-icons';
import type { OccupancyLevel } from '@satre/shared-types';
import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/constants/theme';

const LABELS: Record<OccupancyLevel, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
};

const ICONS: Record<OccupancyLevel, keyof typeof Ionicons.glyphMap> = {
  low: 'checkmark-circle',
  medium: 'alert-circle',
  high: 'warning',
};

const BADGE_COLORS: Record<OccupancyLevel, string> = {
  low: colors.low,
  medium: colors.medium,
  high: colors.high,
};

interface OccupancyBadgeProps {
  level: OccupancyLevel;
}

/** Lotação with icon + text so meaning is not conveyed by color alone. */
export function OccupancyBadge({ level }: OccupancyBadgeProps) {
  const label = LABELS[level];

  return (
    <View
      style={[styles.badge, { backgroundColor: BADGE_COLORS[level] }]}
      accessibilityRole="text"
      accessibilityLabel={`Lotação ${label}`}
    >
      <Ionicons name={ICONS[level]} size={14} color="#fff" accessible={false} />
      <Text style={styles.text}>{label}</Text>
    </View>
  );
}

/** Spoken occupancy label for map pins and cards. */
export function occupancyLevelLabel(level: OccupancyLevel): string {
  return LABELS[level];
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
