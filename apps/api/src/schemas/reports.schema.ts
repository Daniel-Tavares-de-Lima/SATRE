import { z } from 'zod';

const levelSchema = z.enum(['low', 'medium', 'high']);

const cpfPattern = /\d{3}\.?\d{3}\.?\d{3}-?\d{2}/;
const emailPattern = /[^\s@]+@[^\s@]+\.[^\s@]+/;

function noteHasPersonalInfo(note: string): boolean {
  return cpfPattern.test(note) || emailPattern.test(note);
}

export const createReportSchema = z.object({
  occupancyLevel: levelSchema,
  waitLevel: levelSchema,
  note: z
    .string()
    .max(200)
    .optional()
    .refine((note) => !note || !noteHasPersonalInfo(note), {
      message: 'Não inclua informações médicas ou pessoais.',
    }),
});

export type CreateReportInput = z.infer<typeof createReportSchema>;

export function formatZodError(error: z.ZodError) {
  return {
    error: 'Validation failed',
    details: error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    })),
  };
}
