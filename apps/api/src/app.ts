import Fastify from 'fastify';
import cors from '@fastify/cors';
import { authPlugin } from './plugins/auth.plugin.js';
import { authRoutes } from './routes/auth.routes.js';
import { healthRoutes } from './routes/health.routes.js';
import { reportsRoutes } from './routes/reports.routes.js';
import { unitsRoutes } from './routes/units.routes.js';
import { usersRoutes } from './routes/users.routes.js';

export async function buildApp() {
  const app = Fastify({ logger: true });

  await app.register(cors, { origin: true });
  await app.register(authPlugin);
  await app.register(healthRoutes);
  await app.register(authRoutes);
  await app.register(unitsRoutes);
  await app.register(reportsRoutes);
  await app.register(usersRoutes);

  return app;
}
