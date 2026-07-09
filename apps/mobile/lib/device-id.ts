import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const DEVICE_ID_KEY = 'satre_device_id';

function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    const value = char === 'x' ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

/** Stable anonymous device id for crowdsourced reports (X-Device-Id). */
export async function getDeviceId(): Promise<string> {
  if (Platform.OS === 'web') {
    const stored = globalThis.localStorage?.getItem(DEVICE_ID_KEY);
    if (stored) return stored;
    const id = generateId();
    globalThis.localStorage?.setItem(DEVICE_ID_KEY, id);
    return id;
  }

  const stored = await SecureStore.getItemAsync(DEVICE_ID_KEY);
  if (stored) return stored;

  const id = generateId();
  await SecureStore.setItemAsync(DEVICE_ID_KEY, id);
  return id;
}
