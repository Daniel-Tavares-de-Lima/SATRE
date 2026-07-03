import type { OccupancyLevel, UnitDetail, UnitSummary, UnitType } from '@satre/shared-types';
import { prisma } from '../lib/prisma.js';
import { estimateWaitTime } from '../services/estimator.service.js';
import type { HospitalDataProvider, UnitFilters } from './types.js';

const REPORT_LOOKBACK_MS = 2 * 60 * 60 * 1000;

/** Earth radius in meters for haversine distance. */
export function haversineMeters(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const earthRadiusM = 6371000;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 2 * earthRadiusM * Math.asin(Math.sqrt(a));
}

function mapOccupancy(level: string): OccupancyLevel {
  if (level === 'low' || level === 'medium' || level === 'high') return level;
  return 'medium';
}

function mapUnitType(type: string): UnitType {
  return type === 'private' ? 'private' : 'upa';
}

type UnitWithRelations = Awaited<ReturnType<typeof loadUnits>>[number];

async function buildUnitSummary(
  unit: UnitWithRelations,
  filters?: UnitFilters,
): Promise<UnitSummary | null> {
  const snapshot = unit.snapshots[0] ?? null;
  const reportsSince = new Date(Date.now() - REPORT_LOOKBACK_MS);
  const recentReports = unit.reports.filter((r) => r.createdAt >= reportsSince);

  const estimate = estimateWaitTime({
    snapshot: snapshot
      ? {
          officialWaitMinutes: snapshot.officialWaitMinutes,
          occupancyLevel: mapOccupancy(snapshot.occupancyLevel),
          capturedAt: snapshot.source === 'mock' ? new Date() : snapshot.capturedAt,
        }
      : null,
    reports: recentReports.map((r) => ({
      waitLevel: r.waitLevel as 'low' | 'medium' | 'high',
      occupancyLevel: r.occupancyLevel as OccupancyLevel,
      createdAt: r.createdAt,
      note: r.note,
    })),
  });

  if (filters?.maxWait !== undefined && estimate.estimatedMinutes > filters.maxWait) {
    return null;
  }

  if (filters?.minDoctors !== undefined && (snapshot?.doctorCount ?? 0) < filters.minDoctors) {
    return null;
  }

  if (filters?.specialty) {
    const hasSpecialty = unit.specialties.some(
      (s) => s.specialtyName.toLowerCase() === filters.specialty!.toLowerCase(),
    );
    if (!hasSpecialty) return null;
  }

  if (filters?.q) {
    const q = filters.q.toLowerCase();
    if (!unit.name.toLowerCase().includes(q) && !unit.address.toLowerCase().includes(q)) {
      return null;
    }
  }

  if (filters?.accessible) {
    const isAccessible =
      unit.accessibilityPhysical ||
      unit.accessibilityVisual ||
      unit.accessibilityHearing ||
      unit.accessibilityNeuro;
    if (!isAccessible) return null;
  }

  const summary: UnitSummary = {
    id: unit.id,
    name: unit.name,
    type: mapUnitType(unit.type),
    address: unit.address,
    lat: unit.lat,
    lng: unit.lng,
    estimatedWaitMinutes: estimate.estimatedMinutes,
    doctorCount: snapshot?.doctorCount ?? 0,
    patientCount: snapshot?.patientCount ?? 0,
    occupancyLevel: mapOccupancy(snapshot?.occupancyLevel ?? 'medium'),
    confidence: estimate.confidence,
  };

  if (filters?.lat !== undefined && filters?.lng !== undefined) {
    const distance = Math.round(
      haversineMeters(filters.lat, filters.lng, unit.lat, unit.lng),
    );
    summary.distanceMeters = distance;

    if (filters.radiusMeters !== undefined && distance > filters.radiusMeters) {
      return null;
    }
  }

  return summary;
}

async function loadUnits() {
  return prisma.unit.findMany({
    where: { active: true },
    include: {
      specialties: true,
      snapshots: { orderBy: { capturedAt: 'desc' }, take: 1 },
      reports: { orderBy: { createdAt: 'desc' }, take: 50 },
    },
  });
}

/**
 * MVP provider: reads seeded mock units from PostgreSQL and applies the wait estimator.
 * Future hospital integrations implement the same HospitalDataProvider interface.
 */
export class MockProvider implements HospitalDataProvider {
  async listUnits(filters?: UnitFilters): Promise<UnitSummary[]> {
    const units = await loadUnits();
    const byType = filters?.type ? units.filter((u) => u.type === filters.type) : units;

    const summaries = await Promise.all(
      byType.map((unit) => buildUnitSummary(unit, filters)),
    );

    const results = summaries.filter((u): u is UnitSummary => u !== null);

    if (filters?.lat !== undefined && filters?.lng !== undefined) {
      results.sort((a, b) => (a.distanceMeters ?? 0) - (b.distanceMeters ?? 0));
    } else {
      results.sort((a, b) => a.estimatedWaitMinutes - b.estimatedWaitMinutes);
    }

    return results;
  }

  async getUnitById(id: string): Promise<UnitDetail | null> {
    const unit = await prisma.unit.findFirst({
      where: { id, active: true },
      include: {
        specialties: true,
        snapshots: { orderBy: { capturedAt: 'desc' }, take: 1 },
        reports: { orderBy: { createdAt: 'desc' }, take: 50 },
      },
    });

    if (!unit) return null;

    const summary = await buildUnitSummary(unit);
    if (!summary) return null;

    return {
      ...summary,
      phone: unit.phone,
      specialties: unit.specialties.map((s) => s.specialtyName),
      accessibility: {
        physical: unit.accessibilityPhysical,
        visual: unit.accessibilityVisual,
        hearing: unit.accessibilityHearing,
        neuro: unit.accessibilityNeuro,
      },
    };
  }
}

export const mockProvider = new MockProvider();
