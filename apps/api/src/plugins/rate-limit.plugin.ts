import type { FastifyInstance } from 'fastify';
import rateLimit from '@fastify/rate-limit';

/** Default API rate limit — reports route overrides with a tighter cap. */
export async function rateLimitPlugin(app: FastifyInstance) {
  await app.register(rateLimit, {
    global: true,
    max: 100,
    timeWindow: '1 minute',
  });
}
