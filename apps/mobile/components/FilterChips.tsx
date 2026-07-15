import { ScrollView, Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';

export type FilterKey = 'doctors' | 'patients' | 'wait';

interface FilterChipsProps {
  active: FilterKey | null;
  onChange: (key: FilterKey | null) => void;
}

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'doctors', label: 'Qtd Médicos' },
  { key: 'patients', label: 'Qtd Pacientes' },
  { key: 'wait', label: 'Tempo de Espera' },
];

export function FilterChips({ active, onChange }: FilterChipsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.row}
      contentContainerStyle={styles.rowContent}
    >
      {FILTERS.map((filter) => {
        const selected = active === filter.key;
        return (
          <Pressable
            key={filter.key}
            style={[styles.chip, selected && styles.chipActive]}
            onPress={() => onChange(selected ? null : filter.key)}
            accessibilityRole="button"
            accessibilityLabel={`Ordenar por ${filter.label}`}
            accessibilityHint={selected ? 'Selecionado. Toque para remover o filtro' : 'Toque para aplicar o filtro'}
            accessibilityState={{ selected }}
          >
            <Text style={[styles.chipText, selected && styles.chipTextActive]}>
              {filter.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    marginBottom: spacing.md,
    flexGrow: 0,
  },
  rowContent: {
    paddingRight: spacing.sm,
  },
  chip: {
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginRight: spacing.sm,
    backgroundColor: colors.surface,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 13,
    color: colors.text,
    fontWeight: '500',
  },
  chipTextActive: {
    color: '#fff',
  },
});
