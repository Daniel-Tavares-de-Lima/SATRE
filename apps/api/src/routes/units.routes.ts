import type { FastifyInstance } from 'fastify';
import { unitsService } from '../services/units.service.js';
import { parseListUnitsQuery, parseNearbyQuery } from '../schemas/units.schema.js';

export async function unitsRoutes(app: FastifyInstance) {
  app.get('/units', async (request, reply) => {
    const parsed = parseListUnitsQuery(request.query as Record<string, unknown>);
    if (!parsed.ok) {
      return reply.status(400).send(parsed.error);
    }

    return unitsService.listUnits(parsed.data);
  });

  app.get('/units/nearby', async (request, reply) => {
    const parsed = parseNearbyQuery(request.query as Record<string, unknown>);
    if (!parsed.ok) {
      return reply.status(400).send(parsed.error);
    }

    const { lat, lng, radius, ...filters } = parsed.data;

    return unitsService.listNearby(lat, lng, {
      ...filters,
      radiusKm: radius,
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
