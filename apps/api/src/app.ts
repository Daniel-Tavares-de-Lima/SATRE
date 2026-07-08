import Fastify from 'fastify';
import cors from '@fastify/cors';
import { authPlugin } from './plugins/auth.plugin.js';
import { rateLimitPlugin } from './plugins/rate-limit.plugin.js';
import { routesPlugin } from './plugins/routes.plugin.js';

export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(cors, { origin: true });
  await app.register(rateLimitPlugin);
  await app.register(authPlugin);
  await app.register(routesPlugin);

  return app;
}
