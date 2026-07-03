import type { FastifyInstance } from 'fastify';
import { AuthError, authService } from '../services/auth.service.js';
import { loginSchema, refreshSchema, registerSchema } from '../schemas/auth.schema.js';

function formatZodError(error: { issues: { path: (string | number)[]; message: string }[] }) {
  return {
    error: 'Validation failed',
    details: error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    })),
  };
}

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/register', async (request, reply) => {
    const parsed = registerSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send(formatZodError(parsed.error));
    }

    try {
      const result = await authService.register(parsed.data);
      return reply.status(201).send(result);
    } catch (error) {
      if (error instanceof AuthError) {
        return reply.status(error.statusCode).send({ error: error.message, code: error.code });
      }
      throw error;
    }
  });

  app.post('/auth/login', async (request, reply) => {
    const parsed = loginSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send(formatZodError(parsed.error));
    }

    try {
      return await authService.login(parsed.data);
    } catch (error) {
      if (error instanceof AuthError) {
        return reply.status(error.statusCode).send({ error: error.message, code: error.code });
      }
      throw error;
    }
  });

  app.post('/auth/refresh', async (request, reply) => {
    const parsed = refreshSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send(formatZodError(parsed.error));
    }

    try {
      return await authService.refresh(parsed.data.refreshToken);
    } catch (error) {
      if (error instanceof AuthError) {
        return reply.status(error.statusCode).send({ error: error.message, code: error.code });
      }
      throw error;
    }
  });

  app.post('/auth/logout', async (request, reply) => {
    const parsed = refreshSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send(formatZodError(parsed.error));
    }

    await authService.logout(parsed.data.refreshToken);
    return reply.status(204).send();
  });
}
