import { useQuery } from '@tanstack/react-query';
import { router } from 'expo-router';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { fetchUnits } from '@/lib/api';
import { colors, spacing } from '@/constants/theme';

export default function MapaScreen() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['units', 'map'],
    queryFn: fetchUnits,
  });

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (isError || !data?.length) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>Mapa indisponível — verifique a API</Text>
      </View>
    );
  }

  const initialRegion = {
    latitude: data[0].latitude,
    longitude: data[0].longitude,
    latitudeDelta: 0.12,
    longitudeDelta: 0.12,
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
      >
        {data.map((unit) => (
          <Marker
            key={unit.id}
            coordinate={{ latitude: unit.latitude, longitude: unit.longitude }}
            title={unit.name}
            description={`${unit.estimatedWaitMinutes} min · ${unit.occupancyLevel}`}
            onCalloutPress={() => router.push(`/unidade/${unit.id}`)}
          />
        ))}
      </MapView>

      <View style={styles.legend}>
        <Text style={styles.legendText}>Toque no pin para ver detalhes</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background },
  error: { color: colors.textMuted },
  legend: {
    position: 'absolute',
    bottom: spacing.md,
    left: spacing.md,
    right: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  legendText: { textAlign: 'center', color: colors.textMuted, fontSize: 13 },
});
