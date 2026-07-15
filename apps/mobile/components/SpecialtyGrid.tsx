import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';

const SPECIALTY_META: Record<string, { icon: keyof typeof Ionicons.glyphMap; label: string }> = {
  'Clínica Médica': { icon: 'medical-outline', label: 'Clínica Médica' },
  Pediatria: { icon: 'people-outline', label: 'Pediatria' },
  Traumatologia: { icon: 'walk-outline', label: 'Traumato Ortopedia' },
  Ortopedia: { icon: 'walk-outline', label: 'Traumato Ortopedia' },
};

interface SpecialtyGridProps {
  specialties: string[];
}

export function SpecialtyGrid({ specialties }: SpecialtyGridProps) {
  const seen = new Set<string>();
  const items = specialties
    .map((name) => SPECIALTY_META[name] ?? { icon: 'medkit-outline' as const, label: name })
    .filter((item) => {
      if (seen.has(item.label)) return false;
      seen.add(item.label);
      return true;
    });

  if (!items.length) return null;

  return (
    <View style={styles.section}>
      <Text style={styles.title}>Tipos de Atendimentos</Text>
      <View style={styles.grid}>
        {items.map((item) => (
          <View
            key={item.label}
            style={styles.card}
            accessible
            accessibilityRole="text"
            accessibilityLabel={`Especialidade ${item.label}`}
          >
            <Ionicons name={item.icon} size={32} color={colors.primary} accessible={false} />
            <Text style={styles.label} numberOfLines={2} accessible={false}>
              {item.label}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: spacing.lg },
  title: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm },
  card: {
    width: '30%',
    minWidth: 96,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
    alignItems: 'center',
    gap: spacing.xs,
  },
  label: { fontSize: 12, fontWeight: '600', color: colors.text, textAlign: 'center' },
});
