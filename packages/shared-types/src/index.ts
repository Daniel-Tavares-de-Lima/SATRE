export type UnitType = 'upa' | 'private';
export type OccupancyLevel = 'low' | 'medium' | 'high';
export type WaitLevel = 'low' | 'medium' | 'high';

export interface UnitSummary {
  id: string;
  name: string;
  type: UnitType;
  address: string;
  lat: number;
  lng: number;
  estimatedWaitMinutes: number;
  doctorCount: number;
  patientCount: number;
  occupancyLevel: OccupancyLevel;
  confidence: number;
  distanceMeters?: number;
}

export interface UnitDetail extends UnitSummary {
  phone: string | null;
  specialties: string[];
  accessibility: {
    physical: boolean;
    visual: boolean;
    hearing: boolean;
    neuro: boolean;
  };
}

export interface WaitTimeEstimate {
  estimatedMinutes: number;
  confidence: number;
  factors: Record<string, unknown>;
}

export interface CreateReportBody {
  occupancyLevel: OccupancyLevel;
  waitLevel: WaitLevel;
  note?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface RegisterBody {
  name: string;
  email: string;
  password: string;
  acceptTerms: boolean;
  acceptPrivacy: boolean;
}
