import { rateLimiter } from '../../middlewares/rateLimiter';

describe('Rate Limiter', () => {
  let req: any, res: any, next: jest.Mock;

  beforeEach(() => {
    req = { ip: '127.0.0.1' };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  test('should allow requests within limit', () => {
    const limiter = rateLimiter(5, 60000);
    limiter(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  test('should block requests over limit', () => {
    const limiter = rateLimiter(1, 60000);
    limiter(req, res, next);
    limiter(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith({ message: 'Rate limit exceeded' });
  });
});