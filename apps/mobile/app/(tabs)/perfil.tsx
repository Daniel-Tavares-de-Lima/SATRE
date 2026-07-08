import { StyleSheet, Text, View } from 'react-native';
import { colors, spacing } from '@/constants/theme';

/** Placeholder until Task 12+ auth screens and profile editing. */
export default function PerfilScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>
      <Text style={styles.subtitle}>Login e cadastro chegam na próxima etapa.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontSize: 22, fontWeight: '700', color: colors.text, marginBottom: spacing.sm },
  subtitle: { fontSize: 15, color: colors.textMuted, textAlign: 'center' },
});
