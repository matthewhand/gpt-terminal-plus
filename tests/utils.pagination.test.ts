import { paginate as paginateUtil } from '@src/utils/PaginationUtils';
import { paginate as paginateHandler, PaginationHandler } from '@handlers/PaginationHandler';

describe('pagination helpers', () => {
  const items = Array.from({ length: 10 }, (_v, i) => i+1);

  it('utils paginate returns correct slice and total', () => {
    const r = paginateUtil(items, 3, 2);
    expect(r.items).toEqual([3,4,5]);
    expect(r.total).toBe(10);
    expect(r.limit).toBe(3);
    expect(r.offset).toBe(2);
  });

  it('handler paginate returns correct slice and total', () => {
    const r = paginateHandler(items, 4, 6);
    expect(r.items).toEqual([7,8,9,10]);
    expect(r.total).toBe(10);
    expect(r.limit).toBe(4);
    expect(r.offset).toBe(6);
  });

  it('utils paginate handles offsets beyond item length', () => {
    const r = paginateUtil(items, 5, 20);
    expect(r.items).toEqual([]);
    expect(r.total).toBe(10);
    expect(r.limit).toBe(5);
    expect(r.offset).toBe(20);
  });

  it('utils paginate handles limits larger than item count', () => {
    const r = paginateUtil(items, 20, 0);
    expect(r.items).toEqual(items);
    expect(r.total).toBe(10);
    expect(r.limit).toBe(20);
    expect(r.offset).toBe(0);
  });

  it('PaginationHandler uses default values when none provided', () => {
    const handler = new PaginationHandler();
    const r = handler.paginate(items);
    expect(r.items).toEqual(items);
    expect(r.total).toBe(10);
    expect(r.limit).toBe(10);
    expect(r.offset).toBe(0);
  });
});

