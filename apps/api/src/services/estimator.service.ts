import type { OccupancyLevel, WaitLevel } from '@satre/shared-types';

const WAIT_LEVEL_MINUTES: Record<WaitLevel, number> = {
  low: 20,
  medium: 45,
  high: 90,
};

const SNAPSHOT_TTL_MS = 30 * 60 * 1000;
const REPORT_WINDOW_MS = 2 * 60 * 60 * 1000;

export interface SnapshotInput {
  officialWaitMinutes: number;
  occupancyLevel: OccupancyLevel;
  capturedAt: Date;
}

export interface ReportInput {
  waitLevel: WaitLevel;
  occupancyLevel: OccupancyLevel;
  createdAt: Date;
  note?: string | null;
}

export interface WaitTimeResult {
  estimatedMinutes: number;
  confidence: number;
  factors: Record<string, unknown>;
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.floor(sorted.length / 2)] ?? 0;
}

function occupancyFallbackLevel(level: OccupancyLevel | undefined): WaitLevel {
  if (level === 'high') return 'high';
  if (level === 'low') return 'low';
  return 'medium';
}

export function estimateWaitTime(input: {
  snapshot: SnapshotInput | null;
  reports: ReportInput[];
}): WaitTimeResult {
  const now = Date.now();

  const freshSnapshot =
    input.snapshot && now - input.snapshot.capturedAt.getTime() < SNAPSHOT_TTL_MS
      ? input.snapshot
      : null;

  const recentReports = input.reports.filter(
    (report) => now - report.createdAt.getTime() < REPORT_WINDOW_MS,
  );

  const weightOfficial = freshSnapshot ? 0.7 : 0;
  const baseWait = freshSnapshot?.officialWaitMinutes ?? 0;

  let reportWait = 0;
  if (recentReports.length >= 3) {
    const waitMinutes = recentReports.map((report) => WAIT_LEVEL_MINUTES[report.waitLevel]);
    reportWait = median(waitMinutes);
  }

  const weightReports = recentReports.length >= 3 ? (freshSnapshot ? 0.3 : 1) : 0;

  let estimated: number;
  if (weightOfficial && weightReports) {
    estimated = Math.round(baseWait * weightOfficial + reportWait * weightReports);
  } else if (weightOfficial) {
    estimated = baseWait;
  } else if (weightReports) {
    estimated = reportWait;
  } else {
    const fallbackLevel = occupancyFallbackLevel(freshSnapshot?.occupancyLevel);
    estimated = WAIT_LEVEL_MINUTES[fallbackLevel];
  }

  estimated = Math.max(5, Math.min(180, estimated));

  let confidence = 0.3;
  if (freshSnapshot && recentReports.length >= 3) {
    confidence = 0.6;
  } else if (freshSnapshot) {
    confidence = 0.9;
  } else if (recentReports.length >= 3) {
    confidence = 0.4;
  }

  return {
    estimatedMinutes: estimated,
    confidence,
    factors: {
      weightOfficial,
      weightReports,
      reportCount: recentReports.length,
    },
  };
}
