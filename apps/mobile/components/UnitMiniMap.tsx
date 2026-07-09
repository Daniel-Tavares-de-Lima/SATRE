import { Platform, StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { colors, radius, spacing } from '@/constants/theme';

interface UnitMiniMapProps {
  lat: number;
  lng: number;
  name: string;
}

export function UnitMiniMap({ lat, lng, name }: UnitMiniMapProps) {
  return (
    <View style={styles.wrapper}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: 0.008,
          longitudeDelta: 0.008,
        }}
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        accessibilityLabel={`Mapa de ${name}`}
      >
        <Marker coordinate={{ latitude: lat, longitude: lng }} title={name} />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    height: 160,
    borderRadius: radius.md,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  map: { flex: 1 },
});
