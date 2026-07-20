import 'dotenv/config';
import { afterAll, describe, expect, it } from 'vitest';
import { buildApp } from '../app.js';
import { prisma } from '../lib/prisma.js';

describe('Units routes integration', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('lists all units with query filters', async () => {
    const app = await buildApp();

    const response = await app.inject({ method: 'GET', url: '/units?type=upa' });

    expect(response.statusCode).toBe(200);
    const units = response.json();
    expect(units.length).toBeGreaterThan(0);
    expect(units.every((unit: { type: string }) => unit.type === 'upa')).toBe(true);

    await app.close();
  });

  it('sorts nearby units by distance with UPA Caxangá first', async () => {
    const app = await buildApp();

    const response = await app.inject({
      method: 'GET',
      url: '/units/nearby?lat=-8.0476&lng=-34.9510',
    });

    expect(response.statusCode).toBe(200);

    const units = response.json();
    expect(units.length).toBeGreaterThan(0);
    expect(units[0].name).toBe('UPA Caxangá (Escritor Paulo Cavalcanti)');
    expect(units[0].distanceMeters).toBeDefined();

    for (let index = 1; index < units.length; index += 1) {
      expect(units[index].distanceMeters).toBeGreaterThanOrEqual(units[index - 1].distanceMeters);
    }

    await app.close();
  });

  it('applies default 15km radius on nearby', async () => {
    const app = await buildApp();

    const defaultRadius = await app.inject({
      method: 'GET',
      url: '/units/nearby?lat=-8.0476&lng=-34.9510',
    });

    const tightRadius = await app.inject({
      method: 'GET',
      url: '/units/nearby?lat=-8.0476&lng=-34.9510&radius=1',
    });

    const defaultUnits = defaultRadius.json();
    const tightUnits = tightRadius.json();

    expect(defaultUnits.length).toBeGreaterThanOrEqual(tightUnits.length);
    expect(tightUnits.every((unit: { distanceMeters: number }) => unit.distanceMeters <= 1000)).toBe(
      true,
    );

    await app.close();
  });

  it('returns unit detail and wait-time estimate', async () => {
    const app = await buildApp();

    const listResponse = await app.inject({ method: 'GET', url: '/units' });
    const [firstUnit] = listResponse.json();

    const detailResponse = await app.inject({
      method: 'GET',
      url: `/units/${firstUnit.id}`,
    });

    expect(detailResponse.statusCode).toBe(200);
    expect(detailResponse.json()).toMatchObject({
      id: firstUnit.id,
      specialties: expect.any(Array),
      accessibility: expect.any(Object),
    });

    const waitResponse = await app.inject({
      method: 'GET',
      url: `/units/${firstUnit.id}/wait-time`,
    });

    expect(waitResponse.statusCode).toBe(200);
    expect(waitResponse.json()).toMatchObject({
      estimatedMinutes: expect.any(Number),
      confidence: expect.any(Number),
    });

    await app.close();
  });

  it('returns 404 for unknown unit', async () => {
    const app = await buildApp();

    const response = await app.inject({
      method: 'GET',
      url: '/units/00000000-0000-0000-0000-000000000000',
    });

    expect(response.statusCode).toBe(404);
    await app.close();
  });
});
