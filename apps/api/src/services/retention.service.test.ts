import 'dotenv/config';
import { describe, expect, it, afterAll } from 'vitest';
import { prisma } from '../lib/prisma.js';
import { getReportRetentionCutoff, purgeExpiredReports } from './retention.service.js';

describe('purgeExpiredReports', () => {
  let unitId = '';
  const oldDeviceHash = `retention-old-${Date.now()}`;
  const recentDeviceHash = `retention-recent-${Date.now()}`;

  afterAll(async () => {
    await prisma.userReport.deleteMany({
      where: { deviceHash: { in: [oldDeviceHash, recentDeviceHash] } },
    });
    await prisma.$disconnect();
  });

  it('deletes reports older than 90 days and keeps recent ones', async () => {
    const unit = await prisma.unit.findFirst({ where: { active: true } });
    expect(unit).not.toBeNull();
    unitId = unit!.id;

    const cutoff = getReportRetentionCutoff();

    const oldReport = await prisma.userReport.create({
      data: {
        unitId,
        deviceHash: oldDeviceHash,
        occupancyLevel: 'high',
        waitLevel: 'high',
        note: 'Report antigo para purge',
        createdAt: new Date(cutoff.getTime() - 24 * 60 * 60 * 1000),
      },
    });

    const recentReport = await prisma.userReport.create({
      data: {
        unitId,
        deviceHash: recentDeviceHash,
        occupancyLevel: 'low',
        waitLevel: 'low',
        createdAt: new Date(),
      },
    });

    const deletedCount = await purgeExpiredReports(prisma);

    expect(deletedCount).toBeGreaterThanOrEqual(1);

    const oldStillExists = await prisma.userReport.findUnique({ where: { id: oldReport.id } });
    const recentStillExists = await prisma.userReport.findUnique({ where: { id: recentReport.id } });

    expect(oldStillExists).toBeNull();
    expect(recentStillExists).not.toBeNull();
  });
});
