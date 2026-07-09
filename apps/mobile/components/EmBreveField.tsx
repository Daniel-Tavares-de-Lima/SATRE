import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/constants/theme';

interface EmBreveFieldProps {
  label: string;
  placeholder?: string;
}

/** Disabled profile field with "Em breve" badge (Option A — LGPD Fase 2). */
export function EmBreveField({ label, placeholder = '—' }: EmBreveFieldProps) {
  return (
    <View style={styles.field} accessibilityState={{ disabled: true }}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>{label}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Em breve</Text>
        </View>
      </View>
      <Text style={styles.placeholder}>{placeholder}</Text>
      <View style={styles.underline} />
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: spacing.md, opacity: 0.72 },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  label: { fontSize: 14, fontWeight: '600', color: colors.textMuted },
  badge: {
    backgroundColor: colors.border,
    borderRadius: 999,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  badgeText: { fontSize: 11, fontWeight: '600', color: colors.textMuted },
  placeholder: { fontSize: 16, color: colors.textMuted, paddingVertical: spacing.xs },
  underline: { height: 1, backgroundColor: colors.border },
});
