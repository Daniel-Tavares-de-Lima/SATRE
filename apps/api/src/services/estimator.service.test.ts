import { describe, it, expect } from 'vitest';
import { estimateWaitTime } from './estimator.service.js';

describe('estimateWaitTime', () => {
  it('returns official wait when snapshot is fresh', () => {
    const result = estimateWaitTime({
      snapshot: { officialWaitMinutes: 25, occupancyLevel: 'high', capturedAt: new Date() },
      reports: [],
    });
    expect(result.estimatedMinutes).toBe(25);
    expect(result.confidence).toBe(0.9);
  });

  it('blends official and reports when both exist', () => {
    const result = estimateWaitTime({
      snapshot: { officialWaitMinutes: 20, occupancyLevel: 'medium', capturedAt: new Date() },
      reports: [
        { waitLevel: 'high', occupancyLevel: 'high', createdAt: new Date() },
        { waitLevel: 'high', occupancyLevel: 'high', createdAt: new Date() },
        { waitLevel: 'medium', occupancyLevel: 'medium', createdAt: new Date() },
      ],
    });
    expect(result.estimatedMinutes).toBeGreaterThan(20);
    expect(result.confidence).toBe(0.6);
  });

  it('clamps between 5 and 180 minutes', () => {
    const result = estimateWaitTime({
      snapshot: { officialWaitMinutes: 300, occupancyLevel: 'high', capturedAt: new Date() },
      reports: [],
    });
    expect(result.estimatedMinutes).toBe(180);
  });

  it('uses reports only when snapshot is stale and at least 3 reports exist', () => {
    const stale = new Date(Date.now() - 60 * 60 * 1000);
    const result = estimateWaitTime({
      snapshot: { officialWaitMinutes: 10, occupancyLevel: 'low', capturedAt: stale },
      reports: [
        { waitLevel: 'low', occupancyLevel: 'low', createdAt: new Date() },
        { waitLevel: 'low', occupancyLevel: 'low', createdAt: new Date() },
        { waitLevel: 'medium', occupancyLevel: 'medium', createdAt: new Date() },
      ],
    });
    expect(result.estimatedMinutes).toBe(20);
    expect(result.confidence).toBe(0.4);
  });

  it('ignores reports older than 2 hours', () => {
    const oldReport = new Date(Date.now() - 3 * 60 * 60 * 1000);
    const result = estimateWaitTime({
      snapshot: { officialWaitMinutes: 15, occupancyLevel: 'medium', capturedAt: new Date() },
      reports: [
        { waitLevel: 'high', occupancyLevel: 'high', createdAt: oldReport },
        { waitLevel: 'high', occupancyLevel: 'high', createdAt: oldReport },
        { waitLevel: 'high', occupancyLevel: 'high', createdAt: oldReport },
      ],
    });
    expect(result.estimatedMinutes).toBe(15);
    expect(result.confidence).toBe(0.9);
  });

  it('falls back to default when no fresh snapshot and fewer than 3 reports', () => {
    const result = estimateWaitTime({
      snapshot: null,
      reports: [{ waitLevel: 'high', occupancyLevel: 'high', createdAt: new Date() }],
    });
    expect(result.estimatedMinutes).toBe(45);
    expect(result.confidence).toBe(0.3);
  });
});
