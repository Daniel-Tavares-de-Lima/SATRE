import { useState } from 'react';
import { Link, router } from 'expo-router';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AuthTextField } from '@/components/AuthForm';
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
        <Text style={styles.subtitle}>Acesse sua conta SATRE</Text>

        <AuthTextField
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          textContentType="emailAddress"
          autoComplete="email"
          placeholder="seu@email.com"
        />

        <AuthTextField
          label="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="password"
          autoComplete="password"
          placeholder="••••••••"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          style={[styles.primaryButton, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>Entrar</Text>
          )}
        </Pressable>

        <Text style={styles.footer}>
          Não tem conta?{' '}
          <Link href="/(auth)/register" style={styles.link}>
            Cadastre-se
          </Link>
        </Text>

        <View style={styles.socialSection}>
          <Text style={styles.socialTitle}>Ou continue com</Text>
          <Pressable style={styles.socialButton} disabled accessibilityState={{ disabled: true }}>
            <Text style={styles.socialButtonText}>Google — Em breve</Text>
          </Pressable>
          <Pressable style={styles.socialButton} disabled accessibilityState={{ disabled: true }}>
            <Text style={styles.socialButtonText}>Apple — Em breve</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  error: {
    color: colors.high,
    marginBottom: spacing.md,
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  buttonDisabled: { opacity: 0.7 },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
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
  socialSection: {
    marginTop: spacing.xl,
    gap: spacing.sm,
  },
  socialTitle: {
    textAlign: 'center',
    color: colors.textMuted,
    fontSize: 14,
    marginBottom: spacing.xs,
  },
  socialButton: {
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    opacity: 0.6,
  },
  socialButtonText: {
    color: colors.textMuted,
    fontWeight: '600',
  },
});
