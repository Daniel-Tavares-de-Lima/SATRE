import type { PrismaClient } from '@prisma/client';

export const REPORT_RETENTION_DAYS = 90;

/** Returns the cutoff date for report retention (older reports are purged). */
export function getReportRetentionCutoff(now = Date.now()): Date {
  return new Date(now - REPORT_RETENTION_DAYS * 24 * 60 * 60 * 1000);
}

/**
 * Deletes user reports older than 90 days (LGPD retention policy).
 * Returns the number of deleted rows.
 */
export async function purgeExpiredReports(client: PrismaClient): Promise<number> {
  const cutoff = getReportRetentionCutoff();

  const result = await client.userReport.deleteMany({
    where: { createdAt: { lt: cutoff } },
  });

  return result.count;
}
