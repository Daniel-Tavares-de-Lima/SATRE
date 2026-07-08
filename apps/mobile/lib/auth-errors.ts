import { ApiError } from './api';

/** Extracts a user-facing message from API error responses. */
export function getApiErrorMessage(error: unknown, fallback = 'Ocorreu um erro. Tente novamente.'): string {
  if (!(error instanceof ApiError)) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(error.message) as { error?: string; details?: { message: string }[] };
    if (parsed.error) return parsed.error;
    if (parsed.details?.[0]?.message) return parsed.details[0].message;
  } catch {
    if (error.message) return error.message;
  }

  if (error.status === 401) return 'E-mail ou senha inválidos.';
  if (error.status === 409) return 'Este e-mail já está cadastrado.';

  return fallback;
}
