import { PaginationHandler, paginate } from '../../src/handlers/PaginationHandler';

describe('PaginationHandler', () => {
  it('exports paginate and class', () => {
    expect(paginate).toBeDefined();
    expect(typeof PaginationHandler).toBe('function');
  });

  it('paginates arrays using defaults', () => {
    const data = Array.from({ length: 25 }, (_, i) => i + 1);
    const handler = new PaginationHandler(); // limit=10, offset=0
    const res = handler.paginate(data);

    expect(res.items).toEqual([1,2,3,4,5,6,7,8,9,10]);
    expect(res.limit).toBe(10);
    expect(res.offset).toBe(0);
    expect(res.total).toBe(25);
  });

  it('respects custom limit and offset', () => {
    const data = Array.from({ length: 15 }, (_, i) => `v${i}`);
    const handler = new PaginationHandler({ limit: 5, offset: 5 });
    const res = handler.paginate(data);

    expect(res.items).toEqual(['v5','v6','v7','v8','v9']);
    expect(res.limit).toBe(5);
    expect(res.offset).toBe(5);
    expect(res.total).toBe(15);
  });

  it('handles offset past end gracefully (empty page)', () => {
    const data = [1,2,3];
    const handler = new PaginationHandler({ limit: 10, offset: 100 });
    const res = handler.paginate(data);

    expect(res.items).toEqual([]);
    expect(res.total).toBe(3);
  });

  it('utility paginate mirrors class behavior', () => {
    const data = [10, 20, 30, 40, 50, 60];
    const viaFn = paginate(data, 2, 3);
    const viaClass = new PaginationHandler({ limit: 2, offset: 3 }).paginate(data);

    expect(viaFn).toEqual(viaClass);
    expect(viaFn.items).toEqual([40, 50]);
  });
});
