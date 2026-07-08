import type { FastifyInstance } from 'fastify';
import { authRoutes } from '../routes/auth.routes.js';
import { healthRoutes } from '../routes/health.routes.js';
import { reportsRoutes } from '../routes/reports.routes.js';
import { unitsRoutes } from '../routes/units.routes.js';
import { usersRoutes } from '../routes/users.routes.js';

/** Registers all HTTP route modules for the SATRE API. */
export async function routesPlugin(app: FastifyInstance) {
  await app.register(healthRoutes);
  await app.register(authRoutes);
  await app.register(unitsRoutes);
  await app.register(reportsRoutes);
  await app.register(usersRoutes);
}
