import type { OccupancyLevel } from '@satre/shared-types';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@/constants/theme';

const LABELS: Record<OccupancyLevel, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
};

const BADGE_COLORS: Record<OccupancyLevel, string> = {
  low: colors.low,
  medium: colors.medium,
  high: colors.high,
};

interface OccupancyBadgeProps {
  level: OccupancyLevel;
}

export function OccupancyBadge({ level }: OccupancyBadgeProps) {
  return (
    <View
      style={[styles.badge, { backgroundColor: BADGE_COLORS[level] }]}
      accessibilityLabel={`Lotação ${LABELS[level]}`}
    >
      <Text style={styles.text}>{LABELS[level]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  text: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
