import { z } from 'zod';

export const updateProfileSchema = z
  .object({
    name: z.string().min(2).max(100),
  })
  .strict();

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export function formatZodError(error: z.ZodError) {
  return {
    error: 'Validation failed',
    details: error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    })),
  };
}
