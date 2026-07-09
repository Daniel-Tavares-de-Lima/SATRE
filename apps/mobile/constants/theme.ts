import type { OccupancyLevel } from '@satre/shared-types';

/** SATRE brand and UI tokens — Figma palette (2026-07-09). */
export const colors = {
  primary: '#38A19A',
  primaryAlt: '#359892',
  primaryDark: '#297671',
  primaryDeeper: '#1D5451',
  background: '#F5F7FA',
  surface: '#FFFFFF',
  text: '#1A1D21',
  textMuted: '#6B7280',
  textOnPrimary: '#FFFFFF',
  border: '#E5E7EB',
  /** Map pin / occupancy: low load */
  low: '#22C55E',
  /** Map pin / occupancy: medium load */
  medium: '#F59E0B',
  /** Map pin / occupancy: high load */
  high: '#EF4444',
  tabInactive: '#9CA3AF',
  shadow: 'rgba(0, 0, 0, 0.08)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  header: 24,
  pill: 999,
};

export const typography = {
  title: { fontSize: 20, fontWeight: '700' as const },
  screenTitle: { fontSize: 22, fontWeight: '700' as const },
  subtitle: { fontSize: 16, fontWeight: '600' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  caption: { fontSize: 13, fontWeight: '400' as const },
};

/** Pin colors for map markers by occupancy level. */
export function occupancyPinColor(level: OccupancyLevel): string {
  return colors[level];
}
