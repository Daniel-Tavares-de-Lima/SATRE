import { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import type { CreateReportBody, OccupancyLevel, WaitLevel } from '@satre/shared-types';
import { PillButton } from '@/components/PillButton';
import { ApiError, submitReport } from '@/lib/api';
import { getApiErrorMessage } from '@/lib/auth-errors';
import { getDeviceId } from '@/lib/device-id';
import { colors, radius, spacing } from '@/constants/theme';

interface ReportModalProps {
  visible: boolean;
  unitId: string;
  unitName: string;
  onClose: () => void;
  onSuccess?: () => void;
}

const OCCUPANCY_OPTIONS: { value: OccupancyLevel; label: string }[] = [
  { value: 'low', label: 'Baixa' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
];

const WAIT_OPTIONS: { value: WaitLevel; label: string }[] = [
  { value: 'low', label: 'Rápida' },
  { value: 'medium', label: 'Média' },
  { value: 'high', label: 'Alta' },
];

export function ReportModal({ visible, unitId, unitName, onClose, onSuccess }: ReportModalProps) {
  const [occupancy, setOccupancy] = useState<OccupancyLevel | null>(null);
  const [waitLevel, setWaitLevel] = useState<WaitLevel | null>(null);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  function reset() {
    setOccupancy(null);
    setWaitLevel(null);
    setNote('');
  }

  function handleClose() {
    reset();
    onClose();
  }

  async function handleSubmit() {
    if (!occupancy || !waitLevel) {
      Alert.alert('Report', 'Selecione lotação e tempo de espera.');
      return;
    }

    setLoading(true);
    try {
      const deviceId = await getDeviceId();
      const body: CreateReportBody = {
        occupancyLevel: occupancy,
        waitLevel,
        ...(note.trim() ? { note: note.trim().slice(0, 200) } : {}),
      };
      await submitReport(unitId, deviceId, body);
      Alert.alert('Obrigado!', 'Seu report foi registrado e ajuda outros pacientes.');
      reset();
      onSuccess?.();
      onClose();
    } catch (error) {
      if (error instanceof ApiError && error.status === 429) {
        Alert.alert('Aguarde', 'Você já reportou recentemente nesta unidade.');
        return;
      }
      Alert.alert('Report', getApiErrorMessage(error, 'Não foi possível enviar o report.'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <Text style={styles.title}>Reportar situação</Text>
          <Text style={styles.unitName}>{unitName}</Text>
          <Text style={styles.disclaimer}>Seu report é anônimo e ajuda outros pacientes.</Text>

          <ScrollView keyboardShouldPersistTaps="handled">
            <Text style={styles.sectionLabel}>Lotação</Text>
            <View style={styles.optionsRow}>
              {OCCUPANCY_OPTIONS.map((option) => (
                <Segment
                  key={option.value}
                  label={option.label}
                  selected={occupancy === option.value}
                  onPress={() => setOccupancy(option.value)}
                />
              ))}
            </View>

            <Text style={styles.sectionLabel}>Tempo de espera</Text>
            <View style={styles.optionsRow}>
              {WAIT_OPTIONS.map((option) => (
                <Segment
                  key={option.value}
                  label={option.label}
                  selected={waitLevel === option.value}
                  onPress={() => setWaitLevel(option.value)}
                />
              ))}
            </View>

            <Text style={styles.sectionLabel}>Observação (opcional)</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="Ex: Fila na recepção"
              placeholderTextColor={colors.textMuted}
              value={note}
              onChangeText={setNote}
              maxLength={200}
              multiline
            />
            <Text style={styles.privacy}>Não inclua informações médicas ou pessoais.</Text>
          </ScrollView>

          <PillButton label="Enviar report" loading={loading} onPress={handleSubmit} />
          <PillButton label="Cancelar" variant="ghost" onPress={handleClose} fullWidth={false} style={styles.cancel} />
        </View>
      </View>
    </Modal>
  );
}

function Segment({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[styles.segment, selected && styles.segmentSelected]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected }}
    >
      <Text style={[styles.segmentText, selected && styles.segmentTextSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.header,
    borderTopRightRadius: radius.header,
    padding: spacing.lg,
    maxHeight: '88%',
  },
  title: { fontSize: 20, fontWeight: '700', color: colors.text },
  unitName: { fontSize: 14, color: colors.primary, fontWeight: '600', marginTop: 4 },
  disclaimer: { fontSize: 13, color: colors.textMuted, marginVertical: spacing.sm, lineHeight: 18 },
  sectionLabel: { fontSize: 14, fontWeight: '700', color: colors.text, marginTop: spacing.sm, marginBottom: spacing.xs },
  optionsRow: { flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.sm },
  segment: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
  },
  segmentSelected: { backgroundColor: colors.primary, borderColor: colors.primary },
  segmentText: { fontWeight: '600', color: colors.text, fontSize: 13 },
  segmentTextSelected: { color: colors.textOnPrimary },
  noteInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    minHeight: 72,
    textAlignVertical: 'top',
    color: colors.text,
  },
  privacy: { fontSize: 12, color: colors.textMuted, marginTop: spacing.xs, marginBottom: spacing.md },
  cancel: { alignSelf: 'center', marginTop: spacing.sm },
});
