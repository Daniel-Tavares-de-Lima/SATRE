import { useQuery } from '@tanstack/react-query';
import { fetchNearbyUnitsWithCache } from '@/lib/api';
import { getUserLocation } from '@/lib/location';

export function useNearbyUnits() {
  return useQuery({
    queryKey: ['units', 'nearby'],
    queryFn: async () => {
      const location = await getUserLocation();
      const result = await fetchNearbyUnitsWithCache(
        location.coords.lat,
        location.coords.lng,
      );
      return {
        units: result.units,
        fromCache: result.fromCache,
        permissionGranted: location.permissionGranted,
      };
    },
  });
}
