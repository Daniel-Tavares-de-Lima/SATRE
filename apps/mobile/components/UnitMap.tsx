import { useMemo } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, type Region } from 'react-native-maps';
import type { UnitSummary } from '@satre/shared-types';
import { occupancyLevelLabel } from '@/components/OccupancyBadge';
import { RECIFE_CENTER } from '@/lib/location';
import { occupancyPinColor } from '@/constants/theme';

const DEFAULT_DELTA = 0.12;

interface UnitMapProps {
  units: UnitSummary[];
  center?: { lat: number; lng: number };
  selectedUnitId?: string | null;
  onSelectUnit: (unit: UnitSummary) => void;
}

export function UnitMap({ units, center, selectedUnitId, onSelectUnit }: UnitMapProps) {
  const mapCenter = center ?? RECIFE_CENTER;

  const initialRegion: Region = useMemo(
    () => ({
      latitude: mapCenter.lat,
      longitude: mapCenter.lng,
      latitudeDelta: DEFAULT_DELTA,
      longitudeDelta: DEFAULT_DELTA,
    }),
    [mapCenter.lat, mapCenter.lng],
  );

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        showsUserLocation
        showsMyLocationButton
      >
        {units.map((unit) => (
          <Marker
            key={unit.id}
            coordinate={{ latitude: unit.lat, longitude: unit.lng }}
            pinColor={occupancyPinColor(unit.occupancyLevel)}
            title={unit.name}
            description={`${unit.estimatedWaitMinutes} min · ${unit.doctorCount} médicos`}
            accessibilityLabel={`${unit.name}, lotação ${occupancyLevelLabel(unit.occupancyLevel)}, ${unit.estimatedWaitMinutes} minutos de espera, ${unit.doctorCount} médicos`}
            onPress={() => onSelectUnit(unit)}
            opacity={selectedUnitId && selectedUnitId !== unit.id ? 0.75 : 1}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
