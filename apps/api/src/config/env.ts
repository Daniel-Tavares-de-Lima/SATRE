import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().optional(),
  DEVICE_HASH_SALT: z.string().min(1),
});

export const env = envSchema.parse(process.env);
