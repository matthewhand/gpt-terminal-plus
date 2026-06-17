import { rateLimiter } from '../../middlewares/rateLimiter';

describe('Rate Limiter', () => {
  let req: any, res: any, next: jest.Mock;

  beforeEach(() => {
    req = { 
      ip: '127.0.0.1',
      connection: { remoteAddress: '127.0.0.1' }
    };
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

  test('should handle different IPs', () => {
    const limiter = rateLimiter(1, 60000);
    
    // Different IP should get separate tracking
    const req2 = { ip: '192.168.1.1', connection: { remoteAddress: '192.168.1.1' } } as any;
    const res2 = { status: jest.fn().mockReturnThis(), json: jest.fn() } as any;
    const next2 = jest.fn();
    
    limiter(req2, res2, next2);
    expect(next2).toHaveBeenCalled();
    expect(res2.status).not.toHaveBeenCalled();
  });

  test('should handle missing IP gracefully', () => {
    const limiter = rateLimiter(5, 60000);
    req.ip = undefined;
    req.connection = undefined;
    
    expect(() => limiter(req, res, next)).not.toThrow();
    expect(next).toHaveBeenCalled();
  });

  test('should handle zero limit', () => {
    const limiter = rateLimiter(0, 60000);
    limiter(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(429);
    expect(next).not.toHaveBeenCalled();
  });

  test('should handle negative limit gracefully', () => {
    const limiter = rateLimiter(-1, 60000);
    limiter(req, res, next);
    
    expect(res.status).toHaveBeenCalledWith(429);
  });
});