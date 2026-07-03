import type { UnitDetail, UnitSummary } from '@satre/shared-types';

export interface UnitFilters {
  type?: 'upa' | 'private';
  maxWait?: number;
  minDoctors?: number;
  accessible?: boolean;
  specialty?: string;
  q?: string;
  lat?: number;
  lng?: number;
  radiusMeters?: number;
}

export interface HospitalDataProvider {
  listUnits(filters?: UnitFilters): Promise<UnitSummary[]>;
  getUnitById(id: string): Promise<UnitDetail | null>;
}
