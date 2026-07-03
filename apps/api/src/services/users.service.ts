import type { AuthUser, UnitSummary } from '@satre/shared-types';
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma.js';
import { unitsService } from './units.service.js';

export class UserError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = 'UserError';
  }
}

function toPublicUser(user: { id: string; name: string; email: string }): AuthUser {
  return { id: user.id, name: user.name, email: user.email };
}

/**
 * Minimal user profile and favorites for authenticated users.
 */
export class UsersService {
  async getProfile(userId: string): Promise<AuthUser> {
    const user = await prisma.user.findFirst({
      where: { id: userId, deletedAt: null },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      throw new UserError('User not found', 404, 'USER_NOT_FOUND');
    }

    return toPublicUser(user);
  }

  async updateProfile(userId: string, name: string): Promise<AuthUser> {
    try {
      const user = await prisma.user.update({
        where: { id: userId, deletedAt: null },
        data: { name: name.trim() },
        select: { id: true, name: true, email: true },
      });

      return toPublicUser(user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new UserError('User not found', 404, 'USER_NOT_FOUND');
      }
      throw error;
    }
  }

  async deleteAccount(userId: string): Promise<void> {
    try {
      await prisma.user.delete({ where: { id: userId } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new UserError('User not found', 404, 'USER_NOT_FOUND');
      }
      throw error;
    }
  }

  async addFavorite(userId: string, unitId: string): Promise<void> {
    const unit = await prisma.unit.findFirst({
      where: { id: unitId, active: true },
    });

    if (!unit) {
      throw new UserError('Unit not found', 404, 'UNIT_NOT_FOUND');
    }

    try {
      await prisma.favorite.create({
        data: { userId, unitId },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new UserError('Unit already favorited', 409, 'FAVORITE_EXISTS');
      }
      throw error;
    }
  }

  async removeFavorite(userId: string, unitId: string): Promise<void> {
    const result = await prisma.favorite.deleteMany({
      where: { userId, unitId },
    });

    if (result.count === 0) {
      throw new UserError('Favorite not found', 404, 'FAVORITE_NOT_FOUND');
    }
  }

  async listFavorites(userId: string): Promise<UnitSummary[]> {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    const summaries = await Promise.all(
      favorites.map((favorite) => unitsService.getUnitById(favorite.unitId)),
    );

    return summaries.filter((unit): unit is UnitSummary => unit !== null);
  }
}

export const usersService = new UsersService();
