import type { UnitType } from '@satre/shared-types';

export interface UnitListFilters {
  type?: UnitType;
  accessibleOnly: boolean;
  /** Max wait in minutes; null means no limit. */
  maxWait: number | null;
}

export const DEFAULT_UNIT_FILTERS: UnitListFilters = {
  accessibleOnly: false,
  maxWait: null,
};

export function countActiveFilters(filters: UnitListFilters): number {
  let count = 0;
  if (filters.type) count += 1;
  if (filters.accessibleOnly) count += 1;
  if (filters.maxWait !== null) count += 1;
  return count;
}

export function buildUnitsQueryPath(filters: UnitListFilters, search?: string): string {
  const params = new URLSearchParams();

  if (filters.type) params.set('type', filters.type);
  if (filters.accessibleOnly) params.set('accessible', 'true');
  if (filters.maxWait !== null) params.set('maxWait', String(filters.maxWait));
  if (search?.trim()) params.set('q', search.trim());

  const query = params.toString();
  return query ? `/units?${query}` : '/units';
}
