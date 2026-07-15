import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import type { UnitDetail } from '@satre/shared-types';
import { colors, spacing } from '@/constants/theme';

interface AccessibilityRowProps {
  accessibility: UnitDetail['accessibility'];
}

const ITEMS = [
  { key: 'physical' as const, label: 'Deficiente Físico', icon: 'accessibility' as const },
  { key: 'visual' as const, label: 'Deficiente Visual', icon: 'eye-off-outline' as const },
  { key: 'hearing' as const, label: 'Deficiente Auditiva', icon: 'ear-outline' as const },
  { key: 'neuro' as const, label: 'Neuroatípicas', icon: 'infinite-outline' as const },
];

export function AccessibilityRow({ accessibility }: AccessibilityRowProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.title}>Estrutura acessível para</Text>
      <View style={styles.row}>
        {ITEMS.map((item) => {
          const active = accessibility[item.key];
          return (
            <View
              key={item.key}
              style={styles.item}
              accessible
              accessibilityRole="text"
              accessibilityLabel={`${item.label}: ${active ? 'disponível' : 'indisponível'}`}
            >
              <Ionicons
                name={item.icon}
                size={28}
                color={active ? colors.primary : colors.border}
                accessible={false}
              />
              <Text
                style={[styles.label, !active && styles.labelInactive]}
                numberOfLines={2}
                accessible={false}
              >
                {item.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { marginBottom: spacing.lg },
  title: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  item: { width: '22%', alignItems: 'center', gap: spacing.xs },
  label: { fontSize: 11, textAlign: 'center', color: colors.text, fontWeight: '500' },
  labelInactive: { color: colors.textMuted },
});
