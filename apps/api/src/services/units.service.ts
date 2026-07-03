import type { UnitDetail, UnitSummary, WaitTimeEstimate } from '@satre/shared-types';
import { mockProvider } from '../providers/mock-provider.js';
import type { HospitalDataProvider, UnitFilters } from '../providers/types.js';
import { DEFAULT_NEARBY_RADIUS_KM } from '../schemas/units.schema.js';

export type NearbyOptions = Omit<UnitFilters, 'lat' | 'lng' | 'radiusMeters'> & {
  radiusKm?: number;
};

/**
 * Application service for unit queries. Routes depend on this layer, not on Prisma directly.
 */
export class UnitsService {
  constructor(private readonly provider: HospitalDataProvider = mockProvider) {}

  listUnits(filters?: UnitFilters): Promise<UnitSummary[]> {
    return this.provider.listUnits(filters);
  }

  getUnitById(id: string): Promise<UnitDetail | null> {
    return this.provider.getUnitById(id);
  }

  async getWaitTimeEstimate(id: string): Promise<WaitTimeEstimate | null> {
    const unit = await this.provider.getUnitById(id);
    if (!unit) return null;

    return {
      estimatedMinutes: unit.estimatedWaitMinutes,
      confidence: unit.confidence,
      factors: { unitId: unit.id, name: unit.name },
    };
  }

  listNearby(lat: number, lng: number, options?: NearbyOptions) {
    const radiusKm = options?.radiusKm ?? DEFAULT_NEARBY_RADIUS_KM;
    const { radiusKm: _radiusKm, ...filters } = options ?? {};

    return this.provider.listUnits({
      ...filters,
      lat,
      lng,
      radiusMeters: radiusKm * 1000,
    });
  }
}

export const unitsService = new UnitsService();
