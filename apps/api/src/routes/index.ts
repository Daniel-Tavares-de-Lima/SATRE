import type { FastifyInstance } from 'fastify';
import { unitsService } from '../services/units.service.js';

export async function healthRoutes(app: FastifyInstance) {
  app.get('/health', async () => ({
    status: 'ok',
    service: 'satre-api',
    timestamp: new Date().toISOString(),
  }));
}

export async function unitsRoutes(app: FastifyInstance) {
  app.get('/units', async (request) => {
    const query = request.query as Record<string, string | undefined>;
    return unitsService.listUnits({
      type: query.type === 'upa' || query.type === 'private' ? query.type : undefined,
      maxWait: query.maxWait ? Number(query.maxWait) : undefined,
      minDoctors: query.minDoctors ? Number(query.minDoctors) : undefined,
      accessible: query.accessible === 'true',
      specialty: query.specialty,
      q: query.q,
    });
  });

  app.get('/units/nearby', async (request, reply) => {
    const query = request.query as Record<string, string | undefined>;
    const lat = Number(query.lat);
    const lng = Number(query.lng);

    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      return reply.status(400).send({ error: 'lat and lng are required' });
    }

    return unitsService.listNearby(lat, lng, {
      type: query.type === 'upa' || query.type === 'private' ? query.type : undefined,
    });
  });

  app.get('/units/:id', async (request, reply) => {
    const { id } = request.params as { id: string };
    const unit = await unitsService.getUnitById(id);

    if (!unit) {
      return reply.status(404).send({ error: 'Unit not found' });
    }

    return unit;
  });

  app.get('/units/:id/wait-time', async (request, reply) => {
    const { id } = request.params as { id: string };
    const estimate = await unitsService.getWaitTimeEstimate(id);

    if (!estimate) {
      return reply.status(404).send({ error: 'Unit not found' });
    }

    return estimate;
  });
}
