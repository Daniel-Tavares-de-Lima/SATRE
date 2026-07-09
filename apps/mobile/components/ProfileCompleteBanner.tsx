import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { PillButton } from '@/components/PillButton';
import { colors, radius, spacing } from '@/constants/theme';

interface ProfileCompleteBannerProps {
  visible: boolean;
}

export function ProfileCompleteBanner({ visible }: ProfileCompleteBannerProps) {
  if (!visible) return null;

  return (
    <View style={styles.banner}>
      <Text style={styles.title}>Atualize seus dados</Text>
      <Text style={styles.body}>
        Complete seu cadastro para receber recomendações mais precisas perto de você.
      </Text>
      <PillButton
        label="Completar Cadastro"
        onPress={() => router.push('/(auth)/login')}
        style={styles.button}
      />
      <Pressable onPress={() => router.push('/(tabs)/perfil')}>
        <Text style={styles.link}>Ir para perfil</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  title: { fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: spacing.xs },
  body: { fontSize: 13, color: colors.textMuted, lineHeight: 18, marginBottom: spacing.md },
  button: { marginBottom: spacing.sm },
  link: { textAlign: 'center', color: colors.primary, fontWeight: '600', fontSize: 14 },
});
