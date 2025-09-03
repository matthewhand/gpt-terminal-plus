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

  it('throws with undefined or falsy server values', () => {
    expect(() => getServerHandler({ server: undefined } as any)).toThrow(
      'Server handler not found on request object'
    );
    expect(() => getServerHandler({ server: 0 } as any)).toThrow(
      'Server handler not found on request object'
    );
    expect(() => getServerHandler({ server: '' } as any)).toThrow(
      'Server handler not found on request object'
    );
  });

  it('returns handler when present', () => {
    const handler = {} as any;
    const out = getServerHandler({ server: handler } as any);
    expect(out).toBe(handler);
  });

  it('returns the exact same reference without cloning', () => {
    const handler = { id: Symbol('handler') } as any;
    const res = getServerHandler({ server: handler } as any);
    expect(res).toBe(handler);
    expect(res).toEqual(handler);
  });
});
