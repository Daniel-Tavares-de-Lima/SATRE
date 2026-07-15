import { useState } from 'react';
import { Link, router } from 'expo-router';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthTextField } from '@/components/AuthForm';
import { PillButton } from '@/components/PillButton';
import { login } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/auth-errors';
import { useAuthStore } from '@/lib/auth-store';
import { colors, spacing } from '@/constants/theme';

export default function LoginScreen() {
  const setSession = useAuthStore((state) => state.setSession);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setError(null);

    if (!email.trim() || !password) {
      setError('Preencha e-mail e senha.');
      return;
    }

    setLoading(true);
    try {
      const session = await login(email.trim(), password);
      setSession(session);
      router.replace('/(tabs)');
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Bem Vindo,</Text>
        <Text style={styles.subtitle}>Cadastre e use e salve</Text>

        <AuthTextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          placeholder="lorem.ipsum@gmail.com"
        />

        <AuthTextField
          label="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="password"
          autoComplete="password"
          placeholder="Insira a senha"
        />

        <Pressable
          style={styles.forgotRow}
          onPress={() => Alert.alert('Em breve', 'Recuperação de senha estará disponível em breve.')}
          accessibilityRole="button"
          accessibilityLabel="Esqueceu sua senha?"
        >
          <Text style={styles.forgot}>Esqueceu sua senha?</Text>
        </Pressable>

        {error ? (
          <Text style={styles.error} accessibilityRole="alert" accessibilityLiveRegion="polite">
            {error}
          </Text>
        ) : null}

        <PillButton label="Entrar" loading={loading} onPress={handleLogin} />

        <Text style={styles.footer}>
          Não possui conta?{' '}
          <Link href="/(auth)/register" style={styles.link}>
            Se cadastre aqui
          </Link>
        </Text>

        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Entre com:</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialRow}>
          <SocialIcon
            icon="logo-google"
            label="Entrar com Google"
            onPress={() => Alert.alert('Em breve', 'Login com Google estará disponível em breve.')}
          />
          <SocialIcon
            icon="logo-facebook"
            label="Entrar com Facebook"
            onPress={() => Alert.alert('Em breve', 'Login com Facebook estará disponível em breve.')}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function SocialIcon({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={styles.socialButton}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint="Em breve"
    >
      <Ionicons name={icon} size={28} color={colors.primary} accessible={false} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  container: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textMuted,
    marginBottom: spacing.xl,
  },
  forgotRow: { alignSelf: 'flex-end', marginBottom: spacing.md },
  forgot: { fontSize: 13, color: colors.textMuted },
  error: {
    color: colors.high,
    marginBottom: spacing.md,
    fontSize: 14,
  },
  footer: {
    textAlign: 'center',
    marginTop: spacing.lg,
    color: colors.textMuted,
    fontSize: 15,
  },
  link: {
    color: colors.primary,
    fontWeight: '700',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { color: colors.textMuted, fontSize: 14 },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing.lg },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
});
