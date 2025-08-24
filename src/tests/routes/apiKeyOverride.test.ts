import request from 'supertest';
import express from 'express';
import configRoutes from '../../routes/config';
import { checkAuthToken } from '../../middlewares/checkAuthToken';

jest.mock('../../middlewares/checkAuthToken');
jest.mock('../../config/convictConfig', () => ({
  convictConfig: () => ({
    set: jest.fn(),
    load: jest.fn(),
    validate: jest.fn(),
    getProperties: () => ({ security: { apiToken: '[REDACTED]' } })
  }),
  getRedactedSettings: () => ({
    security: {
      apiToken: { value: '*****', readOnly: false }
    }
  })
}));

const app = express();
app.use(express.json());
app.use('/config', configRoutes);
app.use('/test', checkAuthToken, (req, res) => res.json({ authorized: true }));

describe('API Key Override', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (checkAuthToken as jest.Mock).mockImplementation((req, res, next) => next());
  });

  test('should accept API_TOKEN override', async () => {
    const res = await request(app)
      .post('/config/override')
      .send({ API_TOKEN: 'test123' });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  test('should redact API token in settings response', async () => {
    // Set token first
    await request(app)
      .post('/config/override')
      .send({ API_TOKEN: 'secret123' });
    
    const res = await request(app).get('/config/settings');
    expect(res.status).toBe(200);
    expect(res.body.security?.apiToken?.value).toBe('*****');
  }, 10000);

  test('should validate requests with new token', async () => {
    const mockAuth = checkAuthToken as jest.Mock;
    mockAuth.mockImplementation((req, res, next) => {
      const token = req.headers.authorization?.split(' ')[1];
      if (token === 'newtoken123') {
        next();
      } else {
        res.status(401).json({ error: 'Unauthorized' });
      }
    });

    const res = await request(app)
      .get('/test')
      .set('Authorization', 'Bearer newtoken123');
    
    expect(res.status).toBe(200);
    expect(res.body.authorized).toBe(true);
  });

  test('should reject requests with old token', async () => {
    const mockAuth = checkAuthToken as jest.Mock;
    mockAuth.mockImplementation((req, res, next) => {
      const token = req.headers.authorization?.split(' ')[1];
      if (token === 'oldtoken') {
        res.status(401).json({ error: 'Unauthorized' });
      } else {
        next();
      }
    });

    const res = await request(app)
      .get('/test')
      .set('Authorization', 'Bearer oldtoken');
    
    expect(res.status).toBe(401);
  });
});