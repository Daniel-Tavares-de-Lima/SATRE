import 'dotenv/config';
import { buildApp } from './app.js';
import { env } from './config/env.js';
import { PURGE_INTERVAL_MS, runPurgeReportsJob } from './jobs/purge-reports.job.js';
import { prisma } from './lib/prisma.js';

async function main() {
  const app = await buildApp();

  void runPurgeReportsJob().catch((error) => {
    console.error('[retention] Initial purge failed:', error);
  });

  const retentionTimer = setInterval(() => {
    void runPurgeReportsJob().catch((error) => {
      console.error('[retention] Scheduled purge failed:', error);
    });
  }, PURGE_INTERVAL_MS);

  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' });
    console.log(`SATRE API running at http://localhost:${env.PORT}`);
    console.log(`Try: http://localhost:${env.PORT}/units`);
  } catch (error) {
    app.log.error(error);
    process.exit(1);
  }

  const shutdown = async () => {
    clearInterval(retentionTimer);
    await app.close();
    await prisma.$disconnect();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

main();
