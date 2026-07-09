import * as Location from 'expo-location';

export interface UserCoords {
  lat: number;
  lng: number;
}

export interface LocationResult {
  coords: UserCoords;
  permissionGranted: boolean;
}

export const RECIFE_CENTER: UserCoords = { lat: -8.0476, lng: -34.951 };

/** Requests foreground location and returns user coords or Recife center as fallback. */
export async function getUserLocation(): Promise<LocationResult> {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== 'granted') {
    return { coords: RECIFE_CENTER, permissionGranted: false };
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return {
    coords: {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    },
    permissionGranted: true,
  };
}

/** @deprecated Use getUserLocation */
export async function getUserCoords(): Promise<UserCoords> {
  const { coords } = await getUserLocation();
  return coords;
}
