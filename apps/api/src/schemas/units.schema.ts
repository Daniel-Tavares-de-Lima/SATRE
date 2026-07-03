import { z } from 'zod';

const unitTypeSchema = z.enum(['upa', 'private']);

const optionalCoercedInt = z
  .union([z.string(), z.number()])
  .optional()
  .transform((value) => {
    if (value === undefined || value === '') return undefined;
    const parsed = Number(value);
    return Number.isNaN(parsed) ? undefined : parsed;
  });

export const listUnitsQuerySchema = z.object({
  type: unitTypeSchema.optional(),
  maxWait: optionalCoercedInt,
  minDoctors: optionalCoercedInt,
  accessible: z
    .enum(['true', 'false'])
    .optional()
    .transform((value) => (value === 'true' ? true : undefined)),
  specialty: z.string().optional(),
  q: z.string().optional(),
});

export const nearbyQuerySchema = listUnitsQuerySchema.extend({
  lat: z.coerce.number(),
  lng: z.coerce.number(),
  radius: z.coerce.number().positive().default(15),
});

export const DEFAULT_NEARBY_RADIUS_KM = 15;

function formatZodError(error: z.ZodError) {
  return {
    error: 'Validation failed',
    details: error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    })),
  };
}

export function parseListUnitsQuery(query: Record<string, unknown>) {
  const parsed = listUnitsQuerySchema.safeParse(query);
  if (!parsed.success) {
    return { ok: false as const, error: formatZodError(parsed.error) };
  }
  return { ok: true as const, data: parsed.data };
}

export function parseNearbyQuery(query: Record<string, unknown>) {
  const parsed = nearbyQuerySchema.safeParse(query);
  if (!parsed.success) {
    return { ok: false as const, error: formatZodError(parsed.error) };
  }

  if (Number.isNaN(parsed.data.lat) || Number.isNaN(parsed.data.lng)) {
    return {
      ok: false as const,
      error: {
        error: 'Validation failed',
        details: [{ field: 'lat/lng', message: 'lat and lng are required' }],
      },
    };
  }

  return { ok: true as const, data: parsed.data };
}
