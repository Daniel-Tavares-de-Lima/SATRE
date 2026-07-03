import type { AuthUser } from '@satre/shared-types';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';
import { prisma } from '../lib/prisma.js';
import { signAccessToken } from '../lib/jwt.js';
import type { LoginInput, RegisterInput } from '../schemas/auth.schema.js';

const BCRYPT_ROUNDS = 12;
const REFRESH_TOKEN_DAYS = 7;

export interface AuthTokensResponse {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokensResponse {
  accessToken: string;
  refreshToken: string;
}

export class AuthError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

function toPublicUser(user: { id: string; name: string; email: string }): AuthUser {
  return { id: user.id, name: user.name, email: user.email };
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function createRefreshTokenValue(): string {
  return randomBytes(48).toString('base64url');
}

function refreshExpiresAt(): Date {
  return new Date(Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000);
}

async function persistRefreshToken(userId: string): Promise<string> {
  const token = createRefreshTokenValue();
  await prisma.refreshToken.create({
    data: {
      token,
      userId,
      expiresAt: refreshExpiresAt(),
    },
  });
  return token;
}

async function issueAuthResponse(user: {
  id: string;
  name: string;
  email: string;
}): Promise<AuthTokensResponse> {
  return {
    user: toPublicUser(user),
    accessToken: signAccessToken(user.id),
    refreshToken: await persistRefreshToken(user.id),
  };
}

/**
 * Handles registration, login, refresh rotation, and logout for minimal LGPD profile.
 */
export class AuthService {
  async register(input: RegisterInput): Promise<AuthTokensResponse> {
    const email = normalizeEmail(input.email);
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing && !existing.deletedAt) {
      throw new AuthError('Email already registered', 409, 'EMAIL_TAKEN');
    }

    const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
    const now = new Date();

    const user = await prisma.user.create({
      data: {
        name: input.name.trim(),
        email,
        passwordHash,
        termsAcceptedAt: now,
        privacyAcceptedAt: now,
      },
    });

    return issueAuthResponse(user);
  }

  async login(input: LoginInput): Promise<AuthTokensResponse> {
    const email = normalizeEmail(input.email);
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || user.deletedAt) {
      throw new AuthError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const validPassword = await bcrypt.compare(input.password, user.passwordHash);
    if (!validPassword) {
      throw new AuthError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    return issueAuthResponse(user);
  }

  async refresh(refreshToken: string): Promise<RefreshTokensResponse> {
    const stored = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!stored || stored.expiresAt <= new Date() || stored.user.deletedAt) {
      throw new AuthError('Invalid or expired refresh token', 401, 'INVALID_REFRESH_TOKEN');
    }

    await prisma.refreshToken.delete({ where: { id: stored.id } });

    return {
      accessToken: signAccessToken(stored.userId),
      refreshToken: await persistRefreshToken(stored.userId),
    };
  }

  async logout(refreshToken: string): Promise<void> {
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken } });
  }
}

export const authService = new AuthService();
