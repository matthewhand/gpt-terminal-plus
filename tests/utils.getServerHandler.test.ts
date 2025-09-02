import { getServerHandler } from '../src/utils/getServerHandler';

describe('utils/getServerHandler', () => {
  it('throws when req.server missing', () => {
    expect(() => getServerHandler({} as any)).toThrow(/not found/);
  });

  it('throws with null server', () => {
    expect(() => getServerHandler({ server: null } as any)).toThrow(
      /Server handler not found/
    );
  });

  it('returns handler when present', () => {
    const handler = {} as any;
    const out = getServerHandler({ server: handler } as any);
    expect(out).toBe(handler);
  });
});
