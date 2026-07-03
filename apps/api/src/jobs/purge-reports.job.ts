import { prisma } from '../lib/prisma.js';
import { purgeExpiredReports } from '../services/retention.service.js';

/** Runs the report retention purge and logs the outcome. */
export async function runPurgeReportsJob(): Promise<number> {
  const deletedCount = await purgeExpiredReports(prisma);

  if (deletedCount > 0) {
    console.log(`[retention] ${deletedCount} report(s) purged (older than 90 days)`);
  }

  return deletedCount;
}

export const PURGE_INTERVAL_MS = 24 * 60 * 60 * 1000;
