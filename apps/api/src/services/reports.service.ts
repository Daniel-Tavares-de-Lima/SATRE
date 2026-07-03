import { prisma } from '../lib/prisma.js';
import { hashDevice } from '../lib/device-hash.js';
import { env } from '../config/env.js';
import type { CreateReportInput } from '../schemas/reports.schema.js';

const DUPLICATE_WINDOW_MS = 30 * 60 * 1000;

export class ReportError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = 'ReportError';
  }
}

export interface CreateReportContext {
  unitId: string;
  deviceId: string;
  userId?: string;
  input: CreateReportInput;
}

/**
 * Persists crowdsourced unit reports with duplicate protection per device/user.
 */
export class ReportsService {
  async createReport(context: CreateReportContext) {
    const unit = await prisma.unit.findFirst({
      where: { id: context.unitId, active: true },
    });

    if (!unit) {
      throw new ReportError('Unit not found', 404, 'UNIT_NOT_FOUND');
    }

    const deviceHash = hashDevice(context.deviceId, env.DEVICE_HASH_SALT);
    const duplicateSince = new Date(Date.now() - DUPLICATE_WINDOW_MS);

    const duplicate = await prisma.userReport.findFirst({
      where: {
        unitId: context.unitId,
        createdAt: { gte: duplicateSince },
        OR: [
          { deviceHash },
          ...(context.userId ? [{ userId: context.userId }] : []),
        ],
      },
    });

    if (duplicate) {
      throw new ReportError('Você já reportou recentemente', 429, 'DUPLICATE_REPORT');
    }

    const report = await prisma.userReport.create({
      data: {
        unitId: context.unitId,
        userId: context.userId ?? null,
        deviceHash,
        occupancyLevel: context.input.occupancyLevel,
        waitLevel: context.input.waitLevel,
        note: context.input.note?.trim() || null,
      },
    });

    return {
      id: report.id,
      message: 'Report registrado com sucesso',
    };
  }
}

export const reportsService = new ReportsService();
