import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View, Image } from 'react-native';
import type { UnitSummary } from '@satre/shared-types';
import { hasExcellentServiceBadge, unitPhoto, unitThumbnailStyle } from '@/lib/unit-images';
import { colors, radius, spacing } from '@/constants/theme';

interface UnitCardFigmaProps {
  unit: UnitSummary;
  onPress: () => void;
  showAddress?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

function metricColor(level: UnitSummary['occupancyLevel']): string {
  return colors[level];
}

export function UnitCardFigma({
  unit,
  onPress,
  showAddress = true,
  isFavorite = false,
  onToggleFavorite,
}: UnitCardFigmaProps) {
  const thumb = unitThumbnailStyle(unit.type);
  const photo = unitPhoto(unit.name);
  const excellent = hasExcellentServiceBadge(unit.type, unit.estimatedWaitMinutes);

  function handleFavoritePress() {
    if (!onToggleFavorite) return;
    onToggleFavorite();
  }

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${unit.name}, ${unit.estimatedWaitMinutes} minutos de espera, lotação ${unit.occupancyLevel === 'low' ? 'baixa' : unit.occupancyLevel === 'medium' ? 'média' : 'alta'}`}
      accessibilityHint="Abre o detalhe da unidade"
    >
      <View style={styles.row}>
        <View style={[styles.thumb, { backgroundColor: thumb.backgroundColor }]}>
          {photo ? (
            <Image source={photo} style={styles.thumbImage} accessibilityIgnoresInvertColors />
          ) : (
            <Ionicons name={thumb.iconName} size={28} color={thumb.iconColor} />
          )}
          {onToggleFavorite ? (
            <Pressable
              style={styles.heartButton}
              onPress={(event) => {
                event.stopPropagation?.();
                handleFavoritePress();
              }}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel={isFavorite ? 'Remover favorito' : 'Salvar favorito'}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={18}
                color={isFavorite ? colors.high : colors.surface}
              />
            </Pressable>
          ) : null}
        </View>

        <View style={styles.body}>
          <View style={styles.titleRow}>
            <Text style={styles.name} numberOfLines={2}>
              {unit.name}
            </Text>
            {!onToggleFavorite ? (
              <Ionicons name="heart-outline" size={20} color={colors.textMuted} />
            ) : null}
          </View>

          {excellent ? (
            <View style={styles.badge}>
              <Ionicons name="star" size={12} color="#CA8A04" />
              <Text style={styles.badgeText}>Serviço Excelente</Text>
            </View>
          ) : null}

          {showAddress ? (
            <View style={styles.addressRow}>
              <Ionicons name="location-outline" size={14} color={colors.textMuted} />
              <Text style={styles.address} numberOfLines={2}>
                {unit.address}
              </Text>
            </View>
          ) : null}

          <View style={styles.metrics}>
            <View style={styles.metric}>
              <Ionicons name="headset-outline" size={16} color={metricColor(unit.occupancyLevel)} />
              <Text style={[styles.metricText, { color: metricColor(unit.occupancyLevel) }]}>
                {unit.estimatedWaitMinutes} min
              </Text>
            </View>
            <View style={styles.metric}>
              <Ionicons name="people-outline" size={16} color={metricColor(unit.occupancyLevel)} />
              <Text style={[styles.metricText, { color: metricColor(unit.occupancyLevel) }]}>
                {unit.doctorCount} médicos
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pressed: { opacity: 0.9 },
  row: { flexDirection: 'row', gap: spacing.sm },
  thumb: {
    width: 88,
    height: 88,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heartButton: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 999,
    padding: 4,
  },
  body: { flex: 1 },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.xs,
  },
  name: { flex: 1, fontSize: 15, fontWeight: '700', color: colors.text },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: '#FEF9C3',
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  badgeText: { fontSize: 11, fontWeight: '600', color: '#854D0E' },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
  },
  address: { flex: 1, fontSize: 12, color: colors.textMuted, lineHeight: 16 },
  metrics: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xs },
  metric: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metricText: { fontSize: 13, fontWeight: '700' },
});
