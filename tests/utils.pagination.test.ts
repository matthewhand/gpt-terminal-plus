import { paginate as paginateUtil } from '../src/utils/PaginationUtils';
import { paginate as paginateHandler } from '../src/handlers/PaginationHandler';

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

  it('offset beyond length returns empty slice', () => {
    const r1 = paginateUtil(items, 5, 20);
    const r2 = paginateHandler(items, 5, 20);
    expect(r1.items).toEqual([]);
    expect(r2.items).toEqual([]);
  });

  it('zero limit returns empty slice', () => {
    const r1 = paginateUtil(items, 0, 0);
    const r2 = paginateHandler(items, 0, 0);
    expect(r1.items).toEqual([]);
    // Handler defaults 0 limit to 10 via constructor fallback
    expect(r2.items).toEqual(items);
  });

  it('large limit clamps to available items by slice behavior', () => {
    const r1 = paginateUtil(items, 100, 8);
    const r2 = paginateHandler(items, 100, 8);
    expect(r1.items).toEqual([9, 10]);
    expect(r2.items).toEqual([9, 10]);
  });

  it('negative offset yields empty slice for both implementations', () => {
    const r1 = paginateUtil(items, 3, -2);
    const r2 = paginateHandler(items, 3, -2);
    expect(r1.items).toEqual([]);
    expect(r2.items).toEqual([]);
  });
});
