import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { logout } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/auth-errors';
import { useAuthStore } from '@/lib/auth-store';
import { colors, spacing } from '@/constants/theme';

export default function PerfilScreen() {
  const user = useAuthStore((state) => state.user);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const clearSession = useAuthStore((state) => state.clearSession);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogout() {
    if (!refreshToken) {
      clearSession();
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await logout(refreshToken);
      clearSession();
    } catch (err) {
      setError(getApiErrorMessage(err, 'Não foi possível sair. Tente novamente.'));
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Perfil</Text>
        <Text style={styles.subtitle}>
          Entre ou crie uma conta para salvar favoritos e sincronizar seu perfil.
        </Text>

        <Pressable style={styles.primaryButton} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.primaryButtonText}>Entrar</Text>
        </Pressable>

        <Pressable style={styles.secondaryButton} onPress={() => router.push('/(auth)/register')}>
          <Text style={styles.secondaryButtonText}>Criar conta</Text>
        </Pressable>

        <Text style={styles.guestHint}>Você pode explorar unidades sem login.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.value}>{user.name}</Text>

        <Text style={[styles.label, styles.labelSpacing]}>E-mail</Text>
        <Text style={styles.value}>{user.email}</Text>
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        style={[styles.secondaryButton, loading && styles.buttonDisabled]}
        onPress={handleLogout}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={colors.primary} />
        ) : (
          <Text style={styles.secondaryButtonText}>Sair</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textMuted,
    marginBottom: spacing.lg,
    lineHeight: 22,
  },
  guestHint: {
    marginTop: spacing.lg,
    fontSize: 13,
    color: colors.textMuted,
    textAlign: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '600',
  },
  labelSpacing: { marginTop: spacing.md },
  value: {
    fontSize: 16,
    color: colors.text,
    marginTop: spacing.xs,
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
    marginBottom: spacing.sm,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  buttonDisabled: { opacity: 0.7 },
});
