import express from 'express';
import request from 'supertest';
import { setupApiRouter } from '../src/routes';
import { getOrGenerateApiToken } from '../src/common/apiToken';

describe('execute-shell multiline', () => {
	let app: express.Express;
	let token: string;

	beforeAll(() => {
		process.env.NODE_ENV = 'test';
		process.env.NODE_CONFIG_DIR = 'config/test';
		token = getOrGenerateApiToken();
		app = express();
		app.use(express.json());
		setupApiRouter(app);
	});

	it('runs multi-line bash script safely', async () => {
		const script = 'echo hi\necho bye';
		const res = await request(app)
			.post('/command/execute-shell')
			.set('Authorization', `Bearer ${token}`)
			.send({ shell: 'bash', command: script });
		expect(res.status).toBe(200);
		// stdout should contain each line, stderr empty, exitCode 0
		const result = res.body?.result || {};
		expect(String(result.stdout)).toContain('hi');
		expect(String(result.stdout)).toContain('bye');
		expect(String(result.stderr || '')).toBe('');
		expect(Number(result.exitCode)).toBe(0);
	});
});
