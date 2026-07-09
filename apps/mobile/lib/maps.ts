import { Linking, Platform } from 'react-native';

export interface DirectionsTarget {
  lat: number;
  lng: number;
  address: string;
  name?: string;
}

/**
 * Opens Google Maps directions to a health unit.
 * Uses the street address for best resolution; falls back to coordinates.
 */
export function openDirections({ lat, lng, address }: DirectionsTarget) {
  const encodedAddress = encodeURIComponent(address.trim());
  const coords = `${lat},${lng}`;

  const webUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;

  const nativeUrl = Platform.select({
    ios: `comgooglemaps://?daddr=${encodedAddress}&directionsmode=driving`,
    android: `google.navigation:q=${encodedAddress}`,
    default: undefined,
  });

  const nativeCoordsUrl = Platform.select({
    ios: `comgooglemaps://?daddr=${coords}&directionsmode=driving`,
    android: `google.navigation:q=${coords}`,
    default: undefined,
  });

  if (!nativeUrl || !nativeCoordsUrl) {
    void Linking.openURL(webUrl);
    return;
  }

  Linking.canOpenURL(nativeUrl)
    .then((supported) => {
      if (supported) {
        return Linking.openURL(nativeUrl);
      }
      return Linking.canOpenURL(nativeCoordsUrl).then((coordsSupported) =>
        Linking.openURL(coordsSupported ? nativeCoordsUrl : webUrl),
      );
    })
    .catch(() => Linking.openURL(webUrl));
}
