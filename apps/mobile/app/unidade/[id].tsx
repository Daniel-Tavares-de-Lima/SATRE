import { useLocalSearchParams } from 'expo-router';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AccessibilityRow } from '@/components/AccessibilityRow';
import { PillButton } from '@/components/PillButton';
import { ReportModal } from '@/components/ReportModal';
import { SpecialtyGrid } from '@/components/SpecialtyGrid';
import { UnitMiniMap } from '@/components/UnitMiniMap';
import { fetchUnitById } from '@/lib/api';
import { openDirections } from '@/lib/maps';
import { unitThumbnailStyle } from '@/lib/unit-images';
import { useFavorites } from '@/hooks/useFavorites';
import { colors, radius, spacing } from '@/constants/theme';

export default function UnidadeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();
  const [reportOpen, setReportOpen] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['unit', id],
    queryFn: () => fetchUnitById(id!),
    enabled: Boolean(id),
  });
  const { isFavorite, toggleFavorite, isSaving } = useFavorites();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Unidade não encontrada</Text>
      </View>
    );
  }

  const unit = data;
  const thumb = unitThumbnailStyle(unit.type);

  function handleDirections() {
    openDirections({
      lat: unit.lat,
      lng: unit.lng,
      address: unit.address,
      name: unit.name,
    });
  }

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={[styles.hero, { backgroundColor: thumb.backgroundColor }]}>
          <Ionicons name={thumb.iconName} size={64} color={thumb.iconColor} />
          <Pressable
            style={styles.heroHeart}
            accessibilityLabel={isFavorite(unit.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
            disabled={isSaving}
            onPress={() => toggleFavorite(unit)}
          >
            <Ionicons
              name={isFavorite(unit.id) ? 'heart' : 'heart-outline'}
              size={22}
              color={colors.surface}
            />
          </Pressable>
        </View>

        <Text style={styles.name}>{unit.name}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statBlock}>
            <Text style={styles.statLabel}>Tempo médio de atendimento</Text>
            <View style={styles.statValueRow}>
              <Ionicons name="headset-outline" size={22} color={colors.high} />
              <Text style={styles.statValue}>{unit.estimatedWaitMinutes}</Text>
              <Text style={styles.statUnit}>min</Text>
            </View>
          </View>
          <View style={styles.statBlock}>
            <Text style={styles.statLabel}>Médicos no local</Text>
            <View style={styles.statValueRow}>
              <Ionicons name="medkit-outline" size={22} color={colors.high} />
              <Text style={styles.statValue}>{unit.doctorCount}</Text>
              <Text style={styles.statUnit}>médicos</Text>
            </View>
          </View>
        </View>

        <AccessibilityRow accessibility={unit.accessibility} />

        <Pressable
          onPress={handleDirections}
          accessibilityRole="link"
          accessibilityLabel={`Abrir rotas para ${unit.address}`}
        >
          <View style={styles.addressRow}>
            <Ionicons name="location" size={18} color={colors.high} />
            <Text style={styles.addressLink}>{unit.address}</Text>
          </View>
        </Pressable>

        <UnitMiniMap lat={unit.lat} lng={unit.lng} name={unit.name} />

        <SpecialtyGrid specialties={unit.specialties} />

        <PillButton label="Como chegar" onPress={handleDirections} />
        <PillButton
          label="Reportar situação"
          variant="secondary"
          style={styles.reportButton}
          onPress={() => setReportOpen(true)}
        />
      </ScrollView>

      <ReportModal
        visible={reportOpen}
        unitId={unit.id}
        unitName={unit.name}
        onClose={() => setReportOpen(false)}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ['unit', id] });
          queryClient.invalidateQueries({ queryKey: ['units'] });
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: spacing.lg, paddingBottom: spacing.xl },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: colors.high },
  hero: {
    height: 180,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    overflow: 'hidden',
  },
  heroHeart: {
    position: 'absolute',
    bottom: spacing.sm,
    right: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 999,
    padding: spacing.sm,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statBlock: { flex: 1, alignItems: 'center' },
  statLabel: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.sm,
    lineHeight: 16,
  },
  statValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  statValue: { fontSize: 28, fontWeight: '700', color: colors.text },
  statUnit: { fontSize: 14, color: colors.textMuted, fontWeight: '600' },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  addressLink: {
    flex: 1,
    fontSize: 14,
    color: colors.primary,
    textDecorationLine: 'underline',
    lineHeight: 20,
  },
  reportButton: { marginTop: spacing.sm },
});
