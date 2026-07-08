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
import { AuthTextField, ConsentCheckbox } from '@/components/AuthForm';
import { register } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/auth-errors';
import { useAuthStore } from '@/lib/auth-store';
import { colors, spacing } from '@/constants/theme';

export default function RegisterScreen() {
  const setSession = useAuthStore((state) => state.setSession);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validateForm(): string | null {
    if (name.trim().length < 2) return 'Informe seu nome completo.';
    if (!email.trim().includes('@')) return 'Informe um e-mail válido.';
    if (password.length < 8) return 'A senha deve ter no mínimo 8 caracteres.';
    if (password !== confirmPassword) return 'As senhas não coincidem.';
    if (!acceptTerms || !acceptPrivacy) {
      return 'Aceite os Termos de Uso e a Política de Privacidade.';
    }
    return null;
  }

  async function handleRegister() {
    setError(null);
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const session = await register({
        name: name.trim(),
        email: email.trim(),
        password,
        acceptTerms: true,
        acceptPrivacy: true,
      });
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
        <Text style={styles.subtitle}>
          Cadastro mínimo: apenas nome, e-mail e senha (LGPD).
        </Text>

        <AuthTextField
          label="Nome"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          textContentType="name"
          autoComplete="name"
          placeholder="Seu nome"
        />

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
          textContentType="newPassword"
          autoComplete="password-new"
          placeholder="Mínimo 8 caracteres"
        />

        <AuthTextField
          label="Confirmar senha"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          textContentType="newPassword"
          autoComplete="password-new"
          placeholder="Repita a senha"
        />

        <ConsentCheckbox
          label="Li e aceito os Termos de Uso"
          checked={acceptTerms}
          onToggle={() => setAcceptTerms((value) => !value)}
        />

        <ConsentCheckbox
          label="Li e aceito a Política de Privacidade"
          checked={acceptPrivacy}
          onToggle={() => setAcceptPrivacy((value) => !value)}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          style={[styles.primaryButton, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.primaryButtonText}>Criar conta</Text>
          )}
        </Pressable>

        <Text style={styles.footer}>
          Já tem conta?{' '}
          <Link href="/(auth)/login" style={styles.link}>
            Entrar
          </Link>
        </Text>
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
    fontSize: 14,
    color: colors.textMuted,
    marginBottom: spacing.lg,
    lineHeight: 20,
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
});
