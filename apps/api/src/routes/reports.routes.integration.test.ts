import 'dotenv/config';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../app.js';
import { prisma } from '../lib/prisma.js';

const DEVICE_ID = '11111111-2222-3333-4444-555555555555';

describe('Reports routes integration', () => {
  let unitId = '';

  afterAll(async () => {
    if (unitId) {
      await prisma.userReport.deleteMany({ where: { unitId } });
    }
    await prisma.$disconnect();
  });

  it('creates a report for an existing unit', async () => {
    const app = await buildApp();

    const unitsResponse = await app.inject({ method: 'GET', url: '/units' });
    unitId = unitsResponse.json()[0].id;

    const response = await app.inject({
      method: 'POST',
      url: `/units/${unitId}/reports`,
      headers: { 'x-device-id': DEVICE_ID },
      payload: {
        occupancyLevel: 'medium',
        waitLevel: 'high',
        note: 'Fila na recepção',
      },
    });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toMatchObject({
      id: expect.any(String),
      message: 'Report registrado com sucesso',
    });

    await app.close();
  });

  it('rejects duplicate reports within 30 minutes', async () => {
    const app = await buildApp();

    const duplicate = await app.inject({
      method: 'POST',
      url: `/units/${unitId}/reports`,
      headers: { 'x-device-id': DEVICE_ID },
      payload: {
        occupancyLevel: 'low',
        waitLevel: 'low',
      },
    });

    expect(duplicate.statusCode).toBe(429);
    expect(duplicate.json()).toMatchObject({
      error: 'Você já reportou recentemente',
      code: 'DUPLICATE_REPORT',
    });

    await app.close();
  });

  it('requires X-Device-Id header', async () => {
    const app = await buildApp();

    const response = await app.inject({
      method: 'POST',
      url: `/units/${unitId}/reports`,
      payload: {
        occupancyLevel: 'low',
        waitLevel: 'medium',
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({ error: 'X-Device-Id header is required' });

    await app.close();
  });

  it('rejects notes with personal information', async () => {
    const app = await buildApp();

    const response = await app.inject({
      method: 'POST',
      url: `/units/${unitId}/reports`,
      headers: { 'x-device-id': '22222222-3333-4444-5555-666666666666' },
      payload: {
        occupancyLevel: 'medium',
        waitLevel: 'medium',
        note: 'Contato: joao@email.com',
      },
    });

    expect(response.statusCode).toBe(400);
    expect(response.json().details[0].message).toBe(
      'Não inclua informações médicas ou pessoais.',
    );

    await app.close();
  });

  it('returns 404 for unknown unit', async () => {
    const app = await buildApp();

    const response = await app.inject({
      method: 'POST',
      url: '/units/00000000-0000-0000-0000-000000000000/reports',
      headers: { 'x-device-id': '33333333-4444-5555-6666-777777777777' },
      payload: {
        occupancyLevel: 'low',
        waitLevel: 'low',
      },
    });

    expect(response.statusCode).toBe(404);
    await app.close();
  });
});
