import { StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';

interface StaleDataBannerProps {
  visible: boolean;
}

/** Shown when list screens fall back to cached units after a network failure. */
export function StaleDataBanner({ visible }: StaleDataBannerProps) {
  if (!visible) return null;

  return (
    <View
      style={styles.banner}
      accessibilityRole="alert"
      accessibilityLiveRegion="polite"
    >
      <Text style={styles.text}>Dados podem estar desatualizados</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: '#FFF7ED',
    borderWidth: 1,
    borderColor: '#FDBA74',
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  text: {
    color: '#9A3412',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});
