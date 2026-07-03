import { describe, expect, it } from 'vitest';
import { hashDevice } from './device-hash.js';

describe('hashDevice', () => {
  it('returns a deterministic sha256 hmac hex digest', () => {
    const first = hashDevice('device-uuid-123', 'test-salt');
    const second = hashDevice('device-uuid-123', 'test-salt');

    expect(first).toBe(second);
    expect(first).toMatch(/^[a-f0-9]{64}$/);
  });

  it('changes output when device id or salt changes', () => {
    const base = hashDevice('device-a', 'salt-a');
    expect(hashDevice('device-b', 'salt-a')).not.toBe(base);
    expect(hashDevice('device-a', 'salt-b')).not.toBe(base);
  });
});
