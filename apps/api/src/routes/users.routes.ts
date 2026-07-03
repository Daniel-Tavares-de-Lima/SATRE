import type { FastifyInstance } from 'fastify';
import { authenticate } from '../plugins/auth.plugin.js';
import { formatZodError, updateProfileSchema } from '../schemas/users.schema.js';
import { UserError, usersService } from '../services/users.service.js';

function handleUserError(error: unknown) {
  if (error instanceof UserError) {
    return { statusCode: error.statusCode, body: { error: error.message, code: error.code } };
  }
  throw error;
}

export async function usersRoutes(app: FastifyInstance) {
  app.get('/users/me', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      return await usersService.getProfile(request.userId!);
    } catch (error) {
      const handled = handleUserError(error);
      return reply.status(handled.statusCode).send(handled.body);
    }
  });

  app.patch('/users/me', { preHandler: [authenticate] }, async (request, reply) => {
    const parsed = updateProfileSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send(formatZodError(parsed.error));
    }

    try {
      return await usersService.updateProfile(request.userId!, parsed.data.name);
    } catch (error) {
      const handled = handleUserError(error);
      return reply.status(handled.statusCode).send(handled.body);
    }
  });

  app.delete('/users/me', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      await usersService.deleteAccount(request.userId!);
      return reply.status(204).send();
    } catch (error) {
      const handled = handleUserError(error);
      return reply.status(handled.statusCode).send(handled.body);
    }
  });

  app.get('/users/me/favorites', { preHandler: [authenticate] }, async (request, reply) => {
    try {
      return await usersService.listFavorites(request.userId!);
    } catch (error) {
      const handled = handleUserError(error);
      return reply.status(handled.statusCode).send(handled.body);
    }
  });

  app.post('/units/:id/favorites', { preHandler: [authenticate] }, async (request, reply) => {
    const { id: unitId } = request.params as { id: string };

    try {
      await usersService.addFavorite(request.userId!, unitId);
      return reply.status(201).send({ message: 'Favorito adicionado' });
    } catch (error) {
      const handled = handleUserError(error);
      return reply.status(handled.statusCode).send(handled.body);
    }
  });

  app.delete('/units/:id/favorites', { preHandler: [authenticate] }, async (request, reply) => {
    const { id: unitId } = request.params as { id: string };

    try {
      await usersService.removeFavorite(request.userId!, unitId);
      return reply.status(204).send();
    } catch (error) {
      const handled = handleUserError(error);
      return reply.status(handled.statusCode).send(handled.body);
    }
  });
}
