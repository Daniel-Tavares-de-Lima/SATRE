import 'dotenv/config';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../app.js';
import { prisma } from '../lib/prisma.js';

describe('Auth routes integration', () => {
  const email = `test-${Date.now()}@satre.app`;
  let refreshToken = '';

  afterAll(async () => {
    await prisma.refreshToken.deleteMany({
      where: { user: { email } },
    });
    await prisma.user.deleteMany({ where: { email } });
    await prisma.$disconnect();
  });

  it('registers a user with minimal profile and tokens', async () => {
    const app = await buildApp();

    const response = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: {
        name: 'Teste',
        email,
        password: 'senha1234',
        acceptTerms: true,
        acceptPrivacy: true,
      },
    });

    expect(response.statusCode).toBe(201);

    const body = response.json();
    expect(body.user).toEqual({
      id: expect.any(String),
      name: 'Teste',
      email,
    });
    expect(body.user).not.toHaveProperty('passwordHash');
    expect(body.accessToken).toEqual(expect.any(String));
    expect(body.refreshToken).toEqual(expect.any(String));

    refreshToken = body.refreshToken;
    await app.close();
  });

  it('rejects registration without LGPD consent', async () => {
    const app = await buildApp();

    const response = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: {
        name: 'Sem Consentimento',
        email: `no-consent-${Date.now()}@satre.app`,
        password: 'senha1234',
        acceptTerms: false,
        acceptPrivacy: true,
      },
    });

    expect(response.statusCode).toBe(400);
    await app.close();
  });

  it('logs in with valid credentials', async () => {
    const app = await buildApp();

    const response = await app.inject({
      method: 'POST',
      url: '/auth/login',
      payload: {
        email,
        password: 'senha1234',
      },
    });

    expect(response.statusCode).toBe(200);
    const body = response.json();
    expect(body.user.email).toBe(email);
    refreshToken = body.refreshToken;

    await app.close();
  });

  it('refreshes tokens and logs out', async () => {
    const app = await buildApp();

    const refreshResponse = await app.inject({
      method: 'POST',
      url: '/auth/refresh',
      payload: { refreshToken },
    });

    expect(refreshResponse.statusCode).toBe(200);
    const refreshed = refreshResponse.json();
    expect(refreshed.accessToken).toEqual(expect.any(String));
    expect(refreshed.refreshToken).toEqual(expect.any(String));

    const logoutResponse = await app.inject({
      method: 'POST',
      url: '/auth/logout',
      payload: { refreshToken: refreshed.refreshToken },
    });

    expect(logoutResponse.statusCode).toBe(204);

    const invalidRefresh = await app.inject({
      method: 'POST',
      url: '/auth/refresh',
      payload: { refreshToken: refreshed.refreshToken },
    });

    expect(invalidRefresh.statusCode).toBe(401);
    await app.close();
  });
});
