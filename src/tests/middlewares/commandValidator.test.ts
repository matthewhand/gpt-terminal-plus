import { validateCommand } from '../../middlewares/commandValidator';

jest.mock('../../config/convictConfig', () => ({
  convictConfig: () => ({
    get: (key: string) => key === 'policy.denyRegex' ? 'rm -rf' : ''
  })
}));

describe('Command Validator', () => {
  let req: any, res: any, next: jest.Mock;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  test('should allow safe commands', () => {
    req.body.command = 'ls -la';
    validateCommand(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  test('should block dangerous commands', () => {
    req.body.command = 'rm -rf /';
    validateCommand(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Dangerous command blocked',
      command: 'rm -rf /',
      reason: 'potentially destructive'
    });
  });

  test('should block policy denied commands', () => {
    req.body.command = 'rm -rf test';
    validateCommand(req, res, next);
    expect(res.status).toHaveBeenCalledWith(403);
  });
});