import { router } from 'expo-router';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import type { UnitSummary } from '@satre/shared-types';
import { OccupancyBadge } from '@/components/OccupancyBadge';
import { openDirections } from '@/lib/maps';
import { PillButton } from '@/components/PillButton';
import { colors, radius, spacing } from '@/constants/theme';

interface UnitMapSheetProps {
  unit: UnitSummary;
  isFavorite: boolean;
  isAuthenticated: boolean;
  isSaving: boolean;
  onClose: () => void;
  onToggleFavorite: () => void;
}

export function UnitMapSheet({
  unit,
  isFavorite,
  isAuthenticated,
  isSaving,
  onClose,
  onToggleFavorite,
}: UnitMapSheetProps) {
  function handleSave() {
    if (!isAuthenticated) {
      Alert.alert(
        'Entre na sua conta',
        'Faça login para salvar unidades favoritas.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Entrar', onPress: () => router.push('/(auth)/login') },
        ],
      );
      return;
    }

    onToggleFavorite();
  }

  return (
    <View style={styles.sheet}>
      <View style={styles.handleRow}>
        <View style={styles.handle} />
        <Pressable onPress={onClose} accessibilityLabel="Fechar detalhes da unidade">
          <Text style={styles.close}>✕</Text>
        </Pressable>
      </View>

      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={2}>
          {unit.name}
        </Text>
        <OccupancyBadge level={unit.occupancyLevel} />
      </View>

      <Text style={styles.meta}>
        {unit.estimatedWaitMinutes} min de espera · {unit.doctorCount} médicos
      </Text>

      <Text style={styles.address} numberOfLines={2}>
        {unit.address}
      </Text>

      <View style={styles.actions}>
        <View style={styles.actionFlex}>
          <PillButton
            label="Rotas"
            onPress={() =>
              openDirections({
                lat: unit.lat,
                lng: unit.lng,
                address: unit.address,
                name: unit.name,
              })
            }
          />
        </View>
        <View style={styles.actionFlex}>
          <PillButton
            label={isSaving ? '…' : isFavorite ? 'Salvo' : 'Salvar'}
            variant={isFavorite ? 'primary' : 'secondary'}
            disabled={isSaving}
            onPress={handleSave}
          />
        </View>
        <Pressable
          style={styles.linkAction}
          onPress={() => router.push(`/unidade/${unit.id}`)}
          accessibilityLabel="Ver detalhes da unidade"
        >
          <Text style={styles.linkActionText}>Detalhes</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheet: {
    position: 'absolute',
    left: spacing.md,
    right: spacing.md,
    bottom: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  handleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  close: {
    position: 'absolute',
    right: 0,
    top: -4,
    fontSize: 18,
    color: colors.textMuted,
    padding: spacing.xs,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  name: {
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
  },
  meta: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  address: {
    fontSize: 13,
    color: colors.textMuted,
    marginBottom: spacing.md,
    lineHeight: 18,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  actionFlex: { flex: 1 },
  linkAction: {
    paddingHorizontal: spacing.sm,
    justifyContent: 'center',
  },
  linkActionText: {
    color: colors.textMuted,
    fontWeight: '600',
  },
});
