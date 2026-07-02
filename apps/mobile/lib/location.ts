import * as Location from 'expo-location';

export interface UserCoords {
  lat: number;
  lng: number;
}

const RECIFE_CENTER: UserCoords = { lat: -8.0476, lng: -34.951 };

export async function getUserCoords(): Promise<UserCoords> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    return RECIFE_CENTER;
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return {
    lat: position.coords.latitude,
    lng: position.coords.longitude,
  };
}

export { RECIFE_CENTER };
