import { useQuery } from '@tanstack/react-query';
import { fetchNearbyUnits } from '@/lib/api';
import { getUserLocation } from '@/lib/location';

export function useNearbyUnits() {
  return useQuery({
    queryKey: ['units', 'nearby'],
    queryFn: async () => {
      const location = await getUserLocation();
      const units = await fetchNearbyUnits(location.coords.lat, location.coords.lng);
      return { units, permissionGranted: location.permissionGranted };
    },
  });
}
