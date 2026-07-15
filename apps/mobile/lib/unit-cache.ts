import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UnitSummary } from '@satre/shared-types';

const UNITS_KEY = 'satre-cache-units';
const NEARBY_KEY = 'satre-cache-nearby';

export type UnitCacheKey = 'units' | 'nearby';

function storageKey(key: UnitCacheKey): string {
  return key === 'nearby' ? NEARBY_KEY : UNITS_KEY;
}

/** Persist the last successful units list for offline fallback. */
export async function saveCachedUnits(
  key: UnitCacheKey,
  units: UnitSummary[],
): Promise<void> {
  await AsyncStorage.setItem(
    storageKey(key),
    JSON.stringify({ savedAt: Date.now(), units }),
  );
}

/** Load cached units, or null when nothing is stored / payload is invalid. */
export async function loadCachedUnits(
  key: UnitCacheKey,
): Promise<UnitSummary[] | null> {
  const raw = await AsyncStorage.getItem(storageKey(key));
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as { units?: UnitSummary[] };
    if (!Array.isArray(parsed.units) || parsed.units.length === 0) {
      return null;
    }
    return parsed.units;
  } catch {
    return null;
  }
}
