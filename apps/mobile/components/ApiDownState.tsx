import { Pressable, StyleSheet, Text, View } from 'react-native';
import { API_BASE_URL } from '@/lib/api';
import { colors, radius, spacing } from '@/constants/theme';

interface ApiDownStateProps {
  onRetry: () => void;
  title?: string;
  hint?: string;
}

/** Full/partial error state when the API is unreachable and no cache exists. */
export function ApiDownState({
  onRetry,
  title = 'Não foi possível carregar',
  hint = 'Confira se a API está rodando (npm run dev:api)',
}: ApiDownStateProps) {
  return (
    <View style={styles.box} accessibilityRole="alert">
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.text}>API: {API_BASE_URL}</Text>
      <Text style={styles.text}>{hint}</Text>
      <Pressable
        style={styles.retryButton}
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel="Tentar novamente"
      >
        <Text style={styles.retryButtonText}>Tentar novamente</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#FEF2F2',
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  title: { fontWeight: '700', color: '#B91C1C', marginBottom: spacing.xs },
  text: { color: '#7F1D1D', fontSize: 13 },
  retryButton: {
    marginTop: spacing.sm,
    alignSelf: 'flex-start',
    backgroundColor: colors.primary,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  retryButtonText: { color: colors.textOnPrimary, fontWeight: '600' },
});
