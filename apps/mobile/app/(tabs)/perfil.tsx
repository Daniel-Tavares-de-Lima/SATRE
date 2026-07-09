import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EmBreveField } from '@/components/EmBreveField';
import { PillButton } from '@/components/PillButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { logout, updateProfile } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/auth-errors';
import { useAuthStore } from '@/lib/auth-store';
import { colors, radius, spacing } from '@/constants/theme';

export default function PerfilScreen() {
  const user = useAuthStore((state) => state.user);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const [name, setName] = useState(user?.name ?? '');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
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
      setError(getApiErrorMessage(err, 'Não foi possível sair.'));
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveName() {
    if (!user || name.trim().length < 2) {
      Alert.alert('Nome', 'Informe um nome válido.');
      return;
    }

    setSaving(true);
    try {
      const updated = await updateProfile(name.trim());
      setSession({
        accessToken: useAuthStore.getState().accessToken!,
        refreshToken: useAuthStore.getState().refreshToken!,
        user: updated,
      });
      Alert.alert('Perfil', 'Nome atualizado.');
    } catch (err) {
      Alert.alert('Perfil', getApiErrorMessage(err, 'Não foi possível salvar.'));
    } finally {
      setSaving(false);
    }
  }

  if (!user) {
    return (
      <View style={styles.root}>
        <ScreenHeader title="Perfil" />
        <View style={styles.body}>
          <Text style={styles.subtitle}>
            Entre ou crie uma conta para salvar favoritos e sincronizar seu perfil.
          </Text>
          <PillButton label="Entrar" onPress={() => router.push('/(auth)/login')} />
          <PillButton
            label="Criar conta"
            variant="secondary"
            style={styles.buttonSpacing}
            onPress={() => router.push('/(auth)/register')}
          />
          <Text style={styles.guestHint}>Você pode explorar unidades sem login.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScreenHeader
        title="Perfil"
        rightAction={
          <Pressable
            style={styles.settingsButton}
            onPress={() => router.push('/configuracoes')}
            accessibilityLabel="Configurações"
          >
            <Ionicons name="settings-outline" size={22} color={colors.textOnPrimary} />
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={styles.body}>
        <View style={styles.avatarBlock}>
          <View style={styles.avatar}>
            <Ionicons name="person-outline" size={40} color={colors.text} />
          </View>
          <Pressable
            style={styles.editAvatar}
            onPress={() => Alert.alert('Em breve', 'Alteração de foto estará disponível em breve.')}
          >
            <Ionicons name="pencil" size={14} color={colors.textOnPrimary} />
          </Pressable>
        </View>

        <View style={styles.nameRow}>
          <Text style={styles.displayName}>{user.name}</Text>
          <Pressable onPress={handleSaveName} disabled={saving}>
            <Ionicons name="pencil" size={18} color={colors.textMuted} />
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Dados Pessoais</Text>
          <Pressable onPress={handleSaveName} disabled={saving}>
            <Text style={styles.editLink}>{saving ? 'Salvando…' : 'editar'}</Text>
          </Pressable>
        </View>

        <Text style={styles.fieldLabel}>Nome Completo</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Seu nome"
          placeholderTextColor={colors.textMuted}
        />
        <View style={styles.underline} />

        <EmBreveField label="Cartão Nacional de Saúde" />
        <EmBreveField label="Data de Nascimento" />

        <View style={styles.genderRow}>
          <EmBreveField label="Gênero" placeholder="F / M / NDA" />
        </View>

        <EmBreveField label="Endereço" />
        <EmBreveField label="Histórico de Doenças" />

        <Text style={styles.fieldLabel}>E-mail</Text>
        <Text style={styles.readOnly}>{user.email}</Text>
        <View style={styles.underline} />

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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  body: { padding: spacing.lg, paddingBottom: spacing.xl },
  buttonSpacing: { marginTop: spacing.sm },
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
  settingsButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBlock: { alignSelf: 'center', marginBottom: spacing.md, marginTop: spacing.sm },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editAvatar: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: colors.primary,
    borderRadius: 999,
    padding: 6,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginBottom: spacing.lg,
  },
  displayName: { fontSize: 20, fontWeight: '700', color: colors.text },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text },
  editLink: { color: colors.textMuted, fontSize: 13 },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: colors.text, marginBottom: spacing.xs },
  input: { fontSize: 16, color: colors.text, paddingVertical: spacing.sm },
  readOnly: { fontSize: 16, color: colors.textMuted, paddingVertical: spacing.sm },
  underline: { height: 1, backgroundColor: colors.border, marginBottom: spacing.md },
  genderRow: { marginTop: -spacing.sm },
  error: { color: colors.high, marginVertical: spacing.sm },
  secondaryButton: {
    marginTop: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: radius.pill,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: { color: colors.primary, fontWeight: '700' },
  buttonDisabled: { opacity: 0.7 },
});
