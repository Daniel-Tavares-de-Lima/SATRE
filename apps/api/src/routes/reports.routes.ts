import type { FastifyInstance } from 'fastify';
import rateLimit from '@fastify/rate-limit';
import { optionalAuthenticate } from '../plugins/auth.plugin.js';
import { ReportError, reportsService } from '../services/reports.service.js';
import { createReportSchema, formatZodError } from '../schemas/reports.schema.js';

const DEVICE_ID_HEADER = 'x-device-id';

export async function reportsRoutes(app: FastifyInstance) {
  await app.register(rateLimit, {
    max: 10,
    timeWindow: '1 minute',
  });

  app.post(
    '/units/:id/reports',
    { preHandler: [optionalAuthenticate] },
    async (request, reply) => {
      const { id: unitId } = request.params as { id: string };
      const deviceId = request.headers[DEVICE_ID_HEADER];

      if (typeof deviceId !== 'string' || deviceId.trim().length === 0) {
        return reply.status(400).send({ error: 'X-Device-Id header is required' });
      }

      const parsed = createReportSchema.safeParse(request.body);
      if (!parsed.success) {
        return reply.status(400).send(formatZodError(parsed.error));
      }

      try {
        const result = await reportsService.createReport({
          unitId,
          deviceId: deviceId.trim(),
          userId: request.userId,
          input: parsed.data,
        });

        return reply.status(201).send(result);
      } catch (error) {
        if (error instanceof ReportError) {
          return reply.status(error.statusCode).send({ error: error.message, code: error.code });
        }
        throw error;
      }
    },
  );
}
