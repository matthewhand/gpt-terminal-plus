import { redact } from '../src/utils/redact';

describe('utils/redact', () => {
  it('redacts sensitive keys', () => {
    const v = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const out = redact('API_TOKEN', v);
    expect(out).toContain('API_TOKEN: ');
    expect(out).toContain('...');
    expect(out.length).toBeLessThan(('API_TOKEN: ' + v).length);
  });

  it('stringifies non-string values', () => {
    const out = redact('password', { k: 'v' });
    expect(out).toMatch(/password: .*\.\.\./);
  });

  it('handles null and invalid key types', () => {
    // @ts-ignore
    expect(redact(123, 'x')).toMatch(/Invalid key/);
    expect(redact('token', null as any)).toMatch(/Value is null/);
  });
});

