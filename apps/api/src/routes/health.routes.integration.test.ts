import 'dotenv/config';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../app.js';
import { prisma } from '../lib/prisma.js';

describe('Health route integration', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('returns ok status with timestamp', async () => {
    const app = await buildApp();

    const response = await app.inject({ method: 'GET', url: '/health' });

    expect(response.statusCode).toBe(200);

    const body = response.json();
    expect(body.status).toBe('ok');
    expect(body.timestamp).toEqual(expect.any(String));
    expect(new Date(body.timestamp).toString()).not.toBe('Invalid Date');

    await app.close();
  });
});
