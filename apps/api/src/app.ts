import Fastify from 'fastify';
import cors from '@fastify/cors';
import { healthRoutes, unitsRoutes } from './routes/index.js';

export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(cors, { origin: true });
  await app.register(healthRoutes);
  await app.register(unitsRoutes);

  return app;
}
