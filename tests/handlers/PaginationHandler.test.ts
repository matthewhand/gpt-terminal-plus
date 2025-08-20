import { paginate } from '../../src/handlers/PaginationHandler';

describe('PaginationHandler', () => {
  it('should export paginate function', () => {
    expect(paginate).toBeDefined();
  });
});