import request from 'supertest';
import express from 'express';
import commandExecutors from '../src/routes/command/executors';

jest.mock('../src/middlewares/checkAuthToken', () => ({
  checkAuthToken: (_req: any, _res: any, next: any) => next(),
}));

function makeApp() {
  const app = express();
  app.use(express.json());
  app.use('/command', commandExecutors);
  return app;
}

describe('Executors capabilities', () => {
  let app: express.Application;

  beforeEach(() => {
    app = makeApp();
  });

  it('lists default executors with enabled flags', async () => {
    const res = await request(app).get('/command/executors').expect(200);
    const names = res.body.executors.map((e: any) => e.name);
    const byName: any = Object.fromEntries(res.body.executors.map((e: any) => [e.name, e]));
    expect(names).toEqual(expect.arrayContaining(['bash','python','zsh','typescript']));
    expect(byName['bash'].enabled).toBe(true);
    expect(byName['python'].enabled).toBe(true);
    expect(byName['zsh'].enabled).toBe(false);
    expect(byName['typescript'].enabled).toBe(false);
  });

  it('can toggle an executor on and off', async () => {
    // enable zsh
    await request(app).post('/command/executors/zsh/toggle').send({ enabled: true }).expect(200);
    let res = await request(app).get('/command/executors').expect(200);
    let zsh = res.body.executors.find((e: any) => e.name === 'zsh');
    expect(zsh.enabled).toBe(true);

    // disable python
    await request(app).post('/command/executors/python/toggle').send({ enabled: false }).expect(200);
    res = await request(app).get('/command/executors').expect(200);
    let py = res.body.executors.find((e: any) => e.name === 'python');
    expect(py.enabled).toBe(false);

    // re-enable python
    await request(app).post('/command/executors/python/toggle').send({ enabled: true }).expect(200);
    res = await request(app).get('/command/executors').expect(200);
    py = res.body.executors.find((e: any) => e.name === 'python');
    expect(py.enabled).toBe(true);
  });
});

