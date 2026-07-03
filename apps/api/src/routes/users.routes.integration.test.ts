import 'dotenv/config';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../app.js';
import { prisma } from '../lib/prisma.js';

describe('Users routes integration', () => {
  const email = `users-task8-${Date.now()}@satre.app`;
  let accessToken = '';
  let userId = '';
  let unitId = '';

  afterAll(async () => {
    if (userId) {
      await prisma.favorite.deleteMany({ where: { userId } });
      await prisma.refreshToken.deleteMany({ where: { userId } });
      await prisma.user.deleteMany({ where: { id: userId } });
    }
    await prisma.$disconnect();
  });

  async function authHeaders() {
    return { authorization: `Bearer ${accessToken}` };
  }

  it('registers a user for protected route tests', async () => {
    const app = await buildApp();

    const response = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: {
        name: 'Usuario Task 8',
        email,
        password: 'senha1234',
        acceptTerms: true,
        acceptPrivacy: true,
      },
    });

    expect(response.statusCode).toBe(201);
    const body = response.json();
    accessToken = body.accessToken;
    userId = body.user.id;

    await app.close();
  });

  it('returns the authenticated profile', async () => {
    const app = await buildApp();

    const response = await app.inject({
      method: 'GET',
      url: '/users/me',
      headers: await authHeaders(),
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      id: userId,
      name: 'Usuario Task 8',
      email,
    });

    await app.close();
  });

  it('updates only the user name', async () => {
    const app = await buildApp();

    const response = await app.inject({
      method: 'PATCH',
      url: '/users/me',
      headers: await authHeaders(),
      payload: { name: 'Nome Atualizado' },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      id: userId,
      name: 'Nome Atualizado',
      email,
    });

    await app.close();
  });

  it('rejects profile updates with extra fields', async () => {
    const app = await buildApp();

    const response = await app.inject({
      method: 'PATCH',
      url: '/users/me',
      headers: await authHeaders(),
      payload: { name: 'Nome Atualizado', email: 'outro@email.com' },
    });

    expect(response.statusCode).toBe(400);
    await app.close();
  });

  it('manages favorites for a unit', async () => {
    const app = await buildApp();

    const unitsResponse = await app.inject({ method: 'GET', url: '/units' });
    unitId = unitsResponse.json()[0].id;

    const addResponse = await app.inject({
      method: 'POST',
      url: `/units/${unitId}/favorites`,
      headers: await authHeaders(),
    });

    expect(addResponse.statusCode).toBe(201);

    const duplicateResponse = await app.inject({
      method: 'POST',
      url: `/units/${unitId}/favorites`,
      headers: await authHeaders(),
    });

    expect(duplicateResponse.statusCode).toBe(409);

    const listResponse = await app.inject({
      method: 'GET',
      url: '/users/me/favorites',
      headers: await authHeaders(),
    });

    expect(listResponse.statusCode).toBe(200);
    const favorites = listResponse.json();
    expect(favorites).toHaveLength(1);
    expect(favorites[0].id).toBe(unitId);

    const removeResponse = await app.inject({
      method: 'DELETE',
      url: `/units/${unitId}/favorites`,
      headers: await authHeaders(),
    });

    expect(removeResponse.statusCode).toBe(204);

    const emptyList = await app.inject({
      method: 'GET',
      url: '/users/me/favorites',
      headers: await authHeaders(),
    });

    expect(emptyList.json()).toHaveLength(0);
    await app.close();
  });

  it('requires authentication', async () => {
    const app = await buildApp();

    const response = await app.inject({ method: 'GET', url: '/users/me' });
    expect(response.statusCode).toBe(401);

    await app.close();
  });

  it('deletes the user account', async () => {
    const app = await buildApp();

    const response = await app.inject({
      method: 'DELETE',
      url: '/users/me',
      headers: await authHeaders(),
    });

    expect(response.statusCode).toBe(204);

    const profileResponse = await app.inject({
      method: 'GET',
      url: '/users/me',
      headers: await authHeaders(),
    });

    expect(profileResponse.statusCode).toBe(404);
    userId = '';

    await app.close();
  });
});
