import type { UnitDetail, UnitSummary, WaitTimeEstimate } from '@satre/shared-types';
import { mockProvider } from '../providers/mock-provider.js';
import type { HospitalDataProvider, UnitFilters } from '../providers/types.js';

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

  listNearby(lat: number, lng: number, filters?: Omit<UnitFilters, 'lat' | 'lng'>) {
    return this.provider.listUnits({ ...filters, lat, lng });
  }
}

export const unitsService = new UnitsService();
