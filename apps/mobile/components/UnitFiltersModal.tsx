import { useEffect, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import Slider from '@react-native-community/slider';
import type { UnitType } from '@satre/shared-types';
import {
  DEFAULT_UNIT_FILTERS,
  type UnitListFilters,
} from '@/lib/unit-filters';
import { colors, spacing } from '@/constants/theme';

interface UnitFiltersModalProps {
  visible: boolean;
  filters: UnitListFilters;
  onClose: () => void;
  onApply: (filters: UnitListFilters) => void;
}

const MIN_WAIT = 5;
const MAX_WAIT = 180;

export function UnitFiltersModal({
  visible,
  filters,
  onClose,
  onApply,
}: UnitFiltersModalProps) {
  const [draft, setDraft] = useState<UnitListFilters>(filters);

  useEffect(() => {
    if (visible) {
      setDraft(filters);
    }
  }, [visible, filters]);

  function setType(type: UnitType | undefined) {
    setDraft((current) => ({ ...current, type }));
  }

  function handleApply() {
    onApply(draft);
    onClose();
  }

  function handleClear() {
    setDraft(DEFAULT_UNIT_FILTERS);
    onApply(DEFAULT_UNIT_FILTERS);
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.handle} />

          <Text style={styles.title}>Filtros</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.label}>Tipo de unidade</Text>
            <View style={styles.segmentRow}>
              {(
                [
                  { key: undefined, label: 'Todas' },
                  { key: 'upa' as const, label: 'UPA' },
                  { key: 'private' as const, label: 'Privada' },
                ] as const
              ).map((option) => {
                const selected = draft.type === option.key;
                return (
                  <Pressable
                    key={option.label}
                    style={[styles.segment, selected && styles.segmentActive]}
                    onPress={() => setType(option.key)}
                    accessibilityRole="button"
                    accessibilityLabel={`Tipo de unidade: ${option.label}`}
                    accessibilityState={{ selected }}
                  >
                    <Text style={[styles.segmentText, selected && styles.segmentTextActive]}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.switchRow}>
              <View style={styles.switchCopy}>
                <Text style={styles.label}>Somente acessíveis</Text>
                <Text style={styles.hint}>Unidades com recursos de acessibilidade</Text>
              </View>
              <Switch
                value={draft.accessibleOnly}
                onValueChange={(accessibleOnly) =>
                  setDraft((current) => ({ ...current, accessibleOnly }))
                }
                trackColor={{ false: colors.border, true: colors.primary }}
                accessibilityLabel="Somente unidades acessíveis"
              />
            </View>

            <Text style={styles.label}>Tempo máximo de espera</Text>
            <Text style={styles.sliderValue}>
              {draft.maxWait === null ? 'Sem limite' : `Até ${draft.maxWait} min`}
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={MIN_WAIT}
              maximumValue={MAX_WAIT}
              step={5}
              value={draft.maxWait ?? MAX_WAIT}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.border}
              thumbTintColor={colors.primary}
              accessibilityLabel="Tempo máximo de espera"
              accessibilityValue={{
                text:
                  draft.maxWait === null
                    ? 'Sem limite'
                    : `Até ${draft.maxWait} minutos`,
              }}
              onValueChange={(value) =>
                setDraft((current) => ({
                  ...current,
                  maxWait: value >= MAX_WAIT ? null : Math.round(value),
                }))
              }
            />
            <View style={styles.sliderLabels}>
              <Text style={styles.sliderHint}>{MIN_WAIT} min</Text>
              <Text style={styles.sliderHint}>Sem limite</Text>
            </View>
          </ScrollView>

          <View style={styles.actions}>
            <Pressable
              style={styles.clearButton}
              onPress={handleClear}
              accessibilityRole="button"
              accessibilityLabel="Limpar filtros"
            >
              <Text style={styles.clearButtonText}>Limpar</Text>
            </Pressable>
            <Pressable
              style={styles.applyButton}
              onPress={handleApply}
              accessibilityRole="button"
              accessibilityLabel="Aplicar filtros"
            >
              <Text style={styles.applyButtonText}>Aplicar</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
    maxHeight: '85%',
  },
  handle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  hint: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 2,
  },
  segmentRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  segment: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  segmentActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  segmentText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  segmentTextActive: {
    color: '#fff',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
    gap: spacing.md,
  },
  switchCopy: {
    flex: 1,
  },
  sliderValue: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: spacing.xs,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  sliderHint: {
    fontSize: 12,
    color: colors.textMuted,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  clearButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  clearButtonText: {
    color: colors.text,
    fontWeight: '600',
  },
  applyButton: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
});
