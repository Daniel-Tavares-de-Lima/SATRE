import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, radius, spacing } from '@/constants/theme';

interface UnitMiniMapProps {
  lat: number;
  lng: number;
  name: string;
}

/** Web fallback — react-native-maps is native-only. */
export function UnitMiniMap({ lat, lng, name }: UnitMiniMapProps) {
  return (
    <View style={styles.wrapper}>
      <Ionicons name="map-outline" size={32} color={colors.primary} />
      <Text style={styles.text}>{name}</Text>
      <Text style={styles.coords}>
        {lat.toFixed(4)}, {lng.toFixed(4)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 120,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    padding: spacing.md,
  },
  text: { fontWeight: '600', color: colors.text, marginTop: spacing.xs },
  coords: { fontSize: 12, color: colors.textMuted, marginTop: 4 },
});
