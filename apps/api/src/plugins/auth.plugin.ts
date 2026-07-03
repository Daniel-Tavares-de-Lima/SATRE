import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { verifyAccessToken } from '../lib/jwt.js';

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    optionalAuthenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }

  interface FastifyRequest {
    userId?: string;
  }
}

/** Sets userId when a valid Bearer token is present; anonymous requests are allowed. */
export async function optionalAuthenticate(request: FastifyRequest, reply: FastifyReply) {
  const header = request.headers.authorization;
  if (!header) return;

  if (!header.startsWith('Bearer ')) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }

  try {
    const payload = verifyAccessToken(header.slice(7));
    request.userId = payload.sub;
  } catch {
    return reply.status(401).send({ error: 'Unauthorized' });
  }
}

/** Requires a valid Bearer token and attaches userId to the request. */
export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const header = request.headers.authorization;

  if (!header?.startsWith('Bearer ')) {
    return reply.status(401).send({ error: 'Unauthorized' });
  }

  try {
    const payload = verifyAccessToken(header.slice(7));
    request.userId = payload.sub;
  } catch {
    return reply.status(401).send({ error: 'Unauthorized' });
  }
}

/** Validates Bearer access tokens and attaches userId to the request. */
export async function authPlugin(app: FastifyInstance) {
  app.decorate('authenticate', authenticate);

  app.decorate('optionalAuthenticate', optionalAuthenticate);
}
