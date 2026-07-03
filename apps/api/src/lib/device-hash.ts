import { createHmac } from 'node:crypto';

/** Hashes a device UUID with server salt for anonymous report attribution. */
export function hashDevice(deviceId: string, salt: string): string {
  return createHmac('sha256', salt).update(deviceId).digest('hex');
}
