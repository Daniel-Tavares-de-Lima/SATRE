import type { ReactNode } from 'react';
import { router } from 'expo-router';
import { Alert, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';
import { PillButton } from '@/components/PillButton';
import { ScreenHeader } from '@/components/ScreenHeader';
import { deleteAccount, logout } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/auth-errors';
import { useAuthStore } from '@/lib/auth-store';
import { useSettingsStore, type FontScale } from '@/lib/settings-store';
import { colors, spacing } from '@/constants/theme';

export default function ConfiguracoesScreen() {
  const user = useAuthStore((state) => state.user);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const clearSession = useAuthStore((state) => state.clearSession);

  const fontScale = useSettingsStore((s) => s.fontScale);
  const accessibleOnly = useSettingsStore((s) => s.accessibleEmergenciesOnly);
  const neutralColors = useSettingsStore((s) => s.neutralColors);
  const setFontScale = useSettingsStore((s) => s.setFontScale);
  const setAccessibleOnly = useSettingsStore((s) => s.setAccessibleEmergenciesOnly);
  const setNeutralColors = useSettingsStore((s) => s.setNeutralColors);

  async function handleLogout() {
    try {
      if (refreshToken) await logout(refreshToken);
    } catch {
      // Clear local session even if API logout fails
    }
    clearSession();
    router.replace('/(tabs)');
  }

  function handleDeleteAccount() {
    Alert.alert(
      'Excluir conta',
      'Esta ação é permanente. Deseja continuar?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAccount();
              clearSession();
              router.replace('/(tabs)');
            } catch (error) {
              Alert.alert('Erro', getApiErrorMessage(error, 'Não foi possível excluir a conta.'));
            }
          },
        },
      ],
    );
  }

  function cycleFontScale() {
    const next: FontScale = fontScale === 'normal' ? 'large' : 'normal';
    setFontScale(next);
  }

  return (
    <View style={styles.root}>
      <ScreenHeader title="Configurações" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>Acessibilidade</Text>

        <SettingsRow
          title="Tamanho das fontes e ícones"
          subtitle="Adapte a fonte e os tamanhos dos ícones."
          action={
            <Pressable style={styles.chipButton} onPress={cycleFontScale}>
              <Text style={styles.chipButtonText}>{fontScale === 'normal' ? 'Normal' : 'Grande'}</Text>
            </Pressable>
          }
        />

        <SettingsRow
          title="Acessível"
          subtitle="Mostrar apenas emergências/urgências acessíveis."
          action={
            <Switch
              value={accessibleOnly}
              onValueChange={setAccessibleOnly}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          }
        />

        <SettingsRow
          title="Cores"
          subtitle="Deixar o aplicativo com cores neutras."
          action={
            <Switch
              value={neutralColors}
              onValueChange={setNeutralColors}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          }
        />

        <Text style={styles.sectionTitle}>SATRE</Text>

        <LinkRow label="Sobre" onPress={() => Alert.alert('Sobre', 'SATRE — informação de saúde em tempo real para Recife.')} />
        <LinkRow label="Termos de Uso" onPress={() => Alert.alert('Termos de Uso', 'Documento em preparação para lançamento.')} />
        <LinkRow
          label="Fórum"
          onPress={() => Alert.alert('Em breve', 'O fórum de usuários estará disponível em uma atualização futura.')}
        />

        {user ? (
          <View style={styles.actions}>
            <PillButton label="Sair da Conta" onPress={handleLogout} />
            <PillButton label="Excluir Conta" variant="secondary" onPress={handleDeleteAccount} style={styles.deleteBtn} />
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

function SettingsRow({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action: ReactNode;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowText}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>
      {action}
    </View>
  );
}

function LinkRow({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable style={styles.linkRow} onPress={onPress}>
      <Text style={styles.linkLabel}>{label}</Text>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.sm,
    marginTop: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  rowText: { flex: 1 },
  rowTitle: { fontSize: 15, fontWeight: '600', color: colors.primary },
  rowSubtitle: { fontSize: 13, color: colors.textMuted, marginTop: 2, lineHeight: 18 },
  chipButton: {
    borderWidth: 1,
    borderColor: colors.text,
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  chipButtonText: { fontWeight: '600', color: colors.text },
  linkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  linkLabel: { fontSize: 15, fontWeight: '600', color: colors.primary },
  chevron: { fontSize: 22, color: colors.primary },
  actions: { marginTop: spacing.xl, gap: spacing.sm },
  deleteBtn: { marginTop: spacing.xs },
});
